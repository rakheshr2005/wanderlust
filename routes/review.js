const express = require('express')
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {validateReview, isLoggedIn ,isReviewAuthor}= require("../middleware.js");
const Review = require("../MODELS/review.js");
const Listing = require("../MODELS/listing.js");
const session = require('express-session')








//review post route

router.post("/",isLoggedIn, validateReview,wrapAsync(async(req,res)=>{
    
    const reviewData = req.body.review || req.body.Review;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(reviewData);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","review created successfully!")
    res.redirect(`/listings/${listing._id}`)
}))


//delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","review deleted successfully!")

    res.redirect(`/listings/${id}`)
}

))

module.exports = router;