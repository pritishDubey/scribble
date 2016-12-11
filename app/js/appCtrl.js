var mainApp   = angular.module("notes", ['angularTrix']);
const uuidV4  = require('uuid/v4');
var moment    = require('moment')

mainApp.controller('appCtrl', function($scope,$timeout,documentBucket) {

    function init() {
        documentBucket.connectToDb();
        // init lists
        initList();
        //
        $scope.text = '';
        $scope.activeNoteIndex = 0;
    }

    $scope.save = function () {

        // get last obj of documents
        let currentDoc = {};
        currentDoc._id = $scope.notesBucket[$scope.activeNoteIndex]._id;
        currentDoc.date = $scope.notesBucket[$scope.activeNoteIndex].date;
        var docText = $scope.editor.getDocument().toString();
        docText = docText.split('\n')[0]
        currentDoc.subject = docText
        currentDoc.text = $scope.text;
        $scope.text = '';
        documentBucket.save(currentDoc);
        addEmptyNoteToBucket();
    }

    $scope.delete = function () {

    }

    $scope.new = function () {

    }


    function initList() {
        $scope.notesBucket =[]
        documentBucket.getAllDocs().then(function (docs) {
            $scope.notesBucket = docs;
            if($scope.notesBucket.length == 0){
                addEmptyNoteToBucket()
                $scope.setNoteActive(0)
            }
        },function (err) {
            console.log('Error getting all docs :',err);
        })
    }

    function addEmptyNoteToBucket() {
        let document      = {};
        document.text     = ''
        document._id      = uuidV4();
        document.date     = moment().format('ll');
        document.subject  = 'New Note'
        $scope.notesBucket.push(document)
    }

    $scope.setNoteActive = function(index) {
        $scope.activeNoteIndex = index;
    }

    $scope.trixInitialize = function(e, editor) {
        $scope.editor = editor;
    }

    init();
});
