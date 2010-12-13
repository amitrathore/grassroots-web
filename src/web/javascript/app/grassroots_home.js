GrassrootsHome = {
    init: function() {
        GrassrootsUtils.log('GrassrootsHome: Init');
        this.create_skeleton();
        $('#gr_tabs').tabs();
    },

    create_skeleton: function() {
        var gr_tabs = $('<div id=gr_tabs>');
        gr_tabs.appendTo('#grassroots_content');

        var gr_tab_names = $('<ul id=gr_tab_names></ul>');
        gr_tab_names.appendTo(gr_tabs);
        
        this.create_grassroots_tab('#gr_tab_home', 'Groups', gr_tab_names);
        this.create_grassroots_tab('#gr_tab_invites','Invites',  gr_tab_names);
        this.create_grassroots_tab('#gr_tab_settings', 'Settings', gr_tab_names);
    },

    create_grassroots_tab: function(tab_link_id, tab_link_text, tab_ul) {
        var a_node = $('<a>').attr('href', tab_link_id).text(tab_link_text);
        GrassrootsDom.append_li(gr_tab_names, a_node);
    }   
    
};