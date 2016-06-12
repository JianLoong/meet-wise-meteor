import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Destinations = new Mongo.Collection('destinations');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('destinations', function destinationPublication() {
        return Destinations.find();
    });
}

Meteor.methods({
    'destinations.insert'(lat, lng){
        return Destinations.insert({
            lat: lat,
            lng: lng
        });
    },

    'destinations.remove'(id){
        Destinations.remove({
            _id: id
        });
    },

    'destinations.removeAll'(){
        Destinations.remove({});
    },

    'destinations.update'(id, lat, lng){
        Destinations.update(id, {
            $set: {
                lat: lat,
                lng: lng
            }
        });
    }

});
