/**
 * Load models Here
 */
const User         = require('../models/UserModel');
const Post         = require('../models/PostModel');

exports.getPost = (req, res) => {
    res.render('login', { title: 'Index Page' });
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
