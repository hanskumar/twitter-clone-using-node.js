const router = require("express").Router();
const checkAuth = require("../middlewares/checkAuth");

const AuthController    = require("../controllers/AuthController");
const PostController    = require("../controllers/PostController");
const ProfileController = require("../controllers/ProfileController");

const MessageController = require("../controllers/MessageController");

/* const multer           = require('multer');
const upload           = multer({ dest: "../uploads" });
 */

const multerupload = require("../config/upload_profile_image");



router.get("/", checkAuth,AuthController.home);  //home page

router.post("/login", AuthController.login);  //Post Login

router.get("/login", AuthController.index);  // Get Login

router.get("/register", AuthController.register);  // Get register

router.post("/register", AuthController.PostRegister);  // Get register

router.get("/logout", checkAuth,AuthController.logout);  

/**
 * POST Routes
*/
router.post("/post/save", PostController.save);  

router.get("/post/get", PostController.getPost);  



/**
 * Profile Routes
*/
router.get("/profile/:username", checkAuth,ProfileController.profile);  

//router.get("/post/get", PostController.getPost);  

router.post("/upload_profileImage", checkAuth,multerupload.upload,ProfileController.upload_profileImage); 

router.post("/upload_coverPhoto", checkAuth,multerupload.upload,ProfileController.upload_coverPhoto); 

router.get("/uploads/:path", ProfileController.GetImagePath); 


/**
 * Message Routes
 */
router.get("/messages",checkAuth, MessageController.Getmessages); 

router.get("/messages/new", checkAuth,MessageController.NewMessage); 

router.get("/user/search", checkAuth,MessageController.UserSearch); 

router.post("/chat/create", checkAuth,MessageController.createChat); 

router.get("/chat/:chatId",checkAuth, MessageController.InitiateChat); 

router.post("/message/send",checkAuth, MessageController.SaveMessage); 

router.get("/message/load",checkAuth, MessageController.LoadMessages); 

router.get("/test", MessageController.test); 

module.exports = router;