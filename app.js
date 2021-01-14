/**
 * Load Module dependencies.
 */
require("dotenv").config();

const express       = require('express')
const app           = express();
const path          = require('path');
const dotenv        = require('dotenv');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const session       = require('express-session');
const ejs           = require('ejs');
const flash         = require('connect-flash');
const toastr        = require("express-toastr");
const multer        = require('multer');

//const passport      = require("passport");

require("./config/dbConnect")();

/**
 * Set View Engine
 */
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));


app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid', 
    secret: "etewtekeyboard564564", 
    resave: true, 
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 *24 } //24 hours
}));

//-----Passport Config---------
/* require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session()) */

app.use(flash(app));
app.use(toastr());

app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {

    res.locals.session    = req.session.user || '';

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg  = req.flash('error_msg');
    next();
});

/**
 * Define All Routes Here
 */
app.use('/',require('./routes/routes'));

/**
 * Socket Programing Code start Here
*/

const server = app.listen(process.env.PORT,()=>{
    console.log(`Listening on port ${process.env.PORT}.`);
});

const io = require('socket.io')(server);

io.on("connection",(socket)=>{

    console.log('connection with socket.io, completed');

    /*-------Event Listner when someone join the chat------------*/
    socket.on("setup", userData => {
        socket.join(userData._id);
        socket.emit("connected");
        console.log("user logged In "+ userData.first_name);
    });

    /*------Listner when user join the chat----------*/    
    socket.on("JoinChat", chatroom => {
        console.log("user join the chat "+chatroom);
        socket.join(chatroom)
        
    });


    //Someone is typing Listner
    socket.on("typing", chatRoomData => { 
        //console.log("Chat IDD"+chatRoomData.ChatID);
        /*-----Emit typing event to client in specific room--------*/
        socket.in(chatRoomData.ChatID).emit("notifyTyping",chatRoomData);
    }); 

    //Someone is Stoptyping Listner
    socket.on("stopTyping", chatRoom => { 
        //console.log("Chat IDD"+chatRoomData.ChatID);
        /*-----Emit typing event to client in specific room--------*/
        socket.in(chatRoom).emit("notifyStopTyping","");
    }); 

    //---Listner    
    socket.on('message', (MsgData) => {
        console.log(`msg : ${MsgData.message}`);
        socket.in(MsgData.ChatID).emit("message",MsgData);
    });


});

module.exports = app;
