// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Session.set("sort_type",  {'name':1, 'score':1, 'sexyness':1});

  Template.leaderboard.players = function () {
      //return Players.find({}, {sort: sort_mode[sort_index]});
      return Players.find({}, {sort: Session.get("sort_type")});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      console.log('select');
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click .add_player': function (e) {
      console.log('add player clicked');
      //var name = document.getElementById("new_player_name").value;
      var name = $(e.target).parent().find('.new_player_name').val();
      Players.insert({name:name, score:0, sexyness:0});
    },
    'click .reset':function (e) {
      console.log('reset');
      Meteor.call('say_method');
    },
    'click .name_sort':function(e) {
      var sort_by = {'name':1, 'score':1, 'sexyness':1}
      if (_.isEqual(Session.get("sort_type"), sort_by)) {
        sort_by = {'name':-1, 'score':1, 'sexyness':1}
      }
      Session.set("sort_type", sort_by)
    },
    'click .score_sort':function(e) {
      var sort_by = {'score':1, 'name':1, 'sexyness':1};
      if (_.isEqual(Session.get("sort_type"), sort_by)) {
        sort_by = {'score':-1, 'name':1, 'sexyness':1};
      }
      Session.set("sort_type", sort_by)
    },
    'click .sexyness_sort':function(e) {
      var sort_by = {'sexyness':1, 'name':1, 'score':1};
      if (_.isEqual(Session.get("sort_type"), sort_by)) {
        sort_by = {'sexyness':-1, 'name':1, 'score':1};
      }
      Session.set("sort_type", sort_by)
    },

  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
      Players.update(Session.get("selected_player"), {$inc: {sexyness: Math.floor(Random.fraction()*5)}});
    }
  });
}

Meteor.methods({
  say_method: function() {
    Players.remove({});
    reset();
  }
});

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      reset();
    }
  });
}

function reset() {
  var names = ["Ada Lovelace",
               "Carl Friedrich Gauss",
               "Nikola Tesla",
               "Claude Shannon"];
  for (var i = 0; i < names.length; i++) {
    Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5, sexyness: Math.floor(Random.fraction()*10)});
  }
}
