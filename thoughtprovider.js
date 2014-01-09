var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSONPure;
var ObjectID = require('mongodb').ObjectID;

ThoughtProvider = function(host, port) {
    this.db= new Db('brain', new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function(){});
};

//addCommentToThought

ThoughtProvider.prototype.addCommentToThought = function(thoughtId, comment, callback) {
    this.getCollection(function(error, thought_collection) {
        if( error ) callback( error );
        else {
            thought_collection.update(
                {_id: thought_collection.db.bson_serializer.ObjectID.createFromHexString(thoughtId)},
                {"$push": {comments: comment}},
                function(error, thought){
                    if( error ) callback(error);
                    else callback(null, thought)
                });
        }
    });
};

//getCollection

ThoughtProvider.prototype.getCollection= function(callback) {
    this.db.collection('timeframes', function(error, thought_collection) {
        if( error ) callback(error);
        else callback(null, thought_collection);
    });
};

//findAll
ThoughtProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, thought_collection) {
        if( error ) callback(error)
        else {
            thought_collection.find().toArray(function(error, results) {
                if( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};

//findById

ThoughtProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, thought_collection) {
        if( error ) callback(error)
        else {
            thought_collection.findOne({_id: thought_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
                if( error ) callback(error)
                else callback(null, result)
            });
        }
    });
};

//save
ThoughtProvider.prototype.save = function(thoughts, callback) {
    this.getCollection(function(error, thought_collection) {
        if( error ) callback(error)
        else {
            //todo validation á inputi
            if( typeof(thoughts.length)=="undefined")
                thoughts = [thoughts];

            for( var i =0;i< thoughts.length;i++ ) {
                thought = thoughts[i];
                thought.timeObjType = 'Journal';//todo thought.timeObject.objectType;
                thought.createdDate = new Date();
                thought.user = "Brynzi"; //todo sækja innskráðan notanda
                thought.tags = ["Brynjar", "Auður", "Heiðar", "Lilja"];
                thought.location = "Huldugil 23"; //todo sækja documentið í address safnið
            }

            thought_collection.insert(thoughts, function() {
                callback(null, thoughts);
            });
        }
    });
};


ThoughtProvider.prototype.addThought = function(thought, callback) {
    this.getCollection(function(err, collection) {
        collection.insert(thought, {safe:true}, function(err, result) {
            callback(err, result);
        });
    });
}

ThoughtProvider.prototype.updateThought = function(id, thought, callback) {
    this.getCollection(function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, thought, {safe:true}, function(err, result) {
            callback(err, thought);
        });
    });
}

ThoughtProvider.prototype.deleteThought = function(id, callback) {
    this.getCollection(function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            callback(err, result);
        });
    });
}

//prófa að senda hluta af þessu hérna
//á github .  Stoppar þetta fyrst í local repository
//

exports.ThoughtProvider = ThoughtProvider;