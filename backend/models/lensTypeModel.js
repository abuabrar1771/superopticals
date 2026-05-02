import mongoose from "mongoose";

const lensTypeSchema = new mongoose.Schema({
    name:{type:String, required:true},
    price:{type:Number,required:true},
    brand:{type:String, required:true}
})

const lensTypeModel =mongoose.models.lensType || mongoose.model("lensType",lensTypeSchema)

export default lensTypeModel;