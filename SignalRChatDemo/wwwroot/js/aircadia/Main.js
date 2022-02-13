﻿////var AirCADiaNebosURI = 'http://127.0.0.1:3001/';
////var CurrentProjectURI = 'http://127.0.0.1:3002/';

var AirCADiaNebosURI = 'https://aircadia.azurewebsites.net/';
var CurrentProjectURI = 'https://aircadiawindturbine.azurewebsites.net/';




























function DownloadData() {

    //var $$ref = $$('mytext');
    //var value = $$ref.getValue();
    //value = "Atif";
    //var msg = "This is the " + value + "of the port";
    msg = "atif,riaz";
    var blob = new Blob([msg.toString()], { type: "application/csv" });
    webix.html.download(blob, "myfile.csv");

}

function SaveData() {
    let dataCollection = [];
    for (let i = 0; i < nebosProject.data.length; i++) {
        let data = nebosProject.data[i];
        dataCollection.push(data);

        

        //if (!projectJson['data'].some(d => d.name == data.name)) {
        //    data2Delete.push(data);
        //}
    }
    let zzz = JSON.stringify(dataCollection);
}

function ImportData() {
    nebosProject.importData();
}






























//==========================================================================================================================
//==================================================Workflow Visualisation==================================================
//==========================================================================================================================
//#region Workflow Visualisation



//<!--<div id="myDiagramDiv" style="width:1500px; height:850px; background-color: #DAE4E4;"></div>-->
var nodeArraye = [];
var linkArraye = [];

function ShowWorkflowGraph() {

    let workflow = nebosProject.workflows[0];

    for (let i = 0; i < workflow.scheduledComponents.length; i++) {
        let executableComponent = workflow.scheduledComponents[i];
        let modelNode = { key: "Model_" + executableComponent.name, text: executableComponent.name, fig: "Rectangle", fill: "lightblue" };
        nodeArraye.push(modelNode);


        for (let j = 0; j < executableComponent.inputs.length; j++) {
            let inputName = executableComponent.inputs[j].name;
            let dataNode = nodeArraye.find(e => e.key === "Data" + inputName);
            if (typeof dataNode === 'undefined') {
                dataNode = { key: "Data" + inputName, text: inputName, fig: "Ellipse", fill: "lightgreen" }
                nodeArraye.push(dataNode);
            }

            linkArraye.push({ from: dataNode.key, to: modelNode.key });
        }


        for (let j = 0; j < executableComponent.outputs.length; j++) {
            let outputName = executableComponent.outputs[j].name;
            let dataNode = nodeArraye.find(e => e.key === "Data" + outputName);
            if (typeof dataNode === 'undefined') {
                dataNode = { key: "Data" + outputName, text: outputName, fig: "Ellipse", fill: "lightpink" }
                nodeArraye.push(dataNode);
            }

            linkArraye.push({ from: modelNode.key, to: dataNode.key });
        }

    }
    let xoni = 0;
    xoni = xoni + 1;

    init();
}






var openFile = function (event) {
    var input = event.target;
    var text = "";
    var reader = new FileReader();
    var onload = function (event) {
        text = reader.result;

        //parseFile(text);

        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(text, "text/xml");

        var modelsRepositoryXML = xmlDoc.getElementsByTagName("ModelRepository")[0].getElementsByTagName("Model");



        var workflowsRepositoryXML = xmlDoc.getElementsByTagName("WorkflowRepository")[0];
        var workflowXML = workflowsRepositoryXML.getElementsByTagName("Workflow")[0];
        var scheduledComponentsXML = workflowXML.getElementsByTagName("ScheduledComponents")[0];
        var workflowElementsXML = scheduledComponentsXML.getElementsByTagName("Model");
        for (let i = 0; i < workflowElementsXML.length; i++) {
            let workflowElementName = workflowElementsXML[i].getAttribute('Name');
            // get "model xml" from the "ModelRepository"
            var modelXML;
            for (let j = 0; j < modelsRepositoryXML.length; j++) {
                if (modelsRepositoryXML[j].getAttribute('Name') == workflowElementName) {
                    modelXML = modelsRepositoryXML[j];
                    break;
                }
            }
            let modelName = modelXML.getAttribute('Name');




            let modelNode = { key: "Model_" + modelName, text: modelName, fig: "Rectangle", fill: "lightblue" };
            nodeArraye.push(modelNode);


            // Get inputs of the model
            let modelInputsXML = modelXML.getElementsByTagName("Inputs")[0].getElementsByTagName("Input");
            for (let j = 0; j < modelInputsXML.length; j++) {
                let inputXML = modelInputsXML[j];

                let inputName = inputXML.getAttribute('Name')
                let dataNode = nodeArraye.find(e => e.key === "Data" + inputName);
                if (typeof dataNode === 'undefined') {
                    dataNode = { key: "Data" + inputName, text: inputName, fig: "Ellipse", fill: "lightgreen" }
                    nodeArraye.push(dataNode);
                }

                linkArraye.push({ from: dataNode.key, to: modelNode.key });
            }

            // Get outputs of the model
            let modelOutputsXML = modelXML.getElementsByTagName("Outputs")[0].getElementsByTagName("Output");
            for (let j = 0; j < modelOutputsXML.length; j++) {
                let outputXML = modelOutputsXML[j];

                let outputName = outputXML.getAttribute('Name')
                let dataNode = nodeArraye.find(e => e.key === "Data" + outputName);
                if (typeof dataNode === 'undefined') {
                    dataNode = { key: "Data" + outputName, text: outputName, fig: "Ellipse", fill: "lightpink" }
                    nodeArraye.push(dataNode);
                }

                linkArraye.push({ from: modelNode.key, to: dataNode.key });
            }

        }
        init();
    };

    reader.onload = onload;
    reader.readAsText(input.files[0]);




};

//this will parse XML file and output it to website
var parseFile = function (text) {
    var xmlDoc = $.parseXML(text),
        $xml = $(xmlDoc),
        $options = $xml.find("option");

    $.each($options, function () {
        $("#output").append("<li>" + $(this).text() + "</li >");
    });

};
function init() {
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must be the ID or reference to div
            {
                initialAutoScale: go.Diagram.UniformToFill,
                layout: $(go.LayeredDigraphLayout)
                // other Layout properties are set by the layout function, defined below
            });

    // define the Node template
    //myDiagram.nodeTemplate =
    //    $(go.Node, "Spot",
    //        { locationSpot: go.Spot.Center },
    //        $(go.Shape, "Rectangle",
    //            {
    //                fill: "lightgray",  // the initial value, but data binding may provide different value
    //                stroke: null,
    //                desiredSize: new go.Size(30, 30)
    //            },
    //            new go.Binding("fill", "fill")),
    //        $(go.TextBlock,
    //            new go.Binding("text", "text"))
    //    );

    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            {
                fromSpot: go.Spot.BottomSide, // coming out from right side
                toSpot: go.Spot.TopSide // going into at left side
            },
            //new go.Binding("location", "loc", go.Point.parse),
            $(go.Shape,
                {
                    //desiredSize: new go.Size(60, 30)
                },
                new go.Binding("figure", "fig"),
                new go.Binding("fill", "fill")
            ),
            $(go.TextBlock, { margin: 5 }, new go.Binding("text", "text"))
        );

    // define the Link template to be minimal
    //myDiagram.linkTemplate =
    //    $(go.Link,
    //        { curve: go.Link.Bezier, selectable: false },
    //        $(go.Shape, { strokeWidth: 1, stroke: "#333" }),
    //        $(go.Shape, { toArrow: "Standard" })
    //    );

    myDiagram.linkTemplate =
        $(go.Link,
            //{ curve: go.Link.Bezier },
            { routing: go.Link.AvoidsNodes },
            $(go.Shape),
            $(go.Shape, { toArrow: "Standard" })
        );

    // generate a tree with the default values
    rebuildGraph();
}

function rebuildGraph() {
    var minNodes = 20;
    minNodes = parseInt(minNodes, 10);

    var maxNodes = 100;
    maxNodes = parseInt(maxNodes, 10);

    generateDigraph(minNodes, maxNodes);
}

function generateDigraph(minNodes, maxNodes) {
    myDiagram.startTransaction("generateDigraph");
    // replace the diagram's model's nodeDataArray
    generateNodes(minNodes, maxNodes);
    // replace the diagram's model's linkDataArray
    generateLinks();
    // force a diagram layout
    layout();
    myDiagram.commitTransaction("generateDigraph");
}

// Creates a random number of randomly colored nodes.
function generateNodes(minNodes, maxNodes) {
    //var nodeArray = [];
    //// get the values from the fields and create a random number of nodes within the range
    //var min = parseInt(minNodes, 10);
    //var max = parseInt(maxNodes, 10);
    //if (isNaN(min)) min = 0;
    //if (isNaN(max) || max < min) max = min;
    //var numNodes = Math.floor(Math.random() * (max - min + 1)) + min;
    //var i;
    //for (i = 0; i < numNodes; i++) {
    //    nodeArray.push({
    //        key: i,
    //        text: i.toString(),
    //        fill: go.Brush.randomColor()
    //    });
    //}

    //// randomize the node data
    //for (i = 0; i < nodeArray.length; i++) {
    //    var swap = Math.floor(Math.random() * nodeArray.length);
    //    var temp = nodeArray[swap];
    //    nodeArray[swap] = nodeArray[i];
    //    nodeArray[i] = temp;
    //}

    var nodeArray = nodeArraye
    // set the nodeDataArray to this array of objects
    myDiagram.model.nodeDataArray = nodeArray;
}

// Create some link data
function generateLinks() {
    //if (myDiagram.nodes.count < 2) return;
    //var linkArray = [];
    //var nit = myDiagram.nodes;
    //var nodes = new go.List(/*go.Node*/);
    //nodes.addAll(nit);
    //for (var i = 0; i < nodes.count - 1; i++) {
    //    var from = nodes.get(i);
    //    var numto = Math.floor(1 + (Math.random() * 3) / 2);
    //    for (var j = 0; j < numto; j++) {
    //        var idx = Math.floor(i + 5 + Math.random() * 10);
    //        if (idx >= nodes.count) idx = i + (Math.random() * (nodes.count - i)) | 0;
    //        var to = nodes.get(idx);
    //        linkArray.push({ from: from.data.key, to: to.data.key });
    //    }
    //}

    var linkArray = linkArraye;
    myDiagram.model.linkDataArray = linkArray;
}

function layout() {
    myDiagram.startTransaction("change Layout");
    var lay = myDiagram.layout;

    lay.direction = 90;

    lay.layerSpacing = 50;

    lay.columnSpacing = 15;


    lay.cycleRemoveOption = go.LayeredDigraphLayout.CycleDepthFirst;
    //lay.cycleRemoveOption = go.LayeredDigraphLayout.CycleGreedy;

    lay.layeringOption = go.LayeredDigraphLayout.LayerOptimalLinkLength;
    //lay.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSource;
    //lay.layeringOption = go.LayeredDigraphLayout.LayerLongestPathSink;

    lay.initializeOption = go.LayeredDigraphLayout.InitDepthFirstOut;
    //lay.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
    //lay.initializeOption = go.LayeredDigraphLayout.InitNaive;

    lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveLess;
    //lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveNone;
    //lay.aggressiveOption = go.LayeredDigraphLayout.AggressiveMore;

    ////TODO implement pack option
    //var pack = document.getElementsByName("pack");
    //var packing = 0;
    //for (var i = 0; i < pack.length; i++) {
    //  if (pack[i].checked) packing = packing | parseInt(pack[i].value, 10);
    //}
    //lay.packOption = packing;

    lay.setsPortSpots = false;

    myDiagram.commitTransaction("change Layout");







    //myDiagram.startTransaction("changed Layout");
    //var lay = myDiagram.layout;

    //lay.maxIterations = 100;

    //lay.epsilonDistance = 1;

    //lay.infinityDistance = 1000;

    //var arrangementSpacing = new go.Size();
    //arrangementSpacing.width = 100;
    //arrangementSpacing.height = 100;
    //lay.arrangementSpacing = arrangementSpacing;

    //lay.defaultElectricalCharge = 150;

    //lay.defaultGravitationalMass = 0;

    //lay.defaultSpringStiffness = 0.05;

    //lay.defaultSpringLength = 50;

    //myDiagram.commitTransaction("changed Layout");
}

function getRadioValue(name) {
    var radio = document.getElementsByName(name);
    for (var i = 0; i < radio.length; i++)
        if (radio[i].checked) return radio[i].value;
}


//#endregion Workflow Visualisation













































//========================================================================================================
//==================================================Main==================================================
//========================================================================================================
//#region Main

//==================================//
//==========Update Project==========//
//==================================//

function displayTime() {
    //let date = new Date();
    //let time = date.toLocaleTimeString();
    //document.getElementById('demo').textContent = time;

    //alert('Hello, Mr. Universe!');



    //initialiseProject();
}

const createClock = setInterval(displayTime, 30000);

async function DeleteSelectedObject() {
    if (true) {

        let selectedTreeNodes = $$("ProjectExplorerTree").getSelectedItem(true); // if input argument is true, always returns an array of objects

        for (let i = 0; i < selectedTreeNodes.length; i++) {
            selectedTreeNode = selectedTreeNodes[i];

            if (selectedTreeNode == undefined) {
                //webix.message("Please select an object to be deleted.");
                webix.alert({
                    type: "alert-error",
                    title: "Error",
                    text: '"Delete Selected Object" command was unsuccessful.\n Please select an object to be deleted from the project explorer.',
                });
                return
            }
            let parentTreeNodeId = selectedTreeNode.$parent;
            let parentTreeNode = $$("ProjectExplorerTree").getItem(parentTreeNodeId);


            // Delete data
            if (parentTreeNode.value == 'Data') {

                let selectedDataName = selectedTreeNode.value;
                let dataJson = nebosProject.data.filter(d => d.name == selectedDataName)[0];
                if (dataJson != undefined) {
                    let vonto = JSON.stringify(dataJson);

                    let uri = nebosProject.endPoint.concat('delete-data');

                    // #region execution
                    let response = await fetch(uri, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(dataJson)
                    });
                    let result = await response.json();
                    // #endregion

                    // delete data
                    //socket.emit('create_data', dataJson);
                    connection.invoke("DeleteDataObjects", JSON.stringify(dataJson)).catch(function (err) {
                        return console.error(err.toString());
                    });


                }
            }

            // Delete model
            if (parentTreeNode.value == 'Models') {
            }
        }
    }
}


//============================
//=====Project Invitation=====
//============================

var projectInvitation_form = {
    view: "form",
    id: "projectInvitation_form",
    elementsConfig: {
        bottomPadding: 18,
        labelWidth: 120
    },
    elements: [
        { view: "text", label: 'E-mail address', name: "email", width: 450, invalidMessage: "Incorrect e-mail address" },
        {
            view: "combo", label: 'User Right', name: "userRight",
            options: [
                { id: 1, value: "Admin" },
                { id: 2, value: "Write" },
                { id: 3, value: "Read" }
            ]
        },
        {
            view: "button", value: "Submit", align: "center", width: 150, click: function () {
                var form = this.getParentView();
                if (form.validate()) {
                    webix.alert("Correct data!")
                }

            }
        }
    ]
}
webix.ui({
    view: "window",
    id: "projectInvitationWindow",
    height: 500,
    width: 800,
    //left: 450, top: 50,
    position: "center",
    move: true,
    resize: true,
    head: {
        view: "toolbar", cols: [
            { width: 4 },
            { view: "label", label: "Invite Members" },
            { view: "button", label: 'X', width: 100, align: 'right', click: function () { $$('projectInvitationWindow').hide(); } }
        ]
    },
    body: projectInvitation_form
});

//==========================
//=====Visualise Access=====
//==========================

let formVisualiseModelsAccess = {
    view: "form",
    id: "FormVisualiseModelsAccess",
    elementsConfig: {
        bottomPadding: 18,
        labelWidth: 120
    },
    //scroll: true,
    //margin: 20,
    elements: [
        {
            rows: [
                {
                    id: "TableVisualiseModelsAccess",
                    view: "datatable",
                    css: "webix_data_border webix_header_border",
                    editable: true,
                    resizeColumn: true,
                    //autowidth: true,
                    //autoheight: true,
                    columns: [
                        { id: "TableVisualiseModelsAccess_ModelName", header: "ModelNames", css: "rank", width: 140, editor: "text" },
                        { id: "TableVisualiseModelsAccess_CreatedBy", header: "Created By", width: 80, editor: "text" },
                        { id: "TableVisualiseModelsAccess_CreatedOn", header: "Created On", width: 80, editor: "date" },
                        { id: "TableVisualiseModelsAccess_Status", header: "Status", width: 80, editor: "text" },
                        { id: "TableVisualiseModelsAccess_Approve", header: "Approve/Request", width: 80, "template": "<input type='button' value='Approve/Request' align='center'>", },
                        //{ id: "TableVisualiseModelsAccess_Invite", header: "Invite", width: 80, editor: "text" },

                    ],
                    //scroll: "auto",
                    data: []
                }
            ]
        }
    ]
};
webix.ui({
    view: "window",
    id: "WindowVisualiseModelsAccess",
    height: 500,
    width: 600,
    //left: 450, top: 50,
    position: "center",
    move: true,
    resize: true,
    head: {
        view: "toolbar", cols: [
            { width: 4 },
            { view: "label", label: "Available Models" },
            { view: "button", label: 'X', width: 100, align: 'right', click: function () { $$('WindowVisualiseModelsAccess').hide(); } }
        ]
    },
    body: formVisualiseModelsAccess
});

function WindowVisualiseModelsAccessUpdate() {
    $$("TableVisualiseModelsAccess").clearAll();

    for (let i = 0; i < nebosProject.models.length; i++) {
        let model = nebosProject.models[i];
        let row = {};
        row.id = "TableVisualiseModelsAccessItem" + i;
        row.TableVisualiseModelsAccess_ModelName = model.name;
        row.TableVisualiseModelsAccess_CreatedBy = "Xin Chen";
        row.TableVisualiseModelsAccess_CreatedOn = new Date(2021, 5, 2);
        row.TableVisualiseModelsAccess_Status = "Admin";
        row.TableVisualiseModelsAccess_Approve = "Click";
        row.TableVisualiseModelsAccess_Invite = "Click";
        $$("TableVisualiseModelsAccess").add(row);
    }


}

function WindowVisualiseModelsAccess_Show() {
    WindowVisualiseModelsAccessUpdate();
    $$("WindowVisualiseModelsAccess").show();
}


//===========================//
//==========Sign Up==========//
//===========================//

let formSignUp = {
    view: "form",
    id: "formSignUp",
    elementsConfig: {
        bottomPadding: 18,
        labelWidth: 120
    },
    elements: [
        //{ "template": "<span class='webix_icon fa-user-circle-o'></span>Login", type: "header" },
        {
            view: "text", label: "Name", name: "name", id: "formSignUp_textName", labelPosition: "top",
            required: true, validate: webix.rules.isNotEmpty, invalidMessage: "Please enter your name!",
            on: {
                "onBlur": function () {
                    console.log("Validating email", this);
                    var result = this.validate()    // validate only this field and show warning message under field if invalid
                    //this.$scope.validateForm()
                }
            }
        },
        {
            view: "text", label: "Email", name: "email", id: "formSignUp_textEmail", labelPosition: "top",
            required: true, validate: webix.rules.isEmail, invalidMessage: "Please enter a valid email!",
            on: {
                "onBlur": function () {
                    console.log("Validating email", this);
                    var result = this.validate()    // validate only this field and show warning message under field if invalid
                    //this.$scope.validateForm()
                }
            }
        },
        {
            view: "text", type: "password", label: "Password", name: "password", labelPosition: "top",
            required: true, validate: webix.rules.isNotEmpty, invalidMessage: "Please enter your password!", validateEvent: "key",
            on: {
                "onBlur": function () {
                    console.log("Validating password");
                    this.validate()
                    //this.$scope.validateForm()
                },
                "onKeyPress": function () {
                    console.log("keypress in password")
                }
            }
        },
        {
            margin: 10,
            paddingX: 2,
            borderless: true,
            cols: [
                {},
                {
                    view: "button", label: "Submit", type: "form", id: "formSignUp_SubmitButton", width: 150, click:
                        function () {
                            var form = $$('formSignUp')
                            if (form.validate()) {

                                CreateNewUser();

                                webix.alert({ title: "Account created successfully", type: "alert-success", text: "Welcome User" })
                                $$('windowSignUp').hide();
                                $$('welcomeWindow').show();
                            }
                        }
                }
            ]
        }
    ],

}


webix.ui({
    view: "window",
    id: "windowSignUp",
    height: 500,
    width: 450,
    //left: 450, top: 50,
    position: "center",
    head: {
        view: "toolbar", cols: [
            { width: 4 },
            { view: "label", label: "AirCADia Sign Up" },
            { view: "button", label: 'Close Me', width: 100, align: 'right', click: function () { $$('windowSignUp').hide(); } }
        ]
    },
    body: formSignUp
});

function CreateNewUser() {
    //socket.send('Atif Riaz is shortest');

    socket.emit('my event', { data: 'I\'m connected!' });

    // var form = $$('formSignUp');
    // let formGetValues = form.getValues();
    // webix.ajax().post("http://127.0.0.1:3000/signup", form.getValues());


    // webix.ajax().post("http://127.0.0.1:3000/signup").then(function (data) {
    //     //response text
    //     console.log(data.text());
    // });
}

//=========================//
//==========Login==========//
//=========================//

var login_form = [
    { view: "text", label: 'Username', name: "login", invalidMessage: "Login can not be empty" },
    { view: "text", label: 'E-mail address', name: "email", invalidMessage: "Incorrect e-mail address" },
    { view: "text", label: 'Password', name: "password", invalidMessage: "Password can not be empty" },
    { view: "checkbox", labelRight: 'I accept terms of use', name: "accept", invalidMessage: "Must be checked" },
    {
        view: "button", value: "Submit", align: "center", width: 150, click: function () {
            var form = this.getParentView();
            if (form.validate()) {
                webix.alert("Correct data!")
            }

        }
    }
];
let formLogin = {
    view: "form",
    id: "loginForm",
    elementsConfig: {
        bottomPadding: 18,
        labelWidth: 120
    },
    elements: [
        { "template": "<span class='webix_icon fa-user-circle-o'></span>Login", type: "header" },
        {
            view: "text", label: "Email", name: "email", id: "email",
            required: true, validate: webix.rules.isEmail, invalidMessage: "Please enter a valid email!",
            on: {
                "onBlur": function () {
                    console.log("Validating email", this);
                    var result = this.validate()    // validate only this field and show warning message under field if invalid
                    this.$scope.validateForm()
                }
            }
        },
        {
            view: "text", type: "password", label: "Password", name: "password",
            required: true, validate: webix.rules.isNotEmpty, invalidMessage: "Please enter your password!", validateEvent: "key",
            on: {
                "onBlur": function () {
                    console.log("Validating password");
                    this.validate()
                    this.$scope.validateForm()
                },
                "onKeyPress": function () {
                    console.log("keypress in password")
                }
            }
        },
        {
            margin: 10,
            paddingX: 2,
            borderless: true,
            cols: [
                {},
                {
                    view: "button", label: "Login", type: "form", id: "loginFormSubmitButton", width: 150, click:
                        function () {
                            var form = $$('loginForm')
                            if (form.validate()) {

                                CreateNewUser();

                                webix.alert({ title: "Login successfull", type: "alert-success", text: "Welcome User" })
                                $$('loginWindow').hide();
                                $$('welcomeWindow').show();
                            }
                        }
                }
            ]
        }
    ],

}


webix.ui({
    view: "window",
    id: "loginWindow",
    height: 300,
    width: 450,
    //left: 450, top: 50,
    position: "center",
    head: {
        view: "toolbar", cols: [
            { width: 4 },
            { view: "label", label: "AiCADia Login" },
            { view: "button", label: 'Close Me', width: 100, align: 'right', click: function () { $$('loginWindow').hide(); } }
        ]
    },
    body: formLogin
});

function LoginUI() {




    //$$("projectInvitationWindow").show();



    //$$("windowSignUp").show();



    //$$("loginWindow").show();



    UpdateProjects();
    $$("welcomeWindow").show();
}



//==================================//
//==========Welcome Window==========//
//==================================//

//var projectsListData = [
//    { "id": 1, "title": "Wind Turbine", "endPoint": "https://aircadiatest1.azurewebsites.net/api/modelexecution", "year": "1994" },
//    { "id": 2, "title": "Aircraft Design", "endPoint": "http://127.0.0.1:5000/create-data", "year": "1972" },
//    { "id": 3, "title": "APROCONE Use Case 1", "endPoint": "http://127.0.0.1:5000/create-data", "year": "1974" },
//    { "id": 4, "title": "APROCONE Use Case 3", "endPoint": "http://127.0.0.1:5000/create-data", "year": "1966" },
//    { "id": 5, "title": "Multi-Level Design", "endPoint": "http://127.0.0.1:5000/create-data", "year": "1964" },
//    { "id": 6, "title": "Multi-Level Design 2", "endPoint": "https://aircadiatest1.azurewebsites.net/api/modelexecution", "year": "1957" },
//    { "id": 7, "title": "PIPS Thrust Requirements", "endPoint": "http://127.0.0.1:5000/get-project", "year": "1993" }
//];
let projectsListData = [];
let welcomeForm = {
    view: "form",
    id: "welcomeForm",
    width: 800,
    height: 500,
    elements: [
        {
            cols: [
                { view: "button", type: "image", height: 60, width: 60, image: "/images/Aircadia.png", align: "center" },
                //{
                //    "view": "template",
                //    "data": {
                //        "path": "http://webix.com/assets/common/",
                //        "img": "logo_header.png",
                //        "width": "120",
                //        "height": "120"
                //    },
                //    "template": "<img src='images/Aircadia.png' />"
                //},
                {
                    rows: [
                        { view: "label", label: "AirCADia Nebos", align: "bottom,left", height: 40, css: "aircadia_text1" },
                        { view: "label", label: "Cloud Based Design Environment for Complex Systems", align: "top,left", height: 20, css: "aircadia_text2" }
                    ]
                }
            ]
        },
        {
            view: "list",
            id: "projectsList",
            //width: 320,
            //height: 600,
            //template: "#rank#. #title# <div style='padding-left:18px'> Year:#year#, votes:#votes# </div>",
            template: "#title# <div> #endPoint#, Date Created:#year#, </div>",
            type: {
                height: 52
            },
            select: true,
            data: projectsListData
        },
        {
            align: "right",
            cols: [
                { view: "button", value: "Cancel", width: 120, click: function () { $$('welcomeForm').hide(); } },
                { view: "button", value: "Load Project", width: 120, css: "webix_primary", click: initialiseProject }
            ]
        }
    ]
};

webix.ui({
    view: "window",
    id: "welcomeWindow",
    resize: true,
    height: 700,
    width: 800,
    //left: 450, top: 50,
    position: "center",
    head: false,
    body: welcomeForm
});

// call the web service for creating data
async function UpdateProjects() {
    let uri = AirCADiaNebosURI.concat('get-projects');

    // #region execution
    let response = await fetch(uri, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        //body: JSON.stringify(dataJson)
    });
    let result = await response.json();
    // #endregion


    for (let i = 0; i < result.length; i++) {
        $$("projectsList").add({ title: result[i].name, endPoint: result[i].end_point, year: "Test3" }, -1)

        //let row_id = $$("executionTable").getIdByIndex(i + model.inputs.length)
        //$$("executionTable").updateItem(row_id, { value: result.outputs[i].value });
    }
}



//===========================//
//==========Project==========//
//===========================//
var nebosProject = new NebosProject();
nebosProject.initialise();


//==============================//
//==========Top Region==========//
//==============================//

var menu_data = [
    {
        id: "1", value: "File", submenu: [
            { id: "menuItemLoadResults", value: "New Project" },
            { id: "menuItemOpenProject", value: "Open Project" },
            { id: "menuItemSaveProject", value: "Save Project" },
            { id: "menuItemSaveProjectAs", value: "Save Project As" },
            { id: "menuItemClearProject", value: "Clear Project" },
            { id: "menuItemCloseProject", value: "Close Project" },
            { id: "menuItemExit", value: "Exit" },

            {
                value: "Slavic...", submenu: [
                    "Belarusian", "Russian", "Ukrainian"
                ]
            }
        ]
    },
    {
        id: "2", value: "Project", submenu: [
            { id: "menuItemCreateData", value: "Create Data" },
            { id: "menuItemCreateAuxiliaryData", value: "Create Auxiliary Data" },
            { id: "menuItemCreateModel", value: "Create Model" },
            { id: "menuItemCreateAuxiliaryModel", value: "Create Auxiliary Model" },
            { id: "menuItemCreateWorkflow", value: "Create Workflow" },
            { id: "menuItemCreateStudy", value: "Create Study" },
            { id: "menuItemImport", value: "Import" }
        ]
    },
    {
        id: "3", value: "View", submenu: ["Facebook", "Google+", "Twitter"]
    },
    {
        id: "4", value: "Help", submenu: [
            { id: "menuItemManual", value: "Manual" },
            { id: "menuItemAbout", value: "About" }
        ]
    }
];

var menu = {
    view: "menu",
    //css: "clsMenu",
    data: menu_data,
    type: {
        height: 26
    },
    borderless: true,
    on: {
        onMenuItemClick: function (id) {
            var menuItem = this.getMenuItem(id);
            if (menuItem.id == "menuItemLoadResults") {

                LoadDataFile();

            }
        }
    }
    //type: {
    //    subsign: true
    //}
};



function buttons(size) {
    return [
        {
            view: "button", type: "image", value: "Execute", tooltip: true, //tooltip: "#value# a record"
            image: "/images/Execute16.png", width: 26,
            click: ShowExecutionUI
        },
        {
            view: "button", type: "image", value: "Create Data", tooltip: true,
            image: "/images/Data16.png", width: 26,
            click: ShowDataUI
        },
        {
            view: "button", type: "image", value: "Create Model", tooltip: true, label: "Model",
            image: "/images/Model16.png", width: 26,
            click: ShowModelsUI
        },
        {
            view: "button", type: "image", value: "Create Workflow", tooltip: true,
            image: "/images/Workflow16.png", width: 26,
            click: ShowWorkflowsUI
        },
        {
            view: "button", type: "image", value: "Create Study", tooltip: true,
            image: "/images/Study16.png", width: 26
        },
        {
            view: "button", type: "image", value: "Delete", tooltip: true,
            image: "/images/Delete16.png", width: 26,
            click: DeleteSelectedObject
        },
        {
            view: "button", type: "image", value: "Delete", tooltip: true,
            image: "/images/ThumbsUp24.png", width: 26,
            click: WindowVisualiseModelsAccess_Show
        },
        {
            view: "button", type: "image", value: "Save", tooltip: true,
            image: "/images/ThumbsUp24.png", width: 26,
            click: DownloadData
        },
        {
            view: "button", type: "image", value: "Save Data", tooltip: true,
            image: "/images/ThumbsUp24.png", width: 26,
            click: SaveData
        },
        {
            view: "button", id: "buttonNewWindow2", type: "image", value: "Show Workflow Graph", tooltip: true, label: "Info",
            image: "/images/ThumbsUp24.png", width: 26,
            click: ShowWorkflowGraph
        },
        {
            view: "button", type: "image", value: "Import", tooltip: true,
            image: "/images/AddNewRow24.png", width: 26,
            click: ImportData
        },
        //{
        //    view: "button", type: "image", label: "Info",
        //    image: "../../static/images/ThumbsUp24.png", width: 26,
        //    click: buttonAcceptSelectedSolutionsHandler
        //},
        //{
        //    view: "button", id: "buttonNewWindow", type: "image", label: "Info",
        //    image: "../../static/images/DataTable24.png", width: 26,
        //    click: buttonNewWindowHandler
        //},
        //{
        //    view: "button", id: "buttonNewWindow2", type: "image", label: "Info",
        //    image: "../../static/images/DataTable24.png", width: 26,
        //    click: buttonNewWindowHandler2
        //}
    ];
};
var tool1 = {
    view: "toolbar",
    borderless: true,
    paddingY: 2,
    height: 34,
    cols: buttons(26)
};


var tool2 = {
    view: "toolbar",
    borderless: true,
    padding: 8,
    height: 50,
    cols: [
        { view: "text", width: 200, height: 20 },
        {
            view: "button", id: "buttonLogin", type: "image", borderless: true,
            image: "/images/UserProfile32.png", width: 40,
            click: LoginUI
        }
    ]
};


var xxx = {
    cols: [
        { view: "button", type: "image", image: "/images/Aircadia.png", width: 60, height: 60, align: "right" },
        {
            rows: [ //2nd row
                menu,
                tool1
            ]
        },
        tool2
    ]
};


//===============================//
//==========Left Region==========//
//===============================//

var ttt = {
    // container:"box",
    view: "tree",
    id: "ProjectExplorerTree",
    width: 200,
    scroll: "auto",
    select: true,
    multiselect: true,
    data:
        [
            {
                id: "root", value: "Project", open: true, data: [
                    {
                        id: "DataTreeNode", open: true, value: "Data", data: []
                    },
                    {
                        id: "ModelsTreeNode", open: true, value: "Models", data: []
                    },
                    {
                        id: "WorkflowsTreeNode", open: true, value: "Workflows", data: []
                    },
                    {
                        id: "StudiesTreeNode", open: true, value: "Studies", data: []
                    }
                ]
            }
        ]
}



//========================//
// #region Central Region //
//========================//

var cen = {
    rows: [
        {
            view: "tabview",
            id: "tabview1",
            animate: true,
            tabbar: {
                close: true,
                //popupWidth: 300,
                //tabMinWidth: 120,
                //optionWidth: 200,
                height: 30,
                //yCount: 10,
            },
            cells: [
                {
                    header: "Welcome", width: 100,
                    body: {
                        view: "list",
                        template: "#rank#. #title# <div style='padding-left:18px'> Year:#year#, votes:#votes# </div>",
                        type: {
                            height: 60
                        },
                        select: true,
                        //data: grid_data
                    }
                }
            ]
        },
        {
            cols: [
                {
                    view: "button", value: "Add tab", click: executeModel
                },
                {
                    view: "button", value: "Remove tab", click: function () {
                        var multiview = $$("tabview1").getMultiview();
                        if (multiview.getChildViews().length === 1) {
                            webix.message({ text: "Tabview & multiview have to contain at least one cell", type: "debug" })
                            return false
                        }
                        $$("tabview1").removeView($$("tabview1").getValue());
                    }
                },
                { gravity: 2 }
            ]
        }
    ]
};

//#endregion

//================================//
//==========Right Region==========//
//================================//

var ppp = {
    view: "form",
    id: 'propertiesform',
    //height: 1200,
    scroll: "auto",
    width: 300,
    //container: "testA",
    elements: [{ template: "X-Axis", type: "section" },
    { view: "text", label: "Title" },
    {
        view: "select", name: "xAxisSelect", value: 0, label: "Parameter", options: [
            { value: "x1", id: 0 },
            { value: "x2", id: 1 },
            { value: "y1", id: 2 },
            { value: "y2", id: 3 },
            { value: "y3", id: 4 }
        ]
    },

    { template: "Y-Axis", type: "section" },
    { view: "text", label: "Title" },
    {
        view: "select", name: "yAxisSelect", value: 1, label: "Parameter", options: [
            { value: "x1", id: 0 },
            { value: "x2", id: 1 },
            { value: "y1", id: 2 },
            { value: "y2", id: 3 },
            { value: "y3", id: 4 }
        ]
    },

    {
        margin: 5, cols: [
            { view: "button", label: "Login", type: "form" },
            { view: "button", label: "Cancel" }
        ]
    }]
};




//==================================//
//==========User Interface==========//
//==================================//

var mainInteface = webix.ui({
    container: "layout_div", // corresponds to the id of the div block
    rows: [
        xxx,
        {
            cols: [
                ttt, //{ template: "col 1", width: 300 },
                { view: "resizer" },
                //{ template: "col 2", content: "content1" },
                cen,
                { view: "resizer" },
                ppp //{ template: "col 3", width: 300 }
            ]
        },
        { template: "Status Bar", height: 30 },
    ]
});

$$("ProjectExplorerTree").attachEvent("onItemClick", function (id) {
    let conddd = this.getItem(id);
    let bhhb = $$("ProjectExplorerTree").getItem(id);
    let parentId = this.getItem(id).parent;
});

//======================================//
//==========Initialise Project==========//
//======================================//

// consume web service for getting project json
async function initialiseProject() {
    let uri = nebosProject.endPoint.concat('get-project');

    let response;
    try {
        // #region execution
        response = await fetch(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
    }
    catch (err) {
        let xop = err;
        webix.alert({
            type: "alert-error",
            title: "Error",
            text: "AirCADia: Project could not be loaded. \n Project server may be down." + err,
        });
        return;
    }
    let projectJson = await response.json();
    // #endregion


    // Add data variables
    for (let i = 0; i < projectJson['data'].length; i++) {
        let data = projectJson['data'][i];
        if (!nebosProject.data.some(d => d.name == data.name)) {
            AddDataNode(data);
        }
    }
    // Remove data variables
    let data2Delete = [];
    for (let i = 0; i < nebosProject.data.length; i++) {
        let data = nebosProject.data[i];
        if (!projectJson['data'].some(d => d.name == data.name)) {
            data2Delete.push(data);
        }
    }
    for (let i = 0; i < data2Delete.length; i++) {
        nebosProject.data.pop(data2Delete[i]);
        DeleteDataNode(data2Delete[i]);
    }

    // Models
    for (var i = 0; i < projectJson['models'].length; i++) {
        let model = projectJson['models'][i];
        if (!nebosProject.models.some(m => m.name == model.name)) {
            AddModelNode(model);
        }
    }
}

//========================//
//==========Data==========//
//========================//

// Moved to Data.js

//=========================//
//==========Model==========//
//=========================//

// Moved to Models.js

//=============================//
//==========Workflows==========//
//=============================//

// Moved to Workflows.js

//=============================//
//==========Execution==========//
//=============================//

// #region

var grid_Execute =
{
    id: "ExecutionUI",
    cols: [
        {
            id: "ExecutionTree",
            view: "tree",
            width: 200,
            select: true,
            data:
                [
                    {
                        id: "ExecutionTreeModelsNode", open: true, value: "Models", data: []
                    },
                    {
                        id: "ExecutionTreeWorkflowsNode", open: true, value: "Workflows", data: [
                            { id: "3.1", value: "Workflow 1" },
                            { id: "3.2", value: "Workflow 2" }
                        ]
                    },
                    {
                        id: "ExecutionTreeStudiesNode", open: true, value: "Studies", data: [
                            { id: "4.1", value: "Study 1" },
                            { id: "4.2", value: "Study 2" }
                        ]
                    }
                ]
        },

        { view: "resizer" },
        {
            rows: [
                {
                    id: "executionTable",
                    view: "datatable",
                    editable: true,
                    //autowidth: true,
                    //autoheight: true,
                    columns: [
                        { id: "rank", header: "Rank", css: "rank", width: 50 },
                        { id: "category", header: "Category", width: 200 },
                        { id: "name", header: "Name", width: 200 },
                        { id: "value", header: "Value", width: 80, editor: "text" },
                        { id: "description", header: "Description", width: 100, minwidth: 100, fillspace: 1 }
                    ],
                    //autoheight: true,
                    //autowidth: true,
                    scroll: "auto",
                    data: [
                        { id: 1, category: "System.Wing.Span", name: "X1", value: 3, description: "Wing Span", rank: 1 },
                        { id: 2, category: "System.Wing.Area", name: "X2", value: 4, description: "Wing Area", rank: 2 },
                        { id: 3, category: "System.Wing.Weight", name: "Y", value: 0.0, description: "Wing Weight", rank: 3 }
                    ]
                },
                {
                    view: "button", value: "Execute", click: executeModel
                }
            ]
        }
    ]
}



//function ExecutionUI() {
//    $$("tabview1").addView({
//        header: "Execution", width: 100,
//        body: grid_Execute
//    });
//}
function ShowExecutionUI() {
    $$("tabview1").addView({
        header: "Execution", width: 100,
        body: grid_Execute
        //body: {
        //    id: "executionUI",
        //    view: "scrollview",
        //    scroll: "auto",
        //    body: grid_Execute
        //}
    });

    // Update models nodes for tree
    let modelsNodeId = $$("ExecutionTree").getItem('ExecutionTreeModelsNode').id;
    let model;
    for (let i = 0; i < nebosProject.models.length; i++) {
        model = nebosProject.models[i];
        $$("ExecutionTree").add({ id: "ExecutionTreeModelsNode_" + model.name, value: model.name }, -1, modelsNodeId);
    }
    // Update workflows nodes for tree
    let workflowsNodeId = $$("ExecutionTree").getItem('ExecutionTreeWorkflowsNode').id;
    let workflow;
    for (let i = 0; i < nebosProject.workflows.length; i++) {
        workflow = nebosProject.workflows[i];
        $$("ExecutionTree").add({ id: "ExecutionTreeWorkflowsNode_" + workflow.name, value: workflow.name }, -1, workflowsNodeId);
    }

    $$("ExecutionUI").show();

    $$("ExecutionTree").attachEvent("onItemClick", treeViewExecution_ItemClick);


}
function treeViewExecution_ItemClick(id) {
    let treeNode = this.getItem(id);
    var parentId = treeNode.$parent;
    let parentNode = this.getItem(parentId);

    if (parentNode.value == 'Models') {
        $$("executionTable").clearAll();
        let selectedModelName = treeNode.value;
        // get model object
        let model = nebosProject.getModel(selectedModelName);
        // inputs
        for (let i = 0; i < model.inputs.length; i++) {
            let data;
            for (let j = 0; j < nebosProject['data'].length; j++) {
                if (nebosProject['data'][j].name == model.inputs[i].name)
                    data = nebosProject['data'][j];
            }
            let item = {};
            item.id = i;
            item.category = data.category;
            item.name = data.name;
            item.value = data.value;
            item.description = data.description;
            $$("executionTable").add(item);
        }
        // outputs
        for (let i = 0; i < model.outputs.length; i++) {
            let data;
            for (let j = 0; j < nebosProject['data'].length; j++) {
                if (nebosProject['data'][j].name == model.outputs[i].name)
                    data = nebosProject['data'][j];
            }
            let item = {};
            item.id = model.inputs.length + i;
            item.category = data.category;
            item.name = data.name;
            item.value = data.value;
            item.description = data.description;
            $$("executionTable").add(item);
        }

    }
    else if (parentNode.value == 'Workflows') {
        $$("executionTable").clearAll();
        let selectedWorkflowName = treeNode.value;
        // get workflow object
        let workflow = nebosProject.getWorkflow(selectedWorkflowName);
        // inputs
        for (let i = 0; i < workflow.inputs.length; i++) {
            let data;
            for (let j = 0; j < nebosProject['data'].length; j++) {
                if (nebosProject['data'][j].name == workflow.inputs[i].name)
                    data = nebosProject['data'][j];
            }
            let item = {};
            item.id = i;
            item.category = data.category;
            item.name = data.name;
            item.value = data.value;
            item.description = data.description;
            $$("executionTable").add(item);
        }
        // outputs
        for (let i = 0; i < workflow.outputs.length; i++) {
            let item = {};
            item.id = i;
            item.category = workflow.outputs[i].category;
            item.name = workflow.outputs[i].name;
            item.value = workflow.outputs[i].value;
            item.description = workflow.outputs[i].description;
            $$("executionTable").add(item);
        }
    }
    else if (parentNode.value == 'Studies') {

    }
    webix.message("Click on button " + parentId);
}





// after the container box is resized
//document.getElementById('layout_div').style.width = "200px";
webix.event(window, "resize", UpdateAfterResize);
function UpdateAfterResize() {
    mainInteface.adjust(); // component needs adjusting to the new size
}




async function executeModel() {
    let selectedExecutableTreeItem = $$("ExecutionTree").getSelectedItem();
    var parentId = selectedExecutableTreeItem.$parent;
    let parentNode = $$("ExecutionTree").getItem(parentId);

    if (parentNode.value == "Models") {
        let model = nebosProject.getModel(selectedExecutableTreeItem.value);

        // #region inputs
        // prepare request json data
        var jData = {};
        jData.name = model.name;
        jData.inputs = [];
        for (let i = 0; i < model.inputs.length; i++) {
            let dataName = model.inputs[i].name;
            var gridRecord = $$("executionTable").getItem($$("executionTable").getIdByIndex(i));
            jData.inputs.push({ name: dataName, value: gridRecord.value });
        }
        jData.outputs = [];
        for (let i = 0; i < model.outputs.length; i++) {
            let dataName = model.outputs[i].name;
            jData.outputs.push({ name: dataName, value: 0 });
        }
        // #endregion

        let poni = JSON.stringify(jData);

        // #region execution
        let response = await fetch(model.endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(jData)
        });
        let result = await response.json();
        // #endregion

        // #region outputs
        for (let i = 0; i < model.outputs.length; i++) {
            let row_id = $$("executionTable").getIdByIndex(i + model.inputs.length)
            $$("executionTable").updateItem(row_id, { value: result.outputs[i].value });
        }
        // #endregion
    }
    else if (parentNode.value == "Workflows") {
        let workflow = nebosProject.getWorkflow(selectedExecutableTreeItem.value);

        // #region inputs
        // prepare request json data
        var jData = {};
        jData.name = workflow.name;
        jData.inputs = [];
        for (let i = 0; i < workflow.inputs.length; i++) {
            let dataName = workflow.inputs[i].name;
            var gridRecord = $$("executionTable").getItem($$("executionTable").getIdByIndex(i));
            jData.inputs.push({ name: dataName, value: gridRecord.value });
        }
        jData.outputs = [];
        for (let i = 0; i < workflow.outputs.length; i++) {
            let dataName = workflow.outputs[i].name;
            jData.outputs.push({ name: dataName, value: 0 });
        }
        // #endregion

        let poni = JSON.stringify(jData);

        // #region execution
        let response = await fetch(workflow.endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(jData)
        });
        let result = await response.json();
        // #endregion

        // #region outputs
        for (let i = 0; i < model.outputs.length; i++) {
            let row_id = $$("executionTable").getIdByIndex(i + model.inputs.length)
            $$("executionTable").updateItem(row_id, { value: result.outputs[i].value });
        }
        // #endregion

    }
    else if (parentNode.value == 'Studies') {

    }

}

// #endregion


















// Checking with Xin

async function atifModel() {

    // #region inputs
    // prepare request json data
    var jData = {};
    jData.Name = 'AddNumbers';

    jData.Inputs = [];
    jData.Inputs.push({ Name: 'x1', Value: '2' });
    jData.Inputs.push({ Name: 'x2', Value: '3' });

    jData.Outputs = [];
    jData.Outputs.push({ Name: 'y', Value: '0' });

    // #endregion

    let poni = JSON.stringify(jData);


    //fetch('https://localhost:44381/api/ModelExecution', {
    //    method: 'POST',
    //    headers: {
    //        'Accept': 'application/json',
    //        'Content-Type': 'application/json'
    //    },
    //    body: JSON.stringify(jData)
    //})
    //.then(() => getItems())
    //.catch(error => console.error('Unable to update item.', error));

    // #region execution
    //https://aircadiatest1.azurewebsites.net/api/modelexecution
    let response = await fetch('https://localhost:44381/api/ModelExecution', {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;'
        },
        body: JSON.stringify(jData)
    });



    let result = await response.json();
    // #endregion


    var ooo = result.outputs[i].value

    //// #region outputs
    //for (let i = 0; i < model.outputs.length; i++) {
    //    let row_id = $$("executionTable").getIdByIndex(i + model.inputs.length)
    //    $$("executionTable").updateItem(row_id, { value: result.outputs[i].value });
    //}
    //// #endregion
}

//atifModel()
function getItems() {
    for (let i = 0; i < 1000000; i++) {

    }
}


//#endregion Main



