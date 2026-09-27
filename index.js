const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const cookieparser = require("cookie-parser")
const Blog = require("./models/blog")

const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")

const { checkforautcookie } = require("./middlewares/auth")

const app = express()

mongoose.connect("mongodb://localhost:27017/blogify").then((e)=>console.log("mongodb connected"))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))


app.use(cookieparser())
app.use(checkforautcookie("token"))
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.resolve("./public")))

app.get("/", async(req,res)=>{
    const allBlogs = await Blog.find({})    
    res.render("home",{
        user: req.user,
        blogs: allBlogs
    })
})


app.use("/user",userRoute)
app.use("/blog",blogRoute)


app.listen("8000",()=>{
    console.log("server started at 8000")
})
