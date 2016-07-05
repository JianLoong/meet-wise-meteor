import '../api/user.js';
import './removeMember.html';

import {Groups}  from '../api/groups.js';

Template.removeMember.events({
   'click #removeMember'(event){

       var groupId = $('#selectGroup').val();

       var result = Groups.find({
           _id: groupId,
           createdBy: this.userId
       }).fetch();

       if(result.length != 0){
           $('.toast').hide();
           Materialize.toast("You created this group!", 4000);
           return;
       }
    
       Meteor.call('member.remove', groupId, this.userId, function(result, error){
            if(error){

            }else{
                $('.toast').hide();
                Materialize.toast("Member removed successfully.", 4000);
            }
       });

   }
});
