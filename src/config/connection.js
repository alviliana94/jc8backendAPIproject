const mysql = require('mysql')

const conn = mysql.createConnection({
    user: 'alviliana22',
    password: 'Vy@22Feb1994',
    host: 'db4free.net',
    database: 'jc8expressmysql2',
    port: '3306'
})

module.exports = conn