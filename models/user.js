const {Schema, model} = require("mongoose");
const {createHmac, randomBytes} = require("crypto")
const {createTokenforuser} = require("../services/auth")

const userSchema = new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    profileimageurl:{
        type:String,
        default:"/images/images.png"
    },
    role:{
        type:String,
        enum: ["USER","ADMIN"],
        default:"USER"
    }
},{timestamps:true})

userSchema.pre("save", function (next){
    const user = this

    if(!user.isModified("password")) return

    const salt = randomBytes(16).toString()
    const hashedpassword = createHmac("sha256", salt)
       .update(user.password)
       .digest("hex")

       this.salt = salt
       this.password = hashedpassword

})

userSchema.static("matchedpasswordandgeneratetoken", async function(email,password){
    const user = await this.findOne({email})
    if(!user) throw new Error("user not found!")

    const salt = user.salt
    const hashedpassword = user.password

    const userprovidedhash = createHmac("sha256", salt)
       .update(password)
       .digest("hex")

       if(hashedpassword !== userprovidedhash) throw new Error("Incorrect password")
       const token = createTokenforuser(user)
      return token
})

const User = model("User",userSchema)

module.exports = User