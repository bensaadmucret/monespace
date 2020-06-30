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

