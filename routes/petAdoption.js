// Connected to Express and Router
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validatePetAdoption, isAdoptPetAuthor } = require('../middleware');
const petAdoptionController = require('../controllers/petadoption');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// petAdoption ==> Set up Index page to 'index.ejs', it will display all lost pets
router.get('/', catchAsync(petAdoptionController.renderIndex));

// petAdoption ==> Set up New page to 'new.ejs', it will add a new pet item to PetAdoption DB.
router.get('/new', isLoggedIn, catchAsync(petAdoptionController.renderNewForm));
router.post('/', isLoggedIn, upload.array('image'), validatePetAdoption, catchAsync(petAdoptionController.createNewForm));

// petAdoption ==> Show Page Request
router.get('/:id', catchAsync(petAdoptionController.showForm));

// petAdoption ==> Edit Page Request
router.get('/:id/edit', isLoggedIn, isAdoptPetAuthor, catchAsync(petAdoptionController.renderEditForm));

// petAdoption ==> Update Page Request
router.put('/:id', isLoggedIn, isAdoptPetAuthor, upload.array('image'), validatePetAdoption, catchAsync(petAdoptionController.updatePetForm));

// petAdoption ==> Delete Page Request
router.delete('/:id', isLoggedIn, catchAsync(petAdoptionController.deletePet));

module.exports = router;