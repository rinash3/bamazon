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
function askProductID(results){
   
    inquirer
    .prompt ([
        {
            type: "Input",
            name:"selection",
            message:"What is the id for the item you want to buy?"
        }

    ])
    .then (function (Input) {
 
        var selectionId = parseInt(Input.selection);
        
        var product=checkInventory(selectionId, results);

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
 var price = (product.price * quantity);
    connection.query(
      "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
      [quantity, product.item_id],
      function(err, res) {
        
        console.log("Successfully purchased " + quantity + " " + product.product_name +" ," + "Your Total Price:" + price +"$");
        
        displyProducts();
      }
    );
  }

  function checkInventory(selectionId, results){
   
      for (var i = 0; i < results.length; i++) {
        if (results[i].item_id === selectionId) {
            // If a matching product is found, return the product
            return results[i];
          }
      }return null
  }
  
  //need to add quit option if user is done buying 