import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Markers = new Mongo.Collection('markers');


if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('markers', function markerPublication() {
        return Markers.find();
    });

    var geo = new GeoCoder({
        httpAdapter: "https",
        apiKey: 'AIzaSyDslRnnzBLry5hp0VWs39EkserC9tyemX0 '
    });


    Meteor.methods({
        'markers.insert'(userid, lat, lng){

            if (! Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }

            try {
                var result = geo.reverse(lat, lng);
                Markers.insert({
                    userid: userid,
                    lat: lat,
                    lng: lng,
                    address: result[0].formattedAddress
                });

            }catch(e){
                console.log(e);
                Markers.insert({
                    lat: lat,
                    lng: lng,
                    address: "No address."
                })
            }
        },

        'markers.findAll'(){

            return Markers.find({});

        },

        'users.find'(id){

            var result = Meteor.User.find({
                _id: id
            }).fetch();

            console.log(result);
        },

        'markers.find'(id){

            var result = Markers.find({
                _id: id
            }).fetch();

            // console.log(result);
            //
            // var userEmail = Meteor.user().find({
            //     _id: id
            // }).fetch();
            //
            // console.log(userEmail);

            return result;
        },

        'markers.remove'(id){
            Markers.remove({
                _id: id
            });
        },

        'markers.removeAll'(){
            Markers.remove({});
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