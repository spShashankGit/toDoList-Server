const express = require('express');
const app = express();
var userName = "unregisteredUser";

//Passport JS
passport = require("passport");
LocalStrategy = require('passport-local').Strategy;

//Initiate mongoose
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// Create application/x-www-form-urlencoded parser

var urlencodedParser = bodyParser.urlencoded({ extended: false });
// parse application/json 
app.use(bodyParser.json());
//Define ObjectID
var ObjectId = require('mongodb').ObjectID;

// Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/toDoList';
mongoose.connect(mongoDB);

// Constants Get the default connection
const db = mongoose.connection;
var collectionName = userName;
const masterTable = "masterRecord";

// Allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Check if the DB is connected
db.on('open', function () {
    console.log("DB is open")
    db.collection(collectionName).find({}, function (err, collections) {
        if (err)
            console.log("error 123 is ", collections);
        else
            console.log("collections 123 is ", collections);
    });
});

app.post('/login', function (req, res) {
    db.collection(masterTable).find({ username: req.body.email, password: req.body.password }).toArray(function (err, result) {
        collectionName = req.body.email;
        console.log("userName ", userName)
        if (result.length == 0) {
            var msg = { 'response': 'No record found!', 'statusCode': 'API201' }
            result.push(msg);
            res.send(result);
            console.log("This is the result ", result, req.body.email, req.body.password);
        }
        else if (result.length == 1) {
            var msg1 = { 'response': 'A record found!' }
            result[0].msg = 'A record found!';
            result[0].statusCode = 'API200';
            res.send(result);
            console.log("This is the result == 1", result, req.body.email, req.body.password)
        }
        else if (result.length > 1) {
            result.msg = "Multiple records Found";
            res.send(result);
            console.log("This is the result > 1 ", result, req.body.email, req.body.password)
        }
        else
            res.send(err);
    })
});

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

mongoose.model('users1', { name: String });


//Get all the documents of a collection
db.collection(collectionName).find({}, function (err, users) {
    if (err) throw err;
    // object of all the users
    console.log("Cp1", users);
});

//Home Link
app.get('/', function (req, res) {
    res.send('Hello World!1234567890')
})


//Get All Data
app.get('/getAllData', function (req, res) {
    db.collection(collectionName).find({}).toArray(function (err, result) {
        if (result)
            res.send(result);
        else
            res.send(err);
    });
});

//Get Today's data
app.get('/getTodayData', function (req, res) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var temp = today.toString();
    console.log(temp);
    db.collection(collectionName).find({}).toArray(function (err, result) {
        console.log("result 123123", result, collectionName);
        if (result.length == 0)
            res.send([{ "msg": "No results Found" }]);
        else if (result.length >= 1)
            res.send(result);
        else
            res.send(err);
    });
});

//Post request
app.post('/process_post', function (req, res) {
    console.log(req, req.body.id);
    var autoGenID = { _id: req.body._id };
    var newvalues = {
        id: req.body.id,
        name: req.body.name,
        values: req.body.values
    }
    var query = { name: (req.body.name) };
    db.collection(collectionName).find(query).toArray(function (err, result) {
        //checking if the document exist for the requested ID
        console.log(Query, query, req.body.id);
        if (err) throw err;
        console.log(result);
        console.log("Checking the node")
    });
    db.collection(collectionName).updateOne(query, newvalues, function (err, res) {
        if (err) throw err;
        console.log("ch");
        //db.close();
    });
    res.end(JSON.stringify(req.body));
});

//Post an acivity 
app.post('/addActivity', function (req, res) {
    console.log("Add an activity ", req.body);
    // res.send([{ "msg": "Success" }]);
    // db.collection(collectionName).find({})
    var tempDate = new Date();
    tempDate.setHours(0, 0, 0, 0);
    tempDate = tempDate.toString();
    db.collection(collectionName).find({ date: tempDate }).toArray(function (err, result) {
        console.log("~ result ", result, collectionName);
        var activities = result.activities;
        activities.push(req.body);
        res.send(result);
    });

})
//Port listner
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});