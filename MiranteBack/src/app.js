const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const mainRoute = require('./routes/main');

app.use(bodyParser.json());
app.use(cors());
app.use(mainRoute);

module.exports = { app };