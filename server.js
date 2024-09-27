const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

app.use(express.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
  user: process.env.db_user,
  host: process.env.db_host,
  password: process.env.db_password,
  database: process.env.database,
});
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to database");
  }

  
});
// Set up view engine
app.set("view engine", "ejs");
  app.set("views", __dirname + "/views");

  //route to get patients
//   ## 1. Retrieve all patients
  app.get("/patients", (req, res) => {
    db.query("SELECT * FROM patients", (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error retrieving data from database");
      } else {
        res.render("patients", { results: results });
      }
    });
  });

  //route to get providers
//   ## 2. Retrieve all providers
  app.get("/providers", (req, res) => {
    db.query("SELECT * FROM providers", (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error retrieving data from database");
      }
        else {
          res.render("providers", { results: results });
        }
      
    });
  });

//   ## 3. Filter patients by First Name
app.get("/patients_fname/:fname",(req,res)=>{
    const {fname }= req.params;
    db.query("SELECT * FROM patients WHERE first_name = ?", [fname], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error retrieving data from database");
      }
      else {
        res.render("patients", { results: results });
      }
    });
})

// ## 4. Retrieve all providers by their specialty
app.get("/providers_spec/:specialty",(req,res)=>{
    const {specialty }= req.params;
    db.query("SELECT * FROM providers WHERE provider_specialty = ?", [specialty], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error retrieving data from database");
      }
      else {
        res.render("providers", { results: results });
      }
    });
})

//starting the server
app.listen(process.env.port, () => {
  console.log(`server is running on port ${process.env.port}`);
  app.get("/", (req, res) => {
    res.send("server connected successfully");
    console.log("sending message to browser...");
  });
});
