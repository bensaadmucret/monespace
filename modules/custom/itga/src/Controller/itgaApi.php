<?php

namespace Drupal\itga\Controller;

class ItgaApi {
    
    public function callApi($method, $params = []){
        $debug = (!empty($params['debug']) ? true : false);
        unset($params['debug']);
        
        $clientMethod = 'get';
        if(!empty($params['method'])){
            $clientMethod = $params['method'];
            unset($params['method']);
        }
        $url = $this->url.'/'.$method;
        if(!empty($params['subMethod'])){
            $url .= $params['subMethod'];
            unset($params['subMethod']);
        }
        
        $client = \Drupal::httpClient();
        $httpParams = [
            'headers' => [
                'Accept'=> 'application/json',
                'Content-Type' =>  'application/json'
            ]
        ];
    
        if(!empty($params['headersAccept'])){
            $httpParams['headers']['Accept'] = $params['headersAccept'];
            unset($params['headersAccept']);
        }
    
        if(!empty($params['headersContentType'])){
            $httpParams['headers']['Content-Type'] = $params['headersContentType'];
            unset($params['headersContentType']);
        }
        
        if(!empty($this->apiVersion)){
            $httpParams['headers']['version'] = $this->apiVersion;
        }
    
        if(!empty($this->apiKey)){
            $httpParams['headers']['API_KEY'] = $this->apiKey;
        }
        
        $stop = false;
        if(!empty($params['body']['onSuccessRedirectUrlAfterSubmit'])){
            $stop = true;
        }
        if(!empty($params['body'])){
            $httpParams['body'] = json_encode($params['body']);
            unset($params['body']);
        }
    
        $loginPassWord = '';
        if(!empty($params['identifiant']) && !empty($params['motDePasse'])){
            $loginPassWord = '?identifiant='.$params['identifiant'].'&motDePasse='.$params['motDePasse'].'&';
            unset($params['identifiant']);
            unset($params['motDePasse']);
        } else {
            if(strpos($url, 'billing') === false){
                $url .= '?';
            }
        }
        
        foreach($params as $paramKey => $paramValue){
            $url .= $paramKey.'='.$paramValue.'&';
        }
    
        $url = trim($url, '&');
        $url .= trim($loginPassWord, '&');
        
        // dégage les exception GuzzleHttp
        $httpParams['http_errors'] = false;
    
        switch($clientMethod){
            case 'post':
                $request = $client->post($url, $httpParams);
                break;
    
            case 'put':
                $request = $client->put($url, $httpParams);
                break;
    
            case 'delete':
                $request = $client->delete($url, $httpParams);
                break;
    
            case 'get':
            default:
                $request = $client->get($url, $httpParams);
                break;
        }
        
        if(!empty($_GET['forceDebug'])){
            $debug = true;
        }
        if($debug){
            echo '<strong>URL</strong> : '.$url.'<br />';
            echo '<strong>Methode</strong> : '.$clientMethod.'<br />';
            if(!empty($this->apiKey)) { echo '<strong>API KEY</strong> : '.$this->apiKey.'<br />'; }
            if(!empty($this->apiVersion)) { echo '<strong>API VERSION</strong> : '.$this->apiVersion.'<br />'; }
            echo '<strong>PARAMS</strong> : <br />';
            echo '<pre>'; print_r($params); echo '</pre>';
            echo '<strong>HTTP PARAMS</strong> : <br />';
            echo '<pre>'; print_r($httpParams); echo '</pre>';
            echo 'Status code : '.$request->getStatusCode().'<br />';
            echo '<pre>'; print_r(json_decode($request->getBody())); echo '</pre>';
        }
    
        switch($request->getStatusCode()){
            case 200:
                if($this->isJsonReturned($request->getBody())){
                    $response = json_decode($request->getBody());
                } else {
                    $response = [''];
                }
                break;
            
            case 404:
                if($request->getBody() == '"Impossible de trouver l\'utilisateur avec ce login"'){
                    $response = [];
                } else {
                    if(strpos($request->getBody(), '<html')){
                        $response = ['msg' => 'Erreur'];
                    } else {
                        $response = ['msg' => 'Mauvais login ou mauvais mot de passe'];
                    }
                }
                break;
            
            case 401:
                $response = ['msg' => 'Mauvais login ou mauvais mot de passe'];
                break;
            
            default:
                $response = [''];
                break;
        }
        
        return $response;
    }
    
    // Test si le contenu est du json ou pas
    protected function isJsonReturned($returnedData){
        if(substr((string) $returnedData, 0, 2) == '[{' || substr((string) $returnedData, 0, 1) == '{'){
            return true;
        } else {
            return false;
        }
    }
}