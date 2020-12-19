const express = require("express")
const app = express()
const port = 3000
const {
    Pool
} = require("pg")

const secrets = require('./secrets.json')

const bodyParser = require("body-parser");
const { request, response } = require("express")

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

const getHotelsId = (request, response) => {
    const hotelsId = request.params.hotelsId;
    pool
        .query("SELECT * FROM hotels WHERE id=$1", [hotelsId])
        .then((result) => response.json(result.rows))
        .catch((e) => console.error(e));
}

const getCustomersByName = (request, response) => {
    pool
        .query("SELECT * FROM customers ORDER BY name ASC")
        .then((result) => response.json(result.rows))
        .catch((e) => console.error(e));
}

const getCustomersById = (request, response) => {
    const customersId = request.params.customerId;

    pool
        .query("SELECT * FROM customers WHERE id=$1", [customersId])
        .then((result) => response.json(result.rows))
        .catch((e) => console.error(e));
}

const getCostumerBookingsId = (request, response) => {
    const customersId = request.params.customerId
}

/* Add a new GET endpoint /customers/:customerId/bookings to load all the bookings of a specific customer. Returns the following information: check in date, number of nights, hotel name, hotel postcode. */

const postHotel = (request, response) => {
    const newHotelName = request.body.name;
    const newHotelRooms = request.body.rooms;
    const newHotelPostcode = request.body.postcode;
    const query = "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
    pool
        .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
        .then(() => response.send("Hotel created!"))
        .catch((e) => console.error(e));
}
const postCustomer = (request, response) => {
    const name = request.body.name;
    const email = request.body.email;
    const address = request.body.address;
    const city = request.body.city;
    const postcode = request.body.postcode;
    const country = request.body.country;
    const query = "INSERT INTO customers (name, email, address, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6)";

    pool
        .query("SELECT *  FROM customers WHERE name=$1", [name])
        .then((result) => {
          if (result.rows.length > 0) {
              return response
              .status (400)
              .send ("A customer with the same name already exists");
          } else {  
        
    pool
        .query(query, [name, email, address, city, postcode, country])
        .then(() => response.send("Customer created!"))
        .catch((e) => console.error(e));
        }
    });
};

const updateCustomerEmail = (request, response) => {
    const customerId = request.params.customerId;
    const newEmail = request.body.email;
    
    
            if (newEmail === "") {
                return response
                .status (400)
                .send ("You must enter an email");
            } else {

    pool
        .query("UPDATE customers SET email=$1 WHERE id=$2", [newEmail, customerId])
        .then(() => response.send(`Customer ${customerId} email updated!`))
        .catch((e) => console.error(e));
        }  
    };


const deleteCustomer = (req, res) => {
    const customerId = req.params.customerId;
    pool
        .query("DELETE FROM bookings WHERE customer_id=$1", [customerId])
        .then(() => {
            pool
                .query("DELETE FROM customers WHERE id=$1", [customerId])
                .then(() => res.send(`Customer ${customerId} deleted!`))
                .catch((e) => console.error(e));
        })
        .catch((e) => console.error(e));
};

const deleteHotel = (req, res) => {
    const hotelId = req.params.hotelId;
        /*pool
            .query("SELECT *  FROM bookings WHERE id=$1", [hotelId])
            .then((result) => {
                if (result.rows.length > 0) {
                    return res
                    .status (400)
                    .send ("A hotel with bookings can't be deleted");
             } else {*/
     pool
        .query("DELETE FROM bookings WHERE hotel_id=$1", [hotelId])
        .then(() => {           
     pool
        .query("DELETE FROM hotels WHERE id=$1", [hotelId])
        .then(() => res.send(`Hotel ${hotelId} deleted!`))
        .catch((e) => console.error(e));
        })
        .catch((e) => console.error(e));
};


// ENDPOINTS
app.get("/hotels", getHotels)
app.get("/hotels/:hotelsId", getHotelsId);
app.get("/customers", getCustomersByName);
app.get("/customers/:customerId", getCustomersById);
app.use(bodyParser.json());
app.post("/hotels", postHotel);
app.post("/customers", postCustomer);
app.put("/customers/:customerId", updateCustomerEmail);
app.delete("/customers/:customerId", deleteCustomer);
app.delete("/hotels/:hotelId", deleteHotel);
app.listen(port, () => console.log(`Server is listening on port ${port}.`))
