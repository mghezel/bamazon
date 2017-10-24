var inquirer = require("inquirer");
var mysql = require("mysql");
var myconsole = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  
  user: "root",
  
  password: "1359",
  database: "bamazon"
})

connection.connect(function(err) {
  if (err) throw err;
 // console.log("connected as id " + connection.threadId);
  //connection.end();
  displayProducts();
  
});

function displayProducts(){
  
  var sql = 'SELECT * FROM products';  

  connection.query(sql, function (error, results, fields) {
      if (error) throw error;
      //console.log(results);
      // console.log("\n","Item Number" ,"Product Name","Department","Stock quantity", "Price", "\n");
      // console.log("-------------------------------------");
      // for(var i=0; i <results.length; i++ ){
        
      //   console.log(results[i].item_id +"|" +results[i].product_name + "|" + results[i].department_name+
      //    "|"+ results[i].stock_quantity+ "|"+ results[i].price);        
      //   }

        console.table(results);

        inquirer.prompt([

          {
            type: "input",
            name: "exit",
            message: "do you want to exit?:"
          },

        ]).then(function(data) {

        if (data.exit == "yes") process.exit(0);
        else afterConnection();        

      });
        
    });
  }

function afterConnection(){

  inquirer.prompt([

    {
      type: "input",
      name: "itemId",
      message: "Please enter the Item Number you would like to buy:"
    },

    {
      type: "input",
      name: "itemQuantity",
      message: "Please enter the quantity:"
    },
    

    ]).then(function(data) {

    
  var userId = data.itemId;
  var userQuantity = data.itemQuantity;

  var sql = 'SELECT * FROM products WHERE item_id = ' + connection.escape(userId);
  
  connection.query(sql, function (error, res, fields) {
      if (error) throw error;

      if (parseInt(res[0].stock_quantity) < userQuantity){
        console.log("Insufficient Quantity");
      }
      else{

        var diff = parseInt(res[0].stock_quantity - userQuantity);        
        var total = parseInt(res[0].price) * userQuantity;
        console.log("Total Price:" + total);
        console.log("------------------------------------------");

        //update the table with new quantity

        connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [diff, userId], function (error, results, fields) {

          if (error) throw error;        
          
        });
      }
        
        displayProducts();

      });
  });
}