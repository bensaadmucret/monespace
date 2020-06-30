<?php

namespace Drupal\itga\Controller;

use function GuzzleHttp\default_ca_bundle;

require_once('modules/custom/itga/src/Controller/itgaApi.php');

class MadraApi extends ItgaApi {
    protected $url = 'https://webservices.itga.fr/Madra.WebAPI';
    protected $apiKey = 'ITGA';
    protected $apiVersion = '2';
    
    function __construct() {
        if(!empty($_GET['forceDebug']) && $_GET['forceDebug'] != '1'){
            $this->url = $_GET['forceDebug'];
        }
    }
    
    // Retourne les commandes du client
    public function getCommandesClient($type){
    
        $api = new MadraApi();
        
        $perPage = 10;
        $startPage = \Drupal::requestStack()->getCurrentRequest()->query->get('page');
        $startPage++;
        if(empty($startPage)){
            $startPage = 0;
            $endPage = $perPage;
        } else {
            $startPage = $startPage -1;
            $startPage = $startPage*$perPage;
            $endPage = $startPage+$perPage;
        }
        
        $params = [
            'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin, // 'demo',//
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword, // 'fe01ce2a7fbac8fafaed7c982a04e229',//
        ];
        
        $tri = \Drupal::requestStack()->getCurrentRequest()->query->get('o');
        $triOrdre = \Drupal::requestStack()->getCurrentRequest()->query->get('s');
        
        switch($tri){
            case 'ref':
                $tri = 'refCommandeClient';
                break;
    
            case 'date':
            default:
                $tri = 'DateEnregCommande';
                break;
        }
        
        switch($triOrdre){
            case 'asc':
                $triOrdre = 'Croissant';
                break;
    
            case 'desc':
            default:
                $triOrdre = 'Decroissant';
                break;
        }
        
        switch($type){
            case 'mat';
                $typeEchantillon = 'MAT';
                break;
            
            case 'filtre';
                $typeEchantillon = 'FIL';
                break;
            
            case 'legio';
                $typeEchantillon = 'LEG';
                break;
            
            default:
                $typeEchantillon = 'Tous';
                break;
        }
        
        
        return $this->callApi('CommandesClient/dateDebut='.date('Y-m-d', strtotime('-24 months')).'T00%3A00%3A00&dateFin='.date('Y-m-d').'T23%3A59%3A59&tri='.$tri.'&enregistrementDebut='.$startPage.'&enregistrementFin='.$endPage.'&typeEchantillon='.$typeEchantillon.'&ordre='.$triOrdre, $params);
    }
    
    // Retourne les stats des commandes du client
    public function getCommandesClientStats(){
        
        $params = [
            'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin,
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword,
        ];
    
        return $this->callApi('CommandesClient/Statistiques/dateDebut='.date('Y-m-d', strtotime('-24 months')).'T00%3A00%3A00&dateFin='.date('Y-m-d').'T23%3A59%3A59', $params);
    }
    
    // Retourne les stats des échantillons d'une commande
    public function getCommandeEchantillonsStats($refCommande){
        
        //echo urlencode(urlencode('/')); exit;
        $refCommande = str_replace('/', '%252F', $refCommande);
        //$refCommande = urlencode($refCommande);
        
        if(empty($refCommande)){
            $returnApi = new \stdClass();
            $returnApi->NombreTotalDeCommandes = 0;
            $returnApi->NombreTotalEchantillons = 0;
            $returnApi->NombreTotalEchantillonsMateriaux = 0;
            $returnApi->NombreTotalEchantillonsFiltres = 0;
            $returnApi->NombreTotalEchantillonsFiltresSurOperateur = 0;
            $returnApi->NombreTotalEchantillonsFiltresPosteFixe = 0;
            $returnApi->NombreTotalEchantillonsLegionelles = 0;
            
            return $returnApi;
        }
        
        $params = [
            'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin,
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword,
            //'debug' => true,
        ];
        
        $returnApi = $this->callApi('CommandesClient/'.$refCommande.'/Statistiques', $params);
        
        if(empty($returnApi)){
            
            $returnApi = new \stdClass();
            $returnApi->NombreTotalDeCommandes = 0;
            $returnApi->NombreTotalEchantillons = 0;
            $returnApi->NombreTotalEchantillonsMateriaux = 0;
            $returnApi->NombreTotalEchantillonsFiltres = 0;
            $returnApi->NombreTotalEchantillonsFiltresSurOperateur = 0;
            $returnApi->NombreTotalEchantillonsFiltresPosteFixe = 0;
            $returnApi->NombreTotalEchantillonsLegionelles = 0;
        }
        
        return $returnApi;
    }
    
    // Retourne les échantillons matériaux d'une commande
    public function getCommandeDetailsMateriaux($refCommande){
        $params = [
            'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin,
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword,
            //'debug' => true,
        ];
        $refCommande = str_replace('/', '%252F', $refCommande);
        return $this->callApi('CommandesClient/'.$refCommande.'/EchantillonsMateriaux', $params);
    }
    
    // Retourne les échantillons filtres d'une commande
    public function getCommandeDetailsFiltres($refCommande){
        $params = [
            'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin,
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword,
        ];
        $refCommande = str_replace('/', '%252F', $refCommande);
        return $this->callApi('CommandesClient/'.$refCommande.'/EchantillonsFiltres', $params);
    }
    
    // Retourne les échantillons légionelles d'une commande
    public function getCommandeDetailsLegio($refCommande){
        $params = [
            'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin,
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword,
        ];
        $refCommande = str_replace('/', '%252F', $refCommande);
        return $this->callApi('CommandesClient/'.$refCommande.'/EchantillonsLegionelles', $params);
    }
    
    // Retourne le rapport d'une commande
    public function getCommandeRapport($refCommande){
        $params = [
            'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin,
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword,
        ];
        $refCommande = str_replace('/', '%252F', $refCommande);
        return $this->callApi('CommandesClient/'.$refCommande.'/RapportsSynthetiques', $params);
    }
    
    // Retourne le rapport d'un échantillon
    public function getCommandeRapportEchantillonMateriaux($refCommande){
        $params = [
            'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin,
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword,
        ];
        $refCommande = str_replace('/', '%252F', $refCommande);
        return $this->callApi('CommandesClient/'.$refCommande.'/EchantillonsMateriaux/Rapports', $params);
    }
    
    // Retourne le rapport d'un échantillon
    public function getCommandeRapportEchantillonFiltres($refCommande){
        $params = [
            'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin,
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword,
        ];
        $refCommande = str_replace('/', '%252F', $refCommande);
        return $this->callApi('CommandesClient/'.$refCommande.'/EchantillonsFiltres/Rapports', $params);
    }
    
    // Retourne le rapport d'un échantillon
    public function getCommandeRapportEchantillonLegio($refCommande){
        $params = [
            'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin,
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword,
        ];
        $refCommande = str_replace('/', '%252F', $refCommande);
        return $this->callApi('CommandesClient/'.$refCommande.'/EchantillonsLegionelles/Rapports', $params);
    }

    // Retourne le rapport d'un échantillon
    public function getPlanification(){
        $params = [
            'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin,
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword,
        ];
        
        $params = [
            'identifiant' => "35A00ESS01",
                'motDePasse' => md5("ESSAI"),//08553999e436fdc3841853ad13e4a5d4
        ];

        return $this->callApi('CommandesClient/Planification/', $params);
    }

    public function getMadraUserInfos(){
        $params = [
            //'identifiant' => $_SESSION['itga']['apiUser']->MadraLogin,
            'motDePasse' => $_SESSION['itga']['apiUser']->MadraPassword,
        ];
    
        return $this->callApi('Utilisateurs/'.$_SESSION['itga']['apiUser']->MadraLogin, $params);
    }
}