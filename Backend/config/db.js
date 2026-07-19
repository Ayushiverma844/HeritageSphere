const mysql = require("mysql2/promise");

const MyConnection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await MyConnection.getConnection();
    console.log("✅ Connected to MySQL Database");
    connection.release();
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
  }
})();

module.exports = MyConnection;