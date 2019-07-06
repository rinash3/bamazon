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
    displayMenu();
   
});
function displayMenu(){
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
          displayMenu();
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
          console.log("See you nexxt time!");
          process.exit(0);
          break;
        }
      });
  }
//check for products with low inventory
function lowInventory(){
  connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
    if (err) throw err;
    // Draw the table in the terminal using the response, load the manager menu
    console.table(res);
    displayMenu();
  });
}
function addToInventory(inventory){
  console.table(inventory);
  inquirer
  .prompt([
    {
      type: "input",
      name: "choice",
      message: "What is the item_id you would you like to add?",
      validate: function(val) {
        return !isNaN(val);
      }
    }
  ])
  .then(function(val) {
    var choiceId = parseInt(val.choice);
    var product = checkInventory(choiceId, inventory);

    // If a product exists
    if (product) {
      // ask for quantity
      askForQuantity(product);
    }
    else {
      
      console.log("Item is not found.");
      displayMenu();
    }
  });
}
function askForQuantity(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many of the selected item would you like to add?",
        validate: function(val) {
          return val > 0;
        }
      }
    ])
    .then(function(val) {
      var quantity = parseInt(val.quantity);
      addQuantity(product, quantity);
    });
}


function addQuantity(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
    [product.stock_quantity + quantity, product.item_id],
    function(err, res) {
      
      console.log("Successfully added " + quantity + " " + product.product_name + "'s!");
      displayMenu();
    }
  );
}
function addNewProduct(products) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "What is the name of the product ?"
      },
      {
        type: "list",
        name: "department_name",
        choices:  ["Apparel", "Appliances", "Baby", "Board Games", "books","FootWare","Video Games"],
        message: "Which department does this product belong to?"
      },
      {
        type: "input",
        name: "price",
        message: "What is the product price?",
        validate: function(val) {
          return val > 0;
        }
      },
      {
        type: "input",
        name: "quantity",
        message: "How many?",
        validate: function(val) {
          return !isNaN(val);
        }
      }
    ])
    .then(addProduct);
}
function addProduct(val) {
  connection.query(
    "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
    [val.product_name, val.department_name, val.price, val.quantity],
    function(err, res) {
      if (err) throw err;
      console.log(val.product_name + " ADDED!");
      displayMenu();
    }
  );
}
function checkInventory(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      return inventory[i];
    }
  }
  return null;
}