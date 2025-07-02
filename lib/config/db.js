import mongoose from "mongoose";

export const ConnectDB = async () =>{
    await mongoose.connect('mongodb+srv://boyabenfath:0691677901@cluster0.ee8mkfm.mongodb.net/blog-app')
    console.log("DB Connected")
}