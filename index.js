const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const nocache = require('nocache');
const config = require('./config/Config');

require('dotenv').config()
config.mongooseConnection()

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'assets')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'LMNOP',
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 24 * 10,
    },
  })
);

app.set("view engine", "ejs");

// FOR CACHE STORAGE //
app.use(nocache());


// FOR USER ROUTES //
const userRoute = require('./routes/userRoute')
app.use('/',userRoute);


// FOR ADMIN ROUTES //
const adminRoute = require('./routes/adminRoute');
const { appendFile } = require('fs/promises');
app.use('/admin',adminRoute);

app.use((req, res) => {
  res.status(404).render('user/404');
});

// or

app.use((req, res) => {
  res.status(404).render('admin/404');
});

// FOR CONNECTING TO THE SERVER //

app.listen(port,()=>{
  console.log("SERVER STARTED");
});