/**
 * socket would refer on client side
 */
var connected = false;

const socket = io('http://localhost:5000/');

//console.log(userLoggedIn);

var session = JSON.parse($(".local_data").val());
//console.log(localObj.first_name);

socket.emit("setup", session);

socket.on("connected", () => connected = true);

