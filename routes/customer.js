// Connected to Express and Router
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const customerController=require('../controllers/customer');

// Customer ==> Create new customers for the shelter
router.post('/petAdoption/:id/customers', isLoggedIn, catchAsync(customerController.newCustomer));

// Customer ==> Delete customer in shelter and the Customer itself
router.delete('/petAdoption/:id/customers/:customerId', isLoggedIn, catchAsync(customerController.deleteCustomer));
 
module.exports = router; 