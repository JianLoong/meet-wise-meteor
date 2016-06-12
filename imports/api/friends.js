import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Friends = new Mongo.Collection('friends');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('groups', function markerPublication() {
        return Friends.find();
    });
}

Meteor.methods({
    'get_friends'(current_user){
        
    }

})