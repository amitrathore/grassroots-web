GrassrootsSignup = {
    init: function() {
        Grassroots.connection = GrassrootsConnection.new_connection();
    },

    launch_signup: function() {
        $('#signup_dialog').dialog({
            autoOpen: true,
            draggable:false,
            modal: true,
            title: "Sign up for Grassroots!",
            buttons: {
                "Signup": function () {
                    $(document).trigger('signup', {
                        jid: $('#jid').val(),
                        password: $('#password').val()
                    });
                    $('#password').val('');
                    $(this).dialog('close');
                }
            }
        });
    },
    
    process_signup: function(ev, creds) {
        var user_url = Grassroots.web_url() + "/user";
        $.post(user_url, creds, function(data_string) {
            var data = GrassrootsUtils.to_json(data_string);
            GrassrootsUtils.log("GrassrootsSignup: process_signup: new user creation:" + data);
            if (data.result === true) {
                $(document).trigger('signup_success', creds);
            }
            else {
                $(document).trigger('signup_fail', creds);
            }
        });
    },

    signup_fail: function(){
        alert('Trouble signing up!');
    }
};


$(document).bind('signup', GrassrootsSignup.process_signup.bind(GrassrootsSignup));
$(document).bind('signup_success', GrassrootsConnection.process_login.bind(GrassrootsConnection));
$(document).bind('signup_fail', GrassrootsSignup.signup_fail.bind(GrassrootsSignup));

$(document).bind('connected', GrassrootsHome.init.bind(GrassrootsHome));
$(document).bind("disconnected", GrassrootsConnection.disconnected.bind(GrassrootsConnection));

$(document).ready(function() {
    GrassrootsSignup.init();
    GrassrootsSignup.launch_signup();
});
