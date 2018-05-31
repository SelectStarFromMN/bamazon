-- (CAREFUL!!) Drops the DB if it already exists --
-- DROP DATABASE IF EXISTS bamazon;
-- Create a database --
CREATE DATABASE bamazon;

-- Use db for the following statements --
USE bamazon;

CREATE TABLE products (
  item_id int not null auto_increment,
  product_name varchar(100) not null,
  department_name varchar(100) not null,
  price float not null,
  stock_quantity int not null,

  primary key (item_id)
);

-- Create new example rows
INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('BeanyBaby', 'Collectibles', 10.50, 12);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('Toaster', 'Appliances', 21.45, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('VCR', 'Electronics', 49.50, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('Figurine', 'Collectibles', 19.99, 24);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('Blender', 'Appliances', 29.75, 8);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('iPod', 'Electronics', 75.50, 60);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('Paddington', 'Collectibles', 15.00, 30);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('Microwave', 'Appliances', 110.00, 18);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('XBox', 'Electronics', 399.00, 12);
INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('SnowGlobe', 'Collectibles', 9.50, 11);
  
SELECT * FROM products;
