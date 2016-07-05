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
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }
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
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }
            return Groups.find({
                _id: groupId
            })
        },

        'groups.update.addUser'(id, user){
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }
            Groups.update(
                {_id: id},
                {$push: {users: user}}
            )
        },

        'groups.remove'(id){
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }
            Groups.remove({
                _id: id
            })
        },

        'groups.update'(id, destination){
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }
            Groups.update(id, {
                $set: {
                    destination: destination
                }
            });
        },

        //This meteor call removes a user from a group.
        'member.remove'(groupId, userId){
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }
            
            Groups.update(
                {
                    _id: groupId,
                    createdBy: { $ne: userId }
                },

                { $pull:
                    { users: { "userId": userId }
                    }
                });
        },

        //This method adds a user based on email to the group.
        'member.add'(email, groupId){
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }
            var user = Meteor.users.findOne({"emails.address": email});

            if (typeof user === "undefined") {
                throw new Meteor.Error('Email is not registered.');
            }


            var userId = user._id;
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
