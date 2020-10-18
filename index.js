// Dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Moment JS for user
const moment = require('moment');
const today = moment().format('YYYY-MM-DD');

// To create the connection to database/localConnection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: "employee_DB"
});

connection.connect(function(err) {
    // Connection Error Handling
    if (err) throw err;

    // To log connection to user
    console.log("Connected as ID: " + connection.threadId + "\n");
    askPrompt();
});

// To start Prompt for User to select Options
function askPrompt() {
    inquirer.prompt({
        message: "Select what you'd like to do! :)",
        type: "list",
        choices: [
            "View all Employees?",
            "View all Departments?",
            "View all Roles?",
            "Add Employee?",
            "Add Department?",
            "Add Role?",
            "Update Employee Role?",
            "QUIT"
        ],
        name: "choice"
    }).then(answers => {
        console.log(answers.choice);
        // Switch Case to run the specific selection
        switch (answers.choice) {
            case "View all Employees?":
                viewEmployees();
                break;

            case "View all Departments?":
                viewDepartments();
                break;

            case "View all Roles?":
                viewRoles();
                break;

            case "Add Employee?":
                addEmployee();
                break;

            case "Add Department?":
                addDepartment();
                break;

            case "Add Role?":
                addRole();
                break;

            case "Update Employee Role?":
                updateEmployeeRole();
                break;

            default:
                console.log('GoodBye! ' + today);
                connection.end();
                break;
        };
    });
};

// To get a complete of the employees
function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, data) {
        console.table(data);
        askPrompt();
    });
};

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        console.table(data);
        askPrompt();
    });
};

function viewRoles() {
    connection.query("SELECT * FROM roles", function (err, data) {
        console.table(data);
        askPrompt();
    });
};

function addEmployee() {
    inquirer.prompt([{
            type: "input",
            name: "firstName",
            message: "What is the employees first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employees last name?"
        },
        {
            type: "number",
            name: "roleId",
            message: "What is the employees role ID?"
        },
        {
            type: "number",
            name: "managerId",
            message: "What is the employees manager's ID?"
        }
    ]).then(function(res) {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.roleId, res.managerId], function(err, data) {
            if (err) throw err;
            console.table(data);
            askPrompt();
        });
    });
};

function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "department",
        message: "What is the department that you want to add?"
    }, ]).then(function(res) {
        connection.query('INSERT INTO department (name) VALUES (?)', [res.department], function(err, data) {
            if (err) throw err;
            console.table(data);
            askPrompt();
        });
    });
};

function addRole() {
    inquirer.prompt([
        {
            message: "enter title:",
            type: "input",
            name: "title"
        }, {
            message: "enter salary:",
            type: "number",
            name: "salary"
        }, {
            message: "enter department ID:",
            type: "number",
            name: "department_id"
        }
    ]).then(function (res) {
        connection.query("INSERT INTO roles (title, salary, department_id) values (?, ?, ?)", [res.title, res.salary, res.department_id], function (err, data) {
            console.table(data);
        })
        askPrompt();
    });
};

function updateEmployeeRole() {
    inquirer.prompt([
        {
            message: "which employee would you like to update? (Please Enter ID)",
            type: "input",
            name: "name"
        }, {
            message: "enter the new role ID:",
            type: "number",
            name: "role_id"
        }
    ]).then(function (res) {
        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [res.role_id, res.name], function (err, data) {
            console.table(data);
        })
        askPrompt();
    });
};