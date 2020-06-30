<?php

namespace Drupal\itga\Breadcrumb;

use Drupal\Core\Breadcrumb\BreadcrumbBuilderInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Link;
use Drupal\Core\Breadcrumb\Breadcrumb;

class ItgaBreadcrumb implements BreadcrumbBuilderInterface {

  private $myModuleRoutes = ['itga.actu', 'itga.actutag', 'itga.fichierpdf', 'itga.agence', 'itga.webform'];

  public function applies(RouteMatchInterface $route_match) {
    $thisRoute = $route_match->getCurrentRouteMatch()->getRouteName();
    //echo '<pre>'; print_r($thisRoute); echo '</pre>'; exit;
    if ($thisRoute == 'entity.node.canonical') {
      $node = $route_match->getParameter('node');
      switch ($node->getType()) {
        case 'actualite':
        case 'agence':
        case 'page':
        case 'webform':
          return true;
          break;
      }
    } else {
      if(in_array($thisRoute, $this->myModuleRoutes)){
        return true;
      }
    }
    return FALSE;
  }

  public function build(RouteMatchInterface $route_match) {
    $breadcrumb = new Breadcrumb();
    $breadcrumb->addCacheContexts(['route']);
    $links = [];
    $links[] = Link::createFromRoute(t('Home'), '<front>');

    if ($route_match->getCurrentRouteMatch()->getRouteName() == 'entity.node.canonical') {
      $node = $route_match->getParameter('node');
      switch ($node->getType()) {
        case 'actualite':
          $links[] = Link::createFromRoute(t('Actualités'), 'itga.actu');
          break;

        case 'agence':
          $links[] = Link::createFromRoute(t('Agences'), 'itga.agence');
          break;

          case 'webform':
          $links[] = Link::createFromRoute(t('Contact ITGA'), 'itga.webform');
          break;

        case 'page':
          //$links[] = Link::createFromRoute(t('Contenu'), '<none>');
          break;
      }
    } else {
      /*if(in_array($thisRoute, $this->myModuleRoutes)){
        switch($thisRoute){
          case 'itga.actu':
            $links[] = Link::createFromRoute(t('Actualit'), 'itga.actu');
            break;

            case 'itga.actutag':
              break;

          case 'itga.fichierpdf':
            break;

          case 'itga.agence':
            break;
        }
      }*/
    }

    $request = \Drupal::request();
    if ($route = $request->attributes->get(\Symfony\Cmf\Component\Routing\RouteObjectInterface::ROUTE_OBJECT)) {
      $title = \Drupal::service('title_resolver')->getTitle($request, $route);
      $links[] = Link::createFromRoute($title, '<none>');
    }

    return $breadcrumb->setLinks($links);
  }
}
