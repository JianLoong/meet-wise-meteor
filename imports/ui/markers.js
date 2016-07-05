import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Markers} from '../api/markers.js';
import {Groups} from '../api/groups.js';

import './map.html';

var stringToColour = function (str) {
    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
};

var circleIcon = function(colour){
    return {
        path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
        fillColor: colour,
        fillOpacity: 1,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
        scale: 0.8
    };
};

var pinSymbol = function (color) {
    return {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        fillColor: color,
        fillOpacity: 5,
        strokeColor: color,
        strokeWeight: 5,
        scale: 5,
    };
};



Template.map.onCreated(function () {

    GoogleMaps.ready('map', function (map) {

        //var groupId = $('#selectGroup').val();

        google.maps.event.addListener(map.instance, 'click', function (event) {

            if (Meteor.user() == null) {
                $('.toast').hide();
                Materialize.toast("Please login first.", 4000);
                return;
            }

            var lat = event.latLng.lat();
            var lng = event.latLng.lng();

            var groupId = $('#selectGroup').val();

            if (groupId == null) {
                $('.toast').hide();
                Materialize.toast("Please select a group to add the markers.", 4000);
                return;
            }

            if (lat == null || lng == null){
                $('.toast').hide();
                Materialize.toast("Please select a valid position on the map.", 4000);
                return;
            }

            Meteor.call('markers.insert', Meteor.user(), groupId, lat, lng);
        });

        var markers = {};
        var infowindow = new google.maps.InfoWindow();
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

        var icon = "person_pin_circle.png";

        var destinations = [];

        $( "#selectGroup" ).change(function() {


            for(var i = 0; i < destinations.length; i++){
                destinations[i].setMap(null);
            }

            groupId = $('#selectGroup').val();

            var des = Groups.findOne({
                _id: groupId
            });

            var destination = new google.maps.Marker({
                draggable: false,
                position: new google.maps.LatLng(des.lat, des.lng),
                map: map.instance,
                id: des._id
            });

            GoogleMaps.maps.map.instance.setCenter(new google.maps.LatLng(des.lat, des.lng));

            destinations.push(destination);
        });

        Tracker.autorun(function () {

            groupId = $('#selectGroup').val();

            Markers.find().observe({


                added: function (document) {

                //groupId = $('#selectGroup').val();



                    var result = Markers.findOne({_id: document._id});
                    var email = result.userid.emails[0].address;
                    var colour = stringToColour(email);

                    var marker = new google.maps.Marker({
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        position: new google.maps.LatLng(document.lat, document.lng),
                        map: map.instance,
                        id: document._id,
                        label: {
                            text: email.charAt(0).toUpperCase(),
                            color: 'white'
                        },
                        icon: circleIcon(stringToColour(email))

                    });

                    google.maps.event.addListener(marker, 'click', function (document) {
                        infowindow.close();
                        var str = "<p>" + email + "</p>";
                        infowindow.setContent(str + "<p>" + result.address + "</p>");
                        infowindow.open(map.instance, marker);

                    });
                    markers[document._id] = marker;

                },

                changed: function (newDocument, oldDocument) {
                    markers[newDocument._id].setPosition({lat: newDocument.lat, lng: newDocument.lng});
                },

                removed: function (oldDocument) {
                    markers[oldDocument._id].setMap(null);
                    google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
                    delete markers[oldDocument._id];
                }
            });

        });
    });
});

Meteor.startup(function () {

});

Template.map.helpers({

    markers: function() {
      return Markers.find({});
    },

    mapOptions: function () {

        if (GoogleMaps.loaded()) {

            var styles = [{
                "featureType": "landscape.man_made",
                "elementType": "geometry",
                "stylers": [{"color": "#f7f1df"}]
            }, {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [{"color": "#d0e3b4"}]
            }, {
                "featureType": "landscape.natural.terrain",
                "elementType": "geometry",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "poi.medical",
                "elementType": "geometry",
                "stylers": [{"color": "#fbd3da"}]
            }, {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{"color": "#bde6ab"}]
            }, {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffe15f"}]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#efd151"}]
            }, {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}]
            }, {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [{"color": "black"}]
            }, {
                "featureType": "transit.station.airport",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#cfb2db"}]
            }, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#a2daf2"}]}];

            return {
                center: new google.maps.LatLng(-37.8136, 144.9631),
                zoom: 15,
                disableDefaultUI: false,
                streetViewControl: false,
                style: styles
            };
        }
    },
});

Template.map.events({
    'click #set-destination'(event){
        event.preventDefault();

        var lat = $('#lat').val();
        var lng = $('#lng').val();

        if (lat.length == 0 || lng.length == 0) {
            Materialize.toast("Please set a destination.", 4000);
            return;
        }
        GoogleMaps.maps.map.instance.setCenter(new google.maps.LatLng(lat, lng));

    },

    'click #clear-destination'(event){
        event.preventDefault();
        $('#form-set-address').val('');
        $('#lat').val('');
        $('#lng').val('');

        //This will find the current destination of the group and remove it.
        Meteor.call('destinations.removeAll');
        Meteor.call('markers.removeAll');
    },

});
