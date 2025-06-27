import mysql from "mysql2/promise"
import { config } from "../config/config.js";

// Create a pool to manage conections and querys to database
// Modify crdentials with yours to make tests
const host = config.db.host;
const user = config.db.user;
const password = config.db.password;
const database = config.db.name;

export const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});