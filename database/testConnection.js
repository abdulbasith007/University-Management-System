const mysql = require('mysql');

// establish connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'university_management_system',
});
// connect to database
db.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log('Mysql Connected');
});
