const express = require("express"); 
const app = express(); 
const mongoose = require("mongoose");
const Listing = require("./MODELS/listing.js");
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"VIEWS"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function  main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Hi, I am root");
});

app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("LISTINGS/index.ejs",{allListings});
})

app.get("/testListing",async (req,res)=>{
    let sampleListing = new Listing({
        title: "my new villa",
        description: "by the beach",
        price: 1200,
        location: "calangute,goa",
        country:"India"
    })
    await sampleListing.save();
    res.send(" listing test successful");

})

//new route
app.get("/listings/new",(req,res)=>{
    res.render("LISTINGS/new.ejs");
})


//show route


app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
  const listing = await Listing.findById(id);
   res.render("LISTINGS/show.ejs",{listing})
})

//Create Route
app.post("/listings",async (req,res)=>{
    const newListing =new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//Edit Route

app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("LISTINGS/edit.ejs",{listing});
})

//update Route
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listin});
    res.redirect(`/listings/${id}`);
})

//Delete Route

app.delete("/listings/:id", async (req,res)=>{
     let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});