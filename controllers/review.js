
const Review = require("../MODELS/review")
const Listing = require('../MODELS/listing')


module.exports.createReview = async(req,res)=>{
    
    const reviewData = req.body.review || req.body.Review;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(reviewData);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","review created successfully!")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","review deleted successfully!")

    res.redirect(`/listings/${id}`)
}