GrassrootsLogin = {
    launch_login: function() {
        $('#login_dialog').dialog({
            autoOpen: true,
            draggable:false,
            modal: true,
            title: "Log into Grassroots!",
            buttons: {
                "Connect": function () {
                    $(document).trigger('connect', {
                        jid: $('#jid').val(),
                        password: $('#password').val()
                    });
                    $('#password').val('');
                    $(this).dialog('close');
                }
            }
        });
    }
}



$(document).bind("connect", GrassrootsConnection.process_login.bind(GrassrootsConnection));
$(document).bind("connected", GrassrootsHome.init.bind(GrassrootsHome));
$(document).bind("disconnected", GrassrootsConnection.disconnected.bind(GrassrootsConnection));

$(document).ready(function() {
    GrassrootsLogin.launch_login();
});