'use strict'

var app = require('express')()
var mysql = require('mysql')

const port = process.env.PORT || 80
const host = "0.0.0.0"

var number = 0
var message = "";

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qaltamore",
    database: "numbers_db"
})
  
con.connect(function(err) {
    if (err) throw err
    console.log("Connected!")

    con.query("SELECT value FROM numbers WHERE name='defaultNumber'", function(err, res) {
        if (err) throw err
        console.log(res)
        number = res[0].value
    })
})

// Chargement de la page index.html
app.get('/', function (req, res, next) {
    res.send("<h1>Combien d'heures pensez-vous que j'ai passé sur cette évaluation ? : " + number + "</h1>" +
            "<p>"+message+"</p>" +
            "<form method='POST' action=''>" +
                "<input type='submit' value='Incrémenter' /> " +
            "</form>"
    )
    next()
})

app.post('/', function (req, res, next) {
    number++
    con.connect(function(err) {
        con.query("UPDATE numbers SET value='"+number+"' WHERE name='defaultNumber'", function(err, res) {
            if (err) throw err
            console.log(res)
        })
    })
    if(number < 3)
        message = "J'aurais aimé passer si peu de temps"
    else if(number < 7)
        message = "On n'y est pas encore"
    else if(number < 11)
        message = "ça aurait été trop simple"
    else if(number < 16)
        message = "J'ai commencé samedi à 15H, confiant ... (PS : c'est toujours pas assez)"
    else if(number < 20)
        message = "Aaaah, on commence à se rapprocher ! On y est presque !"
    else if(number == 20)
        message = "BINGO ! 20 petites heures :D C'est vraiment pas ouf hein, très décevant même, mais bon. Je vous souhaite une excellente journée !"
    else
        message = "Oulah, doucement doucement, 20 c'est déjà pas mal hein ! Dieu merci ce n'était 'QUE' 20 !"
    res.redirect("/")
})

app.listen(port, host)
console.log("App listening on port : " + port)