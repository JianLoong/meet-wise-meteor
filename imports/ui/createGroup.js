/**
 * Created by Jian on 12/06/2016.
 */

import {Groups}  from '../api/groups.js';

import '../api/user.js';
import './createGroup.html';


Template.createGroup.onRendered(function () {

    this.autorun(function () {

        $('.datepicker').pickadate({
            selectMonths: false, // Creates a dropdown to control month
            selectYears: false, // Creates a dropdown of 15 years to control year
            format: 'yyyy-mm-dd',
            min: true
        });


        if(GoogleMaps.loaded()){
            $("#form-set-address").geocomplete({
                details: ".details"
            });
        }
    })
});

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
            $('.toast').hide();
            Materialize.toast("Please enter required information.", 4000);
            return;
        }

        var address = $('#form-set-address').val();

        var createdAt = new Date();

        var userArray = new Array();

        var user = new User(Meteor.userId(), Meteor.user().emails[0].address, true);

        userArray.push(user);

        Meteor.call('groups.insert', groupName, lat, lng, address, createdAt, userArray, function(error, result){
            if(error){
                $('.toast').hide();
                Materialize.toast("An error occurred.", 4000);
            }else{
                $('.toast').hide();
                Materialize.toast("Group created succesfully.", 4000);
                GoogleMaps.maps.map.instance.setCenter(new google.maps.LatLng(lat, lng));
            }
        });
        

        $('select').material_select();
    },

});
