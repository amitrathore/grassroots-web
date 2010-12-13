GrassrootsConnection = {
    new_connection: function() {
        return new Strophe.Connection("http://lookingglass.local:5280/http-bind");
    },

    process_login: function(ev, data) {
        data.jid = data.jid + "@" + Grassroots.ubernet_domain;
        this.login(data.jid, data.password, 'connected', 'disconnected');
    },

    login: function(jid, password, on_connect_trigger, on_disconnect_trigger) {
        GrassrootsUtils.log('GrassrootsConnection: login: connecting with ' + jid + " , " + password);
        var conn = this.new_connection();
        conn.connect(jid, password, function(status) {
            if (status === Strophe.Status.CONNECTED) {
                GrassrootsUtils.log('GrassrootsConnection: login: CONNECTED!');
                $(document).trigger(on_connect_trigger);
            } 
            else if (status === Strophe.Status.DISCONNECTED) {
                $(document).trigger(on_disconnect_trigger);
            }
        });
        Grassroots.connection = conn;
    },

    disconnected: function() {
        alert("Bye!");
        Grassroots.connection = null;
    }
};

