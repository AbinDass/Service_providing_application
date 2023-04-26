import mongoose, { Schema } from "mongoose";
const appointmentSchema = new mongoose.Schema(
    {
        user:{
            type:String,
            ref:"User"
        },
        worker:{
            type:String,
            ref:"User"
        },
        date:{
            type:String,
        },
        time:{
            type:String,
        },
        descreption:String,
        status:{
            type:String,
            default: 'no response'
        }
    },{timestamps:true}
)
const appointment = mongoose.model("Appointment", appointmentSchema);
export default appointment;