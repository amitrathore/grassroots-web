GrassrootsConnection = {
    new_connection: function() {
        GrassrootsUtils.log('GrassrootsConnection: new');
        return new Strophe.Connection(Grassroots.bosh_http_url);
    },

    process_login: function(ev, data) {
        data.jid = data.jid + "@" + Grassroots.ubernet_domain;
        this.login(data.jid, data.password, 'connected', 'disconnected');
    },

    login: function(jid, password, on_connect_trigger, on_disconnect_trigger) {
        GrassrootsUtils.log('GrassrootsConnection: login: connecting with ' + jid + " , " + password);
        var conn = this.new_connection();
        conn.connect(jid, password, function(status) {
            GrassrootsUtils.log('GrassrootsConnection: login callback!');
            if (status === Strophe.Status.CONNECTED) {
                GrassrootsUtils.log('GrassrootsConnection: login: CONNECTED!');
                Grassroots.jid = jid;
                Grassroots.username = GrassrootsUtils.username_from_jid(jid);
                $(document).trigger(on_connect_trigger);
            } 
            else if (status === Strophe.Status.DISCONNECTED) {
                $(document).trigger(on_disconnect_trigger);
            }
        });
        Grassroots.connection = conn;
        Grassroots.connection.rawInput = console.log;
        Grassroots.connection.rawOutput = console.log;
    },

    send_presence: function(on_presence) {
        GrassrootsUtils.log("GrassrootsConnection: send_presence!");
        Grassroots.connection.addHandler(on_presence, null, "presence");
        Grassroots.connection.send($pres());
    },

    disconnected: function() {
        alert("Bye!");
        Grassroots.connection = null;
    }
};

