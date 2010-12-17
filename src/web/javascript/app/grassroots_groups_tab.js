GrassrootsGroupsTab = {
    NS_MUC: "http://jabber.org/protocol/muc",

    init: function() {
        GrassrootsUtils.log('GrassrootsGroupsTab: init');
        var tabs_content = $('#gr_tabs_content');
        this.append_toolbar(tabs_content);

        // var toolbar = $('<div id=gr_tabs_toolbar>');
        // toolbar.appendTo(tabs_content);
        // this.append_new_group_button(toolbar);
        this.append_owned_groups(tabs_content);
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
                this.launch_add_group_dialog(); 
            });
        });
    },

    launch_add_group_dialog: function() {
        $('groups_tab_new_group_dialog').dialog();
    },
    
    append_owned_groups: function(tabs_content) {
        GrassrootsUtils.log('GrassrootsGroupsTab: append_owned_groups');
        // $.get() 
    },

    create_new_group: function(group_name) {
        var full_group_name = group_name + "@" + Grassroots.ubernet_conf;
        $pres({to: full_group_name + "/" + Grassroots.username})
            .c('x', {xmlns: GrassrootsGroupsTab.NS_MUC});
    }
};