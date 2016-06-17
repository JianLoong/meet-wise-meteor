import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Markers} from '../api/markers.js';

import './map.html';

var stringToColour = function (str) {
    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
}



Template.map.onCreated(function () {

    //Each marker would belong to a group.
    GoogleMaps.ready('map', function (map) {

        //

        google.maps.event.addListener(map.instance, 'click', function (event) {
            if (Meteor.user() == null) {
                Materialize.toast("Please login first.", 4000);
                return;
            }

            //var userId = Meteor.user().emails[0].address;
            //var userid = Meteor.userId();
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();

            var groupId = $('#selectGroup').val();
            if(groupId == null){
                Materialize.toast("Please select a group to add the markers.", 4000);
                return;
            }

            Meteor.call('markers.insert', Meteor.user(), groupId, lat, lng);
        });

        var markers = {};
        var infowindow = new google.maps.InfoWindow();
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';


        Tracker.autorun( function (){
            Markers.find().observe({

                added: function (document) {

                    function pinSymbol(color) {
                        return {
                            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                            fillColor: color,
                            fillOpacity: 5,
                            strokeColor: color,
                            strokeWeight: 5,
                            scale: 5,
                        };
                    };

                    var result = Markers.findOne({_id: document._id});
                    var email = result.userid.emails[0].address;
                    var colour = stringToColour(email);

                    var marker = new google.maps.Marker({
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        position: new google.maps.LatLng(document.lat, document.lng),
                        map: map.instance,
                        id: document._id,
                        icon: pinSymbol(colour)

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

    groupId : function(){
        //Session.set("groupId", )
        //return Session.get($('#selectGroup').val());
    },


    mapOptions: function () {

        if (GoogleMaps.loaded()) {

            var styles = [{
                "featureType": "administrative.land_parcel",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "landscape.man_made",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            }, {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [{"visibility": "simplified"}, {"lightness": 20}]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{"hue": "#f49935"}]
            }, {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [{"visibility": "simplified"}]
            }, {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [{"hue": "#fad959"}]
            }, {
                "featureType": "road.arterial",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [{"visibility": "simplified"}]
            }, {
                "featureType": "road.local",
                "elementType": "labels",
                "stylers": [{"visibility": "simplified"}]
            }, {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"hue": "#a1cdfc"}, {"saturation": 30}, {"lightness": 49}]
            }];

            return {
                center: new google.maps.LatLng(-37.8136, 144.9631),
                zoom: 15,
                disableDefaultUI: true,
                styles: styles
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

    'click .jump-marker'(event){
        GoogleMaps.maps.map.instance.setCenter(new google.maps.LatLng(this.lat, this.lng));
    },

    'click .remove-marker'(event){
        event.preventDefault();
        Meteor.call("markers.remove", this._id);
    },



});
