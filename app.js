const express = require('express');
//creating app
const app = express();

//send an HTTP response when receiving HTTP GET /
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index'); //no need for ejs extension
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const session = require('express-session');
app.use(session({secret: 'some secret code', resave: false, saveUninitialized: true}));

//route for contacts
app.get('/contacts', (req, res) => {
    res.render('contacts');
})

//route for register
app.get('/register', (req, res) => {
    res.render('register');
})

//route for login
app.get('/login', (req, res) => {
    res.render('login');
})

// app.get('/api/login', (req, res) => {
//     res.render('afterLogin');
// })

//pass requests to the router middleware
const router = require('./routes/apis');
app.use(router);

//make the app listen on port
const port = process.argv[2] || process.env.PORT || 3000;
const server = app.listen(port, () =>
{
    console.log(`Cart app listening at http://localhost:${port}`);
});