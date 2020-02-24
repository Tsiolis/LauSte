const   express = require("express"),
        methodOverride = require("method-override")
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        app = express();



mongoose.connect("mongodb://localhost/lauste");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//Mongoose Model Config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

//Routes

app.get("/", function(req, res){
    res.redirect("/blogs");
})

//Index Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error");
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});

//Blogs
app.get("/blogpage", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error");
        } else{
            res.render("blogpage", {blogs: blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//Create New Blog Post Route
app.post("/blogs", function(req,res){
    //Create Blog  
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            //Redirect to home
            res.redirect("/cms")
        }
    });

    
});


//Show page route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    })
});



// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
})



// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });

});


//Delete Route
app.delete("/blogs/:id", function(req, res){
    //Destroy
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/cms");
        }
    })
});


//CMS Route
app.get("/cms", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error");
        } else{
            res.render("cms", {blogs: blogs});
        }
    });
});


// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
})



const port = process.env.PORT || 3000;

app.listen(port, function () {

    console.log("Server Has Started!")
});


