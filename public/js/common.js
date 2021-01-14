/**
 * Global Variable
 */
var cropper ='';

$("#postTextarea").keyup(event => {
    var textbox = $(event.target);
    var value = textbox.val().trim();
    
    var submitButton = $("#submitPostButton");

    if(submitButton.length == 0) return alert("No submit button found");

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
});

$("#submitPostButton").click(() => {
    var button = $(event.target);
    var textbox = $("#postTextarea");

    var data = {
        content: textbox.val()
    }

    /*-----Ajax Request to save the Post-----*/
    $.post("/post/save", data, (response, status, xhr) => {
        console.log(xhr.status);
        if(status =='success' && xhr.status ==201){
            console.log("inside");
            var timestamp = timeDifference(new Date(), new Date(response.createdAt));

            var html = `<div class='post'>
                            <div class='mainContentContainer'>
                            <div class='userImageContainer'>
                                <img src='${response.postedBy.pofile_pic}'>
                            </div>
                            <div class='postContentContainer'>
                                <div class='header'>
                                    <a href='/profile/${response.postedBy.username}' class='displayName'>${response.postedBy.first_name} ${response.postedBy.last_name}</a>
                                    <span class='username'>@${response.postedBy.username}</span>
                                    <span class='date'>${timestamp}</span>
                                </div>
                                <div class='postBody'>
                                    <span>${response.content}</span>
                                </div>
                                <div class='postFooter'>
                                    <div class='postButtonContainer'>
                                        <button>
                                            <i class='far fa-comment'></i>
                                        </button>
                                    </div>
                                    <div class='postButtonContainer'>
                                        <button>
                                            <i class='fas fa-retweet'></i>
                                        </button>
                                    </div>
                                    <div class='postButtonContainer'>
                                        <button>
                                            <i class='far fa-heart'></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);

        }
    })
});

/**
 * Profile photo upload event
 */

$("#filePhoto").change(function() {
    console.log("clicked");
    readURL(this);
});

function readURL(input) {

    if (input.files && input.files[0]) {
      var reader = new FileReader();

      $('#imageUploadModal').modal('show');
      
      reader.onload = function(e) {
        //console.log( e.target.result);
        $('#imagePreview').attr('src', e.target.result);

        var imagePreview = document.getElementById("imagePreview");
        var imageSrc = e.target.result;

        cropper = new Cropper(imagePreview,{
            aspectRatio: 1 / 1,
            background: false
        });

      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    } else {
        console.log("nope");
    }
}


$("#imageUploadButton").click(() => {
    
    // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`.
    // The default value for the second parameter of `toBlob` is 'image/png', change it if necessary.
    cropper.getCroppedCanvas().toBlob((blob) => {

        const formData = new FormData();
    
        // Pass the image file name as the third parameter if necessary.
        formData.append('croppedImage', blob/*, 'example.png' */);
    
        // Use `jQuery.ajax` method for example
        $.ajax('/upload_profileImage', {
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success() {
                console.log('Upload success');
                location.reload()
            },
            error() {
                console.log('Upload error');
            },
        });
    }/*, 'image/png' */);

});

/**
 * Cover photo upload
 */

$("#coverphoto").change(function() {
    console.log("clicked");
    readURLCoverPhoto(this);
});

function readURLCoverPhoto(input) {

    if (input.files && input.files[0]) {
      var reader = new FileReader();

      $('#coverPhotoUploadModal').modal('show');
      
      reader.onload = function(e) {
        //console.log( e.target.result);
        $('#coverPreview').attr('src', e.target.result);

        var imagePreview = document.getElementById("coverPreview");
        var imageSrc = e.target.result;

        cropper = new Cropper(imagePreview,{
            aspectRatio: 1 / 1,
            background: false
        });
      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    } else {
        console.log("nope");
    }
}


$("#coverPhotoButton").click(() => {
    
    // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`.
    // The default value for the second parameter of `toBlob` is 'image/png', change it if necessary.
    cropper.getCroppedCanvas().toBlob((blob) => {

        const formData = new FormData();
    
        // Pass the image file name as the third parameter if necessary.
        formData.append('croppedImage', blob/*, 'example.png' */);
    
        // Use `jQuery.ajax` method for example
        $.ajax('/upload_coverPhoto', {
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success() {
                console.log('Upload success');
                location.reload()
            },
            error() {
                console.log('Upload error');
            },
        });
    }/*, 'image/png' */);

});


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



