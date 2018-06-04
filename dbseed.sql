-- (CAREFUL!!) Drops the DB if it already exists --
-- DROP DATABASE IF EXISTS bamazon;
-- Create a database --
CREATE DATABASE IF NOT EXISTS bamazon;

-- Use db for the following statements --
USE bamazon;

CREATE TABLE IF NOT EXISTS products (
  item_id int not null auto_increment,
  product_name varchar(100) not null,
  department_name varchar(100) not null,
  price float not null,
  stock_quantity int not null,
  product_sales float not null default 0,

  primary key (item_id)
);


CREATE TABLE IF NOT EXISTS departments (
  department_id int not null auto_increment,
  department_name varchar(100) not null,
  over_head_costs float not null,

  primary key (department_id)
);


-- Seed data
INSERT INTO departments (department_name, over_head_costs) 
  VALUES ('Collectibles', 1000);
INSERT INTO departments (department_name, over_head_costs) 
  VALUES ('Appliances', 5000);
INSERT INTO departments (department_name, over_head_costs) 
  VALUES ('Electronics', 40000);


-- Seed data
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
  VALUES ('BeanyBaby', 'Collectibles', 10.50, 12, 1050.00);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
  VALUES ('Toaster', 'Appliances', 21.45, 10, 1072.50);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
  VALUES ('VCR', 'Electronics', 49.50, 100, 1237.50);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
  VALUES ('Figurine', 'Collectibles', 19.99, 24, 899.55);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
  VALUES ('Blender', 'Appliances', 29.75, 8, 952);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
  VALUES ('iPod', 'Electronics', 175.50, 60, 15444);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
  VALUES ('Paddington', 'Collectibles', 15.00, 30, 3750);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
  VALUES ('Microwave', 'Appliances', 110.00, 18, 7480);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
  VALUES ('XBox', 'Electronics', 399.00, 12, 27930);
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) 
  VALUES ('SnowGlobe', 'Collectibles', 9.50, 11, 5320);
  
SELECT * FROM products;
