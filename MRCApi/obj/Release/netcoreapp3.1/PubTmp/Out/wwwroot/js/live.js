"use strict";
var connection = new signalR.HubConnectionBuilder().withUrl("/LiveHub").build();
//Disable send button until connection is establishe
connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " Ngày mai " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});
connection.start().then(function () {
    console.log("started client");
}).catch(function (err) {
    return console.error(err.toString());
});
function sendAll() {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
}
function sendbyuser(userid) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendPrivateMessage", userid, user, message).catch(function (err) {
        return console.error(err.toString());
    });
}