//Affichage du menu mobile
function redimensionnement() {
  var mainMenu = jQuery( "#block-itgatheme-main-menu" );
  var topMenu = jQuery( "#block-menutop-2" );

  if ((mainMenu.length == 1) && (topMenu.length == 1)) {
    if("matchMedia" in window) { // Détection
        if (matchMedia('only screen and (max-width:1320px)').matches) {
          //Déplacement vers le menu mobile
          jQuery(mainMenu).appendTo('.main-menus');
          jQuery(topMenu).appendTo('.main-menus');

        } else {

          //Déplacement vers leurs zones de départ
          jQuery(mainMenu).appendTo('#leftContent > div');
          jQuery(topMenu).appendTo('header > .wrap > div');
        }
    }
  } else {
    //On l'enlève sur la partie connexion
    jQuery('.cd-nav-trigger').remove();
  }
}



// On lie les événements resize/load à la fonction
    window.addEventListener('load', redimensionnement, false);
    window.addEventListener('resize', redimensionnement, false);



jQuery(function ($) {

    $(document).ready(function () {

        //Checkbox et radio button sur les webforms - on déplace le texte dans les spans pour mettre les css
        $('.js-form-type-checkbox label.option span').each(function () {
          console.log("toto");
          $(this).contents().appendTo($(this).parent());
        });

        $('.js-form-type-webform-radios-other label.option span').each(function () {
          console.log("toto");
          $(this).contents().appendTo($(this).parent());
        });

        //Menu mobile
        var isLateralNavAnimating = false;

        //open/close lateral navigation
        jQuery('.cd-nav-trigger').on('click', function (event) {
            event.preventDefault();
            //stop if nav animation is running
            if (!isLateralNavAnimating) {
                if (jQuery(this).parents('.csstransitions').length > 0) isLateralNavAnimating = true;

                jQuery('body').toggleClass('navigation-is-open');
                jQuery('.cd-navigation-wrapper').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                    //animation is over
                    isLateralNavAnimating = false;
                });
            }
        });

        // ajout d'une class au passage
        var $window = $(window);
        $window.on('load scroll', check_if_in_view);
        $window.trigger('scroll');

        //slick slider
        $('.slider').slick({
            infinite: true,
            speed: 700,
            autoplay: true,
            autoplaySpeed: 4000,
            fade: true,
            arrows: true,
            slidesToShow: 1,
            slidesToScroll: 1
        });

        //accordeon
        $('body:not(.path-mon-compte-mon-agence-itga, .page-node-type-agence).accordion-content').hide();
        $('.accordion-single').click(function () {
            $('.accordion .active').removeClass('active');
            $(this).find('h3').toggleClass('rotated');
            $(this).next('.accordion-content').addClass('active');
            $('.accordion-content.active').slideToggle();
        });

        var inputs = $('form input').not('.form-checkbox').not('.form-radio').not('.form-number');
        if (inputs.val().length === 0) {
        } else {
            inputs.parent().addClass("focused");
        }


        // Gestion des placeholder au focus
        $(document).on('blur', 'form input:not(.form-checkbox), form input:not(.form-radio), form input:not(.form-number), form textarea', function () {
            if ($(this).val().length === 0) {
                if ($(this).hasClass('form-textarea')) {
                    $(this).parent().parent().removeClass("focused");
                }
                else {
                    $(this).parent().removeClass("focused");
                }

            }
        });

        $(document).on('focus', 'form input:not(.form-checkbox), form input:not(.form-radio), form input:not(.form-number), form textarea', function () {
            if ($(this).hasClass('form-textarea')) {
                $(this).parent().parent().addClass("focused");
            }
            else {
                $(this).parent().addClass("focused");
            }

        });

        $('.path-mon-compte:not(.path-mon-compte-gestion-des-comptes, .path-mon-compte-mes-factures, .path-mon-compte-mon-agence-itga) #content .submenu-container ul.submenu_page li:first-child').addClass('active');


        if ($(this).val().length === 0) {
            $(this).parent().removeClass("focused");
        }

        //mobile fixes
        var windowsize = $(window).width();
        if (windowsize < 500) {
            //force Youtube iframe to have 100% width :
            $('section.video_agence iframe').attr('width', '100%');

            //accordeons footer
            $('#block-agencefooter .field').hide();
            $('#block-agencefooter h2').append('<img class="chevron" src="/themes/itgatheme/images/chevron-black.svg" />');
            $('#block-agencefooter h2').click(function () {
                $('.active').removeClass('active');
                $('#block-agencefooter h2').toggleClass('rotated');
                $('#block-agencefooter .field').addClass('active');
                $('.active').slideToggle();
            });

            $('nav#block-itgatheme-footer ul').hide();
            $('nav#block-itgatheme-footer h2').append('<img class="chevron" src="/themes/itgatheme/images/chevron-black.svg" />');
            $('nav#block-itgatheme-footer h2').click(function () {
                $('.active').removeClass('active');
                $('nav#block-itgatheme-footer h2').toggleClass('rotated');
                $('nav#block-itgatheme-footer ul').addClass('active');
                $('.active').slideToggle();
            });

            $('#block-views-block-liste-actus-footer-block-1 div').hide();
            $('#block-views-block-liste-actus-footer-block-1 h2').append('<img class="chevron" src="/themes/itgatheme/images/chevron-black.svg" />');
            $('#block-views-block-liste-actus-footer-block-1 h2').click(function () {
                $('.active').removeClass('active');
                $('#block-views-block-liste-actus-footer-block-1 h2').toggleClass('rotated');
                $('#block-views-block-liste-actus-footer-block-1 div').addClass('active');
                $('.active').slideToggle();
            });


        }
        if (windowsize < 1024) {
            $('nav#block-menutop ul li').click(function (event) {
                if ($('nav#block-menutop ul li ul').is(':visible')) {
                    // $(this).parent().click(function(event) {
                    $('nav#block-menutop ul li ul').addClass('hidden');
                    // });
                } else {
                    $('nav#block-menutop ul li ul').removeClass('hidden');

                }
            })
        }
        //disable menu elements
        $('a.fidelity').click(function (event) {
            event.preventDefault();
        });


        //default all actus selected
        $('.path-actualites #block-itgatheme-content .tags a').each(function () {
            if ($(this).hasClass('active')) {
                $('.home_actus').removeClass('home_actus');
            }
        });

        //bypass term link on actu node
        var linktag = $('body.page-node-type-actualite .node--type-actualite .field--name-field-tags-actu .field__item a');

        linktag.each(function () {
            var href = $(this).attr('href');
            if (typeof href !== typeof undefined && href !== false) {
                var linkprefx = $(this).attr('href');
                linkok = linkprefx.replace('taxonomy/term/', 'actualites/tag/');
                $(this).attr('href', linkok);
            }
        });


        // form consommables
        $('#webform-submission-commande-consommables-add-form .js-form-item').each(function () {
            var helpWebForm = $(this).find('a.webform-element-help').attr('data-webform-help');
            var title = $(this).find('span').text().replace('?', '');
            $(this).find('span').text('');
            $(this).find('span').append('<h3>' + title + '</h3>');
            $(this).find('span').append('<div class="detail">' + helpWebForm + '</div>');
            $(this).find('a.webform-element-help').remove();
        });

        $('.detailMateriaux').off('click').on('click', function (e) {
            if ($(this).hasClass('loading')) {
                return false;
            }
            else if ($(this).parents('tr').hasClass('opened')) {
                $(this).parents('tr').next().remove();
                $(this).parents('tr').removeClass('opened');
                $(this).parents('tr').find('.detailMateriaux').text('Détails');
            } else {
                $('.detail-commande.loaded').remove();
                $('.labo-suivi-commandes').find('.detailMateriaux').text('Détails');
                $(this).parents('tr').addClass('opened');
                $(this).addClass('loading');
                addLoader();

                $.ajax({
                    url: '/labo/commande/details?ref=' + $(this).attr('attr-ref') + '&nbEchantillons=' + $(this).parents('tr').attr('nbEchantillons') + '&nbEchantillonsMateriaux=' + $(this).parents('tr').attr('nbEchantillonsMateriaux') + '&nbEchantillonsFiltres=' + $(this).parents('tr').attr('nbEchantillonsFiltres') + '&nbEchantillonsFiltresSurOperateur=' + $(this).parents('tr').attr('nbEchantillonsFiltresSurOperateur') + '&nbEchantillonsFiltresPosteFixe=' + $(this).parents('tr').attr('nbEchantillonsFiltresPosteFixe') + '&nbEchantillonsLegionelles=' + $(this).parents('tr').attr('nbEchantillonsLegionelles'),
                    type: 'POST',
                    data: '',
                    cache: false,
                    //dataType: 'json',
                    context: this,
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    success: function (data, textStatus, jqXHR) {
                        var detail =
                            '<tr class="detail-commande loaded">\n' +
                            '   <td class="hidden" colspan="13">' + data + '</td>\n' +
                            '</tr>';
                        removeLoader();


                        $(this).parents('tr').find('.detailMateriaux').text('Fermer');
                        $(this).parents('tr').find('.detailMateriaux').addClass('close-detail-commande');

                        $(detail).insertAfter($(this).parents('tr'));
                        $(this).parents('tr').next().find('td').removeClass('hidden');

                        showHideColumns();

                        $('input[name=searchEchantillon]').focus().off('keyup').on('keyup', function () {
                            $(this).parents('tr').find('.noResultSearch').remove();
                            $(this).parents('tr').find('table.detailsEchantillon').show();

                            var value = this.value.toLowerCase();

                            $(this).parents('tr').find('table.detailsEchantillon tbody tr').hide().each(function () {
                                if ($(this).text().toLowerCase().search(value) > -1) {
                                    $(this).show();
                                }
                            });

                            $(this).parents('tr').find('.searchResultsCount').text($(this).parents('tr').find('table.detailsEchantillon tbody tr:visible').length + '/' + $(this).parents('tr').find('table.detailsEchantillon tbody tr').length);
                            if ($(this).parents('tr').find('table.detailsEchantillon tbody tr:visible').length <= 0) {
                                $(this).parents('tr').find('table.detailsEchantillon').hide();
                                $(this).parents('tr').find('table.detailsEchantillon').after('<div class="noResultSearch">Aucun résultat pour cette recherche.</div>');
                                //$('<div class="noResultSearch">Aucun résultat pour cette recherche.</div>').insertBefore('.labo-suivi-commandes table');
                            }

                        });

                        $(this).parents('tr').next().find('.detailsEchantillon').tablesorter({
                            dateFormat: "ddmmyyyy", // set the default date format
                            headers: {
                                2: {sorter: 'shortDate'}
                            }
                        });

                        $(this).parents('tr').next().find('.detailsEchantillon th:last-child').click();
                        $(this).removeClass('loading');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        removeLoader();
                    }
                });
            }
        });

        $(".mesFactures table").tablesorter({
            dateFormat: "ddmmyyyy", // set the default date format
            headers: {
                5: {sorter: 'shortDate'},
                6: {sorter: 'shortDate'},
                8: {filter: false}
            }
        });

        $('.labo-suivi-commandes > table tr th:first-child').click();
        $('.labo-suivi-commandes > table tr th:first-child').click();

        $('.labo-suivi-commandes table th').click(function () {
            $('.labo-suivi-commandes table tr').each(function () {
                if ($(this).hasClass('detail-commande')) {
                    $(this).remove();
                }
                if ($(this).hasClass('opened')) {
                    $(this).removeClass('opened');
                }
            });
        })

        var checkbox = $('.custom-modal input#macheckbox');
        var submit = $('.custom-modal input#firstconnexionsubmit');
        submit.css('opacity', '0.5');
        checkbox.prop('checked', false);
        submit.attr('disabled', 'disabled');

        checkbox.click(function () {
            if ($(this).is(':checked')) {
                submit.removeAttr('disabled');
                submit.css('opacity', '1');
            } else {
                submit.attr('disabled', 'disabled');
                submit.css('opacity', '0.5');
            }
        });

        $('body header .wrap nav>ul li a.more + ul li').last().on('click', function () {
            $('#modal-generic .modal-body').html('');
            $('#modal-generic .modal-title').text('Déconnexion');
            $('#modal-generic .modal-body').html($('.content-modal-logout').html());
            $('#modal-generic').modal();
        })

        $('.custom-modal-body .close-modal').on('click', function () {
            $(this).parent().parent().removeClass('visible');
            $('.overlay').removeClass("visible");
        });


        $('.labo-suivi-commandes input[name=searchCommandes]').focus().off('keyup').on('keyup', function () {
            $('.labo-suivi-commandes table').show();
            $('.noResultSearch').remove();

            var value = this.value.toLowerCase();

            $('.labo-suivi-commandes table tr.detailsCommande').hide().each(function () {
                if ($(this).text().toLowerCase().search(value) > -1) {
                    $(this).show();
                }
            });

            $('.labo-suivi-commandes .searchResultsCount').text($('.labo-suivi-commandes table tr.detailsCommande:visible').length + '/' + $('.labo-suivi-commandes table tr.detailsCommande').length);
            if ($('.labo-suivi-commandes table tr.detailsCommande:visible').length <= 0) {
                $('.labo-suivi-commandes table').hide();
                $('.labo-suivi-commandes table').after('<div class="noResultSearch">Aucun résultat pour cette recherche.</div>');
            }
        });

        $('.suivi-factures input[name=searchFactures]').focus().off('keyup').on('keyup', function () {
            $('.suivi-factures table').show();
            $('.noResultSearch').remove();

            var value = this.value.toLowerCase();

            $('.suivi-factures table tr.detailsFacture').hide().each(function () {
                if ($(this).text().toLowerCase().search(value) > -1) {
                    $(this).show();
                }
            });

            $('.suivi-factures .searchResultsCount').text("Nombre de factures : " + $('.suivi-factures table tr.detailsFacture:visible').length + '/' + $('.suivi-factures table tr.detailsFacture').length);
            if ($('.suivi-factures table tr.detailsFacture:visible').length <= 0) {
                $('.suivi-factures table').hide();
                $('.suivi-factures table').after('<div class="noResultSearch">Aucun résultat pour cette recherche.</div>');
            }
        });

        // Labo checkbox columns
        $('.table-columns-configuration input').off('click').on('click', function () {
            var cookieVals = {};
            $('.table-columns-configuration input').each(function (index) {
                cookieVals[$(this).val()] = $(this).is(':checked');
            });
            setCookie('laboColumns', JSON.stringify(cookieVals), 30);
            showHideColumns();
        });


        // Gestion des icônes de tri pour le suivi des commandes
        if(window.location.pathname == "/suivi-commandes") {
            var o = getUrlParameter('o');
            var s = getUrlParameter('s');
            if(o == "ref") {
                $('.ReferenceClientCommande .asc-desc-container .order-'+s).hide();
            }
            else if(o == "date") {
                $('.DateDeLaCommande .asc-desc-container .order-'+s).hide();
            }
        }

        showHideColumns();


        // Gestion Dropdown
        $('.dropdown button').click(function () {
            $(this).parent().toggleClass('active');
            $(this).parents().siblings().children('.dropdown-menu').hide();
            $(this).siblings().toggle();
            //$(this).siblings().toggle();
        });

        // Forgotten password
        $('.forgot-password').click(function(){
            $('.to-hide').fadeOut();
            $('.forgotten-password').fadeIn();;

        });

        // Filter account
        $('input[name="searchUser"]').off('keyup').on('keyup', function () {
            var value = this.value.toLowerCase();
            $('.path-mon-compte .userList>.flex div[id^="user"]').hide().each(function () {
                if($(this).text().toLowerCase().search(value) > -1) {
                    $(this).show();
                }
            });
        });

        // Toutes les actualités : active link
        if(location.pathname == '/actualites'){
            $('#content .submenu-container ul.submenu_page li:first-child a').addClass('active');
        }

        // Si pas d'actus dans une rubrique alors on souligne la rubrique "TOUT"
        if(location.pathname == '/actualites/'){
            if($('#block-itgatheme-content .no-actus').length > 0) {
                $('#content .submenu-container ul.submenu_page li:first-child a').addClass('active');
            }
        }

        // bibliotheque-itga : active link
        if(location.pathname == '/bibliotheque-itga'){
            $('#content .submenu-container ul.submenu_page li:first-child a').addClass('active');
        }

        // Validation formulaire : Déjà client ITGA ?
        if(location.pathname == '/form/deja-client-itga'){
            validationForm('form.webform-submission-deja_client_itga-form');
        }

        // FAQ
        if(location.pathname == '/faq'){
            $('.accordion-single').click();
        }

        // Validation formulaire : Je ne suis pas déjà client ITGA ?
        if(location.pathname == '/form/je-ne-suis-pas-client-itga'){
            validationForm('form.webform-submission-je_ne_suis_pas_client_itga-form');
            $('#edit-fake-submit .fake-submit').click(function(){

                if($('.js-form-type-select').find('.js-validate-error-label').length == 0) {
                    $("form.webform-submission-je_ne_suis_pas_client_itga-form input[type='submit']").click();
                }

                if($('.form-item-message textarea').val() == ''){
                    if($('.form-item-message').find('.js-validate-error-label').length == 0) {
                        displayErrorForm('.form-item-message textarea', 'Veuillez renseigner votre message.');
                    }
                }

                if($('.js-form-type-select select').val() == ''){
                    if($('.js-form-type-select').find('.js-validate-error-label').length == 0) {
                        displayErrorForm('.js-form-type-select select', "Veuillez sélectionner un département.");
                    }
                }

                if($('.form-item-message textarea').val() != '' && $('.js-form-type-select select').val() != '') {
                    $("form.webform-submission-je_ne_suis_pas_client_itga-form input[type='submit']").click();
                }
            });
        }

        // Validation formulaire : Contact
        if(location.pathname == '/contact'){
            $('#edit-fake-submit .fake-submit').click(function(){
                if($('.form-item-message textarea').val() == ''){
                    if($('.form-item-message').find('.js-validate-error-label').length == 0) {
                        displayErrorForm('.form-item-message textarea', 'Veuillez renseigner votre message.');
                    }
                }

                if($('.form-item-votre-demande-concerne select').val() == ''){
                    if($('.form-item-votre-demande-concerne').find('.js-validate-error-label').length == 0) {
                        displayErrorForm('.form-item-votre-demande-concerne select', "Veuillez sélectionner une option.");
                    }
                }

                if($('.form-item-message textarea').val() != '' && $('.form-item-votre-demande-concerne select').val() != '') {
                    $("form.webform-submission-contact-form").submit();
                }
            });
        }


        // Formulaire commande consommables
        $('.validation_commande_conso').click(function() {
            var allempty = true;
            $('.webform-submission-commande_consommables-form input[type="number"]').each(function() {
                console.log($(this).val());
                if($(this).val() != 0) {
                    allempty = false;
                }
            });

            if(allempty) {
                swal("", "Veuillez renseigner une quantité pour au moins un des lots afin de passer commande.", "error");
            }
            else {
                $('.webform-submission-commande_consommables-form input[type="submit"]').click();
            }
        });

        $('.webform-submission-commande_consommables-form input[type="number"]').keypress(function( event ) {
            if ( event.which == 13 ) {
                var allempty = true;
                $('.webform-submission-commande_consommables-form input[type="number"]').each(function() {
                    console.log($(this).val());
                    if($(this).val() != 0) {
                        allempty = false;
                    }
                });

                if(allempty) {
                    event.preventDefault();
                    event.stopPropagation();
                    swal("", "Veuillez renseigner une quantité pour au moins un des lots afin de passer commande.", "error");
                }
            }
        });

        $('body').addClass(detectIE);

        // Check modal nouveau compte à activer
        if($('.open-modal-manage-account').length > 0 && !getCookie('modal-manage-account')) {
            $('#modal-generic .modal-body').html('');
            $('#modal-generic .modal-title').text('Gestion des comptes');
            $('#modal-generic .modal-body').html($('.content-modal-compte-inactifs').html());
            $('#modal-generic').modal();
            setCookie('modal-manage-account', true, 1);
        }

        if($('.open-modal-absence-account').length > 0) {
            openModal('Ajout de collaborateurs','.content-modal-absence-comptes');
        }

        $('.btn-default.create-account').click(function(){
            $('#modal-generic').modal('hide');
            $('.path-mon-compte .intro-gestion-compte .add-account').click();
        });

        $('.btn-default.open-another-popin').click(function(){
            openModal('Ajout de collaborateur','.content-modal-another-popin');
        });

    });

});


function displayErrorForm($element, message) {
    var div = document.createElement('div');
    var element = document.querySelector($element);
    div.innerHTML = message;
    div.className = 'js-validate-error-label';
    div.setAttribute('style', 'color: #B81111');
    console.log(element.parentNode);
    element.parentNode.insertBefore(div, element.nextSibling);
}

function validationForm(element) {
    new window.JustValidate(element, {
        Rules: {
            email: {
                required: true,
                email: true
            },
            text: {
                required: true,
                maxLength: 300
            },
            phone: {
                required: true,
                phone: true,
                maxLength: 10,
                minLength: 10
            },
            textarea: {
                required: true,
                maxLength: 30000
            }
        },
    });
}

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */

function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        var ieV = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        document.querySelector('body').className += ' IE';
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        var ieV = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        document.querySelector('body').className += ' IE';
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // IE 12 (aka Edge) => return version number
        var ieV = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        document.querySelector('body').className += ' IE';
    }

    // other browser
    return false;
}

function openModal(title, element) {
    jQuery('#modal-generic .modal-body').html('');
    jQuery('#modal-generic .modal-title').text(title);
    jQuery('#modal-generic .modal-body').html(jQuery(element).html());
    jQuery('#modal-generic').modal();
}

function showHideColumns(){
    var cookieVals = getCookie('laboColumns');

    if(cookieVals == '' || cookieVals == undefined){
        var cookieVals = {};
        jQuery('.table-columns-configuration input').each(function(index){
            cookieVals[jQuery(this).val()] = true;
        });
        setCookie('laboColumns', JSON.stringify(cookieVals), 30);
    }

    cookieVals = JSON.parse(getCookie('laboColumns'));

    if(getCookie('laboColumns') == '{}'){
        var cookieVals = {};
        jQuery('.table-columns-configuration input').each(function(index){
            cookieVals[jQuery(this).val()] = true;
        });
        setCookie('laboColumns', JSON.stringify(cookieVals), 30);
    }

    jQuery.each(cookieVals, function (index, value) {
        jQuery('.table-columns-configuration input[value=' + index + ']').attr('checked', value);

        if (value) {
            jQuery('th.' + index + ', td.' + index).show();
        } else {
            jQuery('th.' + index + ', td.' + index).hide();
        }
    });
}



// Effet d'affichage des blocs
function check_if_in_view() {
  var $animation_elements = jQuery('.anim');
  var $window = jQuery(window);
  var window_height = $window.height();
  var window_top_position = $window.scrollTop();
  var window_bottom_position = (window_top_position + window_height);

  jQuery.each($animation_elements, function() {
    var $element = jQuery(this);
    var element_height = $element.outerHeight();
    var element_top_position = $element.offset().top;
    var element_bottom_position = (element_top_position + element_height);

    //check to see if this current container is within viewport
    if ((element_bottom_position >= window_top_position) &&
        (element_top_position <= window_bottom_position)) {
          $element.addClass('active');
    }
  });
}

function addLoader(){
    removeLoader();
    jQuery('body').append('<div class="loader-wrapper"><img style="width:100px;" src="/themes/itgatheme/assets/images/loader.svg" class="ajaxLoader" /></div>');
}

function removeLoader(){
    jQuery('body').find('.loader-wrapper').remove();
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function genericModal(title, content){
    jQuery('#modal-generic .modal-title').html(title);
    jQuery('#modal-generic .modal-body').html(content);
    jQuery('#modal-generic').modal('show');
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}
jQuery(function ($) {

    var modificationTypeButton = 'modifier';

    // -------------------------------------------------------
    // ----------------- Modifier MON PROFIL -----------------
    // -------------------------------------------------------
    $('.changeProfil').off('click').on('click', function(e) {
        e.preventDefault();
        $('#modal-edit-account .modal-body').html('');
        $('#modal-edit-account h4').html('Modifier mes informations');
        $('.mon-compte > form').clone().appendTo('#modal-edit-account .modal-body');
        $('#modal-edit-account').modal();
        //$('#modal-edit-account .modal-body .value span').hide();
        $('#modal-edit-account #monCompteUpdate .change-password').hide();
        $('#modal-edit-account #monCompteUpdate .hidden').removeClass('hidden');
        $('#modal-edit-account .modal-body input[type=submit]').removeClass('hidden');

        new window.JustValidate('#modal-edit-account .modal-body #monCompteUpdate', {
            Rules: {
                email: {
                    required: true,
                    email: true
                },
                text: {
                    required: true,
                    maxLength: 300
                },
                phone: {
                    required: true,
                    phone: true,
                    maxLength: 10,
                    minLength: 10
                }
            },
        });

        $('form#monCompteUpdate').off('submit').on('submit', function(e) {
            e.preventDefault();

            if($('.js-validate-error-label').length == 0) {

                swal({
                    text: "Vous allez modifier vos informations de compte. Merci de valider l'action.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: 'Ok',
                    cancelButtonText: 'Annuler'
                }).then(function(willUpdate) {
                        if (willUpdate) {

                            addLoader();

                            updateForm = $('#modal-edit-account form#monCompteUpdate');

                            $.ajax({
                                url: '/mon-compte/ajax',
                                type: 'POST',
                                data: jQuery.param({
                                    WorkPhone: updateForm.find('input[name=userWorkPhone]').val(),
                                    firstName: updateForm.find('input[name=userFirstName]').val(),
                                    lastName: updateForm.find('input[name=userLastName]').val(),
                                    Title: updateForm.find('input[name=userTitle]').val()
                                }),
                                cache: false,
                                dataType: 'json',
                                context: updateForm,
                                processData: false, // Don't process the files
                                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                                success: function (data, textStatus, jqXHR) {
                                    removeLoader();

                                    if (!data.error) {
                                        $('.mon-compte #monCompteUpdate input[name=userWorkPhone]').parent().find('span').html(updateForm.find('input[name=userWorkPhone]').val());
                                        $('.mon-compte #monCompteUpdate input[name=userWorkPhone]').parent().find('input[type=text]').val(updateForm.find('input[name=userWorkPhone]').val());
                                        $('.mon-compte #monCompteUpdate input[name=userFirstName]').parent().find('span').html(updateForm.find('input[name=userFirstName]').val());
                                        $('.mon-compte #monCompteUpdate input[name=userFirstName]').parent().find('input[type=text]').val(updateForm.find('input[name=userFirstName]').val());
                                        $('.mon-compte #monCompteUpdate input[name=userLastName]').parent().find('span').html(updateForm.find('input[name=userLastName]').val());
                                        $('.mon-compte #monCompteUpdate input[name=userLastName]').parent().find('input[type=text]').val(updateForm.find('input[name=userLastName]').val());
                                        $('.mon-compte #monCompteUpdate input[name=userTitle]').parent().find('span').html(updateForm.find('input[name=userTitle]').val());
                                        $('.mon-compte #monCompteUpdate input[name=userTitle]').parent().find('input[type=text]').val(updateForm.find('input[name=userTitle]').val());

                                        $('#modal-edit-account').modal('toggle');
                                    } else {
                                        removeLoader();
                                        swal(data.msg);
                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    removeLoader();
                                    swal(textStatus)
                                }
                            });
                    }
                });

            }
            else {
                removeLoader();
                swal("", 'Veuillez renseigner tous les champs', "error");
            }
        });
    });

    // ===================================================================================
    // ===================================================================================
    // ===================================================================================
    // ===================================================================================

    // -------------------------------------------------------------
    // ----------------- Valider un PROFIL INACTIF -----------------
    // -------------------------------------------------------------
    $('.accountValidation').off('click').on('click', function(e) {
        e.preventDefault();

        $('#modal-edit-account .modal-body').html('');
        $('#modal-edit-account h4').html('Modification du compte avant activation');


        $('#userRoles').clone().appendTo('#modal-edit-account .modal-body');
        $('#monCompteUpdate').clone().prependTo('#modal-edit-account .modal-body #userRoles');
        $('<h4>Informations personnelles</h4>').prependTo('#modal-edit-account .modal-body');

        addLoader();

        $.ajax({
            url: '/mon-compte/gestion-des-comptes/details-compte/'+$(this).attr('userId'),
            type: 'POST',
            data: jQuery.param({email: $(this).find('input[name=email]').val()}),//'email='+$(this).find('input[name=email]').val()+'&password='+$(this).find('input[name=password]').val(),
            cache: false,
            dataType: 'json',
            context: this,
            processData: false, // Don't process the files
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {

                if(!data.error){

                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userWorkPhone"]').val(data.details.user.WorkPhone);
                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userFirstName"]').val(data.details.user.FirstName);
                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userLastName"]').val(data.details.user.LastName);
                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userTitle"]').val(data.details.user.Title);


                    // On doit désactiver le mode readonly le temps de renseigner les champs
                    userFields = {
                        'userAccountId': data.details.user.AccountId,
                        'userEmail': data.details.user.Email,
                        'accountAccount': data.details.account.Account,
                        'accountAddress': data.details.account.Address,
                        'userProfil': data.details.account.Typology.Description,
                        'accountPostalCode': data.details.account.PostalCode,
                        'accountCity': data.details.account.City,
                        'login': data.details.user.Login,
                        'ContactId': data.details.user.ContactId,
                        'MadraLogin': data.details.user.MadraLogin,
                        'MadraPassword': data.details.user.MadraPassword
                    };

                    Object.keys(userFields).forEach(function(key, index)  {
                        $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="'+key+'"]').prop('readonly', false);
                        $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="'+key+'"]').prop('disabled', false);
                        $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="'+key+'"]').val(userFields[key]);
                        $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="'+key+'"]').prop('readonly', true);
                    });

                    var userRoles = [];

                    if(data.details.user.Profiles.length != 0){
                        for(var i= 0; i < data.details.user.Profiles.length; i++){
                            userRoles.push(data.details.user.Profiles[i].Code);
                        }
                    }

                    $('#modal-edit-account .modal-body .userRoles .focused input[type="checkbox"]').each(function(){
                        $(this).attr('name', $(this).attr('name').replace('-hidden-form', ''));
                        $(this).attr('id', $(this).attr('id').replace('-hidden-form', ''));
                        if(userRoles.includes($(this).attr('name').toUpperCase())) {
                            $(this).prop('checked', true);
                        }
                    });



                    removeLoader();


                    $('#modal-edit-account').modal();


                    //$('form.userRoles').find('input[type=checkbox]').removeAttr('checked');

                    $.each(data.drupalRoles, function(index, value){
                        $('form.userRoles').find('input[name='+value+']').attr('checked', 'checked');
                    });


                    checkRoles();

                    $('form.userRoles').attr('userId', data.details.user.Id);

                    $('form.userRoles').off('submit').on('submit', function(e) {
                        e.preventDefault();
                        addLoader();

                        if($('#modal-edit-account .userRolesContent input:checked').length >= 1 && $('.js-validate-error-label').length == 0) {

                            var dataFrm = new FormData();
                            $('form.userRoles').find('input[type=checkbox]').each(function (index) {
                                dataFrm.append($(this).attr('name'), $(this).is(':checked'));
                            });

                            dataFrm.append('login', $(this).find('input[name=login]').val());
                            dataFrm.append('AccountId', $(this).find('input[name=userAccountId]').val());
                            dataFrm.append('ContactId', $(this).find('input[name=contactId]').val());
                            dataFrm.append('MadraLogin', $(this).find('input[name=madraLogin]').val());
                            dataFrm.append('MadraPassword', $(this).find('input[name=madraPassword]').val());

                            dataFrm.append('WorkPhone', $(this).find('input[name=userWorkPhone]').val());
                            dataFrm.append('firstName', $(this).find('input[name=userFirstName]').val());
                            dataFrm.append('lastName', $(this).find('input[name=userLastName]').val());
                            dataFrm.append('Title', $(this).find('input[name=userTitle]').val());

                            $.ajax({
                                url: '/mon-compte/gestion-des-comptes/details/' + $(this).attr('userId') + '/updateAccount/?validation=true',
                                type: 'POST',
                                data: dataFrm,
                                cache: false,
                                dataType: 'json',
                                context: this,
                                processData: false, // Don't process the files
                                //contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                                success: function (data, textStatus, jqXHR) {
                                    swal("", data.msg, "success");

                                    $('#modal-edit-account').modal('hide');
                                    $('#user' + $(this).attr('userId')).removeClass('to-validate');
                                    $('#user' + $(this).attr('userId')).addClass('waiting-first-connexion');
                                    $('.validation-users > .flex #user' + $(this).attr('userId')).clone(true).prependTo('.userList.first-connexion div.tab-content');
                                    $('.validation-users > .flex #user' + $(this).attr('userId')).remove();
                                    if($('.validation-users .flex .userBlock').length <= 0) {
                                        $('.validation-users').remove();
                                    }
                                    removeLoader();
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    swal("", textStatus, "error");
                                    $('#modal-edit-account').modal('hide');
                                    removeLoader();
                                }
                            });
                        }
                        else if($('#modal-edit-account .userRolesContent input:checked').length == 0) {
                            removeLoader();
                            swal("", 'Veuillez sélectionner au moins un type de profil.', "error");
                        }
                        else if($('.js-validate-error-label').length >= 1) {
                            removeLoader();
                            swal("", 'Veuillez renseigner les informations', "error");
                        }
                    });
                } else {
                    removeLoader();
                    swal("", data.msg, "error");
                    $('#modal-edit-account').modal('hide');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    // ------------------------------------------------------
    // ----------------- Modifier un PROFIL -----------------
    // ------------------------------------------------------
    $('.modifierUserAccount').off('click').on('click', function(e) {
        e.preventDefault();

        if(modificationTypeButton == 'reactiver'){
            $('#modal-edit-account .modal-body').html('');
            $('#modal-edit-account h4').html('Réactivation du compte');
        } else {
            $('#modal-edit-account .modal-body').html('');
            $('#modal-edit-account h4').html('Modification du compte');
        }


        $('#userRoles').clone().appendTo('#modal-edit-account .modal-body');
        $('#monCompteUpdate').clone().prependTo('#modal-edit-account .modal-body #userRoles');
        $('#modal-edit-account #monCompteUpdate').css('margin-top','20px');
        $('<h4>Informations personnelles</h4>').prependTo('#modal-edit-account .modal-body');

        // Si le compte est en attente de première connexion
        var waitingFirstConnexion = false;
        if($(this).parents('.userBlock').find('.status-first-connexion').val() == "1") {
            waitingFirstConnexion = true;
        }

        // Visibilité des rapports envoyés à d'autres collaborateurs
        setVisibiliteRapport();

        addLoader();

        $.ajax({
            url: '/mon-compte/gestion-des-comptes/details-compte/'+$(this).attr('userId'),
            type: 'POST',
            data: jQuery.param({email: $(this).find('input[name=email]').val()}),//'email='+$(this).find('input[name=email]').val()+'&password='+$(this).find('input[name=password]').val(),
            cache: false,
            dataType: 'json',
            context: {waitingFirstConnexion : waitingFirstConnexion },
            processData: false, // Don't process the files
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {
                if(!data.error){

                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userWorkPhone"]').val(data.details.user.WorkPhone);
                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userFirstName"]').val(data.details.user.FirstName);
                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userLastName"]').val(data.details.user.LastName);
                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userTitle"]').val(data.details.user.Title);

                    // On doit désactiver le mode readonly le temps de renseigner les champs
                    userFields = {
                        'userAccountId': data.details.user.AccountId,
                        'userEmail': data.details.user.Email,
                        'accountAccount': data.details.account.Account,
                        'accountAddress': data.details.account.Address,
                        'userProfil': data.details.account.Typology.Description,
                        'accountPostalCode': data.details.account.PostalCode,
                        'accountCity': data.details.account.City,
                        'login': data.details.user.Login,
                        'ContactId': data.details.user.ContactId,
                        'MadraLogin': data.details.user.MadraLogin,
                        'MadraPassword': data.details.user.MadraPassword
                    };

                    Object.keys(userFields).forEach(function(key, index)  {
                        $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="'+key+'"]').prop('readonly', false);
                        $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="'+key+'"]').prop('disabled', false);
                        $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="'+key+'"]').val(userFields[key]);
                        $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="'+key+'"]').prop('readonly', true);
                    });

                    var userRoles = [];
                    if(data.details.user.Profiles.length != 0){
                        for(var i= 0; i < data.details.user.Profiles.length; i++){
                            userRoles.push(data.details.user.Profiles[i].Code);
                        }
                    }

                    $('#modal-edit-account .modal-body .userRoles .focused input[type="checkbox"], #modal-edit-account .modal-body .userRoles .focused input[type="radio"]').each(function(){
                        $(this).attr('name', $(this).attr('name').replace('-hidden-form', ''));
                        $(this).attr('id', $(this).attr('id').replace('-hidden-form', ''));
                        //if(waitingFirstConnexion) {
                        //    $(this).prop('disabled', true);
                        //}
                        if(userRoles.includes($(this).attr('name').toUpperCase())) {
                            $(this).prop('checked', true);
                        }
                    });

                    checkRoles();

                    new window.JustValidate('#modal-edit-account .modal-body form.userRoles', {
                        Rules: {
                            email: {
                                required: true,
                                email: true
                            },
                            text: {
                                required: true,
                                maxLength: 300,
                            },
                            phone: {
                                required: true,
                                phone: true,
                                maxLength: 10,
                                minLength: 10
                            }
                        },
                    });

                    removeLoader();

                    $('#modal-edit-account').modal();

                    $('#modal-edit-account .modal-body form.userRoles').attr('userId', data.details.user.Id);

                    $('#modal-edit-account .modal-body form.userRoles').off('submit').on('submit', function(e) {
                        addLoader();

                        if($('.js-validate-error-label').length == 0) {
                            e.preventDefault();

                            var dataFrm = new FormData();
                            $('#modal-edit-account .modal-body form.userRoles').find('input[type=checkbox]').each(function (index) {
                                dataFrm.append($(this).attr('name'), $(this).is(':checked'));
                            });

                            dataFrm.append('login', $(this).find('input[name=login]').val());
                            dataFrm.append('AccountId', $(this).find('input[name=userAccountId]').val());
                            dataFrm.append('ContactId', $(this).find('input[name=contactId]').val());
                            dataFrm.append('MadraLogin', $(this).find('input[name=madraLogin]').val());
                            dataFrm.append('MadraPassword', $(this).find('input[name=madraPassword]').val());

                            dataFrm.append('WorkPhone', $(this).find('input[name=userWorkPhone]').val());
                            dataFrm.append('firstName', $(this).find('input[name=userFirstName]').val());
                            dataFrm.append('lastName', $(this).find('input[name=userLastName]').val());
                            dataFrm.append('Title', $(this).find('input[name=userTitle]').val());

                            if($('input[name="email-collabo[]"]').length > 0){
                                $('input[name="email-collabo[]"]').each(function() {
                                    dataFrm.append('email-collabo[]', $(this).val());
                                });
                            }

                            $('#user'+$(this).attr('userId')+' h3').text($(this).find('input[name=userFirstName]').val()+ ' '+$(this).find('input[name=userLastName]').val());
                            $('#user'+$(this).attr('userId')+' p.flex .title').text($(this).find('input[name=userTitle]').val());

                            $.ajax({
                                url: '/mon-compte/gestion-des-comptes/details/'+$(this).attr('userId')+'/updateAccount/',
                                type: 'POST',
                                data: dataFrm,
                                cache: false,
                                dataType: 'json',
                                context: this,
                                processData: false, // Don't process the files
                                //contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                                success: function(data, textStatus, jqXHR) {
                                    swal("", data.msg, "success");

                                    if(modificationTypeButton == 'reactiver') {
                                        $('div#user'+$(this).attr('userid')).removeClass('disabled');

                                        // si le block était en attente de première connexion
                                        if ($('div#user'+$(this).attr('userid')).find('.status-is-active').val() == "1" && $('div#user'+$(this).attr('userid')).find('.status-first-connexion').val() == "1") {
                                            $('div#user'+$(this).attr('userid')).addClass('waiting-first-connexion');
                                            $('#user' + $(this).attr('userId')).clone(true).prependTo('.userList.first-connexion .tab-content');
                                        } else if ($('div#user'+$(this).attr('userid')).find('.status-is-active').val() == "" && $('div#user'+$(this).attr('userid')).find('.status-first-connexion').val() == "1") {
                                            // Sinon si le bloc était en attente de validation
                                            $('div#user'+$(this).attr('userid')).addClass('to-validate');
                                            $('#user' + $(this).attr('userId')).clone(true).prependTo('.validation-users > .flex');
                                        } else if ($('div#user'+$(this).attr('userid')).find('.status-is-active').val() == "1" && $('div#user'+$(this).attr('userid')).find('.status-first-connexion').val() == "") {
                                            // Sinon si le bloc était actif
                                            $('div#user'+$(this).attr('userid')).addClass('active');
                                            $('#user' + $(this).attr('userId')).clone(true).prependTo('.userList.enabled .tab-content');
                                        }

                                        $('.userList.disabled #user' + $(this).attr('userId')).remove();

                                        if ($('.validation-users .userBlock').length == 0) {
                                            $('.path-mon-compte .validation-users .flex').text('Aucun compte en attente de validation');
                                        }
                                    }

                                    removeLoader();
                                    $('#modal-edit-account').modal('hide');
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    swal("", data.msg, "error");
                                    removeLoader();
                                    $('#modal-edit-account').modal('hide');
                                }
                            });
                        }
                        else {
                            removeLoader();
                            swal("", 'Veuillez renseigner tous les champs', "error");
                        }

                    });
                } else {
                    removeLoader();
                    swal(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                swal("", data.msg, "error");
            }
        });
    });

    // -------------------------------------------------------
    // ----------------- Détails d'un PROFIL -----------------
    // -------------------------------------------------------
    $('.detailsUserAccount').off('click').on('click', function(e) {
        e.preventDefault();
        $('#modal-edit-account .modal-body').html('');
        $('#modal-edit-account h4').html('Détail du compte');
        $('.detailsMembre').clone().appendTo('#modal-edit-account .modal-body');
        $('#userRoles').clone().appendTo('#modal-edit-account .modal-body');
        $('#modal-edit-account .sub-role.visibilite').remove();
        $('#modal-edit-account #userRoles').addClass('details');
        $('#modal-edit-account #monCompteUpdate').css('margin-top','20px');
        $('<h4>Informations personnelles</h4>').prependTo('#modal-edit-account .modal-body');
        $('#modal-edit-account .required-fields').hide();

        addLoader();

        $.ajax({
            url: '/mon-compte/gestion-des-comptes/details-compte/'+$(this).attr('userId'),
            type: 'POST',
            data: jQuery.param({email: $(this).find('input[name=email]').val()}),//'email='+$(this).find('input[name=email]').val()+'&password='+$(this).find('input[name=password]').val(),
            cache: false,
            dataType: 'json',
            context: this,
            processData: false, // Don't process the files
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {
                removeLoader();

                if(!data.error){
                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userWorkPhone"]').val(data.details.user.WorkPhone);
                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userFirstName"]').val(data.details.user.FirstName);
                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userLastName"]').val(data.details.user.LastName);
                    $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="userTitle"]').val(data.details.user.Title);

                    // On doit désactiver le mode readonly le temps de renseigner les champs
                    userFields = {
                        'userAccountId': data.details.user.AccountId,
                        'userEmail': data.details.user.Email,
                        'accountAccount': data.details.account.Account,
                        'accountAddress': data.details.account.Address,
                        'userProfil': data.details.account.Typology.Description,
                        'accountPostalCode': data.details.account.PostalCode,
                        'accountCity': data.details.account.City,
                        'madraLogin': data.details.user.Login
                    };

                    Object.keys(userFields).forEach(function(key, index)  {
                        $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="'+key+'"]').prop('readonly', false);
                        $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="'+key+'"]').prop('disabled', false);
                        $('#modal-edit-account .modal-body #monCompteUpdate').find('input[name="'+key+'"]').val(userFields[key]);
                    });

                    $('#modal-edit-account .modal-body #monCompteUpdate input').each(function(){
                        $(this).prop('readonly', true);
                        $(this).parent().parent().removeClass('required');
                    });

                    var userRoles = [];
                    for(var i= 0; i < data.details.user.Profiles.length; i++){
                        userRoles.push(data.details.user.Profiles[i].Code);
                    }

                    $('#modal-edit-account .modal-body .userRoles .focused input[type="checkbox"]').each(function(){
                        $(this).attr('name', $(this).attr('name').replace('-hidden-form', ''));
                        $(this).attr('id', $(this).attr('id').replace('-hidden-form', ''));
                        if(userRoles.includes($(this).attr('name').toUpperCase())) {
                            $(this).prop('checked', true);
                        }
                        $(this).prop('disabled', true);
                    });

                    checkRoles();

                    $('#modal-edit-account').modal('toggle');
                } else {
                    removeLoader();
                    swal(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    // ---------------------------------------------------------
    // ----------------- Search sur les PROFILS -----------------
    // ---------------------------------------------------------
    $('input[name=searchUser]').focus().off('keyup').on('keyup', function () {
        $('.userBlock').show();

        var value = this.value.toLowerCase();

        $('.userBlock').hide().each(function () {
            if ($(this).text().toLowerCase().search(value) > -1) {
                $(this).show();
            }
        });
    });

    // ------------------------------------------------------------
    // ----------------- Réactivation d'un PROFIL -----------------
    // ------------------------------------------------------------
    $('.accountActivation').off('click').on('click', function(e) {
        //e.preventDefault();

        modificationTypeButton = 'reactiver';
        $(this).parents('.userBlock').find('a.modifierUserAccount').trigger('click');
    });

    // --------------------------------------------------------
    // ----------------- Désactiver un PROFIL -----------------
    // --------------------------------------------------------
    $(document).on('click', '.accountDesactivation', function() {
        $('#modal-confirm-disable-account').modal('hide');
        addLoader();

        $.ajax({
            url: '/mon-compte/gestion-des-comptes/desactiveuser/'+$(this).attr('userId'),
            type: 'POST',
            data: '',//'email='+$(this).find('input[name=email]').val()+'&password='+$(this).find('input[name=password]').val(),
            cache: false,
            dataType: 'json',
            context: this,
            processData: false, // Don't process the files
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {
                removeLoader();



                if(!data.error){


                    if($('.validation-users div.flex .userBlock').length == 0) {
                        $('.validation-users div.flex').text('');
                    }
                    if($('.validation-users div.flex .userBlock').length == 1) {
                        $('.validation-users div.flex .flex-fix').remove();
                        $('#user'+$(this).attr('userId')).clone( true ).prependTo('.userList.disabled div.tab-content');
                        $('<div class="flex-fix"></div>').appendTo($('.validation-users div.flex'));
                    }
                    else {
                        $('#user'+$(this).attr('userId')).clone( true ).prependTo('.userList.disabled div.tab-content');
                    }

                    $('.userList #user'+$(this).attr('userId')).addClass('disabled');

                    if($('#user'+$(this).attr('userId')).hasClass('to-validate')) {
                        $('.validation-users #user'+$(this).attr('userId')).remove();
                        $('.userList #user'+$(this).attr('userId')).removeClass('to-validate');
                    }

                    if($('#user'+$(this).attr('userId')).hasClass('waiting-first-connexion')) {
                        $('.first-connexion #user'+$(this).attr('userId')).remove();
                        $('.userList #user'+$(this).attr('userId')).removeClass('waiting-first-connexion');
                    }

                    if($('#user'+$(this).attr('userId')).hasClass('active')) {
                        $('.enabled #user'+$(this).attr('userId')).remove();
                        $('.userList #user'+$(this).attr('userId')).removeClass('active');
                    }

                    if($('.validation-users .flex .userBlock').length <= 0) {
                        $('.validation-users').remove();
                    }

                    $('#modal-generic').modal('hide');
                    removeLoader();

                } else {
                    removeLoader();
                    swal(data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        });
    });

    // ----------------------------------------------------------------------
    // ----------------- Affiche la POPIN AJOUTER un PROFIL -----------------
    // ----------------------------------------------------------------------
    $('.add-account').off('click').on('click', function(e) {
        e.preventDefault();
        $('#modal-edit-account .modal-body').html('');
        $('#modal-edit-account h4').html('Demande de création d\'un compte utilisateur');
        $('#newMembre form').clone().prependTo('#modal-edit-account .modal-body');
        $('.userRolesContent').clone().insertBefore('#modal-edit-account .modal-body form input[type="submit"]');
        $('<h4>Informations personnelles</h4>').prependTo('#modal-edit-account .modal-body');


        $('#modal-edit-account .modal-body .userRolesContent .focused input[type="checkbox"], #modal-edit-account .modal-body .userRolesContent input[type="radio"]').each(function(){
            $(this).attr('name', $(this).attr('name').replace('-hidden-form', ''));
            $(this).attr('id', $(this).attr('id').replace('-hidden-form', ''));
        });

        checkRoles();

        new window.JustValidate('#modal-edit-account .modal-body form.newMembre', {
            Rules: {
                email: {
                    required: true,
                    email: true
                },
                text: {
                    required: true,
                    maxLength: 300,
                },
                phone: {
                    required: true,
                    phone: true,
                    maxLength: 10,
                    minLength: 10
                }
            },
        });

        // Visibilité des rapports envoyés à d'autres collaborateurs
        $('#modal-edit-account input.visibiliteRapport').change( function() {
            $('#visibilite-rapport').prop('checked', true);
            $('#check-profil-labo').prop('checked', true);
            if($(this).val() == "other-rapport") {

                if($(this).prop('checked') == true){
                    $(this).parent().children('label').after('<div class="add-email-row">+</div>');
                    $(this).parent().append('' +
                        '<div class="email-row"><input type="text" name="email-collabo[]" placeholder="Adresse email"><button class="remove-email-row">-</button></div>'
                    );
                    $('#modal-edit-account .add-email-row + .email-row input').focus();
                    $(document).off('click').on('click', '.add-email-row', function(){
                        $('.add-email-row').after(
                            '<div class="email-row"><input type="text" name="email-collabo[]" placeholder="Adresse email"><button class="remove-email-row">-</button></div>'
                        );
                        $('#modal-edit-account .add-email-row + .email-row input').focus();
                    });
                    $(document).on('click', '.remove-email-row', function(){
                        $(this).parent().remove();
                    });
                } else {
                    $('.email-row').remove();
                    $('.add-email-row').remove();
                }
            }
        });

        $('#modal-edit-account').modal();

        $('#modal-edit-account form.newMembre').off('submit').on('submit', function(e) {
            e.preventDefault();

            addLoader();

            if($('#modal-edit-account .newMembre .userRolesContent input:checked').length >= 1 && $('.js-validate-error-label').length == 0) {

                var data = new FormData();

                // Add content to form array
                $.each($(this).find('input'), function () {
                    if ($(this).attr('type') != 'checkbox') {
                        data.append($(this).attr('name'), $(this).val());
                    } else {
                        if ($(this).is(':checked')) {
                            data.append($(this).attr('name'), true);
                        }
                    }
                });

                $.ajax({
                    url: '/mon-compte/gestion-des-comptes/add-membre',
                    type: 'POST',
                    data: data,
                    cache: false,
                    dataType: 'json',
                    context: this,
                    processData: false, // Don't process the files
                    //contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    success: function (data, textStatus, jqXHR) {
                        if(!data.error){
                            removeLoader();

                            $('#modal-edit-account').modal('hide');
                            $('#modal-confirm-add-account p .firstname').text($('#modal-edit-account #newCompte input[name="FirstName"]').val());
                            $('#modal-confirm-add-account p .lastname').text($('#modal-edit-account #newCompte input[name="LastName"]').val());
                            $('#modal-confirm-add-account').modal('show');

                            setTimeout(
                                function()
                                {
                                    document.location.reload()
                                }, 10000);
                        } else {
                            swal("", data.msg, "error");
                            removeLoader();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        removeLoader();
                        swal("", textStatus, "error");
                    }
                });
            }
            else if($('#modal-edit-account .newMembre .userRolesContent input:checked').length == 0) {
                removeLoader();
                swal("", 'Veuillez sélectionner au moins un type de profil.', "error");
            }
            else if($('.js-validate-error-label').length >= 1) {
                removeLoader();
                swal("", 'Veuillez renseigner tous les champs', "error");
            }
        });
    });

    // ------------------------------------------------------
    // ----------------- ???? -----------------
    // ------------------------------------------------------
    $(document).ready(function(){
        $('.accountDesactivationModal').off('click').on('click', function(e) {
            $('#modal-generic .modal-body').html('');
            $('#modal-generic .modal-title').text('Désactivation du compte');
            $('#modal-generic .modal-body').html($('.content-modal-disable-account').html());
            $('#modal-generic .accountDesactivation').attr('userId',$(this).attr('userId'));
            $('#modal-generic').modal();
        });
    });

    $('#modal-edit-account').on('hidden.bs.modal', function () {
        modificationTypeButton = 'modifier';
    });

    // ---------------------------------------------------------------------------------------
    // ----------------- Coche les roles suivants la rubrique de role cochée -----------------
    // ---------------------------------------------------------------------------------------
    function checkRoles() {
        $('#check-profil-labo').on('change', function(){
            if($(this).prop('checked')) {
                $('#check-suivi-commandes').prop('checked', true);
                $('#diag_suivi_cmd_mat').prop('checked', true);
                $('#diag_suivi_cmd_fltr').prop('checked', true);
                $('#diag_suivi_cmd_legio').prop('checked', true);
                $('#visibilite-rapport').prop('checked', true);
                $('#propre-rapport').prop('checked', true);
                $('#planification').prop('checked', false);
                $('#diag_cmd_conso').prop('checked', true);
            }
            else {
                $('#check-suivi-commandes').prop('checked', false);
                $('#diag_suivi_cmd_mat').prop('checked', false);
                $('#diag_suivi_cmd_fltr').prop('checked', false);
                $('#diag_suivi_cmd_legio').prop('checked', false);
                $('#visibilite-rapport').prop('checked', false);
                $('#propre-rapport').prop('checked', false);
                $('#planification').prop('checked', false);
                $('#diag_cmd_conso').prop('checked', false);
            }
        });

        $('#check-suivi-commandes').on('change', function(){
            if($(this).prop('checked')) {
                $('#diag_suivi_cmd_mat').prop('checked', true);
                $('#diag_suivi_cmd_fltr').prop('checked', true);
                $('#diag_suivi_cmd_legio').prop('checked', true);
            }
            else {
                $('#diag_suivi_cmd_mat').prop('checked', false);
                $('#diag_suivi_cmd_fltr').prop('checked', false);
                $('#diag_suivi_cmd_legio').prop('checked', false);
            }
        });

        $('#visibilite-rapport').on('change', function(){
            if($(this).prop('checked')) {
                $('#propre-rapport').prop('checked', true);
            }
            else {
                $('#propre-rapport').prop('checked', false);
                $('#all-rapport').prop('checked', false);
                $('#other-rapport').prop('checked', false);
                $('.email-row').remove();
                $('.add-email-row').remove();
            }
        });

        $('#diag_admin_delegate').on('change', function(){
            if($(this).prop('checked')) {
                $('#programme-fidelite').prop('checked', true);
                $('#check-profil-labo').prop('checked', true);
                $('#check-suivi-commandes').prop('checked', true);
                $('#diag_suivi_cmd_mat').prop('checked', true);
                $('#diag_suivi_cmd_fltr').prop('checked', true);
                $('#diag_suivi_cmd_legio').prop('checked', true);
                $('#diag_cmd_conso').prop('checked', true);
                $('#visibilite-rapport').prop('checked', true);
                $('#all-rapport').prop('checked', true);
                $('#planification').prop('checked', true);
                $('#diag_stagiaire').prop('checked', true);
                $('#diag_facturation').prop('checked', true);
            }
            else {
                $('#programme-fidelite').prop('checked', false);
                $('#check-profil-labo').prop('checked', false);
                $('#check-suivi-commandes').prop('checked', false);
                $('#diag_suivi_cmd_mat').prop('checked', false);
                $('#diag_suivi_cmd_fltr').prop('checked', false);
                $('#diag_suivi_cmd_legio').prop('checked', false);
                $('#diag_cmd_conso').prop('checked', false);
                $('#visibilite-rapport').prop('checked', false);
                $('#all-rapport').prop('checked', false);
                $('#planification').prop('checked', false);
                $('#diag_stagiaire').prop('checked', false);
                $('#diag_facturation').prop('checked', false);
            }
        });

        $('.profil-labo .sub-role input[type=checkbox]').on('change', function() {
            if($('.profil-labo .sub-role input[type=checkbox]:checked').length >= 1) {
                $('#check-profil-labo').prop('checked', true);
            }
            else {
                $('#check-profil-labo').prop('checked', false);
            }
        });

        $('.profil-admin .sub-role input[type=checkbox]').on('change', function() {
            if($('.profil-admin .sub-role input[type=checkbox]:checked').length >= 1) {
                $('#diag_admin_delegate').prop('checked', true);
            }
            else {
                $('#diag_admin_delegate').prop('checked', false);
            }
        });

        $('.suivi-commandes .sub-role input[type=checkbox]').on('change', function() {
            if($('.suivi-commandes .sub-role input[type=checkbox]:checked').length >= 1) {
                $('#check-suivi-commandes').prop('checked', true);
            }
            else {
                $('#check-suivi-commandes').prop('checked', false);
                if($('.profil-labo .sub-role input[type=checkbox]:checked').length >= 1) {
                    $('#check-profil-labo').prop('checked', true);
                }
                else {
                    $('#check-profil-labo').prop('checked', false);
                }
            }
        });

        // Vérification à l'ouverture de la pop-in
        if($('.profil-labo .sub-role input[type=checkbox]:checked').length >= 1) {
            $('#check-profil-labo').prop('checked', true);
        }
        else {
            $('#check-profil-labo').prop('checked', false);
        }

        if($('.suivi-commandes .sub-role input[type=checkbox]:checked').length >= 1) {
            $('#check-suivi-commandes').prop('checked', true);
        }
        else {
            $('#check-suivi-commandes').prop('checked', false);
            if($('.profil-labo .sub-role input[type=checkbox]:checked').length >= 1) {
                $('#check-profil-labo').prop('checked', true);
            }
            else {
                $('#check-profil-labo').prop('checked', false);
            }
        }
    }

    // ----------------------------------------------------------------------------------------------------------------
    // ----------------- Affiche les champs emails et gere les events pour la visiblité des rapports  -----------------
    // ----------------------------------------------------------------------------------------------------------------
    function setVisibiliteRapport(){
        // Visibilité des rapports envoyés à d'autres collaborateurs
        $('#modal-edit-account input.visibiliteRapport').change( function() {
            $('#visibilite-rapport').prop('checked', true);
            $('#check-profil-labo').prop('checked', true);
            if($(this).val() == "other-rapport") {

                if($(this).prop('checked') == true){
                    $(this).parent().children('label').after('<div class="add-email-row">+</div>');
                    $(this).parent().append('' +
                        '<div class="email-row"><input type="text" name="email-collabo[]" placeholder="Adresse email"><button class="remove-email-row">-</button></div>'
                    );
                    $('#modal-edit-account .add-email-row + .email-row input').focus();
                    $(document).off('click').on('click', '.add-email-row', function(){
                        $('.add-email-row').after(
                            '<div class="email-row"><input type="text" name="email-collabo[]" placeholder="Adresse email"><button class="remove-email-row">-</button></div>'
                        );
                        $('#modal-edit-account .add-email-row + .email-row input').focus();
                    });
                    $(document).on('click', '.remove-email-row', function(){
                        $(this).parent().remove();
                    });
                } else {
                    $('.email-row').remove();
                    $('.add-email-row').remove();
                }
            }
        });
    }
});


jQuery(function ($) {


    $('form#premiereconnexion').off('submit').on('submit', function(e) {
        e.preventDefault();

        addLoader();

        $.ajax({
            url: '/premiere-connexion/ajax',
            type: 'POST',
            data: jQuery.param({email: $(this).find('input[name=email]').val()}),//'email='+$(this).find('input[name=email]').val()+'&password='+$(this).find('input[name=password]').val(),
            cache: false,
            dataType: 'json',
            context: this,
            processData: false, // Don't process the files
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {
                removeLoader();
                genericModal('Première connexion', data.msg+'<div style="margin-top:20px;"><a class="btn btn-default" href="/signin">Se connecter</a></div>');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                removeLoader();
                genericModal('Première connexion', data.textStatus);
            }
        });
    });

    $('form#premiereconnexionfinalise').off('submit').on('submit', function(e) {
        e.preventDefault();

        addLoader();

        // checkpass
        if($(this).find('input[name=password]').val() != $(this).find('input[name=password-confirm]').val()){
            alert('Le mot de passe ne correspond pas à sa confirmation');
            $(this).find('.loader-wrapper').remove();
        } else {
            $.ajax({
                url: document.location.pathname + '/ajax',
                type: 'POST',
                data: jQuery.param({password: $(this).find('input[name=password]').val(), passwordConfirm: $(this).find('input[name=password-confirm]').val()}),//'email='+$(this).find('input[name=email]').val()+'&password='+$(this).find('input[name=password]').val(),
                cache: false,
                dataType: 'json',
                context: this,
                processData: false, // Don't process the files
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function (data, textStatus, jqXHR) {
                    removeLoader();

                    if (!data.error) {
                        document.location.href = '/';
                    } else {
                        alert(data.msg);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    removeLoader();
                    alert(textStatus);
                }
            });
        }
    });
});
jQuery(function ($) {

    // Modal demander un accès
    $('.request-account').off('click').on('click', function(e) {
      e.preventDefault();
      $('#modal-request-account').modal();
    });


    $('form#signin').off('submit').on('submit', function(e) {
        e.preventDefault();

        addLoader();

        $.ajax({
            url: '/signin/ajax',
            type: 'POST',
            data: jQuery.param({email: $(this).find('input[name=email]').val(), 'password' : $(this).find('input[name=password]').val()}),//'email='+$(this).find('input[name=email]').val()+'&password='+$(this).find('input[name=password]').val(),
            cache: false,
            dataType: 'json',
            context: this,
            processData: false, // Don't process the files
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
           // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {
                removeLoader();
                if(!data.error){
                    document.location.href = '/';
                } else {
                    swal("", data.msg, "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                removeLoader();
                swal("", textStatus, "error");
            }
        });
    });

    $('.dejaClientItga').off('click').on('click', function(e) {
        $('#dejaClient').removeClass('hidden');
        $('.modal-body ul').addClass('hidden');
    });

    $('#modal-request-account button.close').click(function(e) {
        $('#dejaClient').addClass('hidden');
        $('.modal-body ul').removeClass('hidden');
    });

    $('#dejaClient').off('submit').on('submit', function(e) {
        e.preventDefault();

        addLoader();

        $.ajax({
            url: '/signin/deja-client/ajax',
            type: 'POST',
            data: jQuery.param({numero: $(this).find('input[name=numero]').val()}),//'email='+$(this).find('input[name=email]').val()+'&password='+$(this).find('input[name=password]').val(),
            cache: false,
            dataType: 'json',
            context: this,
            processData: false, // Don't process the files
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            // contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {
                removeLoader();
                if(!data.error){
                    document.location.href = '/form/deja-client-itga?key=' + $(this).find('input[name=numero]').val();
                } else {
                    $('.errorMsgDejaClient').remove();
                    $('#dejaClient input[type=submit]').after('<div class="errorMsgDejaClient">' + data.msg + '</div>');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                removeLoader();
                swal("", textStatus, "error");
            }
        });
    });


    $('#webform-submission-deja-client-itga-add-form #edit-numero-de-compte-client-itga').attr('value', getUrlParameter('key'));

    $('#modal-request-account input[type="text"]').on('input',function(e){
        if($(this).val().length > 0) {
            $('#modal-request-account input[type="submit"]').prop('disabled', false);
        }
        if($(this).val().length == 0) {
            $('#modal-request-account input[type="submit"]').prop('disabled', true);
        }
    });

    $('#modal-request-account input[type="submit"]').click(function(e){
        if($('#modal-request-account input[type="text"]').val().length == 0) {
            e.preventDefault();
            e.stopPropagation();
            $('#modal-request-account .error').show();
        }

    });

});


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};