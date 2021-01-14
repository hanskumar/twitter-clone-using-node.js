/**
 * Load models Here
 */
//const passport     = require("passport");
const bcrypt       = require('bcrypt');
const User         = require('../models/UserModel');
const auth         = require('../middlewares/checkAuth');

const Post         = require('../models/PostModel');

var helper = require('../helpers/helper');

exports.index = (req, res) => {
    res.render('login', { title: 'Index Page' });
}

exports.register = (req, res) => {
    res.render('register', { title: 'Index Page' });
}

exports.PostRegister = async (req, res) => {
   
    const { first_name,last_name,username,email,password,passwordConf,phone } = req.body;

    if(!first_name || !last_name || !username || !email || !password || !passwordConf){
        req.flash('error_msg', 'All filed are Required!');
        res.redirect('/register') 
    }

    var payload = req.body;

    const user = await User.findOne({$or: [
        { 'username': username },
        { 'email': email }
      ]});

    try{

        //----- If User found then give error message--------------//
        if (!user) {

            /*--------------Register User---------------------*/
            let postData = {first_name,last_name,username,email,phone,password}

            User.create(postData)
                .then(newUser => {

                    req.session.isLoggedIn = true;    
                    req.session.user = newUser;

                    var payload = {
                        title: "Home",
                        session: req.session.user
                    }

                    res.redirect('/')
                })
                .catch(error => {
                    console.log(error);
                    req.flash('error_msg', 'Something went wrong Please Try Again!');
                    res.redirect('back')
                })
        

        } else {
            //throw "Invalid Login Crediantioals"
            req.flash('error_msg', 'User Already exist with given username or Email');
            res.redirect('back')
        }

    } catch (err) {
        console.log(err);
        res.redirect('back')
    }
} 


/**
 * User Login POST
 */
exports.login = async (req, res) => {
   
    const { username, password } = req.body;

    if(!username || !password){
        req.flash('error_msg', 'All filed are Required!');
        res.redirect('back') 
    }

    const user = await User.findOne({
        username,
        password: password,
    });

    try{

        //----- If User found then login--------------//
        if (user) {

            req.session.isLoggedIn = true;    
            req.session.user = user;

            var payload = {
                title: "Home",
                session: req.session.user
            }

            res.redirect('/')
        
            //res.status(200).render("home", payload);

        } else {
            //throw "Invalid Login Crediantioals"
            console.log("Invalid Login Crediantioals");
            res.redirect('/');
        }

    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
} 


exports.logout = (req, res) => {

    req.session.destroy(function(err){
        res.redirect('/');
    });
}


exports.home = async (req, res) => {

    /*------Get Post from LoggedIn User--------*/
   let posts = await Post.find().sort({createdAt: -1}).populate("postedBy");
   //res.send(posts);
   
    try{
        var payload = {
            title: "Home",
            session: req.session.user,
            data: posts,
            helper:helper
        }

    } catch(err){

        var payload = {
            title: "Home",
            session: req.session.user,
            data: [],
            helper:helper
        }
    }
    
    res.render('home', payload);
}