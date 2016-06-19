import './navbar.html';

Template.navbar.events({
    'click #loginButton'(){

        $('.button-collapse').sideNav('hide');


        $('.addMemberPanel').hide();
        $('.userLocationsPanel').hide();
        $('.createGroupPanel').hide();
        $('.selectGroupPanel').hide();
        $('.groupDetailsPanel').hide();


        $('.userDetailsPanel').show();
    },

    'click #createGroupButton'(){
        $('.button-collapse').sideNav('hide');

        $('#map').addClass("hide-on-small-only");

        $('.addMemberPanel').hide();
        $('.userDetailsPanel').hide();
        $('.selectGroupPanel').hide();
        $('.groupDetailsPanel').hide();


        $('.createGroupPanel').show();
        $('.userLocationsPanel').hide();
        $('#form-set-address').removeAttr("placeholder");

        $('.datepicker').pickadate({});
    },

    'click #menuExitButton'(){
        $('#map').addClass("hide-on-small-only");

        $('.button-collapse').sideNav('hide');
        $('.addMemberPanel').hide();
        $('.createGroupPanel').hide();
        $('.userLocationsPanel').hide();
        $('.userDetailsPanel').show();
        $('.selectGroupPanel').hide();
        $('.groupDetailsPanel').hide();

        Session.set("groupId",0);
        Meteor.logout();
    },

    'click #groupDetailsButton'(){
        $('#map').addClass("hide-on-small-only");
        $('.button-collapse').sideNav('hide');


        $('.userDetailsPanel').hide();
        $('.createGroupPanel').hide();
        //
        $('.addMemberPanel').show();

        $('.userLocationsPanel').show();

        $('.selectGroupPanel').show();
        $('.groupDetailsPanel').show();
    },

    'click #mapButton'(){
        $('.button-collapse').sideNav('hide');

        $('#map').removeClass("hide-on-small-only");

        $('.addMemberPanel').hide();
        $('.createGroupPanel').hide();
        $('.userLocationsPanel').hide();
        $('.userDetailsPanel').hide();
        $('.selectGroupPanel').hide();
        $('.groupDetailsPanel').hide();
    }
});
