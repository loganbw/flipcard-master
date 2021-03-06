const passport = require('passport');
const bcrypt = require('bcryptjs');
const models = require('../models');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id).then(function(user) {
    if (user) {
      done(null, user.get());
    } else {
      done(user.errors, null);
    }
  });
});

passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {

    let isValidPassword = function(userpass, password) {
      return bcrypt.compareSync(password, userpass);
    }

    models.User.findOne({
      where: {
        username: username
      }
    }).then(function(user) {
      if (!user) {
        return done(null, false, {
          message: 'Username does not exists'
        });
      }

      if (!isValidPassword(user.password, password)) {
        return done(null, false, {
          message: 'Incorrect password'
        });
      }

      let userinfo = user.get();
      return done(null, userinfo);
    }).catch(function(err) {
      console.log("error:", err);

      return done(null, false, {
        message: 'Something went wrong with your sign-in'
      });
    });

  }
));


passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    let generateHash = function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    models.User.findOne({
      where: {
        username: username
      }
    }).then(function(user) {
      if (user) {
        return done(null, false, {
          message: 'That username is already taken'
        });
      } else {
        let userPassword = generateHash(password);
        let data = {
          username: username,
          password: userPassword
        };

        models.User.create(data).then(function(newUser, created) {
          if (!newUser) {
            return done(null, false);
          }
          if (newUser) {
            return done(null, newUser);
          }
        });
      }
    });
  }
));


passport.use(new BasicStrategy(function(username, password, done) {
  models.User.findOne({
    where: {
      username: username
    }
  }).then(function(user) {
    if (!user) {
      return done(null, false);
    } else if (user.password !== password) {
      return done(null, false)
    } else {
      return done(null, user);
    }
  });
}));
