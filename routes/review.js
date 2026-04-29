const express = require('express')
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {validateReview, isLoggedIn ,isReviewAuthor}= require("../middleware.js");
const Review = require("../MODELS/review.js");
const Listing = require("../MODELS/listing.js");
const session = require('express-session')



const reviewController = require('../controllers/review.js');




//review post route

router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview))


//delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;