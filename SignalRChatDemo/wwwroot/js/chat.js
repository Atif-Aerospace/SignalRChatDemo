"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
//document.getElementById("sendButton").disabled = true;


connection.on("CreateDataObject", function (dataObject_JsonString) {
    let dataObject_Json = JSON.parse(dataObject_JsonString)
    AddDataNode(dataObject_Json);
    console.log('Data Created on Client Side: ' + dataObject_JsonString);
});
connection.on("CreateDataObjects", function (dataObjects_JsonString) {
    let dataObjects_Json = JSON.parse(dataObjects_JsonString)
    for (let i = 0; i < dataObjects_Json.length; i++) {
        let dataObject_Json = dataObjects_Json[i];
        AddDataNode(dataObject_Json);
        let dataObject_JsonString = JSON.stringify(dataObject_Json)
        console.log('Data Created on Client Side: ' + dataObject_JsonString);
    }
});


connection.on("DeleteDataObject", function (dataObject_JsonString) {
    let dataObject_Json = JSON.parse(dataObject_JsonString)
    DeleteDataNode(dataObject_Json);
    console.log('Data Deleted on Client Side: ' + dataObject_JsonString);
});
connection.on("DeleteDataObjects", function (dataObjects_JsonString) {
    let dataObjects_Json = JSON.parse(dataObjects_JsonString)
    for (let i = 0; i < dataObjects_Json.length; i++) {
        let dataObject_Json = dataObjects_Json[i];
        DeleteDataNode(dataObject_Json);
        let dataObject_JsonString = JSON.stringify(dataObject_Json);
        console.log('Data Deleted on Client Side: ' + dataObject_JsonString);
    }
});





connection.on("CreateModelObject", function (modelObject_JsonString) {
    let modelObject_Json = JSON.parse(modelObject_JsonString)
    AddModelNode(modelObject_Json);
    console.log('Model Created on Client Side: ' + modelObject_JsonString);
});


connection.on("CreateWorkflowObject", function (workflowObject_JsonString) {
    let workflowObject_Json = JSON.parse(workflowObject_JsonString)
    AddWorkflowNode(workflowObject_Json);
    console.log('Workflow Created on Client Side: ' + workflowObject_JsonString);
});





connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;
});

connection.start().then(function () {
    //document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

//document.getElementById("sendButton").addEventListener("click", function (event) {
//    var user = document.getElementById("userInput").value;
//    var message = document.getElementById("messageInput").value;
//    connection.invoke("SendMessage", user, message).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});



