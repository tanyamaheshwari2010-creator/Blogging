const {Schema, model} = require("mongoose");

const blogSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    coverimageurl:{
        type:String,
        required:false
    },
    createdby:{
        type: Schema.Types.ObjectId,
        ref: "user"
    } 
},{timestamps: true})

const Blog = model("blogs", blogSchema)

module.exports = Blog