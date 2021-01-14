/**
 * Load models Here
 */
const User         = require('../models/UserModel');
const Chat         = require('../models/ChatModel');
const Message      = require('../models/MessageModel');


const mongoose = require("mongoose");
const path     = require('path');
var helper     = require('../helpers/helper');

const fs     = require('fs');


exports.Getmessages = async (req, res) => {

    /*-------------Get all the Chats Here-----------*/

    var allChats = await Chat.find({users: { $elemMatch: { $eq: req.session.user._id } } })
    .populate("users");

    let payload = {
        title:'Messages',
        data:allChats,
        helper:helper
    }

    //res.send(allChats);

    res.status(200).render('messages',payload);
}


exports.NewMessage = async (req, res) => {
    res.render('new_message', { title: 'Not Found Page' });
}

exports.UserSearch = async (req, res) => {

    //console.log(req.query.search);
    /*------Get User By search key------*/

    if(req.query.search){

        var searchQuery={};
        //searchQuery.first_name = req.query.email;
        searchQuery.first_name = {$regex: req.query.search, $options: 'i'};     

        let result = await User.find(searchQuery) //like 'pa%'  {'name': {'$regex': 'sometext'}}

        res.send(result);
    }
}

/**
 *  Create a chat with selected users
 */
exports.createChat = async (req, res) => {

       //res.send(req.body.content);

        if(!req.body.users){
            console.log('fields requirred');
            res.sendStatus(400);
        }

        var users = JSON.parse(req.body.users);

        //res.send(UsersmongoID);

        if(users.length > 1){
            var isGroupChat = true;
        } else {
            var isGroupChat = false;
        }
        users.push(req.session.user);

        let postData = {
            isGroupChat:isGroupChat,
            users: users,
            chatName:'Dummy'
        }

        Chat.create(postData)
        .then(async chatdata => {
            res.status(200).send(chatdata);
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
}


exports.InitiateChat = async (req, res,next) => {

    //console.log(req.params);
    let chatID = req.params.chatId;
    
    /*-----------Check wther chatId is valid mongo Object ID/ and check from db also-----*/

    let IsValid = mongoose.isValidObjectId(chatID);
    if(!IsValid){
        res.render('404', { title: 'Something went wrong,Please try again' });
    }

    var chat = await Chat.findOne({ _id: chatID, users: { $elemMatch: { $eq: req.session.user._id } } })
    .populate("users");

    ///res.send(chat);

    if(chat){

        var message = await Message.find({ chat: chatID}).populate("sender");
        var payload = {
            title:'Chat Page',
            data:chat,
            message:message
        }

        //console.log(message);

        res.render('initiatechat', payload);
    } else {
        res.status(400).render('404', { title: 'Something went wrong,Please try again' });
    }
}

/**
 * Save Message in db
*/

exports.SaveMessage = async (req, res,next) => {

    const {message,chatID} = req.body;

    if(!message || !chatID){
        res.status(400).send('Somthing Went Wrong');
    }
    
    /*-----------Check wther chatId is valid mongo Object ID/ and check from db also-----*/

    let IsValid = mongoose.isValidObjectId(chatID);
    if(!IsValid){
        res.send('404', { message: 'Something went wrong,Please try again' });
    }

    var chat = await Chat.findOne({ _id: chatID, users: { $elemMatch: { $eq: req.session.user._id } } });

    //res.send(chat);

    if(chat){

        let postData = {
            readby:[],
            sender: req.session.user._id,
            //receiver: chat.users._id,
            message: message,
            chat:chatID
        }

        Message.create(postData)
        .then(async newMessageData => {
            newMessageData = await User.populate(postData, { path: "sender" })

            res.status(201).send(newMessageData);
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })

    } else {
        res.status(400).render('404', { title: 'Something went wrong,Please try again' });
    }
}

/**
 * Load Previous Messages in a Chat
 */
exports.LoadMessages = async (req, res,next) => {

   /*  const {chatID} = req.body;

    if(!chatID){
        res.status(400).send('ChatID Should be Mandatory');
    } */
    
    const chatID = '5ffdd6f0ed536026a816f1a9';

    /*-----------Check wther chatId is valid mongo Object ID/ and check from db also-----*/
    let IsValid = mongoose.isValidObjectId(chatID);
    if(!IsValid){
        res.status(400).send('Something went wrong,Please try again');
    }

    var chat = await Message.find({ chat: chatID});

    if(chat){

        console.log(chat);

        res.status(200).send(chat);


    } else {

        res.status(400).send('Something went wrong,Please try again');
    }
}


exports.test = (req,res)=>{
    
        res.writeHead(200, {'Content-Type': 'audio/mp3'});
        let opStream = fs.createReadStream('public/images/done-for-you-612.mp3');
        opStream.pipe(res);
   
}