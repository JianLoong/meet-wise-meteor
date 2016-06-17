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
