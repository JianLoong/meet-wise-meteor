import './navbar.html';

Template.navbar.events({
    'click #hamburger'(){
        $('.addMemberPanel').hide();
        $('.userLocationsPanel').hide();
        $('.createGroupPanel').hide();
        $('.selectGroupPanel').hide();
        $('.groupDetailsPanel').hide();
        $('.userDetailsPanel').toggle();
    },

    'click #user-location-button'(){
        $('.addMemberPanel').hide();
        $('.userDetailsPanel').hide();
        $('.selectGroupPanel').hide();
        $('.groupDetailsPanel').hide();


        $('.createGroupPanel').toggle();
        $('#form-set-address').removeAttr("placeholder");

        $('.datepicker').pickadate({});
    },

    'click #menuExitButton'(){
        $('.addMemberPanel').hide();
        $('.createGroupPanel').hide();
        $('.userLocationsPanel').hide();
        $('.userDetailsPanel').hide();
        $('.selectGroupPanel').hide();
        $('.groupDetailsPanel').hide();

        Session.set("groupId",0);
        Meteor.logout();
    },

    'click #groupDetailsButton'(){


        $('.userDetailsPanel').hide();
        $('.createGroupPanel').hide();
        $('.addMemberPanel').hide();

        //$('.userLocationsPanel').toggle();

        $('.selectGroupPanel').toggle();
        $('.groupDetailsPanel').toggle();
    }
});
