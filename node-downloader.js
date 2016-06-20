var request = require('request');
var fs = require('fs');
var firebase = require("firebase");

firebase.initializeApp({
  serviceAccount: "./dronepan_node.json",
  databaseURL: "https://dronepan-dev.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref("uploads");

// Pull any files that have not been downloaded to the APS server yet
ref.orderByChild("downloaded").equalTo(false).on("value", function(snapshot) {
  snapshot.forEach(function(data) {
    var url = data.child("url").val();
    
    request(url).pipe(fs.createWriteStream("./uploads/" + data.key + ".zip").on('close', function() {
      downloadComplete(data.key);
    }));
    
  });
  
  // Exit script when done
  //process.exit();
  
});

// Update the download status
function downloadComplete(key) {
  
  console.log("Downloaded: " + key);
  
  ref = db.ref("uploads/" + key);
  
  ref.update({
    downloaded: true
  })
}