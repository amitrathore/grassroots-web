GrassrootsConfig = {
    current_host: $.url.attr('host'),

    "grassrootsweb.com": {
        bosh_http_url: "http://lookingglass.local:5280/http-bind",
        web_url: "http://grassrootsweb.com/api",
        ubernet_domain: "lookingglass.local",
        ubernet_conf: "conference.lookingglass.local"
    },

    "grassroots.currylogic.com": {
        bosh_http_url: "http://chatter.currylogic.com:5280/http-bind",
        web_url: "http://grassroots.currylogic.com/api",
        ubernet_domain: "chatter.currylogic.com",
        ubernet_conf: "conference.chatter.currylogic.com"
    }
};

Grassroots = {
    bosh_http_url: function() {
        return GrassrootsConfig[GrassrootsConfig.current_host].bosh_http_url;
    },

    web_url: function() {
        return GrassrootsConfig[GrassrootsConfig.current_host].web_url;
    },

    ubernet_domain: function() {
        return GrassrootsConfig[GrassrootsConfig.current_host].ubernet_domain;
    },

    ubernet_conf: function() {
        return GrassrootsConfig[GrassrootsConfig.current_host].ubernet_conf;
    },

    roster: {}
};