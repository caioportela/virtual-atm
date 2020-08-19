/**
 * Routes
 * @description :: Setup application routes
**/

const express = require('express');
const router = express.Router();

const { AccountController } = require('./controllers');

// Account Controller
router.post('/event', AccountController.event);
router.post('/reset', AccountController.reset);

module.exports = (app) => app.use(router);
