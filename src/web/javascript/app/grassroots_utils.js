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
    }
};