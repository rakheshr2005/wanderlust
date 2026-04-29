const express = require('express')
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")

const Listing = require("../MODELS/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")




//index route
router.get("/",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("LISTINGS/index.ejs",{allListings});
})


//new route
router.get("/new",isLoggedIn,(req,res)=>{
    
    res.render("LISTINGS/new.ejs");
})


//show route


router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing){
    req.flash("error","Lising no longer exists")
    return res.redirect("/listings")
  }
   res.render("LISTINGS/show.ejs",{listing})
}))

//Create Route
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    const newListing =new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","new listing created successfully!")
    res.redirect("/listings");
   
}));

//Edit Route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error","Listing no longer exists")
     return res.redirect("/listings")
  }
    res.render("LISTINGS/edit.ejs",{listing});
}))

//update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","listing updated successfully!")

    res.redirect(`/listings/${id}`);
}))

//Delete Route

router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req,res)=>{
     let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted successfully!")
    res.redirect("/listings");
}))

module.exports = router;