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