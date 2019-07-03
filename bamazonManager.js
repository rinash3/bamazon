var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("table")

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Dindin123!!",
    database: "bamazon"
});
connection.connect(function(err) {
    if (err) throw err;
    displyMenu();
   
});
function displyMenu(){
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        displayOptions(results);
    });
}
function displayOptions(products){
    inquirer
    .prompt([
        {
      type: "list",
      name: "choice",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
      message: "What would you like to do?"
        }
    ])
    .then(function(option) {
        switch (option.choice) {
        case "View Products for Sale":
          console.table(products);
          displyMenu();
          break;
        case "View Low Inventory":
          lowInventory();
          break;
        case "Add to Inventory":
          addToInventory(products);
          break;
        case "Add New Product":
          addNewProduct(products);
          break;
        default:
          console.log("Goodbye!");
          process.exit(0);
          break;
        }
      });
  }
