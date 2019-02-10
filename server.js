'use strict'

var app = require('express')()
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"

MongoClient.connect(url, function(err, db) {
    if (err) throw err
    console.log("Connected")
    var dbo = db.db("mydb")
    var defaultNumber = {name:'defaultValue', value:0}
    dbo.createCollection("numbers", function(err, res) {
        if (err) throw err
        console.log("Collection created!")
        dbo.collection("numbers").insertOne(defaultNumber, function(err, res) {
            if (err) throw err
            console.log("Inserted")
            db.close()
        })
    })
    dbo.collection("numbers").findOne({name:"defaultValue"}, function(err, res) {
        if (err) throw err
        number = res.value
        db.close()
    })
})

const port = process.env.PORT || 80
const host = "0.0.0.0"

var number = 0

app.get('/', function (req, res, next) {
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("mydb")
        dbo.collection("numbers").findOne({name:"defaultValue"}, function(err, res) {
            if (err) throw err
            number = res.value
            db.close()
        })
    })
    
    res.send("<h1>" + number + "</h1>" +
            "<form method='POST' action=''>" +
                "<input type='submit' value='Incrémenter' /> " +
            "</form>"
    )
    next()
})

app.post('/', function (req, res, next) {
    number++
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("mydb")
        var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
        dbo.collection("numbers").updateOne({name:"defaultValue"}, { $set: { value: number } }, function(err, res) {
            if (err) throw err
            db.close()
        })
    })
    res.redirect("/")
    next()
})

app.listen(port, function(){
    console.log("App listening on port : " + port)
})
