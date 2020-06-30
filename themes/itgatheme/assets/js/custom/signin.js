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