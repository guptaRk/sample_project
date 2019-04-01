
Please change the password in server.js file as per your system and run following commands:

IN TERMINAL AT LOCATION OF FILE:
1.  npm install
2.  npm run server
3.  npm start

IN SQL TERMINAL:
1.  CREATE DATABASE TEST;
2.  USE TEST;
3.  CREATE TABLE CUSTOMERS (  
     email varchar(80) NOT NULL PRIMARY KEY,
  password varchar(255) NOT NULL
     );
4.  ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'password'; (change as per need)
