/**
 * Global Variable
 */
var selectedUsers = [];

var selectedUserID = [];

/**
 * Search user in new message page
 */
$("#userSearchTextbox").keyup(event => {
    var searchValue = $(event.target);
    var searchString = searchValue.val().trim();

    //console.log(searchString);
    
    if(searchString == ''){
        $(".resultsContainer").html("");
        // remove user from selection
        selectedUsers.pop();
        selectedUserID.pop();

        /*-------Remove Selected user from textbox-----------*/
    }

    /*---type atleat 2 charchater---*/
    if(searchString.length >= 2){
        searchUsers(searchString);
    }
    
    var submitButton = $("#createChatButton");

    if (searchString == "") {
        submitButton.prop("disabled", true);
        return;
    }
});

function searchUsers(searchTerm) {
    $.get("/user/search", { search: searchTerm }, results => {
        OutputSearchableUser(results, $(".resultsContainer"));
    })
}

function OutputSearchableUser(users,container){
    
    users.forEach(result => {
        /*--------Dont display own profile in search result and remove duplicay----*/    
        if(selectedUsers.some(u => u._id == result._id)) {
            return;
        }

        /*---------Push the selected user's in selecteduser array-----------*/
        container.html();

        var html = displayFoundUsers(result);
        var element = $(html);
        element.click(e => {
            alert("user select event fire");
            console.log("user select event fire..");
            Userselected(result);
        }); 

        //element.click(() => Userselected(result))

        container.append(element);
    });

    
}

function  displayFoundUsers(userData) {

    return `<div class="user" style="cursor: pointer;">
            <div class="userImageContainer">
                <img src="${userData.pofile_pic}">
            </div>
            <div class="userDetailsContainer">
                <div class="header">${userData.first_name} ${userData.last_name}
                    <span class="username">@${userData.username}</span>
                </div>
            </div>
        </div>`
}

function Userselected(users){
    selectedUsers.push(users);
    UpdatedSelectedUserHtml();
    //$(".resultsContainer").html("");
    $("#userSearchTextbox").val("").focus();

    var submitButton = $("#createChatButton");
    submitButton.prop("disabled", false);

}

function UpdatedSelectedUserHtml(){
    var elements = [];

    console.log(selectedUsers,'Selected user array');
    selectedUsers.forEach(user => {
        var name = user.first_name + " " + user.last_name;
        var userElement = $(`<span class='selectedUser' data-id=${user._id}>${name}</span>`);
        elements.push(userElement);

        selectedUserID.push(user._id);

        console.log(selectedUserID);

        //GetSelectedUserID(selectedChatUsers);

    });

    $(".selectedUser").remove();
    $("#selectedUsers").prepend(elements);
}


function GetSelectedUserID(selectableUserID){
    JSON.stringify(selectableUserID);
}

$("#createChatButton").click(() => {
    alert("hello");
    
    var data = JSON.stringify(selectedUsers);

    console.log(data);
    //return false;

    /*-----Ajax Request to save the Post-----*/
    $.post("/chat/create", { users: data }, (response, status, xhr) => {
        console.log(response);
        /* if(status =='success' && xhr.status ==200){
            console.log("inside");
        } */
        if(response._id){
            window.location.href = `/chat/${response._id}`;
        } else {
            toastr.fail('No Response from Server');
        }
    })
});

/**
 * Send Message event Handler
 */
$(".sendMessageButton").click((e) => {

    var message = $('textarea.inputTextbox').val();

    var ChatID = $(".chatContainer").data("room");

    if(!message || !ChatID){
        sendMessages(message,ChatID);
    }
});


$(document).keydown(function(event){
    var message = $('textarea.inputTextbox').val().trim();
    var ChatID = $(".chatContainer").data("room");

    var session = JSON.parse($(".local_data").val());

    //Emit Typing event to the server
    var emitData ={ user: session.first_name, message: "is typing" ,ChatID:ChatID, profile:session.pofile_pic}
    socket.emit("typing", emitData);

    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        if(!message=='' || !ChatID==''){
            sendMessages(message,ChatID);

            /*-----Emit messese event to server------*/
            var msg_emitting_data = {message:message,ChatID:ChatID}
            socket.emit('message', msg_emitting_data);
        }
        return false;	
    }
});

$(document).keyup(function(event){
    var ChatID = $(".chatContainer").data("room");

    setTimeout(function(){
        //Emit stop Typing event to the server
        socket.emit("stopTyping", ChatID);
     }, 2000); 
});

$(document).ready(function(){
    var ChatID = $(".chatContainer").data("room");
    console.log(ChatID);

    /*------Emit an Event when user join the chat-----------*/
    socket.emit("JoinChat", ChatID);

    /*------Listner of Typing Event emit by server---------*/
    socket.on('notifyTyping',data => {
        $(".typingDots").show();
        var typing_string =  `<p class="typing"><img src="${data.profile}"> ${data.user}  ${data.message} <img src="/images/dots.gif" alt="Typing dots" /></p>`;
        $(".typingDots").html(typing_string);    
    });

    /*------Listner of Typing Event emit by server---------*/
    socket.on('notifyStopTyping',() => {
        $(".typingDots").hide();
        $(".typingDots").html();    
    });

    // Recieve from server messages 
    socket.on('message', (msg) => {
        //appendMessage(msg, 'incoming');

        console.log("message reciver event on client side::"+ msg.message);

        var outhtml = CreateMessageHtml(msg,'theirs');

        var container = $(".chatMessages");
        DisplayMessage(outhtml,container);

       // scrollToBottom();
    });


}); 
/**
 * Message
 */
function sendMessages(message,chatID){

    if(message !=''){

        $.post("/message/send", { message: message,chatID:chatID}, results => {

            /*------Check if Message saved succssfully-----*/

            var outhtml = CreateMessageHtml(results,'mine');

            var container = $(".chatMessages");
            DisplayMessage(outhtml,container);

            $('textarea.inputTextbox').val('');
        });
    }
}

function CreateMessageHtml(response,msg_type) {

    //var timestamp = timeDifference(new Date(), new Date(response.createdAt)); 
    
    return `<li class="message ${msg_type} first">
                <div class="messageContainer">
                 <span class="messageBody">${response.message}</span>
                </div>
            </li>`;
}

function DisplayMessage(outhtml,container) {
    
    container.append(outhtml);
}

/**
 * Load Previous Messages in a chat
 */
function LoadMessages(chatID) {
    alert("helo");
    
    $.get("/message/load", {chatID:'5ffdd6f0ed536026a816f1a9' }, (results) => {

        /*------Check if Message saved succssfully-----*/
        
        //var outhtml = DispalyPreviousChat(results);

        DispalyPreviousChat(results,$(".chatMessages"))

        //$(".chatMessages").html(outhtml);
        //DisplayMessage(outhtml,container);

        //$('textarea.inputTextbox').val('');
    });
}

function DispalyPreviousChat(chatData,container){

    chatData.forEach(result => { 

        var html = PreviousChatHtml(result);
        var element = $(html);
        container.append(element);
    });
}

function PreviousChatHtml(results) {
    
    return `<li class="message theirs first">
                <div class="imageContainer"></div>
                <div class="messageContainer">
                    <span class="senderName">Sender Name</span>
                    <span class="messageBody">${results.message}</span>
                </div>
            </li>
            <li class="message mine">
                <div class="messageContainer">
                 <span class="messageBody">${results.message}</span>
                </div>
            </li>`;
}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now";
        
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}






