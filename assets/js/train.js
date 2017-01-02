// create a jumbotron to display the train name and destination.
// create a panel to display the current train schedule
// displayde basic spec Train
//  Name, Destination, First Train Time -- in military time, Frequency -- in minutes.
//  display1st train and cod it's spec.


// Initialize Firebase
var config = {
  apiKey: "AIzaSyC9Zq8C97UsEaAVPm79F2uN8vFEm01H61M",
  authDomain: "mytrainsched.firebaseapp.com",
  databaseURL: "https://mytrainsched.firebaseio.com",
  storageBucket: "mytrainsched.appspot.com",
  messagingSenderId: "814736096526"
};
firebase.initializeApp(config);

var dataRef = firebase.database();
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";




// Capture Button Click
$("#add-train").on("click", function() {

  // YOUR TASK!!!
  // Code in the logic for storing and retrieving the most recent user.
  // Don't forget to provide initial data to your Firebase database.
  trainName = $("#tName-input").val().trim();
  destination = $("#dest-input").val().trim();
  firstTrainTime = $("#tTime-input").val().trim();
  frequency = $("#frequency-input").val().trim();

  $("#tName-input").val(null);
  $("#dest-input").val(null);
  $("#tTime-input").val("");
  $("#frequency-input").val("");


  // Code for the push
  dataRef.ref().push({

    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  // Don't refresh the page!
  return false;
});



//value 
//child_added
// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")

// .on('value') triggers anytime any of the data changes 

//where as child_added only triggers if a child is added (not modified)
dataRef.ref().on("child_added", function(childSnapshot) {

  // Log everything that's coming out of snapshot
  console.log(childSnapshot.val().trainName);
 
  console.log(childSnapshot.val().destination);
  console.log(childSnapshot.val().firstTrainTime);
  console.log(childSnapshot.val().frequency);
  // console.log(childSnapshot.val().joinDate);

        var tFrequency = childSnapshot.val().frequency;

      // Time is 3:30 AM
      var firstTime = childSnapshot.val().firstTrainTime;

      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart (remainder)
      var tRemainder = diffTime % tFrequency;
      console.log(tRemainder);

      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // full list of items to the well
  var tr = $("<tr>");
  tr.append("<td>"+ childSnapshot.val().trainName)
  	.append("<td>"+ childSnapshot.val().destination)
  	.append("<td>"+ childSnapshot.val().frequency)
  	.append("<td>"+ moment(nextTrain).format("hh:mm A"))
  	.append("<td>"+ tMinutesTillTrain);

  $("#trainTable").append(tr);

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});
dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(data) {

  // Change the HTML to reflect
  $("#trainName-display").html(data.val().trainName);
  $("#dest-display").html(data.val().destination);
  $("#tTime-display").html(data.val().firstTrainTime);
  $("#frequency-display").html(data.val().frequency);
});
