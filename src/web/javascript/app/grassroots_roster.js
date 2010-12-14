GrassrootsRoster = {
    get_roster: function(on_roster, on_roster_changed) {
        GrassrootsUtils.log('GrassrootsRoster: get_roster: asking for roster...');
        var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
        Grassroots.connection.addHandler(on_roster_changed, "jabber:iq:roster", "iq", "set");
        Grassroots.connection.sendIQ(iq, on_roster);
    },

    on_roster: function(iq) {
        GrassrootsUtils.log('GrassrootsRoster: on_roster!');
        $(iq).find('item').each(function () {
            var jid = $(this).attr('jid');
            GrassrootsUtils.log("GrassrootsRoster: on_roster: " + jid);
            var username = GrassrootsUtils.username_from_jid(jid);
            var name = $(this).attr('name') || jid;
            Grassroots.roster[username] = {"jid": jid, "username": username, "name": name};
        });        
    },

    on_roster_changed: function(iq) {
        alert("GrassrootsRoster: on_roster_changed!");
    }
};