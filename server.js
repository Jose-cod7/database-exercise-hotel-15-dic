const express = require("express")
const app = express()
const port = 3000
const {
    Pool
} = require("pg")

const secrets = require('./secrets.json')

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const pool = new Pool({
    user: "pepe",
    host: "localhost",
    database: "cyf_hotels2",
    password: secrets.password,
    port: 5432,
})

// FUNCTIONS
const getHotels = (request, response) => {
    pool
        .query("SELECT * FROM hotels")
        .then((result) => response.json(result.rows))
        .catch((e) => console.error(e))
}

// ENDPOINTS
app.get("/hotels", getHotels)


app.post("/hotels", function (req, res) {
    const newHotelName = req.body.name;
    const newHotelRooms = req.body.rooms;
    const newHotelPostcode = req.body.postcode;
  
    const query =
      "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
  
    pool
      .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
      .then(() => res.send("Hotel created!"))
      .catch((e) => console.error(e));
  });

  app.post("/customers", function (req, res) {
    const newCustomerName = req.body.name;
    const newCustomerEmail = req.body.email;
    const newCustomerAddress = req.body.address;
    const newCustomerCity = req.body.city;
    const newCustomerPostcode = req.body.postcode;
    const newCustomerCountry = req.body.country;
  
    const query =
      "INSERT INTO customers (name, email, address, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6)";
  
    pool
      .query(query, [newCustomerName, newCustomerEmail, newCustomerAddress, newCustomerCity, newCustomerPostcode, newCustomerCountry ])
      .then(() => res.send("Customer created!"))
      .catch((e) => console.error(e));
  });

  
  app.put("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;
    const newEmail = req.body.email;
  
    pool
      .query("UPDATE customers SET email=$1 WHERE id=$2", [newEmail, customerId])
      .then(() => res.send(`Customer ${customerId} updated!`))
      .catch((e) => console.error(e));
  });


  app.delete("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;
  
    pool
      .query("DELETE FROM customers WHERE id=$1", [customerId])
      .then(() => res.send(`Customer ${customerId} deleted!`))
      .catch((e) => console.error(e));
  });

app.listen(port, () => console.log(`Server is listening on port ${port}.`))
