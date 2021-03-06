import express from "express";
const app = express();
var cors = require('cors');

app.use(cors());

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))

const PORT = 9000; 

// define a route handler for the default home page
app.use('/users', require('./routes/users.js'));

// start the Express server
app.listen(PORT, () => {
    console.log(`${PORT}`);
});