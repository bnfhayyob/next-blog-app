import mongoose from "mongoose";

export const ConnectDB = async () =>{
    await mongoose.connect('mongodb+srv://boyabenfath:0691677901@cluster0.andycvz.mongodb.net/blogApp')
    console.log("DB Connected")
}