/**
 * Created by Jian on 12/06/2016.
 */

import {Markers} from '../api/markers.js';

import './user.html';

Template.userLocations.helpers({
    markers(){
        return Markers.find({});
    }
});

Template.userLocations.events({
    'click .remove-marker'(event){
        event.preventDefault();
        Meteor.call("markers.remove", this._id);
    },

    'click .jumpMarker'(event){
        event.preventDefault();

        GoogleMaps.maps.map.instance.setCenter(new google.maps.LatLng(this.lat, this.lng));
    },

    'click .removeMarker'(event){
        event.preventDefault();
        Meteor.call("markers.remove", this._id);
    },
})
