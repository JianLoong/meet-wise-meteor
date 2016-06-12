/**
 * Created by Jian on 12/06/2016.
 */

import './user.html';

Template.user.helpers({
    address: function() {
        return Meteor.user().emails[0].address;
    }
});