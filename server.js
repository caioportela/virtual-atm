'use strict';

const bodyParser = require('body-parser');
const express = require('express');

const PORT = 3000;

const app = express();

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
