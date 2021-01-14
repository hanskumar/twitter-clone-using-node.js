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

function GetParticipiants(loggedInUser,UserData){
    var otherUsers = UserData.filter(user => user._id != loggedInUser);
    var participiant_names = otherUsers.map(userdata => userdata.first_name + " " + userdata.last_name);

    return participiant_names;
}


function ParticipiantsProfileImage(loggedInUser,UserData){
    var otherUsersdata = UserData.filter(user => user._id != loggedInUser);

    
     var output = otherUsersdata.map((userdata) => {
        console.log(userdata.pofile_pic);
          +'<img src='+ userdata.pofile_pic +' alt="User">';
    })

    return output;
}

module.exports = {
    timeDifference: timeDifference,
    GetParticipiants: GetParticipiants,
    ParticipiantsProfileImage:ParticipiantsProfileImage,
}