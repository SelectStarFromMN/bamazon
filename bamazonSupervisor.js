// SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS total_product_sales,  SUM(p.product_sales) - d.over_head_costs AS department_profit FROM products p
// JOIN departments  d ON d.department_name = p.department_name
// GROUP BY p.department_name
// ORDER BY 2 DESC

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
        showSupervisorMenu();
    }
})

function showSupervisorMenu() {
    inquirer
        .prompt([
            {
                name: "choice",
                type: "checkbox",
                choices: ["View Product Sales by Department", "Create New Department", "View Departments"],
                validate: function (arr) { if (arr.length === 1) return true; else return "Please select exactly one product." },
                message: "Please select Administrative Task"
            }
        ])
        .then(function (answer) {
            switch (answer.choice[0]) {
                case "View Product Sales by Department":
                    showDeptSummary();
                    break;
                case "Create New Department":
                    addNewDepartment();
                    break;
                case "View Departments":
                    showAllDepartments();
                    break;
            }

        }); // inquirer.then
}


function showDeptSummary() {
    var query =
        `SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS total_product_sales,  SUM(p.product_sales) - d.over_head_costs AS department_profit FROM products p
JOIN departments  d ON d.department_name = p.department_name
GROUP BY p.department_name
ORDER BY 5 DESC`;
    connection.query(query, function (err, results) {
        // throw and exit on error
        if (err) throw err;

        // Display formatted table results
        console.log(results);
        formatDepartmentSales(results);

        // Close dbconnection
        connection.end();
    })
}


function formatDepartmentSales(results) {
    // Format table header
    console.log(`
+---------+----------------+-----------------+-------------+----------------+
| dept_id | dept_name      |   dept_overhead | total_sales |    dept_profit |
+---------+----------------+-----------------+-------------+----------------+ `);

    // Format each row
    for (i = 0; i < results.length; i++) {
        var item = results[i];
        console.log(
            `| ${item.department_id.toString().padEnd(7)} | ${item.department_name.toString().padEnd(14)} | ${item.over_head_costs.toFixed(2).toString().padStart(15)} | ${item.total_product_sales.toFixed(2).toString().padStart(11)} | ${item.department_profit.toFixed(2).toString().padStart(14)} |`
        );
    }

    // Format table footer
    console.log(`+---------+----------------+-----------------+-------------+----------------+`);
}


function addNewDepartment() {
    // Build an inquirer choice list of Department fields
    inquirer
        .prompt([
            {
                type: "input",
                name: "department_name",
                message: "New Department Name?"
            },
            {
                type: "input",
                name: "over_head_costs",
                message: "New Department Overhead?",
                default: "Misc"
            }
        ])
        .then(function (answer) {
            var department_name = answer.department_name;
            var over_head_costs = answer.over_head_costs;

            DbAddNewDepartment(department_name, over_head_costs);

        }); // inquirer.then
}

function DbAddNewDepartment(department_name, over_head_costs) {
    connection.query(
        "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)",
        [department_name, over_head_costs],
        function (error) {
            if (error) throw error;
        }
    );
    // Confirm new product to user
    console.log(`\n> New Department: "${department_name}" added.\n`);

    // Close dbconnection
    // connection.end();
    showAllDepartments();
}

function showAllDepartments() {
    connection.query("SELECT * FROM departments", function (err, results) {
        // throw and exit on error
        if (err) throw err;

        // Display formatted table results
        formatDepartmentsTable(results);

        // Close dbconnection
        connection.end();
    })
}

function formatDepartmentsTable(results) {
    // Format table header
    console.log(`
+---------------+--------------------+------------------+
| department_id | department_name    |  over_head_costs |
+---------------+--------------------+------------------+`);

    // Format each row
    for (i = 0; i < results.length; i++) {
        var item = results[i];
        console.log(
            `| ${item.department_id.toString().padEnd(13)} | ${item.department_name.toString().padEnd(18)} | ${item.over_head_costs.toFixed(2).toString().padStart(16)} |`
        );
    }

    // Format table footer
    console.log(`+---------------+--------------------+------------------+`);
}
