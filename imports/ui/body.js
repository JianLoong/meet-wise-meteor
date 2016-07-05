import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    //Meteor.subscribe('tasks');
    //Meteor.subscribe('groupMarkers', "");
    //Meteor.subscribe('destinations');
    Meteor.subscribe('groups');
    //Meteor.subscribe('userGroups');

    //this.subscribe('groups');
});

Template.body.onRendered( function () {

    // $('#map').addClass("hide-on-small-only");
    
    $(".dropdown-button").dropdown();
    $(".button-collapse").sideNav();
});

Template.body.helpers({


});

Template.body.events({

});

