'use strict'

var app = require('express')()
var mysql = require('mysql')

const port = process.env.PORT || 80
const host = "0.0.0.0"

var number = 0

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "numbers_db"
})
  
con.connect(function(err) {
    if (err) throw err
    console.log("Connected!")

    /*con.query("CREATE DATABASE ??", db, function (err, res) {
        if (err) throw err
        console.log("Database created")
        
        con.query("CREATE TABLE ??.numbers (id SERIAL PRIMARY KEY, name varchar(20) UNIQUE NOT NULL, value int(11) unsigned DEFAULT 0);", db, function(err, res) {
            if (err) throw err
            console.log("Table created")

            con.query("INSERT INTO ??.numbers(name) VALUES('defaultNumber')", db, function(err, res) {
                if (err) throw err
                console.log("Inserted", res)
            })
        })
    })*/

    con.query("INSERT INTO numbers(name, compteur) VALUES('defaultNumber', 0)", function(err, res) {
        if (err) throw err
        console.log("Inserted", res)
    })

    con.query("SELECT compteur FROM numbers WHERE name='defaultNumber'", function(err, res) {
        if (err) throw err
        console.log(res)
        number = res.compteur
    })
})

// Chargement de la page index.html
app.get('/', function (req, res, next) {
    res.send("<h1>" + number + "</h1>" +
            "<form method='POST' action=''>" +
                "<input type='button' value='Incrémenter' /> " +
            "</form>"
    )
    next()
})

app.post('/', function (req, res, next) {
    number++
    con.connect(function(err) {
        con.query("UPDATE numbers SET value=?? WHERE name='defaultNumber'", number, function(err, res) {
            if (err) throw err
            console.log(res)
        })
    })
    next()
})

app.listen(port, host)
console.log("App listening on port : " + port)