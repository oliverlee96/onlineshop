const path = require ('path');

const express = require('express');

const db = require('./data/database');
const authRoutes = require('./routes/auth.routes')

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public')); //ensures the public folder is served statically

app.use(authRoutes);

db.connectToDatabase().then(function() {
    app.listen(3000); //only connects if successful connection
})
.catch(function(error) {
    console.log("Failed to connect to database");
    console.log(error);
});