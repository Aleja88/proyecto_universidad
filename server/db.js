require("dotenv").config();

const mysql = require('mysql2');

const conection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'universidad'
});

conection.connect((err) => {
    if (err) {
        console.error('Error connecting to database',err);
        return;
    }

     console.log('Connecte to mysql database');
}); 

module.exports = conection;

