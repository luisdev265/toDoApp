import mysql from "mysql2/promise"
import dotenv from "dotenv";

dotenv.config();

// Create a pool to manage conections and querys to database
// Modify crdentials with yours to make tests
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

export const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});