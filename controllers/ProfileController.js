/**
 * Load models Here
 */
const User         = require('../models/UserModel');
const Post         = require('../models/PostModel');

const path          = require('path');

var helper = require('../helpers/helper');

//const multer       = require('multer');



exports.profile = async (req, res) => {

    /*-------Check if query Params is same as logged in user ------*/
    if(req.params.username){
        
        if(req.params.username == req.session.user.username){

            let posts = await Post.find({postedBy:req.session.user._id}).sort({createdAt: -1}).populate("postedBy");

            var payload = {
                title: "Profile",
                data: posts,
                helper:helper
            }

            res.render('profile', payload);
        } else {
            res.send("not working");
        }
    } else {
        res.render('404', { title: 'Not Found Page' });
    }

    
    
}


/**
 * save Post
 */
exports.save = async (req, res) => {

    if(!req.body.content){
        res.status(400).send('false');
    }

    let postData = {
        content: req.body.content,
        postedBy: req.session.user
    }

    Post.create(postData)
    .then(async newPost => {
        newPost = await User.populate(newPost, { path: "postedBy" })

        res.status(201).send(newPost);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
} 


/**
 * Upload profile image on server
 */
exports.upload_profileImage = async (req, res,next) => {

    if(!req.file){
        console.log(req.file.croppedImage);
        res.status(400).send('uououiuouo');
    }
    
    var file_path = `/uploads/${req.file.filename}`;

    req.session.user = await User.findByIdAndUpdate(req.session.user._id, { pofile_pic: file_path}, { new: true });
    res.sendStatus(204);  // Success but given no content

   
} 


/**
 * Upload profile image on server
 */
exports.upload_coverPhoto = async (req, res,next) => {

    if(!req.file){
        console.log(req.file.croppedImage);
        res.status(400).send('uououiuouo');
    }
    
    var file_path = `/uploads/${req.file.filename}`;

    req.session.user = await User.findByIdAndUpdate(req.session.user._id, { cover_photo: file_path}, { new: true });
    res.sendStatus(204);  // Success but given no content

   
} 

exports.GetImagePath = (req,res) => {
    res.sendFile(path.join(__dirname, "../uploads/" + req.params.path));
}