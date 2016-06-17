import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Markers = new Mongo.Collection('markers');

import {Groups} from '../api/groups.js';

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('markers', function markerPublication() {

        return Markers.find({
                // "userid._id": this.userId
            }
        )
    });

    Meteor.publish('groupMarkers', function groupMarkersPublication(groupId){
        
        return Markers.find({
            groupId : groupId
        })
    });

    var geo = new GeoCoder({
        httpAdapter: "https",
        apiKey: 'AIzaSyDslRnnzBLry5hp0VWs39EkserC9tyemX0 '
    });

    Meteor.methods({
        'markers.insert'(userid, groupId, lat, lng){

            if (!Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                var result = geo.reverse(lat, lng);
                Markers.insert({
                    userid: userid,
                    groupId: groupId,
                    lat: lat,
                    lng: lng,
                    address: result[0].formattedAddress
                });
            } catch (e) {
                Markers.insert({
                    userid: userid,
                    groupId: groupId,
                    lat: lat,
                    lng: lng,
                    address: "No address."
                })
            }
        },

        'markers.findAll'(){
            return Markers.find({});
        },

        'markers.find'(id){
            var result = Markers.find({
                _id: id
            }).fetch();
            return result;
        },

        'markers.remove'(id){
            Markers.remove({
                _id: id
            });
        },

        'markers.updateAddress'(id, address){
            Markers.update(id, {
                $set: {
                    address: address
                }
            })
        },

        'markers.update'(id, lat, lng){

            var result = geo.reverse(lat, lng);

            Markers.update(id, {
                $set: {
                    lat: lat,
                    lng: lng,
                    address: result[0].formattedAddress
                }
            });
        },

    });
}