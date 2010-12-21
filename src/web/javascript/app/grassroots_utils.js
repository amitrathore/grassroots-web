GrassrootsUtils = {
    to_json: function(json_string) {
        return eval('(' + json_string + ')');
    },

    log: function(message) {
        if (window.console) {
            console.log(message);
        }
    },

    username_from_jid: function(full_jid) {
        return full_jid.split('@')[0];
    },

    room_jid: function(room_name, nick_name) {
        return room_name + "@" + Grassroots.ubernet_conf + "/" + nick_name;
    },

    full_group_name: function(group_name) {
        return group_name + "@" + Grassroots.ubernet_conf;
    },

    make_id: function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
    }
};