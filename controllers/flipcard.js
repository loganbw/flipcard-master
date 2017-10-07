const models = require('../models')
const bodyParser = require('body-parser');
const session = require('express-session');
var User = require('../models/user')
var Deck = require('../models/deck')
const FlipcardController = {
  home: function(req, res) {
    console.log("started quiz " + req.session.quizStarted);
    res.render('flipcards/home', {
      user: req.session.passport.user
    });
    // console.log("hello " + req.session.Users.username);
  },
  deck: function(req, res) {
    res.render('flipcards/createdeck', {
      user: req.session.passport.user
    })
  },
  create: function(req, res) {
    models.Deck.create({
      card: req.body.card,
      userdeck: req.session.passport.user
    });
    res.redirect('/flipcard/home')
  },
  list: function(req, res) {
    console.log(req.query.userdeck);
    let deckfind = models.Deck.findAll({
      where: {
        userdeck: req.session.passport.user
      }
    }).then((decks) => {
      res.render("flipcards/home", {
        user: req.session.passport.user,
        deck: decks
      })
    });
  },
  card: function(req, res) {
    console.log(req.session);
    var deck = req.body.deck;
    var hiddenId = req.query.hiddenId;
    var card = models.Card.findAll({
      where: {
        carddeck: hiddenId
      }
    }).then((cards) => {
      res.render('flipcards/card', {
        user: req.session.passport.user,
        deck: deck,
        hiddenId: hiddenId,
        card: cards
      })
    });
  },

  flipcard: function(req, res) {
    //var deck = models.Deck.findById(req.body.hiddenId);
    var deck = req.body.deck;
    var hiddenId = req.query.hiddenId;
    console.log(req.query);
    models.Card.create({
      fcard: req.body.frontCard,
      bcard: req.body.backCard,
      carddeck: req.body.hiddenId
    });

    res.redirect('/flipcard/card/?hiddenId=' + req.body.hiddenId)
  },
  edit: function(req, res) {
    console.log("cards" + cards);
    var cardId = req.body.cardId;
    var cards = req.body.card;
    var hiddenId = req.body.hiddenId;
    var f = req.body.frcard;
    var b = req.body.brcard;
    console.log(" F " + f + " B " + b + " ============-=-=-=-=-=-=-=-=-=-=-=-=-0-=");
    res.render('flipcards/edit', {
      user: req.session.passport.user,
      card: cards,
      cardId: cardId,
      hiddenId: hiddenId,
      fcard: f,
      bcard: b
    })
  },
  editPost: function(req, res) {
    var cardId = req.body.cardId;
    var cards = req.body.card;
    var editFcard = req.body.updatefcard;
    var editBcard = req.body.updatebcard;
    var hiddenId = req.body.hiddenId;
    //var hiddenId = req.query.hiddenId;
    console.log("=-=-=-=-=-=-=-=--=-=--=-=-=-=-=" + editFcard);
    console.log("=-=-=-=-=-=-=-=--=-=--=-=-=-=-=" + editBcard);
    console.log("=-=-=-=-=-=-=-=--=-=--=-=-=-=-=" + cardId);
    console.log("=-=-=-=-=-=-=-=--=-=--=-=-=-=-=" + hiddenId);
    models.Card.update({
      fcard: editFcard,
      bcard: editBcard
    }, {
      where: {
        id: cardId
      }
    });
    res.redirect('/flipcard/card/?hiddenId=' + req.body.hiddenId);


  },
  delete: function(req, res) {
    var cardId = req.body.cardId;
    var deckId = req.body.hiddenId;
    models.Card.destroy({
      where: {
        id: cardId
      }
    }).then(function(deckId) {
      res.redirect('/flipcard/card/?hiddenId=' + req.body.hiddenId)
    });
  },
  quiz: function(req, res) {
    var deck = req.body.hiddenId;
    console.log("Deck " + deck);
    console.log("Session Deck " + req.session.deck);
    var startingnew = false;
    if (req.session.deck == 'undefined' || req.session.deck == null) {
      req.session.deck = deck;
      startingnew = true;
    } else {
      if (deck === req.session.deck) {
        console.log("continuing quiz");
        startingnew = false;
      } else {
        console.log("starting a new quiz");
        req.session.deck = deck
        startingnew = true;
      }


    }
    console.log(deck + " --=-==-=-=-=-=-=");
    var card = models.Card.findAndCountAll({
        where: {
          carddeck: deck
        }
      })
      .then(function(obj) {
        var noquestions = false;
        console.log(obj.count);
        if (obj.count > 0) {
          var curr = []
          if (req.body.startnew || startingnew) {
            req.session.currentquiz = null;
            req.session.finishedquiz = false;
            req.session.currentquizcard = null;

          }
          //if this is a new quiz
          if (req.session.currentquiz == 'undefined' || req.session.currentquiz == null) {
            var min = Math.ceil(1);
            var max = Math.floor(obj.count + 1);
            specificCard = Math.floor(Math.random() * (max - min)) + min;
            curr.push(specificCard);
            req.session.finishedquiz = false;
            req.session.currentquizcard = curr[curr.length - 1];
            req.session.rights = 0;
            req.session.wrongs = 0;
          } else {
            curr = req.session.currentquiz;
            if (curr.length === obj.count) {
              req.session.finishedquiz = true;
              //clear current session quiz stuff
            } else {
              var found = false;
              var specificCard = null;
              while (!found) {
                var min = Math.ceil(1);
                var max = Math.floor(obj.count + 1);
                specificCard = Math.floor(Math.random() * (max - min)) + min;
                if (curr.indexOf(specificCard) >= 0) {
                  found = false;
                } else {
                  found = true;
                }
              }
              curr.push(specificCard);
            }
          }
          req.session.currentquiz = curr;
          req.session.currentquizcard = curr[curr.length - 1];

          console.log("dec " + curr);
          console.log("sesssion " + req.session.currentquizcard);
          console.log("current quiz finished = " + req.session.finishedquiz);
          console.log("card values " + obj.rows[req.session.currentquizcard - 1].fcard);
          req.session.storedcard = obj.rows[req.session.currentquizcard - 1];
          res.render('flipcards/quiz', {
            user: req.session.passport.user,
            hiddenId: req.body.hiddenId,
            cardId: req.body.cardId,
            question: obj.rows[req.session.currentquizcard - 1].fcard,
            finished: req.session.finishedquiz,
            rights: req.session.rights,
            wrongs: req.session.wrongs,
            totals: req.session.rights + req.session.wrongs
          })
        } else {
          res.render('flipcards/quiz', {
            user: req.session.passport.user,
            hiddenId: req.body.hiddenId,
            cardId: req.body.cardId,
            question: "no questions",
            finished: false,
            rights: 0,
            wrongs: 0,
            totals: 0
          })
        }
        //console.log( obj.rows );
      })

  },
  checkanswer: function(req, res) {

    if (req.body.answer === req.session.storedcard.bcard) {
      console.log("right");
      req.session.rights++;
    } else {
      req.session.wrongs++
        console.log("wrong");
    }

    FlipcardController.quiz(req, res);
  }


};
module.exports = FlipcardController;
