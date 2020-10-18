// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

const mysql = require('mysql2');
var inquirer = require('inquirer');

// To create the connection to database/localConnection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'EnderW_766!Val.',
    database: './db/employee'
});

console.log(connection);

connection.connect(function(err) {
    // Connection Error Handling
    if (err) throw err;

    // To log connection to user
    console.log(`Now connected as ${connection.threadId}`);
    startPrompt();
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
    connection.query("SELECT * FROM role", function (err, data) {
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
            console.table("Successfully Inserted");
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
            console.table("Successfully Inserted");
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
    ]).then(function (response) {
        connection.query("INSERT INTO roles (title, salary, department_id) values (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
            console.table(data);
        })
        askPrompt();
    });
};

function updateEmployeeRole() {
    inquirer.prompt([
        {
            message: "which employee would you like to update? (use first name only for now)",
            type: "input",
            name: "name"
        }, {
            message: "enter the new role ID:",
            type: "number",
            name: "role_id"
        }
    ]).then(function (response) {
        connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.name], function (err, data) {
            console.table(data);
        })
        askPrompt();
    });
};