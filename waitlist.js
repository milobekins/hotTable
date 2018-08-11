// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Array that contains all guests currently waiting for a table
var waitListArr = [
    {
      customerName: "Jon Snow",
      customerEmail: "jonsnow@stark.com",
      phoneNumber: "000-000-0000",
      customerID: "JonSnowy"
    }, {
      customerName: "Billy Madison",
      customerEmail: "billy@highschool.com",
      phoneNumber: "111-111-1111",
      customerID: "BillyMad"
    }, {
      customerName: "Joe Dirt",
      customerEmail: "joedirt@lifesagarden.com",
      phoneNumber: "222-222-2222",
      customerID: "joedirty"
    }
  ];


// Array that contains all our table information
var tableInfo = [{
    name: "Table 1",
    seatMax: 2,
    isAvailable: true,
}, {
    name: "Table 2",
    seatMax: 4,
    isAvailable: true,
}, {
    name: "Table 3",
    seatMax: 6,
    isAvailable: true,
}, {
    name: "Table 4",
    seatMax: 4,
    isAvailable: true,
}, {
    name: "Table 5",
    seatMax: 1,
    isAvailable: true,
}];

// Variable that contains jQuery selectors
var newReservation = {
    customerName: $("#reserve-name").val().trim(),
    phoneNumber: $("#reserve-phone").val().trim(),
    customerEmail: $("#reserve-email").val().trim(),
    customerID: $("#reserve-unique-id").val().trim()
  };

  console.log(newReservation);

// Functions
// ==========================================================================================

function validateTables () {
    let tablesAvailableArr = [];
    var currentURL = window.location.origin;

    $.ajax({ url: currentURL + "api/tableInfo", method: "GET"
}).then(function(tableData){
    tableData.forEach(table => {
        if(table.isAvailable) {
            tablesAvailableArr.push(table);
        }
    });
});
    return(tablesAvailableArr.length <= 0 ? true : false);
}

function runTableQuery() {
    var currentURL = window.location.origin;

    $.ajax({ url: currentURL + "api/tableInfo", method: "GET"
}).then(function(tableData){
    tableData.forEach(table => {
        var tbl = $(".table");
        var thead = $("<thead");
        var tr = $("<th>");
        var th = $("<th>");
        th.append(table);
        tr.append(th);
        thead.append(tr);
        tbl.append(thead);
    });
});
}


function checkWaitList() {

    var currentURL = window.location.origin;

    // Ajax call
    $.ajax({ url: currentURL + "/api/waitlist", method: "GET" })
      .then(function(waitlistData) {

        // Loop through and displays current Waitlist
        for (var i = 0; i < waitlistData.length; i++) {

        // Creates Waitlist HTML section
          var waitlistSection = $("<div>");
          waitlistSection.addClass("well");
          waitlistSection.attr("id", "waitlistWell-" + i + 1);
          $("#waitlistSection").append(waitlistSection);

          var tableNumber = i + 1;
        
          // Displays remaining HTML fields
          $("#waitlistWell-" + i + 1).append("<h2><span class='label label-primary'>" + tableNumber + "</span> | " + waitlistData[i].customerID + "</h2>");
        }
      });
  }

  // Resets Table
  function clearTable() {

    var currentURL = window.location.origin;
    $.ajax({ url: currentURL + "/api/clear", method: "POST" });

  }

  $("#clear").on("click", function() {
    alert("Clearing...");
    clearTable();

    // Refresh the page after data is cleared
    location.reload();

  });

  // Submit OnClick 
$(".submit").on("click", function(event) {
    event.preventDefault();
    // Validates if there are any tables available
    if (!validateTables()) { 
        alert("Sorry. All tables are reserved!");
    } else {
        $.post("/api/tables", newReservation,
        function(data) {
            
            // If table is available
            if (data) {
                alert('Reservation Booked');
            }

            // If a table is unavailable 
            else { 
                alert('Added to Waitlist');
            }

            // Clears form
            $("#reserve-name").val("");
            $("#reserve-phone").val("");
            $("#reserve-email").val("");
            $("#reserve-unique-id").val("");
        });
    }
});


  // Run Queries!
  // ==========================================
  runTableQuery();
  checkWaitList();




// Export modules
module.exports = tableInfo, waitListArr;
