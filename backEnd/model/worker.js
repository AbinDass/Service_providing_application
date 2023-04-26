import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
    {
        servicetitle: String,
        user: {
            type: String,
            ref: "User",
        },
        labour: {
            type: Number,
            default: 0,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        distric: String,
        state: String,
        description: {
            type: String,
            max: 50,
        },
        liecence: {
            type: Array,
            default: [],
        },
        approved:{
            type:Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

const worker = mongoose.model("Worker", workerSchema);
export default worker;
