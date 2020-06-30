<?php

namespace Drupal\itga\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\image\Entity\ImageStyle;
use Drupal\Core\Menu;
use Lcobucci\JWT\Parser;
use Drupal\user\Entity\User;

require_once('modules/custom/itga/src/Controller/itgaApi.php');
require_once('modules/custom/itga/src/Controller/authentApi.php');
require_once('modules/custom/itga/src/Controller/userApi.php');
require_once('modules/custom/itga/src/Controller/madraApi.php');
require_once('modules/custom/itga/src/Controller/factureApi.php');

class ItgaController extends ControllerBase {
    
    // Page de login
    public function signin(){
        return array();
    }
    
    // Page de login - Gestion ajax
    public function signinAjax(){
        
        $api = new AuthentApi();
        $signin = $api->signIn(\Drupal::request()->request->get('email'), \Drupal::request()->request->get('password'));
        $_SESSION['itga']['nbUserNotActive'] = 0;
        
        if(!$signin['error']){
            $api = new UserApi();
    
            $accountUsers = $api->getUserAccountUsersList($_SESSION['itga']['apiUser']->AccountId);
            $isAutreCompteMadra = false;
            $nbNotActive = 0;
            foreach($accountUsers as $accountUser){
                if(!$accountUser->IsActive){
                    $nbNotActive++;
                }
                if(!$userAccount->IsSuperAdmin){
                    $isAutreCompteMadra = true;
                }
            }
            
            $_SESSION['itga']['nbUserNotActive'] = $nbNotActive;
        }



        // Première connexion : Activation des pop-ins

        $current_user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());

        if($current_user->get('field_has_first_connexion')->getValue()[0]['value'] == "0") {
            $_SESSION['itga']['popin']['isFirstConnexion'] = true;
        }

        if($_SESSION['itga']['popin']['isFirstConnexion']) {
            //echo "first Connexion";
            if (in_array("diag_admin_principal", $current_user->getRoles()) || in_array("prel_admin_principal", $current_user->getRoles())) {
                //echo "diag_admin_principal";
                //exit;
                if($isAutreCompteMadra){
                    $_SESSION['itga']['popin']['FirstConnexionAdminPrincipalWithAccount']['activeModal'] = true;
                }
                else {
                    $_SESSION['itga']['popin']['FirstConnexionAdminPrincipalWithoutAccount']['activeModal'] = true;
                }
            }
            else if (in_array("diag_admin_delegate", $current_user->getRoles()) || in_array("prel_admin_delegate", $current_user->getRoles())) {
                $_SESSION['itga']['popin']['FirstConnexionAdminDelegate']['activeModal'] = true;
            }
            else {
                $_SESSION['itga']['popin']['FirstConnexionDefault']['activeModal'] = true;
            }
            $current_user->set('field_has_first_connexion', "1");
            $current_user->save();
            $_SESSION['itga']['popin']['isFirstConnexion'] = false;
        }
        else if (!$_SESSION['itga']['popin']['isFirstConnexion']){
            $_SESSION['itga']['popin']['FirstConnexionAdminPrincipalWithAccount']['activeModal'] = false;
            $_SESSION['itga']['popin']['FirstConnexionAdminPrincipalWithoutAccount']['activeModal'] = false;
            $_SESSION['itga']['popin']['FirstConnexionAdminDelegate']['activeModal'] = false;
            $_SESSION['itga']['popin']['FirstConnexionDefault']['activeModal'] = false;
        }

        echo json_encode($signin);
        exit;
    }
    
    public function dejaClient(){
        $userApi = new UserApi();
        $userAccount = $userApi->getUserAccountByClientCode(\Drupal::request()->request->get('numero'));
        
        if(empty($userAccount)){
            echo json_encode(['error' => false]);
            exit;
        } else {
            $usersList = $userApi->getUserAccountUsersListByCodeClient(\Drupal::request()->request->get('numero'));
            
            foreach($usersList as $userApi){
                if($userApi->IsSuperAdmin){
                    echo json_encode(['error' => true, 'msg' => 'Un compte MonEspace.ITGA associé à votre entreprise a déjà été créé. Pour plus d\'informations, rapprochez-vous de l\'administrateur principal de votre espace client : ' .trim($userApi->FirstName.' '.$userApi->LastName).' ('.$userApi->Email.')']);
                    exit;
                }
            }
            
            // Pas de super admin, redirection vers le formulaire
            echo json_encode(['error' => false]);
            exit;
        }
    }
    
    // page de premiere connexion
    public function premiereConnexion(){
        return [];
    }
    
    // page de premiere connexion - gestion ajax
    public function premiereConnexionAjax(){
        $api = new UserApi();
        $userInfos = $api->getUserByEmail(\Drupal::request()->request->get('email'));
        
        if(!empty($userInfos->Email)){
            if($userInfos->IsFirstConnexion == false){
                $retour = ['error' => true, 'msg' => 'Ce compte a déjà réalisé sa première connexion'];
            } else {
                $api = new UserApi();
                $authent = new AuthentApi();
                $firstConnect = $authent->firstConnexion($userInfos->Email, 'https://'.$_SERVER['HTTP_HOST'].'/?t=');
    
                $retour = ['result' => true, 'msg' => 'Un email a été envoyé avec un lien pour vous connecter'];
            }
        } else {
            $retour = ['result' => true, 'msg' => 'L\'adresse email renseignée est erronée.'];
        }
        echo json_encode($retour);
        exit;
    }
    
    public function actualites($tag = '') {
        $nids = \Drupal::entityQuery('node')
            ->condition('type', 'actualite')
            ->sort('created' , 'DESC')
            ->condition('status', 1);

        if (!empty($tag)) {
            $nids->condition('field_tags_actu', $tag);
        }

        if (!empty($_GET['agence'])) {
            $nids->condition('field_agences', intval($_GET['agence']), 'in');
        }
        // News by roles
        $userRoles = \Drupal::currentUser()->getRoles();

        $condition_or = $nids->orConditionGroup();
        $condition_or->notExists('field_roles');
        $condition_or->condition('field_roles', $userRoles, 'IN');

        $nids->condition($condition_or);

        $nids = $nids->execute();

        $nodesEntities = \Drupal\node\Entity\Node::loadMultiple($nids);
        $nodes = [];

        if(!empty($nodesEntities)) {
            foreach ($nodesEntities as $nodeEntity) {
                // -> array w/ protected object
                $tags = $nodeEntity->get('field_tags_actu')->referencedEntities();

                $nodes[] = [
                    'title' => $nodeEntity->title->getString(),
                    'description' => $nodeEntity->field_description->getString(),
                    'image' => ImageStyle::load('thumb_300x400')->buildUrl($nodeEntity->field_image->entity->getFileUri()),
                    'date' => date('d/m/Y', $nodeEntity->created->getString()),
                    'url' => $nodeEntity->toUrl(),
                    'tags' => $nodeEntity->field_tags_actu->getString(),
                    'tags' => $tags
                ];
            }
        }


        $tids = \Drupal::entityQuery('taxonomy_term')
            ->condition('vid', 'tag_actualites')
            ->execute();
        $termsEntities = \Drupal\taxonomy\Entity\Term::loadMultiple($tids);
        $terms = [];
        $selectedTerm = [];



        foreach ($termsEntities as $termEntity) {
            $terms[] = [
                'id' => $termEntity->id(),
                'name' => $termEntity->toLink()->getText(),
                'url' => '/actualites/tag/'.$termEntity->id()
            ];

            if ($termEntity->id() == $tag) {
                $selectedTerm = [
                    'id' => $termEntity->id(),
                    'name' => $termEntity->toLink()->getText(),
                ];
            }
        }

        if(!empty($_SESSION['itga']['agence'])) {
    
    
            $nids = \Drupal::entityQuery('node')
                ->condition('type', 'actualite')
                ->sort('created' , 'DESC')
                ->condition('status', 1);
    
            $nids->condition('field_agences', $_SESSION['itga']['agence']->id(), 'in');
            
            // News by roles
            $userRoles = \Drupal::currentUser()->getRoles();
    
            $condition_or = $nids->orConditionGroup();
            $condition_or->notExists('field_roles');
            $condition_or->condition('field_roles', $userRoles, 'IN');
    
            $nids->condition($condition_or);
    
            $nids = $nids->execute();
            
            if(count($nids) > 0) {
                $terms[] = [
                    'id' => $_SESSION['itga']['agence']->id(),
                    'name' => $_SESSION['itga']['agence']->title->getString(),
                    'url' => '/actualites/?agence=' . $_SESSION['itga']['agence']->id()
                ];
            }
        }

        return array(
            '#theme' => 'actualites',
            '#nodes' => $nodes,
            '#terms' => $terms,
            '#selectedTerm' => $selectedTerm,
            '#actualTag' => $tag
        );
    }


    public function bibliothequePdf() {
        // Liste des catégories
        $tids = \Drupal::entityQuery('taxonomy_term')
            ->condition('vid', 'categorie_fichiers_pdf')
            ->execute();
        $termsEntities = \Drupal\taxonomy\Entity\Term::loadMultiple($tids);
        $terms = [];
        $selectedTerm = [];

        foreach ($termsEntities as $termEntity) {
            $terms[$termEntity->id()] = [
                'id' => $termEntity->id(),
                'name' => $termEntity->toLink()->getText(),
                'nodes' => []
            ];
        }

        $nids = \Drupal::entityQuery('node')
            ->condition('type', 'fichiers_pdf')
            ->condition('status', 1);

        $nids = $nids->execute();

        $nodesEntities = \Drupal\node\Entity\Node::loadMultiple($nids);

        foreach ($nodesEntities as $nodeEntity) {
            $terms[$nodeEntity->field_categorie_fichier->getString()]['nodes'][] = [
                'title' => $nodeEntity->title->getString(),
                'date' => date('d/m/Y', $nodeEntity->created->getString()),
            ];
        }

        return array(
            '#theme' => 'bibliothequePdf',
            //'#nodes' => $nodes,
            '#terms' => $terms,
        );
    }

    public function agences() {
        $nids = \Drupal::entityQuery('node')
            ->condition('type', 'agence')
            ->condition('status', 1);
        $nids = $nids->execute();

        $nodesEntities = \Drupal\node\Entity\Node::loadMultiple($nids);
        $nodes = [];

        foreach ($nodesEntities as $nodeEntity) {

            $term = $nodeEntity->field_type_agence->getString();
            $term = explode(',', $term);

            foreach ($term as $element){
                $termEntity = \Drupal\taxonomy\Entity\Term::load(trim($element));

                $nodes[$termEntity->toLink()->getText()][] = [
                    'title' => $nodeEntity->title->getString(),
                    'description' => $nodeEntity->field_description->getString(),
                    'url' => \Drupal::service('path.alias_manager')->getAliasByPath('/node/' . $nodeEntity->nid->getString()),
                    'agence' => [
                        'adresse' => $nodeEntity->field_adresse->getString(),
                        'ville' => $nodeEntity->field_ville->getString(),
                        'cp' => $nodeEntity->field_code_postale->getString(),
                        'tel' => $nodeEntity->field_tel->getString(),
                        'fax' => $nodeEntity->field_fax->getString(),
                        'email' => $nodeEntity->field_email->getString(),
                    ],
                    'type' => $termEntity,
                    'cp' => $nodeEntity->field_code_postale->getString(),
                    'ville' => $nodeEntity->field_ville->getString(),
                    'tel' => $nodeEntity->field_tel->getString(),
                    'fax' => $nodeEntity->field_fax->getString(),
                    'mail' => $nodeEntity->field_email->getString()
                ];
            }
        }

        return array(
            '#theme' => 'agences',
            '#nodes' => $nodes,
        );
    }

    public function labo($type = '') {
       if(empty($_SESSION['itga']['apiUser']->MadraLogin) || empty($_SESSION['itga']['apiUser']->MadraPassword)){
            return array(
                '#theme' => 'labo',
                '#commandes' => [],
            );
        }

        $api = new MadraApi();
       
        $commandes = $api->getCommandesClient($type);
        $nbCommandes = $api->getCommandesClientStats();//$type

        switch($type){
            case 'mat';
                $nbCommandes = $nbCommandes->NombreTotalCommandesMateriaux;
                break;

            case 'filtre';
                $nbCommandes = $nbCommandes->NombreTotalCommandesFiltres;
                break;

            case 'legio';
                $nbCommandes = $nbCommandes->NombreTotalCommandesLegionelles;
                break;

            default:
                $nbCommandes = $nbCommandes->NombreTotalDeCommandes;
                break;
        }

        $commandesList = [];
        if(empty($commandes['msg'])) {
            foreach ($commandes as $commande) {
                
                foreach($commande->ListeCommandesITGA as $commandeLine) {
                    $thiscommande = clone $commande;
                    $thiscommande->commandeLine = $commandeLine;
                    
                    $thiscommande->echantillonsStats = $api->getCommandeEchantillonsStats(trim(strip_tags($commande->ReferenceCommandeClient)));
                    $typeCommande = [];
    
                    if (!empty($commande->echantillonsStats->NombreTotalEchantillonsMateriaux) && $commande->echantillonsStats->NombreTotalEchantillonsMateriaux > 0) {
                        $typeCommande[] = 'MAT';
                    }
                    if (!empty($commande->echantillonsStats->NombreTotalEchantillonsFiltres) || !empty($commande->echantillonsStats->NombreTotalEchantillonsFiltresSurOperateur) || !empty($commande->echantillonsStats->NombreTotalEchantillonsFiltresPosteFixe)) {
                        $typeCommande[] = 'FILTRE';
                    }
                    if (!empty($commande->echantillonsStats->NombreTotalEchantillonsLegionelles) && $commande->echantillonsStats->NombreTotalEchantillonsLegionelles > 0) {
                        $typeCommande[] = 'LEGIO';
                    }
    
                    @$thiscommande->echantillonsStats->type = implode('/', $typeCommande);
                    $thiscommande->DateEnregistrement = $commandeLine->DateEnregistrement;
                    $thiscommande->NumeroCommandeITGA = $commandeLine->NumeroCommandeITGA;
                    unset($thiscommande->ListeCommandesITGA);
    
                    $commandesList[] = $thiscommande;
                }
            }

            pager_default_initialize($nbCommandes, 10);
        }
        
        $renderAr = [];
        $renderAr[] = array(
            '#theme' => 'labo',
            '#commandes' => $commandesList,
            '#nbCommandes' => $nbCommandes
        );
    
        
        if(empty($type)){
            $renderAr[] = [
                '#type' => 'pager',
                '#route_name' => 'itga.labo'
            ];
        } else {
            //echo '<pre>'; print_r($type); echo '</pre>'; exit;
            $renderAr[] = [
                '#type' => 'pager',
                '#route_name' => '<current>',
            ];
        }

        return $renderAr;
    }

    // Liste des échantillons d'une commande
    public function laboCommandeDetails(){

        $api = new MadraApi();
        $details = [];
        $detailsFiltres = [];
        $detailsLegio = [];

        if(!empty($_GET['nbEchantillonsMateriaux']) && $_GET['nbEchantillonsMateriaux'] > 0){
            $details = $api->getCommandeDetailsMateriaux(trim(strip_tags($_GET['ref'])));
        }
        //echo '<pre>'; var_dump($details); echo '</pre>'; exit;
        if(!empty($_GET['nbEchantillonsFiltres']) && $_GET['nbEchantillonsFiltres'] > 0) {
            $detailsFiltres = $api->getCommandeDetailsFiltres(trim(strip_tags($_GET['ref'])));
        }

        if(!empty($_GET['nbEchantillonsLegionelles']) && $_GET['nbEchantillonsLegionelles'] > 0){
            $detailsLegio = $api->getCommandeDetailsLegio(trim(strip_tags($_GET['ref'])));
        }

        $details = array_merge($details, $detailsFiltres, $detailsLegio);

        $twig = \Drupal::service('twig');
        $template = $twig->loadTemplate(drupal_get_path('theme', 'itgatheme') . '/templates/custom/commande-details.html.twig');
        
        echo $template->render(['details' => $details, 'ref' => trim(strip_tags($_GET['ref']))]);
        exit;
    }

    // Rapport
    public function laboCommandeRapport(){

        $api = new MadraApi();
        $details = $api->getCommandeRapport(strip_tags($_GET['ref']));
        $pdf = base64_decode($details[0]->ListeRapportsSynthetiques[0]->ContenuBase64);

        header("Content-type: application/pdf");
        header("Content-disposition: inline;filename=".$details[0]->ListeRapportsSynthetiques[0]->NomDocument);
        echo $pdf;
        exit;
    }

    // Rapport par échantillon
    public function laboCommandeRapportEchantillon($type = ''){

        $api = new MadraApi();
        switch($type){
            case 'mat':
                $details = $api->getCommandeRapportEchantillonMateriaux(strip_tags($_GET['ref']));
                break;

            case 'filtre':
                $details = $api->getCommandeRapportEchantillonFiltres(strip_tags($_GET['ref']));
                break;

            case 'legio':
                $details = $api->getCommandeRapportEchantillonLegio(strip_tags($_GET['ref']));
                break;
        }

        if(!empty($details)) {
            $pdf = base64_decode($details[0]->ListeRapports[0]->ContenuBase64);

            header("Content-type: application/pdf");
            header("Content-disposition: inline;filename=" . $details[0]->ListeRapportsSynthetiques[0]->NomDocument);
            echo $pdf;
        }
        exit;
    }

    // Export excel
    public function laboCommandesToExcel(){

        $laboColumns = json_decode($_COOKIE['laboColumns']);

        $api = new MadraApi();
        $commandes = $api->getCommandesClient();

        $arrayCsv = [];
        $newLine = [];

        if(!empty($laboColumns->DateDeLaCommande) && $laboColumns->DateDeLaCommande) {
            $newLine[] = 'Date de la commande';
        }

        if(!empty($laboColumns->NumeroDeLaCommande) && $laboColumns->NumeroDeLaCommande) {
            $newLine[] = 'Numéro de la commande';
        }

        if(!empty($laboColumns->Client) && $laboColumns->Client) {
            $newLine[] = 'Client';
        }

        if(!empty($laboColumns->ReferenceClientCommande) && $laboColumns->ReferenceClientCommande) {
            $newLine[] = 'Référence client';
        }

        if(!empty($laboColumns->DestinataireResultat) && $laboColumns->DestinataireResultat) {
            $newLine[] = 'Destinataire Résultat';
        }

        if(!empty($laboColumns->NbEchantillons) && $laboColumns->NbEchantillons) {
            $newLine[] = 'Nb échantillons';
        }

        if(!empty($laboColumns->TypeEchantillons) && $laboColumns->TypeEchantillons) {
            $newLine[] = 'Type d\'échantillons';
        }

        if(!empty($laboColumns->NumeroEchantillon) && $laboColumns->NumeroEchantillon){
            $newLine[] = 'N° éch.';
        }

        if(!empty($laboColumns->ReferenceClientEchantillon) && $laboColumns->ReferenceClientEchantillon){
            $newLine[] = 'Réf. éch. client';
        }

        if(!empty($laboColumns->DatePrelevement) && $laboColumns->DatePrelevement){
            $newLine[] = 'Date prelevement.';
        }

        if(!empty($laboColumns->TypeEchantillon) && $laboColumns->TypeEchantillon){
            $newLine[] = 'Type';
        }

        if(!empty($laboColumns->Typefiltre) && $laboColumns->Typefiltre){
            $newLine[] = 'Type de filtre';
        }

        if(!empty($laboColumns->Statut) && $laboColumns->Statut){
            $newLine[] = 'Statut';
        }

        if(!empty($laboColumns->DateReception) && $laboColumns->DateReception){
            $newLine[] = 'Date de réception';
        }

        if(!empty($laboColumns->DateRendu) && $laboColumns->DateRendu){
            $newLine[] = 'Date de Rendue';
        }

        $arrayCsv[] = utf8_decode(implode(';', $newLine));
        
        foreach($commandes as $commande){
            // Nb échantillons
            $commande->echantillonsStats = $api->getCommandeEchantillonsStats(trim(strip_tags($commande->ReferenceCommandeClient)));

            $typeCommande = [];
            if($commande->echantillonsStats->NombreTotalEchantillonsMateriaux > 0){
                $typeCommande[] = 'MAT';
            }
            if($commande->echantillonsStats->NombreTotalEchantillonsFiltres > 0 || $commande->echantillonsStats->NombreTotalEchantillonsFiltresSurOperateur > 0 || $commande->echantillonsStats->NombreTotalEchantillonsFiltresPosteFixe > 0){
                $typeCommande[] = 'FILTRE';
            }
            if($commande->echantillonsStats->NombreTotalEchantillonsLegionelles > 0){
                $typeCommande[] = 'LEGIO';
            }
            $commande->echantillonsStats->type = implode('/', $typeCommande);

            // Détails des échantillons
            if(!empty($commande->echantillonsStats->NombreTotalEchantillonsMateriaux) && $commande->echantillonsStats->NombreTotalEchantillonsMateriaux > 0){
                $detailsMat = $api->getCommandeDetailsMateriaux(trim(strip_tags($commande->ReferenceCommandeClient)));
            }

            $nbFiltres = 0;
            if(!empty($commande->echantillonsStats->NombreTotalEchantillonsFiltres) && $commande->echantillonsStats->NombreTotalEchantillonsFiltres > 0) { $nbFiltres = $nbFiltres + $commande->echantillonsStats->NombreTotalEchantillonsFiltres; }
            if(!empty($commande->echantillonsStats->NombreTotalEchantillonsFiltresSurOperateur) && $commande->echantillonsStats->NombreTotalEchantillonsFiltresSurOperateur > 0) { $nbFiltres = $nbFiltres + $commande->echantillonsStats->NombreTotalEchantillonsFiltresSurOperateur; }
            if(!empty($commande->echantillonsStats->NombreTotalEchantillonsFiltresPosteFixe) && $commande->echantillonsStats->NombreTotalEchantillonsFiltresPosteFixe > 0) { $nbFiltres = $nbFiltres + $commande->echantillonsStats->NombreTotalEchantillonsFiltresPosteFixe; }
            if($nbFiltres > 0){
                $detailsFiltres = $api->getCommandeDetailsFiltres(trim(strip_tags($commande->ReferenceCommandeClient)));
            }

            if(!empty($commande->echantillonsStats->NombreTotalEchantillonsLegionelles) && $commande->echantillonsStats->NombreTotalEchantillonsLegionelles > 0){
                $detailsLegio = $api->getCommandeDetailsLegio(trim(strip_tags($commande->ReferenceCommandeClient)));
            }
    
            $detailsEch = [];
            if(!empty($detailsMat)){
                $detailsEch = array_merge($detailsEch, $detailsMat);
            }
            if(!empty($detailsFiltres)){
                $detailsEch = array_merge($detailsEch, $detailsFiltres);
            }
            if(!empty($detailsLegio)){
                $detailsEch = array_merge($detailsEch, $detailsLegio);
            }
            
            foreach($detailsEch as $details) {
                $newLine = [];
                
                if (!empty($laboColumns->DateDeLaCommande) && $laboColumns->DateDeLaCommande) {
                    $newLine[] = $commande->ListeCommandesITGA[0]->DateEnregistrement;
                }

                if (!empty($laboColumns->NumeroDeLaCommande) && $laboColumns->NumeroDeLaCommande) {
                    $newLine[] = $commande->ListeCommandesITGA[0]->NumeroCommandeITGA;
                }

                if (!empty($laboColumns->Client) && $laboColumns->Client) {
                    $newLine[] = $commande->Client;
                }

                if (!empty($laboColumns->ReferenceClientCommande) && $laboColumns->ReferenceClientCommande) {
                    $newLine[] = $commande->ReferenceCommandeClient;
                }

                if (!empty($laboColumns->DestinataireResultat) && $laboColumns->DestinataireResultat) {
                    $newLine[] = $commande->NomDestinataireResultat;
                }

                if (!empty($laboColumns->NbEchantillons) && $laboColumns->NbEchantillons) {
                    $newLine[] = $commande->echantillonsStats->NombreTotalEchantillons;
                }

                if (!empty($laboColumns->TypeEchantillons) && $laboColumns->TypeEchantillons) {
                    $newLine[] = $commande->echantillonsStats->type;
                }

                // Détails échantillon
                if (!empty($laboColumns->NumeroEchantillon) && $laboColumns->NumeroEchantillon) {
                    $newLine[] = $details->NumeroEchantillonITGA;
                }
                
                if (!empty($laboColumns->ReferenceClientEchantillon) && $laboColumns->ReferenceClientEchantillon) {
                    $newLine[] = trim($details->ReferenceEchantillonClient);
                }

                if (!empty($laboColumns->DatePrelevement) && $laboColumns->DatePrelevement) {
                    $newLine[] = $details->DatePrelevement;
                }

                if (!empty($laboColumns->TypeEchantillon) && $laboColumns->TypeEchantillon) {
                    $newLine[] = $details->Type;
                }

                if (!empty($laboColumns->Typefiltre) && $laboColumns->Typefiltre) {
                    $newLine[] = '';
                }

                if (!empty($laboColumns->Statut) && $laboColumns->Statut) {
                    $newLine[] = $details->Statut;
                }

                if (!empty($laboColumns->DateReception) && $laboColumns->DateReception) {
                    $newLine[] = $details->DateEnregistrement;
                }

                if (!empty($laboColumns->DateRendu) && $laboColumns->DateRendu) {
                    $newLine[] = $details->DatePrevue;
                }

                $arrayCsv[] = utf8_decode(implode(';', $newLine));
            }
        }
        
        header("Content-type: text/csv");
        header("Content-disposition: inline;filename=export.csv");
        header("Pragma: no-cache");
        header("Expires: 0");
        echo implode(chr(10), $arrayCsv);
        exit;
    }

    public function monCompte(){
        return array(
            '#theme' => 'mon-compte',
            '#thisUser' => $_SESSION['itga']
        );
    }

    public function activitesCollaborateur(){
        return array(
            '#theme' => 'activites-collaborateurs',
            '#thisUser' => $_SESSION['itga']
        );
    }

    public function mesFactures(){
        $facture = new factureApi();
        $factureList = $facture->getAll($_SESSION['itga']['apiAccount']->ClientCode);
        
        if(empty($factureList[0])){
            $factureList = [];
        }
        return array(
            '#theme' => 'mes-factures',
            '#thisUser' => $_SESSION['itga'],
            '#factures' => $factureList,
        );
    }

    public function mesFacturesDownload($id){
        $facture = new factureApi();
        $factureDl = $facture->getFacture($_SESSION['itga']['apiAccount']->ClientCode, $id);

        $options = array(
            CURLOPT_RETURNTRANSFER => true,     // return web page
            CURLOPT_HEADER         => false,    // don't return headers
            CURLOPT_FOLLOWLOCATION => true,     // follow redirects
            CURLOPT_ENCODING       => "",       // handle all encodings
            CURLOPT_USERAGENT      => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36", // who am i
            CURLOPT_AUTOREFERER    => true,     // set referer on redirect
            CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
            CURLOPT_TIMEOUT        => 120,      // timeout on response
            CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
            CURLOPT_SSL_VERIFYPEER => false,     // Disabled SSL Cert checks
            CURLOPT_HTTPHEADER     => ['API_KEY: '.$facture->getApiKey()]
        );

        $ch      = curl_init( $factureDl->LinkToVisualize );
        curl_setopt_array( $ch, $options );
        $pdf = curl_exec( $ch );

        if(!empty($pdf)) {
            header("Content-type: application/pdf");
            header("Content-disposition: inline;filename=".$id.".pdf");
            echo $pdf;
            exit;
        } else {
            echo 'Error, empty file...';
            exit;
        }
    }

    public function monCompteAjax(){
        $api = new UserApi();

        
        $datas = [];
        $datas['WorkPhone'] = strip_tags($_POST['WorkPhone']);
        $datas['FirstName'] = strip_tags($_POST['firstName']);
        $datas['LastName'] = strip_tags($_POST['lastName']);
        $datas['Id'] = $_SESSION['itga']['apiUser']->Id;
        $datas['Title'] = strip_tags($_POST['Title']);

        $values = $api->updateUser($datas);
        $authentApi = new AuthentApi();
        $authentApi->updateSession($_SESSION['itga']['jwt']);
        
        $_POST['ClientCode'] = $_SESSION['itga']['apiAccount']->ClientCode;
        $_POST['Account'] = $_SESSION['itga']['apiAccount']->Account;
        
        $htmlDroit = $this->cleanDisplayForEmail();
        
        $params = [
            'subject' => 'Modification des détails d\'un membre sur MonEspace.ITGA !',
            'toEmail' => 'monespace@itga.fr',
            'toName' => '',
            'keys' => [
                'droit' => $htmlDroit
            ]
        ];
        itga_send_mail('modification-mon-compte', $params);
        
        $params = [
            'subject' => 'Modification des détails d\'un membre sur MonEspace.ITGA !',
            'toEmail' => $_SESSION['itga']['apiAccount']->Manager->Email,
            'toName' => '',
            'keys' => [
                'droit' => $htmlDroit
            ]
        ];
        itga_send_mail('modification-mon-compte', $params);
        
        echo json_encode(['error' => false]);
        exit;
    }

    public function monAgenceItga(){

        $nid = $_SESSION['itga']['agence']->id();
        $node = \Drupal::entityTypeManager()->getStorage('node')->load($nid);
        return array(
            '#theme' => 'mon-agence-itga',
            '#content' => $node,//$_SESSION['itga']['agence']
        );
    }

    public function gestionDescomptes(){

        $user = \Drupal::currentUser();

        $api = new UserApi();

        $accountUsers = $api->getUserAccountUsersList($_SESSION['itga']['apiUser']->AccountId);
        $Users = array();


        foreach($accountUsers as $account){
            $userAccount = $api->getUserById($account->Id);
            array_push($Users, $userAccount);
        }

        return array(
            '#theme' => 'gestion-compte',
            '#roles' => $user->getRoles(true),
            '#accountUsers' => $Users,
            '#thisUser' => $_SESSION['itga']
        );
    }

    public function gestionDescomptesAddMembre(){
        $api = new UserApi();
        $isUserExist = $api->getUserByEmail(strip_tags($_POST['Email']));
        $currentAccountId = $_SESSION['itga']['apiAccount'];
        $currentAccountId = $currentAccountId->AccountId;

        if(count($isUserExist) <= 0){
            $datas = [];
            $datas['ContactId'] = '';
            $datas['AccountId'] = $currentAccountId;
            $datas['Login'] = strip_tags($_POST['Email']);
            $datas['MadraLogin'] = '';
            $datas['MadraPassword'] = '';
            $datas['FirstName'] = strip_tags($_POST['FirstName']);
            $datas['LastName'] = strip_tags($_POST['LastName']);
            $datas['Email'] = strip_tags($_POST['Email']);
            $datas['WorkPhone'] = strip_tags($_POST['WorkPhone']);
            $datas['Title'] = strip_tags($_POST['Title']);
            $datas['IsSuperAdmin'] = false;


            $retour = $api->addUser($datas);

            $activate = $api->activateUser($retour->Id);
    
            $auth = new AuthentApi();
            $authentication = $auth->firstConnexion(strip_tags($_POST['Email']), '');
            
            $isLabo = false;
            
            unset($_POST['AccountId']);
            
            $_POST['ClientCode'] = $_SESSION['itga']['apiAccount']->ClientCode;
            $_POST['Account'] = $_SESSION['itga']['apiAccount']->Account;
            
            $htmlDroit = $this->cleanDisplayForEmail();
            
            foreach ($_POST as $key => $value) {
                if ($value == 'true') {
                    $detailProfilItga = $api->getProfilDetails($key);
                    if($key <> 'itga_facturation') {
                        $api->addUserProfil($retour->Id, $detailProfilItga->Id);
                    }
                }
                if($key == "check-profil-labo") {
                    $isLabo = true;
                }
            }
            
            $params = [
                'subject' => 'Ajout d\'un membre sur MonEspace.ITGA !',
                'toEmail' => 'monespace@itga.fr',
                'toName' => '',
                'keys' => [
                    'droit' => $htmlDroit
                ]
            ];
            itga_send_mail('ajout-d-un-compte', $params);
    
            $params = [
                'subject' => 'Ajout d\'un membre sur MonEspace.ITGA !',
                'toEmail' => $_SESSION['itga']['apiAccount']->Manager->Email,
                'toName' => '',
                'keys' => [
                    'droit' => $htmlDroit
                ]
            ];
            itga_send_mail('ajout-d-un-compte', $params);
    

            if($isLabo) {
                $params = [
                    'subject' => 'Ajout d\'un membre sur MonEspace.ITGA !',
                    'toEmail' => 'support.madra@itga.fr',
                    'toName' => '',
                    'keys' => [
                        'droit' => $htmlDroit
                    ]
                ];
                itga_send_mail('ajout-d-un-compte', $params);
            }
            
            echo json_encode(['error' => false]);
        } else {
            echo json_encode(['error' => true, 'msg' => 'Un compte existe déjà avec cette adresse']);
        }
        exit;
    }
    
    public static function cleanDisplayForEmail() {
        $htmlDroit = '';
        $htmlVisibilite = '';
        $htmlInformation = '';
        $htmlcontact = '';
        
        foreach ($_POST as $key => $value) {
            $value = strip_tags($value);
    
            if (!empty($value)) {
                switch ($key) {
                    case 'propre-rapport':
                        if($value !== false && $value !== 'false') {
                            $htmlVisibilite .= '- Ses propres rapports<br />';
                        }
                        break;
                    case 'all-rapport':
                        if($value !== false && $value !== 'false') {
                            $htmlVisibilite .= '- Tous les rapports de la société<br />';
                        }
                        break;
                    case 'other-rapport':
                        if($value !== false && $value !== 'false') {
                            $htmlVisibilite .= '- Les rapports adressés à d\'autres collaborateurs :<br />';
                            foreach ($_POST['email-collabo'] as $emailCollabo) {
                                $htmlVisibilite .= '&nbsp;&nbsp;&nbsp;&nbsp;- ' . strip_tags($emailCollabo) . '<br />';
                            }
                        }
                        break;
                    case 'login':
                    case 'userEmail':
                    case 'Email':
                        $htmlInformation .= "Adresse email : " . $value . '<br />';
                        break;
                    case 'email':
                        $htmlcontact .= "Adresse email : " . $value . '<br />';
                        break;
                    case 'votre_numero_de_telephone':
                        $htmlcontact .= "Numéro de téléphone : " . $value . '<br />';
                        break;
                    case 'AccountId':
                    case 'userAccountId':
                        $htmlInformation .= "Identifiant du compte : " . $value . '<br />';
                        break;
                    case 'numero_client_itga':
                        $htmlcontact .= "Identifiant du compte : " . $value . '<br />';
                        break;
                    case 'ContactId':
                        $htmlInformation .= "Identifiant du contact : " . $value . '<br />';
                        break;
                    case 'WorkPhone':
                    case 'userWorkPhone':
                        $htmlInformation .= "Téléphone : " . $value . '<br />';
                        break;
                    case 'FirstName':
                    case 'userFirstName':
                    case 'firstName':
                        $htmlInformation .= "Prénom : " . $value . '<br />';
                        break;
                    case 'votre_prenom':
                        $htmlcontact .= "Prénom : " . $value . '<br />';
                        break;
                    case 'Account':
                        $htmlInformation .= "Société : " . $value . '<br />';
                        break;
                    case 'subject':
                        $htmlcontact .= "Sujet : " . $value . '<br />';
                        break;
                    case 'votre_demande_concerne':
                        $htmlcontact .= "La demande concerne : " . $value . '<br />';
                        break;
                    case 'ClientCode':
                        $htmlInformation .= "Code Client : " . $value . '<br />';
                        break;
                    case 'LastName':
                    case 'userLastName':
                    case 'lastName':
                        $htmlInformation .= "Nom : " . $value . '<br />';
                        break;
                    case 'name':
                        $htmlcontact .= "Nom : " . $value . '<br />';
                        break;
                    case 'Title':
                    case 'userTitle':
                        $htmlInformation .= "Fonction : " . $value . '<br />';
                        break;
                    case "type-visibilite-rapport":
                        $htmlVisibilite .= "Visibilité des rapports : " . $value . '<br />';
                        break;
                    case "message":
                        $htmlcontact .= "Message : " . nl2br($value) . '<br />';
                        break;
                    case 'MadraLogin':
                    case 'MadraPassword':
                        break;
                    default:
                        if($value !== false && $value !== 'false') {
                            switch ($key) {
                                case 'diag_admin_delegate':
                                    $htmlDroit .= '- PROFIL ADMINISTRATEUR DÉLÉGUÉ<br/>';
                                    break;
                                case 'check-profil-labo':
                                    $htmlDroit .= '- PROFIL LABORATOIRE<br/>';
                                    break;
                                case 'check-suivi-commandes':
                                    $htmlDroit .= '&nbsp;&nbsp;&nbsp;&nbsp;- SUIVI COMMANDES<br/>';
                                    break;
                                case 'diag_suivi_cmd_mat':
                                    $htmlDroit .= '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Matériaux<br/>';
                                    break;
                                case 'diag_suivi_cmd_fltr':
                                    $htmlDroit .= '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Filtres<br/>';
                                    break;
                                case 'diag_suivi_cmd_legio':
                                    $htmlDroit .= '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Légionelles<br/>';
                                    break;
                                case 'diag_cmd_conso':
                                    $htmlDroit .= '&nbsp;&nbsp;&nbsp;&nbsp;- COMMANDES CONSOMMABLES<br/>';
                                    break;
                                case 'planification':
                                    $htmlDroit .= '&nbsp;&nbsp;&nbsp;&nbsp;- PLANNIFICATION<br/>';
                                    break;
                                case 'diag_stagiaire':
                                    $htmlDroit .= '- PROFIL FORMATION<br/>';
                                    break;
                                case 'diag_facturation':
                                    $htmlDroit .= '- PROFIL FACTURATION<br/>';
                                    break;
                                case 'submit':
                                case 'visibilite-rapport':
                                    break;
                                default:
                                    $htmlDroit .= $key . '<br/>';
                                    break;
                            }
                        }
                }
            }
        }
        
        $html = '';
        
        if(!empty($htmlInformation)){
            $html .= '<strong>Information utilisateur</strong> :<br />'.$htmlInformation.'<br />';
        }
        
        if(!empty($htmlcontact)){
            $html .= '<strong>Information du message</strong> :<br />'.$htmlcontact.'<br />';
        }
        
        if(!empty($htmlDroit)){
            $html .= '<strong>Droits</strong> :<br />'.$htmlDroit.'<br />';
        }
    
        if(!empty($htmlVisibilite)){
            $html .= '<strong>Visibilité des rapports</strong> :<br />'.$htmlVisibilite;
        }
        
        return $html;
    }
    
    public function gestionDescomptesDetails($id){
        $user = \Drupal::currentUser();
    
        $api = new UserApi();
        $userDetails = $api->getUserById($id);
    
        if(!empty($userDetails->Email)){
            $userAccount = \user_load_by_mail($userDetails->Email);
            if(!empty($userAccount)){
                $userDetails->drupalRoles = $userAccount->getRoles(true);
                echo json_encode($userDetails);
                exit;
            } else {
                echo json_encode(['error' => true, 'msg' => 'Le compte n\'est pas encore activé (2)']);
            }
        } else {
            echo json_encode(['error' => true, 'msg' => 'Le compte n\'est pas encore activé (1)']);
        }
        
        exit;
    }


    // Fonction appelée à la modification du compte personnel de l'utilisateur courant
    public function gestionDescomptesDetailsUpdateRoles($id){
        // Check si on a le droit d'update le compte ou pas
        $api = new UserApi();
        $userDetails = $api->getUserById($id);
        
        if(!empty($userDetails->Email)) {
            $userAccount = \user_load_by_mail($userDetails->Email);
    
            $_POST['ClientCode'] = $_SESSION['itga']['apiAccount']->ClientCode;
            $_POST['Account'] = $_SESSION['itga']['apiAccount']->Account;
            $htmlDroit = $this->cleanDisplayForEmail();
            
            //echo '<pre>'; print_r($userAccount); echo '</pre>'; exit;
            foreach ($_POST as $key => $value) {
                
                $detailProfilItga = $api->getProfilDetails($key);
                
                if ($value == 'true') {
                    $userAccount->addRole($key);
                    if($key <> 'itga_facturation') {
                        $api->addUserProfil($id, $detailProfilItga->Id);
                    }
                } else {
                    $userAccount->removeRole($key);
                    if($key <> 'itga_facturation') {
                        $api->deleteUserProfil($id, $detailProfilItga->Id);
                    }
                }
            }
    
            $userAccount->save();
    
            $params = [
                'subject' => 'Modification des droits d\'un membre sur MonEspace.ITGA !',
                'toEmail' => 'monespace@itga.fr',
                'toName' => 'MonEspace.ITGA',
                'keys' => [
                    'droit' => $htmlDroit
                ]
            ];
            itga_send_mail('modification-droit-membre', $params);
    
            $params = [
                'subject' => 'Modification des droits d\'un membre sur MonEspace.ITGA !',
                'toEmail' => $_SESSION['itga']['apiAccount']->Manager->Email,
                'toName' => 'MonEspace.ITGA',
                'keys' => [
                    'droit' => $htmlDroit
                ]
            ];
            itga_send_mail('modification-droit-membre', $params);
            
            echo json_encode(['error' => false, 'msg' => 'Le compte a été mis à jour']);
        } else {
            echo json_encode(['error' => true, 'msg' => 'Le compte n\'est pas encore activé']);
        }
        exit;
    }


    // Fonction appelée à la modification d'un compte utilisateur
    public function updateAccount($id){
        
        $api = new UserApi();
        $userDetails = $api->getUserById($id);
        $reactivation = false;

        if($userDetails->IsArchived == 1) {
            $reactivation = true;
        }

        $api->activateUser($id);
        $api->notArchivedUser($id);
    
        $authent = new AuthentApi();
        $authent->firstConnexion($userDetails->Email, 'https://'.$_SERVER['HTTP_HOST'].'/?t=');
        
        if(!empty($userDetails->Email)) {
            
            $datas = [];
            $datas['Email'] = $userDetails->Email;
            $datas['Login'] = $userDetails->Login;
            $datas['Id'] = $id;
            $datas['AccountId'] = $userDetails->AccountId;
            $datas['ContactId'] = $userDetails->ContactId;
            $datas['MadraLogin'] = $userDetails->MadraLogin;
            $datas['MadraPassword'] = $userDetails->MadraPassword;

            $datas['WorkPhone'] = strip_tags($_POST['WorkPhone']);
            $datas['FirstName'] = strip_tags($_POST['firstName']);
            $datas['LastName'] = strip_tags($_POST['lastName']);
            $datas['Title'] = strip_tags($_POST['Title']);

            $api->updateUserAccount($datas);

            $userAccount = \user_load_by_mail($userDetails->Email);
    
            $_POST['ClientCode'] = $_SESSION['itga']['apiAccount']->ClientCode;
            $_POST['Account'] = $_SESSION['itga']['apiAccount']->Account;

            
            $htmlDroit = $this->cleanDisplayForEmail();
            
            foreach ($_POST as $key => $value) {
                $detailProfilItga = $api->getProfilDetails($key);
                
                if ($value == "true") {
                    if($userAccount !== false){
                        $userAccount->addRole($key);
                    }
                    if($key <> 'itga_facturation') {
                        $api->addUserProfil($id, $detailProfilItga->Id);
                    }
                } else {
                    if($userAccount !== false){

                        $userAccount->removeRole($key);
                    }
                    if($key <> 'itga_facturation') {
                        $api->deleteUserProfil($id, $detailProfilItga->Id);
                    }
                }
            }
    
            if($userAccount !== false) {
                $userAccount->save();
            }
            
            if(empty($_GET['validation'])) {
                $params = [
                    'subject' => 'Modification des détails d\'un membre sur MonEspace.ITGA !',
                    'toEmail' => 'monespace@itga.fr',
                    'toName' => 'MonEspace.ITGA',
                    'keys' => [
                        'droit' => $htmlDroit
                    ]
                ];
                itga_send_mail('modification-droit-membre', $params);
    
                $params = [
                    'subject' => 'Modification des détails d\'un membre sur MonEspace.ITGA !',
                    'toEmail' => $_SESSION['itga']['apiAccount']->Manager->Email,
                    'toName' => 'MonEspace.ITGA',
                    'keys' => [
                        'droit' => $htmlDroit
                    ]
                ];
                itga_send_mail('modification-droit-membre', $params);
            }
            else {
                $activate = $api->activateUser($id);
                
                $params = [
                    'subject' => 'Validation d\'un membre sur MonEspace.ITGA !',
                    'toEmail' => 'monespace@itga.fr',
                    'toName' => 'MonEspace.ITGA',
                    'keys' => [
                        'droit' => $htmlDroit
                    ]
                ];
                itga_send_mail('ajout-d-un-compte', $params);
            }

            if($_GET['validation'] == "true") {
                echo json_encode(['error' => false, 'msg' => 'Votre demande a bien été prise en considération. Votre collaborateur recevra un email pour activer son compte personnel MonEspace.ITGA']);
            }
            elseif($reactivation) {
                echo json_encode(['error' => false, 'msg' => 'Votre demande a bien été prise en considération. Le compte a été réactivé.']);
            }
            else {
                echo json_encode(['error' => false, 'msg' => 'Le compte a été mis à jour.']);
            }

        } else {
            echo json_encode(['error' => true, 'msg' => 'Le compte n\'est pas encore activé']);
        }
        exit;
    }
    
    public function gestionDescomptesDetailsCompte($id){
        $user = \Drupal::currentUser();
        
        $api = new UserApi();
        $userDetails = $api->getUserById($id);
        
        if(!empty($userDetails->Email)){
            //echo json_encode($userDetails);
            
            $userAccount = $api->getUserAccount($userDetails->AccountId);
            
            echo json_encode(['error' => false, 'details' => ['user' => $userDetails, 'account' => $userAccount]]);
        } else {
            echo json_encode(['error' => true, 'msg' => 'Le compte n\'est pas encore activé']);
        }
        
        exit;
    }
    
    public function gestionDescomptesActivateUser($id){
        $api = new UserApi();
        $userDetails = $api->activateUser($id);
        $userDetails = $api->notArchivedUser($id);
    
        echo json_encode(['error' => false]);
        exit;
    }
    
    public function gestionDescomptesDesactivateUser($id){
        $api = new UserApi();
        $userDetails = $api->archivedUser($id);
    
        echo json_encode(['error' => false]);
        exit;
    }
    
    public function pagedetest(){
        echo '<pre>'; print_r($_SESSION['itga']);
        exit;
    }
    
    public function planification() {
        $api = new MadraApi();
        $planificationList = $api->getPlanification();

        return array(
            '#theme' => 'planification',
            '#planificationList' => $planificationList,
        );
    }
    
    public function premiereConnexionFinalise(){
    
    }
    public function premiereConnexionFinaliseAjax(){
    
    }
}