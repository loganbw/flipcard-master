const express = require('express');
const passport = require('passport');
const UserController = require('./controllers/user');
const FlipcardController = require('./controllers/flipcard');

module.exports = function(app) {

const userRouter = express.Router();
const flipcardRouter = express.Router();

// Middleware to protect routes
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())

    return next();
    res.redirect('/');
  }

  userRouter.post('/login/', passport.authenticate('local-login', {
        successRedirect: '/flipcard/home',
        failureRedirect: '/',
        failureFlash: true
    }));

    userRouter.get('/signup/', UserController.signup);
    userRouter.post('/signup/', passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/signup/',
      failureFlash: true
    }));

    userRouter.get('/', UserController.login);
    userRouter.get('/signup', UserController.signup);
    userRouter.get('/logout', UserController.logout);

    //flipcardRouter.get('/home', FlipcardController.home);
    flipcardRouter.get('/create', FlipcardController.deck);
    flipcardRouter.post('/create', FlipcardController.create);
    flipcardRouter.get('/home', FlipcardController.list);
    flipcardRouter.get('/card', FlipcardController.card);
    flipcardRouter.post('/createcard', FlipcardController.flipcard);
    flipcardRouter.post('/edit', FlipcardController.edit);
    flipcardRouter.post('/editPost', FlipcardController.editPost);
    flipcardRouter.post('/delete', FlipcardController.delete);
    flipcardRouter.post('/quiz', FlipcardController.quiz);
    flipcardRouter.post('/checkanswer', FlipcardController.checkanswer);




app.use('/', userRouter);
app.use('/flipcard/', flipcardRouter);

};
