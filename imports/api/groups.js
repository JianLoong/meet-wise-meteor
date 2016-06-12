import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Groups = new Mongo.Collection('groups');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('groups', function markerPublication() {
        return Groups.find();
    });
}

Meteor.methods({
    'groups.insert'(id, name, group_type, country_code, updated_at, members, destination){
        Groups.insert({
            name: name,
            group_type: group_type,
            country_code: country_code,
            updated_at: updated_at,
            members: members,
            destination: destination
        });
    },

    'groups.remove'(id){
        Groups.remove({
            _id: id
        })
    },

    'groups.update'(id, destination){
        Groups.update(id, {
            $set: {
                destination: destination
            }
        });
    }
});
