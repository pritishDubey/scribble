var mainApp   = angular.module("notes");
mainApp.service('documentBucket', function($q) {

    var nedb      = require('nedb')
    const uuidV4  = require('uuid/v4');
    var Datastore = require('nedb')
    var db;

    var textSub = {};
    textSub.text ='';
    textSub.subject='';

    var toggleGetTextSub = Math.random();

    var _connectToDb = function() {
        db = new Datastore({ filename: __dirname + '/datafile', autoload: true });
    }

    var _getAllDocs = function() {
        var deferred = $q.defer();
        db.find({}, function (err, docs) {
            if(err){
                deferred.reject(err);
            }
            deferred.resolve(docs);
        });
        return deferred.promise;
    }

    var _save = function (doc) {
        db.update({_id : doc._id}, doc, {upsert : true }, function(err,newDoc) {
            if(err){
                console.log(err);
            }
            console.log('updated',doc);
        })
    }

    var _setTextSub = function (subject) {
        textSub = subject;
    }

    return{
        connectToDb : _connectToDb,
        getAllDocs  : _getAllDocs,
        save        : _save,
        setTextSub  : _setTextSub
    }
});
