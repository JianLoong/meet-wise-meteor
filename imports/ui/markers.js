import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Markers} from '../api/markers.js';
import {Destinations} from '../api/destinations.js';

import './map.html';

function pinSymbol(color) {
    return {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        fillColor: color,
        fillOpacity: 5,
        strokeColor: color,
        strokeWeight: 5,
        scale: 5,
    };
}

var stringToColour = function (str) {

    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    console.log(colour);

    return colour;
}



Template.map.onCreated(function () {


    GoogleMaps.ready('map', function (map) {


        //map.instance.setOptions({styles: styles});

        $("#form-set-address").geocomplete({details: "form"});

        google.maps.event.addListener(map.instance, 'click', function (event) {
            if (Meteor.user() == null) {
                Materialize.toast("Please login first.", 4000);
                return;
            }

            var userId = Meteor.user().emails[0].address;
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            Meteor.call('markers.insert', userId, lat, lng);
        });

        var markers = {};
        var infowindow = new google.maps.InfoWindow();
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

        Markers.find().observe({

            added: function (document) {

                Meteor.call('markers.find', document._id, function (error, result) {
                    if (error) {
                        Materialize.toast("Error encountered while finding markers.")
                    }
                    else {

                        var colour = stringToColour(result[0].userid);

                        console.log(colour);

                        var marker = new google.maps.Marker({
                            draggable: true,
                            animation: google.maps.Animation.DROP,
                            position: new google.maps.LatLng(document.lat, document.lng),
                            map: map.instance,
                            id: document._id,
                            draggable: false,
                            icon: pinSymbol(colour),

                        });

                        google.maps.event.addListener(marker, 'click', function (document) {
                            infowindow.close();
                            var str = "<p>" + result[0].userid + "</p>";
                            infowindow.setContent(str + "<p>" + result[0].address + "</p>");
                            infowindow.open(map.instance, marker);

                        });
                        markers[document._id] = marker;

                    }
                });
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

        Destinations.find().observe({

            added: function (document) {
                var marker = new google.maps.Marker({
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(document.lat, document.lng),
                    map: map.instance,
                    id: document._id,
                    icon: iconBase + 'schools_maps.png'
                });

                google.maps.event.addListener(marker, 'dragend', function (event) {
                    Markers.update(marker.id, {$set: {lat: event.latLng.lat(), lng: event.latLng.lng()}});
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

Meteor.startup(function () {
    GoogleMaps.load({
        libraries: 'places'  // also accepts an array if you need more than one
    });
});

Template.map.helpers({

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
                zoom: 11,
                disableDefaultUI: true,
                styles: styles
            };
        }
    },
    markers(){
        //return Meteor.call('markers.findAll',);
        return Markers.find({});
    }
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

        Meteor.call('destinations.removeAll');

        Meteor.call('destinations.insert', lat, lng, function (error, result) {

        });
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
    }
});

