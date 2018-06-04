// Requires
var inquirer = require('inquirer');
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon',
    // port: 3306,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
})

connection.connect(function (err) {
    if (err) {
        console.log('Error: ' + err + '\nStack: ' + err.stack);
        return;
    } else {
        showManagerMenu();
    }
})

function showManagerMenu() {
    inquirer
        .prompt([
            {
                name: "choice",
                type: "checkbox",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                validate: function (arr) { if (arr.length === 1) return true; else return "Please select exactly one product." },
                message: "Please select Administrative Task"
            }
        ])
        .then(function (answer) {
            switch (answer.choice[0]) {
                case "View Products for Sale":
                    showAllProducts();
                    break;
                case "View Low Inventory":
                    showLowInventory(5);
                    break;
                case "Add to Inventory":
                    updateInventory();
                    break;
                case "Add New Product":
                    addNewProduct();
            }

        }); // inquirer.then
}

function showAllProducts() {
    connection.query("SELECT * FROM products", function (err, results) {
        // throw and exit on error
        if (err) throw err;

        // Display formatted table results
        formatProductTable(results);

        // Close dbconnection
        connection.end();
    })
}



function showLowInventory(cutoff) {
    connection.query("SELECT * FROM products WHERE stock_quantity < ?", [cutoff], function (err, results) {
        // throw and exit on error
        if (err) throw err;

        // Display formatted table results
        formatProductTable(results);

        // Close dbconnection
        connection.end();
    })
}

function updateInventory() {
    // Select product(s) to update
    // Loop and Update
    connection.query("SELECT * FROM products", function (err, results) {
        // throw and exit on error
        if (err) throw err;
        // Build an inquirer choice list of all the products
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "checkbox",
                    choices: function () {
                        var choiceArray = ["Cancel"];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(`${i.toString().padEnd(3)} ItemID: ${results[i].item_id.toString().padEnd(6)}  Product: ${results[i].product_name.padEnd(20)}  Stock: ${results[i].stock_quantity}`);
                        }
                        return choiceArray;
                    },
                    validate: function (arr) { if (arr.length === 1) return true; else return "Please select exactly one product." },
                    message: "Which product would you like to restock?"
                },
                {
                    name: "quantity",
                    when: function (answers) { if (answers.choice[0] != 'Cancel') return true; else return false; },
                    type: "input",
                    validate: function (quantity) { if (Number.isInteger(parseInt(quantity)) && (parseInt(quantity) > -1)) return true; else return "Please enter a non-negative quantity." },
                    message: "How many would you like to add?"
                }
            ])
            .then(function (answer) {
                var chosenItem;
                var itemIndex;
                var quantity;
                // Check whether the user has chosen to cancel out
                if (answer.choice[0] == "Cancel") {
                    console.log("\nRestocking finished.\n")
                    connection.end();
                }
                else {
                    // Our choice array intentionally encodes the index as the 1st item in the string
                    itemIndex = parseInt(answer.choice[0].split(" ")[0]);
                    chosenItem = results[itemIndex];
                    quantity = parseInt(answer.quantity)

                    addStock(chosenItem, quantity);
                }
            }); // inquirer.then
    })
}


function addStock(item, quantity) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: (item.stock_quantity + quantity)
            },
            {
                item_id: item.item_id
            }
        ],
        function (error) {
            if (error) throw err;
        }
    );
    // Confirm restock to user
    console.log(`\n> ${quantity} ${item.product_name} units have been added to warehouse stock. Quantity now: ${item.stock_quantity + quantity}\n`);

    // Return to Inventory
    updateInventory();
}

function addNewProduct () {
        // Build an inquirer choice list of product fields
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "product_name",
                    message: "New Product Name?"
                },
                {
                    type: "input",
                    name: "department_name",
                    message: "New Product Department?",
                    default: "Misc"
                },
                {
                    type: "input",
                    name: "price",
                    message: "New Product Price?",
                    validate: function (price) { if (!isNaN(price))  return true; else return "Please enter a price."; }
                },
                {
                    type: "input",
                    name: "quantity",
                    message: "New Product Quantity?",
                    validate: function (quantity) { if (Number.isInteger(parseInt(quantity)) && (parseInt(quantity) > 0)) return true; else return "Please enter an integer quantity." }
                }
            ])
            .then(function (answer) {
                var product_name = answer.product_name;
                var department_name = answer.department_name;
                var price = parseFloat(answer.price);
                var quantity = parseInt(answer.quantity);
                
                DbAddNewProduct(product_name, department_name, price, quantity);
                
            }); // inquirer.then
}

function DbAddNewProduct (product_name, department_name, price, quantity) {
    connection.query(
        "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
        [product_name, department_name, price, quantity],
        function (error) {
            if (error) throw err;
        }
    );
    // Confirm new product to user
    console.log(`\n> New Product: "${product_name}" added.\n`);
 
    // Close dbconnection
    // connection.end();
    showAllProducts();
}

function formatProductTable(results) {
    // Format table header
    console.log(`
+---------+--------------+-----------------+------------+----------------+
| item_id | product_name | department_name |      price | stock_quantity |
+---------+--------------+-----------------+------------+----------------+ `);

    // Format each row
    for (i = 0; i < results.length; i++) {
        var item = results[i];
        console.log(
            `| ${item.item_id.toString().padEnd(7)} | ${item.product_name.toString().padEnd(12)} | ${item.department_name.toString().padEnd(15)} | ${item.price.toFixed(2).toString().padStart(10)} | ${item.stock_quantity.toString().padStart(14)} |`
        );
    }

    // Format table footer
    console.log(`+---------+--------------+-----------------+------------+----------------+`);
}
