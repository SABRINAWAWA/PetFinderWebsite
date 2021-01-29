// Connected to Express and Router
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { validatePetAdoption, validateShelter, isAuthor, isLoggedIn } = require('../middleware');
const shelterController=require('../controllers/shelter');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// shelter & petAdoption ==> Set up New Page for new pet for shelter
router.get('/:id/petAdoption/new', isLoggedIn, catchAsync(shelterController.renderPetNewForm));
router.post('/:id/petAdoption/new', isLoggedIn, upload.array('image'), validatePetAdoption, catchAsync(shelterController.createPetForm));

// shelter & petAdoption ==> Set up Index Page for new pet for shelter
router.get('/:id/petAdoption', catchAsync(shelterController.showPetFrom));

// shelter & petAdoption ==> Delete one adoptablePet item from shelter
router.delete('/:id/petAdoption/:petId', isLoggedIn, catchAsync(shelterController.deletePetForm));

// shelter ==> Set up Index page to 'index.ejs', it will display all shelters.
router.get('/', catchAsync(shelterController.index));

// shelter ==> Set up New page to 'new.ejs', it will add a new pet item to Shelter DB.
router.get('/new', isLoggedIn, catchAsync(shelterController.renderNewForm));
router.post('/', isLoggedIn, upload.array('image'), validateShelter, catchAsync(shelterController.createNewForm));

// shelter ==> Show Page Request
router.get('/:id', catchAsync(shelterController.showFrom));

// shelter ==> Edit Page Request
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(shelterController.renderEditForm));

// shelter ==> Update Page Request
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateShelter, catchAsync(shelterController.updateForm));

// shelter ==> Delete Page Request
router.delete('/:id/petAdoption/:petId', isLoggedIn, isAuthor, catchAsync(shelterController.deleteForm));

module.exports = router;