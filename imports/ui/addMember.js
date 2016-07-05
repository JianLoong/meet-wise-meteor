/**
 * Created by Jian on 12/06/2016.
 */

import {Groups}  from '../api/groups.js';

import '../api/user.js';
import './addMember.html';

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

Template.addMember.events({
    'click #add'(event){

        event.preventDefault();
        
        var email = $('#email').val();
        var groupId = $('#selectGroup').val();

        if(validateEmail(email) == false || email.length == 0){
            $('.toast').hide();
            $('#email').addClass("invalid").val("");
            $("label[for='addMember']").addClass("active").attr("data-error", "Please enter a valid email.");
            Materialize.toast(error.error, 4000);
        }

        if(groupId.length == 0 ){
            $('.toast').hide();
            Materialize.toast("Please select a group.", 4000);
            return;
        }

        Meteor.call("member.add",email, groupId, function(error, result){
            if(error){
                $('.toast').hide();
                $('#email').addClass("invalid").val("");
                $("label[for='addMember']").addClass("active").attr("data-error", error.error);
                Materialize.toast(error.error, 4000);
            }else{
                $('.toast').hide();
                Materialize.toast("Member added successfully.", 4000);
            }
        });

    }
})
