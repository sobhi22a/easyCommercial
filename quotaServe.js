const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const database = require("./config/oracle/oracledb");
const apiRoute = require("./apiRoute");

// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 2090;

// Middleware Setup
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/easy", apiRoute);

// Database Connection
database.sequelize
  .authenticate()
  .then(() => console.log("Connection to Database has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

// Server Setup
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
