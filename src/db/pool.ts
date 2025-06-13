import mysql from "mysql2/promise"

// Create a pool to manage conections and querys to database
// Modify crdentials with yours to make tests

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo-app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});