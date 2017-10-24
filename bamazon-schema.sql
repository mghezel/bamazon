DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  stock_quantity INT NULL,
  price DECIMAL(10,4) NULL,
  
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,  
  department_name VARCHAR(100) NULL,
  over_head_costs INT NULL, 
  
  PRIMARY KEY (department_id)
);


--sql for bamazonSupervisor

SELECT 
    department_id,
    department_name,
    over_head_costs,
    SUM(stock_quantity * price) as product_sales,
    SUM(stock_quantity * price) - over_head_costs as total_profit
    
FROM
    departments
        INNER JOIN
    products USING (department_name)
GROUP BY department_name;
