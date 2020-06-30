<?php

namespace Drupal\itga\Controller;

use Lcobucci\JWT\Parser;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\RedirectResponse;

class UserApi extends ItgaApi {
    
    protected $url = 'https://apiextranetfront.itga.fr/api/v1';
    protected $apiKey = 'ITGA';
    protected $apiVersion = '2';
    
    public function getUser($userId){
        $userDetails = $this->callApi('users/'.$userId, ['method' => 'get']);
        return $userDetails;
    }
    
    public function getUserAccount($accountId){
        $accountDetails = $this->callApi('accounts/'.$accountId, ['method' => 'get']);
        return $accountDetails;
    }
    
    public function getUserAccountByClientCode($clientCode){
        $accountDetails = $this->callApi('accounts/clientCode/'.$clientCode, ['method' => 'get']);
        return $accountDetails;
    }
    
    public function getUserAccountUsersList($accountId){
        $accountDetails = $this->callApi('users/account/'.$accountId, ['method' => 'get']);
        return $accountDetails;
    }
    
    public function getUserAccountUsersListByCodeClient($clientCode){
        $accountDetails = $this->callApi('users/account/clientCode/'.$clientCode, ['method' => 'get']);
        return $accountDetails;
    }
    
    public function getUserByEmail($email){
        $accountDetails = $this->callApi('users/'.$email, ['method' => 'get']);
        return $accountDetails;
    }
    
    public function getUserById($id){
        $accountDetails = $this->callApi('users/'.$id, ['method' => 'get']);
        return $accountDetails;
    }
    
    public function getUserTypology($typologyId){
        $accountDetails = $this->callApi('typologies/'.$typologyId, ['method' => 'get']);
        return $accountDetails;
    }
    
    public function deleteUserProfil($userId, $profilId){
        $accountDetails = $this->callApi('userprofiles/', ['method' => 'delete', 'body' => ['UserId' => $userId, 'ProfileId' => $profilId]]);
        return $accountDetails;
    }
    
    public function addUserProfil($userId, $profilId){
        $accountDetails = $this->callApi('userprofiles/', ['method' => 'post', 'body' => ['UserId' => $userId, 'ProfileId' => $profilId]]);
        return $accountDetails;
    }
    
    public function activateUser($userId){
        $accountDetails = $this->callApi('users/activate', ['method' => 'put', 'body' => ['UserId' => $userId, 'IsActive' => true]]);
        return $accountDetails;
    }
    
    public function desactivateUser($userId){
        $accountDetails = $this->callApi('users/activate', ['method' => 'put', 'body' => ['UserId' => $userId, 'IsActive' => false]]);
        return $accountDetails;
    }

    public function archivedUser($userId){
        $accountDetails = $this->callApi('users/archived', ['method' => 'delete', 'body' => ['UserId' => $userId, 'IsArchived' => true]]);
        return $accountDetails;
    }

    public function notArchivedUser($userId){
        $accountDetails = $this->callApi('users/archived', ['method' => 'delete', 'body' => ['UserId' => $userId, 'IsArchived' => false]]);
        return $accountDetails;
    }
    
    public function getProfilDetails($profilName){
        $accountDetails = $this->callApi('profiles/'.$profilName);
        return $accountDetails;
    }
    
    public function updateUser($datas){
        $datas['Email'] = $_SESSION['itga']['apiUser']->Email;
        $datas['Login'] = $_SESSION['itga']['apiUser']->Login;
        $datas['AccountId'] = $_SESSION['itga']['apiUser']->AccountId;
        $datas['ContactId'] = $_SESSION['itga']['apiUser']->ContactId;
        $datas['MadraLogin'] = $_SESSION['itga']['apiUser']->MadraLogin;
        $datas['MadraPassword'] = $_SESSION['itga']['apiUser']->MadraPassword;
        
        $accountDetails = $this->callApi('users/', ['method' => 'put', 'body' => $datas]);
        
        return $accountDetails;
    }

    public function updateUserAccount($datas){
        $accountDetails = $this->callApi('users/', ['method' => 'put', 'body' => $datas]);
        return $accountDetails;
    }
    
    public function addUser($datas){
        $accountDetails = $this->callApi('users/', ['method' => 'post', 'body' => $datas]);
        return $accountDetails;
    }
}