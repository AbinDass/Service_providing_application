import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        thumbnail: {
            type: Array,
        },
        servicelogo: {
            type: Array,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        isdeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
