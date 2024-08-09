const path = require ('path');

const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middleware/csrf-token');
const errorHandlerMiddleware = require('./middleware/errors');
const authRoutes = require('./routes/auth.routes')

const app = express();

//Sets up Express views to use
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));  //ensures the public folder is served statically
app.use(express.urlencoded({ extended: false })); //handling submitted form data

//Session management
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

//CSRF token management
app.use(csrf());
app.use(addCsrfTokenMiddleware);

//Authentication routes like sign up, login, etc
app.use(authRoutes);

app.use(errorHandlerMiddleware);

//Mongo connection 
db.connectToDatabase().then(function() {
    app.listen(3000); //only connects if successful connection
})
.catch(function(error) {
    console.log("Failed to connect to database");
    console.log(error);
});