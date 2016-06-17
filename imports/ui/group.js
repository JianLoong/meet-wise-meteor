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

Template.addMember.events({
    'click #add'(event){

        var email = $('#email').val();
        var groupId = $('#selectGroup').val();

        Meteor.call("member.add",email, groupId, function(error, result){
            if(error){
                $('#email').addClass("invalid");
                Materialize.toast("Email not registered.", 4000);
                return;
            }
        });

    }
})


Template.groupMember.events({
    'click #addMember'(event){
        $('.selectGroupPanel').hide();
        $('.addMemberPanel').show();
    }
});


Meteor.startup(function () {
    GoogleMaps.load({
        libraries: 'places'  // also accepts an array if you need more than one
    });
});



Template.group.onRendered( function (){
    this.autorun(function () {
        $('select').material_select();
    })
})

Template.groupMember.onRendered( function (){

    this.autorun(function (){
        $('.groupMember').hide();
    })
})

Template.createGroup.onRendered(function () {
    this.autorun(function () {
        if(GoogleMaps.loaded()){
            $("#form-set-address").geocomplete({
                details: ".details"
            });
        }
    })
})

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
})


Template.createGroup.events({
    'click #create-group'(event){
        event.preventDefault();
        var flag = true;
        var groupName = $('#group-name').val();
        var lat = $('#lat').val();
        var lng = $('#lng').val();
        var date = $('#date').val();

        if (lat.length == 0 || lng.length == 0) {
            $('#form-set-address').addClass("invalid");
            $("label[for='form-set-address']").addClass("active");
            flag = false;
        }

        if (groupName.length == 0) {
            $('#group-name').addClass("invalid");
            $("label[for='group-name']").addClass("active");
            flag = false;
        }

        if (!flag) {
            return;
        }

        var address = $('#form-set-address').val();

        var createdAt = new Date();

        var userArray = new Array();

        var user = new User(Meteor.userId(), Meteor.user().emails[0].address, true);

        userArray.push(user);

        var result = Meteor.call('groups.insert', groupName, lat, lng, address, createdAt, userArray, function(error, result){
        });

        GoogleMaps.maps.map.instance.setCenter(new google.maps.LatLng(lat, lng));

        $('select').material_select();
    },

});
