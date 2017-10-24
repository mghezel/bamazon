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
  managerView();
});

function managerView() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Please select one of the following options",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          viewProducts();
          break;

        case "View Low Inventory":
          lowInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          addNewProduct();
          break;

        case "Exit":          
          process.exit(0); 
      }
    });
}

function viewProducts() {
  
      var sql = "SELECT * FROM products";
      connection.query(sql, function(err, res) {
      if (err) throw error;
        // for (var i = 0; i < res.length; i++) {
        //   console.log("Item: " + res[i].item_id + " || product: " + res[i].product_name 
        //   	+ " || Department: " + res[i].department_name + " || Quantity: " + res[i].stock_quantity
        //   	+ " || Price: " + res[i].price);
        // }

        console.table(res);

        managerView();

      });  
 }

 function lowInventory(){

 	var sql = "SELECT * FROM products where stock_quantity < ? ";
 	connection.query(sql, [5], function(err, res) {
 	  if (err) throw error;
 	  // console.log("\n","Item Number" ,"Product Name","Department","Stock quantity", "Price", "\n");
    //   console.log("-------------------------------------");
 	  // for (var i=0; i < res.length; i++){
 	  // 	console.log(res[i].item_id +"|" +res[i].product_name + "|" + res[i].department_name+
    //       "|"+ res[i].stock_quantity+ "|"+ res[i].price);        
    //     }

        console.table(res);

        managerView();
 	});

 }

 function addInventory() {
  inquirer
    .prompt([
    {
      name: "item",
      type: "input",
      message: "which item you would like to add?"
    },

    {
      type: "input",
      name: "addQuantity",
      message: "Please enter the quantity:"
    },

    ])
    .then(function(answer) {
    	      
      connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?', [answer.addQuantity, answer.item], function (error, results, fields) {

          if (error) throw error;        
          
        });
      
        managerView();
      });
  }

  function addNewProduct() {
  inquirer
    .prompt([
    {
      type: "input",
      name: "item",      
      message: "please enter the item number for the new product"
    },

    {
      type: "input",
      name: "product",      
      message: "please add the product name"
    },

    {
      type: "input",
      name: "department",      
      message: "please enter the department"
    },

    {
      type: "input",
      name: "addQuantity",
      message: "Please enter the quantity:"
    },

    {
      type: "input",
      name: "price",
      message: "Please enter the price:"
    },

    ])
    .then(function(answer) {
      
     	var post  = {item_id: answer.item, product_name: answer.product, department_name: answer.department, stock_quantity: answer.addQuantity, price: answer.price};
		var query = connection.query('INSERT INTO products SET ?', post, function (error, res, fields) {
  		if (error) throw error;
  
		});
      
        managerView();
      });
  }