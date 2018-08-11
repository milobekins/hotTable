//userInput

//JSON data for tables

var tables [{
    //JSON of tables
}]

var availableTables = [];

tables.forEach (table => {
    if (table.isAvailable) {
        availableTables.push(table);
    }
})

//reserving the table
var reserveTable = availableTables.shift();

reserveTable.isAvailable = false;