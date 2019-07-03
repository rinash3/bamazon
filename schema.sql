DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE products(
 item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(40) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price DECIMAL (10,2) NOT NULL,
  stock_quantity INT (20) NOT NULL,
  PRIMARY KEY (item_id)
);
SELECT * FROM products;
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("x-box", "Video Games", 30.95, 100),
 ("Monopoly", "Board Games", 20.50, 25),
  ("Dress", "Apparel", 59.99, 150),
  ("Sandales", "FootWare", 24.50, 50),
  ("T-shirts", "Apparel", 10.00, 15),
  ("Shorts", "Apparel", 25.25, 35),
  ("Wipes", "Baby", 11.99, 40),
  ("Pampers", "Baby", 59.95, 25),
  ("The Very Hungry Caterpillar", "books", 5.50, 60),
  ("Rice Cooker", "Appliances", 29.92, 22);