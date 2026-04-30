const Listing = require('../MODELS/listing')


module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("LISTINGS/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    
    res.render("LISTINGS/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let mapToken = process.env.MAP_API_KEY;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
   const place = listing.location;
   const url = `https://api.maptiler.com/geocoding/${place}.json?key=${mapToken}`;
   const result = await fetch(url);
   const data = await result.json();
   let coords;
   if (data.features && data.features.length > 0) {
  coords = data.features[0].center;
} else {
  coords = [77.1025, 28.7041]; // Delhi fallback
}

    coords = data.features[0].center;


  if(!listing){
    req.flash("error","Listing no longer exists")
    return res.redirect("/listings")
  }
   res.render("LISTINGS/show.ejs",{listing,mapToken,coords})
}

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing =new Listing(req.body.listing);
    newListing.owner = req.user._id;

    newListing.image.url = url;
    newListing.image.filename = filename;
    await newListing.save();
    req.flash("success","new listing created successfully!")
    res.redirect("/listings");
   
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error","Listing no longer exists")
     return res.redirect("/listings")
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_300,h_150")
  console.log(originalImageUrl)
  res.render("LISTINGS/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

   
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
     listing.image.url = url;
    listing.image.filename = filename;
    await listing.save()
    }
   
    req.flash("success","listing updated successfully!")

    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
     let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted successfully!")
    res.redirect("/listings");
}