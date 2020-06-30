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