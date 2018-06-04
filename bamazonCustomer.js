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
        offerItems();
    }
})

function offerItems() {
    // Check the database for all items being offered
    console.log("\nWelcome back to Bamazon!\n")
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
                            choiceArray.push(`${i.toString().padEnd(3)} ItemID: ${results[i].item_id.toString().padEnd(6)}  Product: ${results[i].product_name.padEnd(20)}  Price: $${results[i].price.toFixed(2)}`);
                        }
                        return choiceArray;
                    },
                    validate: function (arr) { if (arr.length === 1) return true; else return "Please select exactly one product." },
                    message: "Which product would you like to purchase?"
                },
                {
                    name: "quantity",
                    when: function (answers) { if (answers.choice[0] != 'Cancel') return true; else return false; },
                    type: "input",
                    validate: function (quantity) { if (Number.isInteger(parseInt(quantity)) && (parseInt(quantity) > -1)) return true; else return "Please enter a non-negative quantity." },
                    message: "How many would you like?"
                }
            ])
            .then(function (answer) {
                var chosenItem;
                var itemIndex;
                // Check whether the user has chosen to cancel out
                if (answer.choice[0] == "Cancel") {
                    console.log("\nThis transaction has been cancelled.\n")
                    connection.end();
                }
                else {
                    // Our choice array intentionally encodes the index as the 1st item in the string
                    itemIndex = parseInt(answer.choice[0].split(" ")[0]);
                    chosenItem = results[itemIndex];

                    placeOrder(chosenItem, answer.quantity);

                    return chosenItem;
                }
                console.log("Shop Bamazon again soon!\n")
            }); // inquirer.then
    });
}

function placeOrder(item, quantity) {
    if (item.stock_quantity >= quantity) {
        connection.query(
            "UPDATE products SET ?, ? WHERE ?",
            [
                {
                    stock_quantity: (item.stock_quantity - quantity)
                },
                {
                    product_sales: (item.product_sales + (item.price * quantity))
                },
                {
                    item_id: item.item_id
                }
            ],
            function (error) {
                if (error) throw error;
            }
        );
        // Confirm purchase to user
        console.log(`\n> Dear Customer,  Your order for ${quantity} ${item.product_name} totalling $${(quantity * item.price).toFixed(2)} has been placed.  Thank you!\n`);
    } else {
        console.log(`\n> Dear Customer,  We're sorry but Bamazon only has ${item.stock_quantity} ${item.product_name}'s in stock, and we are unable to complete your order.\n`)
    }

    // Go back to store
    offerItems();
}

