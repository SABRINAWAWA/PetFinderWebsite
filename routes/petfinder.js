// Connected to Express and Router
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isPetOwner, validatePet } = require('../middleware');
const petController = require('../controllers/petfinder');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// petfinder ==> Set up Index page to 'index.ejs', it will display all lost pets
router.get('/', catchAsync(petController.renderIndex));

// petfinder ==> Set up New page to 'new.ejs', it will add a new pet item to Pet DB.
router.get('/new', isLoggedIn, catchAsync(petController.renderNewForm));
router.post('/', isLoggedIn, upload.array('image'), validatePet, catchAsync(petController.createNewForm));

// petfinder ==> Show Page Request
router.get('/:id', catchAsync(petController.showPet));

// petfinder ==> Edit Page Request
router.get('/:id/edit', isLoggedIn, isPetOwner, catchAsync(petController.editPetForm));

// petfinder ==> Update Page Request
router.put('/:id', isLoggedIn, isPetOwner, upload.array('image'), validatePet, catchAsync(petController.updatePetForm));

// petfinder ==> Delete Page Request
router.delete('/:id', isLoggedIn, isPetOwner, catchAsync(petController.deletePetForm));

module.exports = router;