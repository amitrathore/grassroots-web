GrassrootsGroupsTab = {
    NS_MUC: "http://jabber.org/protocol/muc",
    group_participants: {},
    nicks: {},
    joined_rooms: {},
    current_room: null,

    init: function() {
        GrassrootsUtils.log('GrassrootsGroupsTab: init');
        var tabs_content = $('#gr_tabs_content');
        GrassrootsGroupsTab.append_toolbar(tabs_content);
        GrassrootsGroupsTab.append_sidebar(tabs_content);
        Grassroots.connection.addHandler(GrassrootsGroupsTab.on_presence, null, "presence");
        Grassroots.connection.addHandler(GrassrootsGroupsTab.on_public_message, null, "message", "groupchat");
    },

    append_toolbar: function(tabs_content) {
        $.get("/html/snippets/new_group.html", function(toolbar_html) {
            tabs_content.append(toolbar_html);
            $('#groups_tab_list_groups').button();
            $('#groups_tab_list_groups').click(function() {
                GrassrootsUtils.log('***');
            });
            $('#groups_tab_add_group').button();
            $('#groups_tab_add_group').click(function() {
                GrassrootsUtils.log('+++');
                GrassrootsGroupsTab.launch_add_group_dialog(); 
            });
        });
    },

    launch_add_group_dialog: function() {
        GrassrootsUtils.log('GrassrootsGroupsTab: launch_add_group_dialog');
        $('#groups_tab_new_group_dialog').dialog({
            draggable: false,
            modal: true,
            resizable: false,
            title: "Create new group",
            buttons: {
                "Go!": function() {
                    var group_name = $('#groups_tab_new_group_name').val();
                    $(this).dialog('close');
                    GrassrootsGroupsTab.send_join_group(group_name);
                }
            }
        });
    },
    
    append_sidebar: function(tabs_content) {
        GrassrootsUtils.log('GrassrootsGroupsTab: append_owned_groups');
        var sidebar = $('<div id=groups_tab_sidebar></div>');
        tabs_content.append(sidebar); 

        var groups_list_url = Grassroots.web_url + "/groups";
        $.get(groups_list_url, {username: Grassroots.username}, function(groups_list_string) {
            GrassrootsUtils.log('GrassrootsGroupsTab: group_list callback');
            Grassroots.group_names = GrassrootsUtils.to_json(groups_list_string);
            GrassrootsGroupsTab.refresh_side_bar();
        });
    },

    refresh_side_bar: function() {
        var sidebar = $('#groups_tab_sidebar');
        sidebar.empty();
        sidebar.append($('<h2>Your groups</h2>'));
        $.each(Grassroots.group_names, function(i, full_name) {
            var group_name = GrassrootsUtils.username_from_jid(full_name);
            var group_item = $('<div class=owned_group_name>').text(group_name);
            group_item.click(function () {
                GrassrootsGroupsTab.switch_to_group(group_name)
            });
            sidebar.append(group_item);
        });
    },

    switch_to_group: function(group_name) {
        GrassrootsUtils.log('GrassrootsGroupsTab: switching to ' + group_name);
        GrassrootsGroupsTab.load_room_if_needed(group_name);
    },

    handle_group_joined: function(presence) {
        GrassrootsUtils.log('GrassrootsGroupsTab: handle_group_joined!');
        var from = $(presence).attr('from');
        var room = GrassrootsUtils.username_from_jid(from);
        var nick = Strophe.getResourceFromJid(from);
        var room_jid = GrassrootsUtils.room_jid(room, Grassroots.username);

        if (Grassroots.username === room) { //this is not a group related presence
            return true;
        }
        GrassrootsUtils.log('GrassrootsGroupsTab: handle_group_joined with room_jid:' + room_jid + ' from:' + from);

        if ($(presence).find("status[code='210']").length > 0) {
            nicks[room] = nick;
        }
        
        if (room_jid === from && $(presence).attr('type') !== 'unavailable') { //
            GrassrootsUtils.log('GrassrootsGroupsTab: handle_group_joined: joining ' + room + ' complete!');
            if ($(presence).find("status[code='201']").length > 0) {
                GrassrootsGroupsTab.configure_room(room);
            }
        }
        GrassrootsGroupsTab.load_room_if_needed(room);
        return true;
    },

    configure_room: function(room_name) {
        GrassrootsUtils.log('GrassrootsGroupsTab: configure_room');
        var muc_config_url = Grassroots.web_url + "/room_config";
        var config_data = {
            id: GrassrootsUtils.make_id(),
            to: GrassrootsUtils.full_group_name(room_name),
            username: Grassroots.username,
            roomname: GrassrootsUtils.full_group_name(room_name),
            roomdesc: room_name + " room for Grassroots."
        };
        $.get(muc_config_url, config_data, function(creation_result_string) {
            GrassrootsUtils.log('GrassrootsGroupsTab: configure_room: callback!');
            var creation = GrassrootsUtils.to_json(creation_result_string);
            if (creation.result === true) {
                GrassrootsGroupsTab.joined_rooms[room_name] = true;
                Grassroots.connection.send($(creation.config));
            }
            else {
                alert('Unable to create group!');
            }
        });
    },

    load_room_if_needed: function(room) {
        GrassrootsUtils.log('GrassrootsGroupsTab: load_room_if_needed!');
        if (GrassrootsGroupsTab.current_room === room) {
            return true;
        }
        GrassrootsGroupsTab.send_join_group(room);
        GrassrootsGroupsTab.current_room = room;
        var group_main = $('<div id=groups_tab_main>');
        var group_title = $('<div id=group_title>' + room + '</div>');
        group_main.append(group_title);

        var group_messages = $('<div id=groups_tab_messages>');
        group_main.append(group_messages);

        var group_message_editor = $('<div id=message_editor>');
        group_message_editor.append('<textarea id=send_message_text cols=60 rows=2></textarea>');
        var send_button = $('<button id=send_message>Send</button>');
        send_button.button();
        send_button.click(function() {
            GrassrootsGroupsTab.send_message($('#send_message_text').val());
        }); 
        group_message_editor.append(send_button);
        group_main.append(group_message_editor);

        $('#groups_tab_main').replaceWith(group_main);
        GrassrootsGroupsTab.current_room = room;
    },

    send_message: function(message_text) {
        GrassrootsUtils.log('GrassrootsGroupsTab: SEND!');        
    },

    on_public_message: function(message) {
        GrassrootsUtils.log('GrassrootsGroupsTab: on_public:');
        GrassrootsUtils.log(message);
        var from = $(message).attr('from');
        var room = Strophe.getBareJidFromJid(from);
        var nick = Strophe.getResourceFromJid(from);

        var notice = !nick;
        
        var nick_class = "nick";
        if (nick === Grassroots.username) {
            nick_class += " self";
        }
        var body = $(message).children('body').text();
        
        if (!notice) {
            GrassrootsGroupsTab.add_message("<div class='message'> &lt;<span class='"
                                            + nick_class + "'>" + nick 
                                            + "</span>&gt; <span class='body'>" 
                                            + body 
                                            + "</span></div>");
        }
        return true;
    },

    add_message: function (msg) {
        GrassrootsUtils.log('GrassrootsGroupsTab: add_message:' + msg);
        var chat = $('#groups_tab_messages');
        chat.append(msg);

        var at_bottom = chat.scrollTop >= chat.scrollHeight - chat.clientHeight;
        if (at_bottom) {
            chat.scrollTop = chat.scrollHeight;
        }
    },

    on_presence: function(presence) {
        GrassrootsUtils.log('PREZ:' + presence);
        GrassrootsUtils.log(presence);
        var from = $(presence).attr('from');
        var room = GrassrootsUtils.username_from_jid(from);
        var nick = Strophe.getResourceFromJid(from);
        GrassrootsUtils.log('GrassrootsGroupsTab: Room:' + room + ', Nick:' + nick);

        if ($(presence).attr('type') === 'error') {
            alert('Error joining room:' + room);
        }

        if ($(presence).attr('type') !== 'error') {
            GrassrootsGroupsTab.handle_group_joined(presence);
        }
        return true;
    },

    send_join_group: function(group_name) {
        var full_group_name = GrassrootsUtils.full_group_name(group_name);
        GrassrootsUtils.log('GrassrootsGroupsTab: send_join_group: ' + full_group_name);

        var p = $pres({to: full_group_name + "/" + Grassroots.username})
            .c('x', {xmlns: GrassrootsGroupsTab.NS_MUC});
        Grassroots.connection.send(p);
    }
};