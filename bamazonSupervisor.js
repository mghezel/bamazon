var mysql = require("mysql");
var inquirer = require("inquirer");
var myconsole = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1359",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  supervisorView();
});

function supervisorView() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Please select one of the following options",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
        "Exit"       
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Product Sales by Department":
          viewProductSales();
          break;

        case "Create New Department":
          createNewDepartment();
          break; 

        case "Exit":          
          process.exit(0);           
       }
    });
}

function viewProductSales() {
  
      var sql = "SELECT department_id, department_name, over_head_costs, SUM(stock_quantity * price) as product_sales, SUM(stock_quantity * price) - over_head_costs as total_profit";
				    
		  sql += " FROM departments INNER JOIN products USING (department_name) GROUP BY department_name";


      console.log(sql);
      connection.query(sql, function(err, res) {
      	
      	if (err) throw err;
      	//console.log(err);
      	//console.log(res);

        // for (var i = 0; i < res.length; i++) {
        //   console.log("dept_id: " + res[i].department_id + " || dept_name: " + res[i].department_name 
        //   	+ " || overHeadCost: " + res[i].over_head_costs + " || Product_sales: " + res[i].product_sales
        //   	+ " || total_profit: " + res[i].total_profit);
        // }

        console.table(res);

        supervisorView();

      });  
 }

 function createNewDepartment() {
  inquirer
    .prompt([
    {
      type: "input",
      name: "dept_name",      
      message: "please add a new department"
    },

    {
      type: "input",
      name: "overHeadCost",      
      message: "please enter an over head cost for the new department"
    },
    
    ])
    .then(function(answer) {
      
     	var post  = {department_name: answer.dept_name, over_head_costs: answer.overHeadCost};
		var query = connection.query('INSERT INTO departments SET ?', post, function (error, res, fields) {
  		if (error) throw error;
  
		});
      
        supervisorView();
      });
  }
