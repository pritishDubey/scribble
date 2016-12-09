var mainApp   = angular.module("notes", ['angularTrix']);
var moment    = require('moment')
var nedb      = require('nedb')
const uuidV4  = require('uuid/v4');
var Datastore = require('nedb')
var db        = new Datastore({ filename: __dirname + '/datafile', autoload: true });

mainApp.controller('appCtrl', function($scope,$timeout) {

    $scope.text = '';
    $scope.documents = [];


    function init() {
      db.find({}, function (err, docs) {
          console.log(err);
          console.log(docs);
          $timeout(function () {
              if(docs.length > 0){
                $scope.documents = docs
                $scope.text = $scope.documents[$scope.documents.length -1].text
              }
              else{
                  _addEmptyRecord();
              }
          })
      });
    }



    function _addEmptyRecord() {
        let document      = {};
        document.text     = ''
        document._id      = uuidV4();
        document.date     = moment().format('ll');
        document.subject  = 'New Note'

        $scope.documents.push(document)
    }


    $scope.save = function () {

        // get last obj of documents
        let savedCurrentDoc = {};
        savedCurrentDoc._id = $scope.documents[$scope.documents.length -1]._id;
        savedCurrentDoc.date = $scope.documents[$scope.documents.length -1].date;
        savedCurrentDoc.text= $scope.text;
        $scope.documents[$scope.documents.length -1].text =  $scope.text;
        $scope.text = '';
        var text  = $('#editorField').text();
        savedCurrentDoc.subject = text.substr(0, 20);
        $scope.documents[$scope.documents.length -1].subject = savedCurrentDoc.subject
        // check if current doc
        db.update({_id : savedCurrentDoc._id}, savedCurrentDoc, {upsert : true }, function(err,newDoc) {
            if(err){
                console.log(err);
            }
            console.log('updated',newDoc);
            $timeout(function() {
              _addEmptyRecord();
            })

        })

    }

    $scope.delete = function () {

    }

    $scope.new = function () {

    }

    init();
});
