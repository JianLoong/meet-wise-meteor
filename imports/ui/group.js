/**
 * Created by Jian on 12/06/2016.
 */

import {Groups}  from '../api/groups.js';

import '../api/user.js';
import './group.html';

Template.selectGroup.helpers({
    groups(){
        return Groups.find({});
    }
});



Template.groupMember.events({
    'click #addMember'(event){
        //$('.selectGroupPanel').hide();
        $('.addMemberPanel').show();
    },

    'click #viewGroup'(event){
        alert(this._id);
        $('.selectGroupPanel').hide();
        $('.userLocationsPanel').show();

    },

    'click .removeMember'(event){
        alert(this.userId);
    }
});


Meteor.startup(function () {
    GoogleMaps.load({
        libraries: 'places'  // also accepts an array if you need more than one
    });
});


Template.groupMember.onRendered( function (){

    this.autorun(function (){
        $('.groupMember').hide();
    })
});


Template.selectGroup.events({
    'change #selectGroup'(event){
        $('.groupMember').show();
        $('#' +$('#selectGroup').val()).parent().siblings().hide();

        var groupId = $('#selectGroup').val();

        Session.set("groupId", groupId);
        
        Tracker.autorun( function (){
            Meteor.subscribe('groupMarkers', Session.get('groupId'));
        });
    },
});


Template.group.onRendered( function (){
    this.autorun(function () {
        $('select').material_select();
    })
});

