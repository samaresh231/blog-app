var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// App config
mongoose.connect('mongodb://localhost/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Object, 
        default: new Date()
    }
})

var Blog = mongoose.model("blog", blogSchema);

app.get("/", (req, res) => {
    res.redirect("/blogs");
})

app.get("/blogs", (req, res) => {
    Blog.find({},(error, blogList) => {
        if(error)
            console.log(error);
        else
            res.render("index", {blogs: blogList});
    })
})

app.post("/blogs", (req, res) => {
    Blog.create(req.body.blog, (error, newBlog) => {
        if(error)
            console.log(error);
        else
            res.redirect("/blogs");
    })
})

app.get("/blogs/new", (req, res) => {
    res.render("newBlog");
})

app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (error, foundBlog) => {
        if(error)
            console.log(error);
        else
            res.render("edit", {blog: foundBlog});
    })
})

app.put("/blogs/:id", (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (error) =>{
        if(error)
            console.log(error);
        else
            res.redirect(`/blogs/${req.params.id}`);
    })
})

app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndDelete(req.params.id , (error) => {
        if(error)
            console.log(error);
        else
            res.redirect("/blogs");
    })
})

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (error, foundBlog) => {
        if(error)
            console.log(error);
        else
            res.render("show", {blog: foundBlog});
    })
})

app.get("*", (req, res) => {
    res.send("<h1 style='text-align: center;'>Error 404</h1>")
})

app.listen(3000, () =>{
    console.log("server is running");
})