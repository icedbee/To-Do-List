// imported libraries
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

// setting the .env path as well as the port and express variables
dotenv.config({ path: './.env'})
const app = express();
const port = process.env.PORT || 3000

// setting the view engine
app.set('view engine', 'ejs')

// creating a connection to the MySQL database using .env
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

// actually connecting using the credentials above
db.connect((error) => {
    if(error) {
        console.log(error)
    }
    else {
        console.log('MySQL connected!')
    }
})

// setting the directory that will be visible to all
const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir)); // setting express to use that directory
app.use( // setting up a session
    session({
        secret: 'Secret_Key', 
        resave: false,
        saveUninitialized: true
    })
);

/*
app.use((req, res, next) => {
    res.status(404).send(
        "<h1>Page not found on the server<h1>"
    );
    let time = new Date();
    console.log('404 Not Found Time: ', time.toLocaleString("en-US"));
});
*/

// getting the index page
app.get("/", (req, res) => {
    console.log("index")

    // checking to see if the user is logged in or not
    if(req.session.name) {
        res.render("index", { // if logged in, render index page with some attributes
            message: `Hello ${req.session.name}!`,
            isAuthenticated: true,
            name: req.session.name
        })
    }
    else { // if not logged in, render index page with some other attributes
        res.render("index", {
            message: 'You are logged out! Do you want to login or create an account?',
            isAuthenticated: false
        })
    }
})

// getting the register page
app.get("/register", (req, res) => {
    console.log("register")
    res.render("register", {
        message: ''
    })
})

// getting the login page
app.get("/login", (req, res) => {
    console.log("login")
    res.render("login", {
        message: ''
    })
})

// getting the logout page
app.get("/logout", (req, res) => {
    console.log("logout")

    // destroying the session for logging out
    req.session.destroy(() => {
        res.redirect('/')
    })
})

// getting the account page
app.get("/account", (req, res) => {
    console.log("account")
    res.render("account", {
        message: ''
    })
})

// needed for POST and PUT reqs
app.use(express.urlencoded({extended: 'false'})) // recognize incoming req object as strings or arrays
app.use(express.json()) // recognize incoming req object as a json object

// post req for registering a user
app.post("/auth/register", (req, res) => {
    const { name, email, password, password_confirm } = req.body // getting what the user filled out in the form
    // Testing purposes
    /*
    console.log(name)
    console.log(email)
    console.log(password)
    console.log(password_confirm)
    */

    // querying the database to see if any users have the same email that the user attempted to register with
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if(error) {
            console.log(error)
        }

        // we know if there are any existing users with the same email then that user already has an account
        if(result.length > 0) {
            return res.render('register', {
                message: 'This email is already in use'
            })
        } // seeing if the password and the confirmation of the password are the same
        else if(password !== password_confirm) {
            return res.render('register', {
                message: 'Passwords do not match!'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8) // hashing the password to put in the database

        console.log(hashedPassword)

        // putting the user into the database
        db.query('INSERT INTO users SET?', {name: name, email: email, password: hashedPassword}, (err, result) => {
            if(err) {
                console.log(err)
            }
            else { // giving a message to the user about registering them
                return res.render('register', {
                    message: 'User registered!'
                })
            }
        })
    })
})

// post req for logging a user in
app.post("/auth/login", (req, res) => {
    const { email, password } = req.body // getting what the user filled out in the form

    // querying the database to look for users with the same email
    db.query('SELECT password, name FROM users WHERE email=?', [email], async (error, results, fields) => {
        if(error) {
            console.log(error)
        }
        else if(results.length > 1) { //we know if there is more than 1 result something is seriously wrong with the sign up process
            console.log('Something is very wrong')
        }
        console.log(results)

        // comparing the hash password entered with the hashed password in the database
        await bcrypt.compare(password, results[0].password, (err, resu) => {
            if(err) {
                console.log(err)
            }
            else {
                console.log(`passwords match? ${resu}`)
                if(resu) { // if the passwords are the same, make the session variables equal to the user's credentials and redirect to index page
                    req.session.name = results[0].name;
                    res.redirect('/')
                }
                else { // if passwords don't match, tell the user
                    return res.render('login', {
                        message: 'Not a valid email or password!'
                    })
                }
            }
        })
    })
})

app.use((req, res, next) => {
    res.status(404).render('not-found')
    let time = new Date();
    console.log('404 Not Found Time: ', time.toLocaleString("en-US"));
});

// listening on a certain port
app.listen(port, () => {
    console.log(`App is listening on port ${port}.`)
});
