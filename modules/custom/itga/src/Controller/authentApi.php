<?php

namespace Drupal\itga\Controller;

use Lcobucci\JWT\Parser;
use Drupal\user\Entity\User;
use Drupal\user\UserAuth;

class AuthentApi extends ItgaApi {
    
    protected $url = 'http://apiextranetauth.itga.fr/api/Auth';
    protected $apiKey = 'ITGA';
    protected $apiVersion = '2';
    
    public function signIn($email, $password){

        $params = [
            'body' => ['login' => $email, 'password' => $password],
            'method' => 'post'
        ];
        // On appelle l'api du token
        $signin = $this->callApi('request/sign-in', $params);
        
        // Si on a un token
        if(!empty($signin->token)){
            $token = (new Parser())->parse((string) $signin->token);
    
            $tokenEmail = $token->getClaim('email');
            
            // Check si le compte Drupal existe ou pas
            $userAccount = \user_load_by_mail($email);
            // Si le compte drupal existe
            if(!empty($userAccount)){
                // On met le token en session
                $this->signinToSession($token);
                
                // On met à jour les infos de la personne qui sont en base
                $userAccount->set("field_given_name", $token->getClaim('given_name'));
                $userAccount->set("field_unique_name", $token->getClaim('unique_name'));
                $userAccount->set("field_account_id", $_SESSION['itga']['apiUser']->AccountId);
                $userAccount->set("field_contact_id", $_SESSION['itga']['apiUser']->ContactId);
    
                if(!empty($_SESSION['itga']['apiUser']->Profiles)){
                    foreach($_SESSION['itga']['apiUser']->Profiles as $profil){
                        $userAccount->addRole(strtolower($profil->Code));
                    }
                }
                
                if($_SESSION['itga']['apiMadra']->AccesPlanification){
                    $userAccount->addRole('planification');
                }
                
                // Si la mise à jour est ok on identifie
                if($userAccount->save()){
                    // Si le compte existe on identifie
                    user_login_finalize($userAccount);
                    
                    return ['error' => false];
                } else {
                    unset($_SESSION['itga']);
                    
                    return ['error' => true, 'msg' => 'Adresse email et/ou mot de passe erroné(s) (err 3)'];
                }
            } else {
                // On arrive ici quand l'utilisateur a fait sa première connexion (donc il a un compte activé et la première connexion a été faites
                // mais qu'il n'a pas de compte sur Drupal
                
                // On met le token en session
                $this->signinToSession($token);
                
                // On le garde pour l'archivage, ça a été chiant à mettre en place et ça peut servir ailleurs car ça marche #ouaisOuBien
                $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
                
                $user = \Drupal\user\Entity\User::create();
                $user->setUsername($tokenEmail);
                $user->setPassword('itga'.time());
                $user->setEmail($tokenEmail);
                $user->enforceIsNew(); // Force la creation
                $user->set("init", $tokenEmail);
                $user->set("langcode", $lang);
                $user->set("preferred_langcode", $lang);
                $user->set("preferred_admin_langcode", $lang);
                $user->set("field_given_name", $token->getClaim('given_name'));
                $user->set("field_unique_name", $token->getClaim('unique_name'));
                $user->set("field_account_id", $_SESSION['itga']['apiUser']->AccountId);
                $user->set("field_contact_id", $_SESSION['itga']['apiUser']->ContactId);
                $user->activate();
                
                // Si la création du user est ok on l'identifie
                if($user->save()){
                    $userAccount = \user_load_by_mail($email);
                    user_login_finalize($userAccount);
                
                    // On met le token en session
                    $this->signinToSession($token);
                    
                    $isAdminPrincipal = false;
                    $isAdminDelegue = false;
                    $isAutreCompteMadra = false;
    
                    $api = new UserApi();
                    
                    // Sauvegarde des droits
                    if(!empty($_SESSION['itga']['apiUser']->Profiles)){
                        foreach($_SESSION['itga']['apiUser']->Profiles as $profil){
                            //echo '<pre>'; print_r($profil); echo '</pre>'; exit;
                            $user->addRole(strtolower($profil->Code));
                            
                            if($profil->Code == 'DIAG_ADMIN_PRINCIPAL'){
                                $isAdminPrincipal = true;
    
                                $accountUsers = $api->getUserAccountUsersList($_SESSION['itga']['apiUser']->AccountId);
                                
                                foreach($accountUsers as $userAccount){
                                    if(!$userAccount->IsSuperAdmin){
                                        $isAutreCompteMadra = true;
                                    }
                                }
                            }
    
                            if($profil->Code == 'DIAG_ADMIN_DELEGATE' || $profil->Code == 'PREL_ADMIN_DELEGATE'){
                                $isAdminDelegue = true;
                            }
                        }
    
                        $user->save();
                    }
    
                    if($_SESSION['itga']['apiMadra']->AccesPlanification){
                        $userAccount->addRole('planification');
                    }
                    
                    // Envoi du mail de première connexion
                    if($isAdminPrincipal){
                        if($isAutreCompteMadra){
                            $params = [
                                'subject' => 'Bienvenue sur MonEspace.ITGA !',
                                'toEmail' => $_SESSION['itga']['apiUser']->Email,
                                'toName' => trim($_SESSION['itga']['apiUser']->FirstName.' '.$_SESSION['itga']['apiUser']->LastName),
                                'keys' => [
                                ]
                            ];
                            itga_send_mail('bienvenue-admin-avec-compte', $params);
                        } else {
                            $params = [
                                'subject' => 'Bienvenue sur MonEspace.ITGA !',
                                'toEmail' => $_SESSION['itga']['apiUser']->Email,
                                'toName' => trim($_SESSION['itga']['apiUser']->FirstName.' '.$_SESSION['itga']['apiUser']->LastName),
                                'keys' => [
                                ]
                            ];
                            itga_send_mail('bienvenue-admin-sans-compte', $params);
                        }
                        
                    } elseif($isAdminDelegue){
                        $params = [
                            'subject' => 'Bienvenue sur MonEspace.ITGA !',
                            'toEmail' => $_SESSION['itga']['apiUser']->Email,
                            'toName' => trim($_SESSION['itga']['apiUser']->FirstName.' '.$_SESSION['itga']['apiUser']->LastName),
                            'keys' => [
                            ]
                        ];
                        itga_send_mail('bienvenue-admin-delegue', $params);
                    } else {
                        $params = [
                            'subject' => 'Bienvenue sur MonEspace.ITGA !',
                            'toEmail' => $_SESSION['itga']['apiUser']->Email,
                            'toName' => trim($_SESSION['itga']['apiUser']->FirstName.' '.$_SESSION['itga']['apiUser']->LastName),
                            'keys' => [
                            ]
                        ];
                        itga_send_mail('bienvenue-sous-profil', $params);
                    }
                    return ['error' => false];
                } else {
                    return ['error' => true, 'msg' => 'Adresse email et/ou mot de passe erroné(s) (err 2)'];
                }
            }
        } else {
            // On a pas de compte sur l'api, on regarde si on a un compte Drupal
            
            // Charge le user
            $userAccount = \user_load_by_mail($email);

            // On compare son mot de passe et le mot de passe rentré dans le formulaire
            $passwordHasher = \Drupal::service('password');
            if(!empty($userAccount)) {
                if($passwordHasher->check($password, $userAccount->getPassword())){
                    user_login_finalize($userAccount);

                    // On met le token en session
                    $this->signinToSession();

                    return ['error' => false];
                } else {
                    return ['error' => true, 'msg' => 'Adresse email et/ou mot de passe erroné(s) (err 1)'];
                }
            }
            else {
                return ['error' => true, 'msg' => 'Adresse email et/ou mot de passe erroné(s)'];
            }

        }
    }
    
    /**
     * Met les infos utiles du token en session
     *
     * @param $token
     */
    private function signinToSession($token = ''){
        
        if(empty($token)){
            $_SESSION['itga'] = [];
            $_SESSION['itga']['token'] = '';
            $_SESSION['itga']['jwt'] = [];
            $_SESSION['itga']['apiUser'] = [];
            $_SESSION['itga']['apiAccount'] = [];
            $_SESSION['itga']['apiTypology'] = [];
        } else {
            $_SESSION['itga']['token'] = $token->__toString();
            
            $_SESSION['itga']['jwt'] = [
                'unique_name' => $token->getClaim('unique_name'),
                'given_name' => $token->getClaim('given_name'),
                'email' => $token->getClaim('email'),
                //'role' => $token->getClaim('role'),
                'typologyId' => $token->getClaim('typologyId'),
                'typologyCode' => $token->getClaim('typologyCode'),
                'accountId' => $token->getClaim('accountId'),
            ];
    
            // On récupère les infos du user chez ITGA
            $apiUser = new UserApi();
            $api = new MadraApi();
    
            $_SESSION['itga']['apiUser'] = $apiUser->getUser($token->getClaim('email'));
            $_SESSION['itga']['apiAccount'] = $apiUser->getUserAccount($token->getClaim('accountId'));
            $_SESSION['itga']['apiTypology'] = $apiUser->getUserTypology($token->getClaim('typologyId'));
            $_SESSION['itga']['apiMadra'] = $api->getMadraUserInfos();
        }
    }
    
    /**
     * Met les infos utiles du token en session
     *
     * @param $token
     */
    public function updateSession($token){
        // On récupère les infos du user chez ITGA
        $apiUser = new UserApi();
        //echo '<pre>'; print_r($apiUser->getUser($token['email'])); echo '</pre>'; exit;
        $_SESSION['itga']['apiUser'] = $apiUser->getUser($token['email']);
        $_SESSION['itga']['apiAccount'] = $apiUser->getUserAccount($token['accountId']);
        $_SESSION['itga']['apiTypology'] = $apiUser->getUserTypology($token['typologyId']);
    }
    
    public function firstConnexion($email, $onSuccessRedirectUrlAfterSubmit = ''){
        $params = [
            'method' => 'post',
            'email' => $email,
            'onSuccessRedirectUrlAfterSubmit' => $onSuccessRedirectUrlAfterSubmit,
        ];
        
        return $this->callApi('first-connexion', $params);
    }
}