import mongoose from "mongoose";

const Subscriptionschema = new mongoose.Schema(
    {
        mainHead: String,
        subHead: String,
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            max: 50,
        },
        plan: {
            type: String,
        },
        background:{
            type:Array
        },
        users: {
            type: [
                {
                    userid: {
                        type: mongoose.Types.ObjectId,
                        ref: "User",
                    },

                    subscriptionStatus: {
                        type: String,
                        default: "pending",
                    },
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

const subscribe = mongoose.model("Subscription", Subscriptionschema);
export default subscribe;
