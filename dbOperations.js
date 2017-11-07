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

//Port listner
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

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

//Home Link
app.get('/', function (req, res) {
    res.send('Hello World!')
})


/*
Search in DB
If parameters are passed,where clause will be implemented,
else all the records will be returned.
*/
function getData(param, value) {
    if (param && value) {
        db.collection(collectionName).find({}).toArray(function (err, result) {
            if (result)
                return (result);
            else
                return (err);
        });
    }
    else {
        db.collection(collectionName).find({ param: value }).toArray(function (err, result) {
            if (result)
                return (result);
            else
                return (err);
        });
    }

};

//Insert Request
function createNewTask(task) {
    db.collection(collectionName).InsertOne(task, function (err, res) {
        if (err) throw err;
        console.log("ch");
        //db.close();
    });
};

//Update Request
function updateExistingTask(task) {
    db.collection(collectionName).updateOne(query, newvalues, function (err, res) {
        if (err) throw err;
        console.log("ch");
        //db.close();
    });
};