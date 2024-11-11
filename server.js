//"start": "node server.js"
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: './.env'})
const app = express();
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

db.connect((error) => {
    if(error) {
        console.log(error)
    }
    else {
        console.log('MySQL connected!')
    }
})

const publicDir = path.join(__dirname, './public')
app.use(express.static(publicDir));

app.get("/", (req, res) => {
    console.log("index")
    res.render("index")
})

app.get("/register", (req, res) => {
    console.log("register")
    res.render("register")
})

app.get("/login", (req, res) => {
    console.log("login")
    res.render("login")
})

app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

/*
app.post("/auth/register", (req, res) => {
    const { name, email, password, password_confirm } = req.body
    console.log(name)
    console.log(email)
    console.log(password)
    console.log(password_confirm)

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if(error) {
            console.log(error)
        }

        if(result.length > 0) {
            return res.render('register', {
                message: 'This email is already in use'
            })
        }
        else if(password !== password_confirm) {
            return res.render('register', {
                message: 'Passwords do not match!'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8)

        console.log(hashedPassword)

        db.query('INSERT INTO users SET?', {name: name, email: email, password: hashedPassword}, (err, result) => {
            if(err) {
                console.log(err)
            }
            else {
                return res.render('register', {
                    message: 'User registered!'
                })
            }
        })
    })
})*/

/*
app.use((req, res, next) => {
    res.status(404);
    res.send(`<h1>Error 404: Resource not found</h1>`);
    let time = new Date();
    console.log('404 Not Found Time: ', time.toLocaleString("en-US"));
    next();
});*/

app.listen(port, () => {
    console.log(`App is listening on port ${port}.`)
});
