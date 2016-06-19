import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Groups = new Mongo.Collection('groups');

if (Meteor.isServer) {
    Meteor.publish('groups', function groupPublication() {
        return Groups.find({
            "users.userId": this.userId
        });
    });

    Meteor.methods({
        'groups.insert'(groupName, destinationLat, destinationLong, address, createdAt, users){
            return Groups.insert({
                groupName: groupName,
                lat: destinationLat,
                lng: destinationLong,
                createdAt: createdAt,
                createdBy: this.userId,
                address: address,
                users: users
            });
        },

        'groups.find'(groupId){
            return Groups.find({
                _id: groupId
            })
        },

        'groups.update.addUser'(id, user){
            Groups.update(
                {_id: id},
                {$push: {users: user}}
            )
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
        },

        'member.add'(email, groupId){
            var user = Meteor.users.findOne({"emails.address": email});

            if (typeof user === "undefined") {
                throw new Meteor.Error('Email is not registered.');
            };


            var userId = user._id;
            var email = user.emails[0].address;
            var groupId = groupId;

            var u = new User(userId, email, "false");
            var flag = Groups.findOne({ _id : groupId, "users.userId": userId});

            if (typeof flag === "undefined") {
                Groups.update(
                    {_id: groupId},
                    {$push: {users: u}}
                )
            }else{
                throw new Meteor.Error('Email exist in the group.');
            }

        }
    });
}
