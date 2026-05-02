import mongoose from "mongoose";

const lensFeaturesSchema = new mongoose.Schema({
    prdId:{type:String, required:true},
    name: {type:String, required:true},
    price: {type:Number,required:true},
    
})

const lensFeaturesModel= mongoose.models.lensFeautres || mongoose.model("lensFeautres",lensFeaturesSchema)

export default lensFeaturesModel; 