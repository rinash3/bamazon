var mysql = require("mysql");
var inquirer = require("inquirer");

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
    displyProducts();
   
});
function displyProducts(){
connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.table(results);
    askProductID(results)
});
}
//ask the customer for product id
function askProductID(inventory){
    inquirer
    .prompt ([
        {
            type: "Input",
            name:"selection",
            message:"What is the id for the item you want to buy?"
        }

    ])
    .then (function (userInput) {
        var selectionId = parseInt(userInput.selection);
        var product = checkInventory(selectionId, inventory);
        //if product with selected id exists ask the user for quantity  
        if(product){
            askForQuantity(product);
        }else 
        {
            //if product was not found 
            console.log("selected item is out of stock, please select another item from the list ")
            displyProducts();
        }
    });
}
function askForQuantity(product){
    inquirer
    .prompt ([
        {
        type: "input",
       name:"quantity",
       message:"How many of the selected item would you like?"
        }
    ])
    .then (function (Input){
        var quantity = parseInt(Input.quantity);

        if (quantity > product.stock_quantity) {
            console.log("Insufficient quantity!");
            displyProducts();
          }
          else {
            // Otherwise run makePurchase, give it the product information and desired quantity to purchase
            buy(product, quantity);
          }
        });
}
function buy(product, quantity) {
    connection.query(
      "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
      [quantity, product.item_id],
      function(err, res) {
        
        console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
        displyProducts();
      }
    );
  }
  function checkInventory(selectionId, inventory){
      for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === selectionId) {
            // If a matching product is found, return the product
            return inventory[i];
          }else {
              return null;
          }
          
      }
  }