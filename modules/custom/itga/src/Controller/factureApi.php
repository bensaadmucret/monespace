<?php

namespace Drupal\itga\Controller;

use Lcobucci\JWT\Parser;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\RedirectResponse;

class FactureApi extends ItgaApi {
    
    protected $url = 'https://apiextranetbilling.itga.fr/api/v1';
    protected $apiKey = 'ITGA';
    protected $apiVersion = '2';
    
    public function getAll($clientCode, $status = 'Successful'){
        $userDetails = $this->callApi('invoices/all', ['method' => 'get', '?invoiceRequest.clientCode' => $clientCode, 'invoiceRequest.stateInvoice' => $status]);
        return $userDetails;
    }
    
    public function getFacture($clientCode, $factureNumero){
        $accountDetails = $this->callApi('invoices/number', ['method' => 'get', '?invoiceNumberRequest.clientCode' => $clientCode, 'invoiceNumberRequest.number' => $factureNumero]);
        return $accountDetails;
    }
    
    public function downloadFacture($factureNumero){
        $facture = $this->getFacture(94178, $factureNumero);
    
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
            CURLOPT_HTTPHEADER     => ['API_KEY: '.$this->getApiKey()]
        );
        
        $ch = curl_init( $facture->LinkToVisualize );
        curl_setopt_array( $ch, $options );
        $pdf = curl_exec( $ch );
        
        header("Content-type: application/pdf");
        header("Content-disposition: inline;filename=".$factureNumero.".pdf");
        echo $pdf;
        exit;
    }
    
    public function getApiKey(){
        return $this->apiKey;
    }
}