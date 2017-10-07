const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const exphbs = require('express-handlebars');
const sequelize = require('sequelize');
const flash = require('express-flash-messages');

const models = require('./models');
const router = require('./router');
const app = express();

// config view and static layout
app.engine('handlebars', exphbs({
  defaultLayout: 'base'
}));
app.set('view engine', 'handlebars');

app.use('/static', express.static('public'));

// for body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// user authentication

require('./controllers/passport');
// for passport
app.use(session({
  secret: 'KnowlageIsKey',
  resave: false,
  saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// router
router(app);


app.listen(3000);
