import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        secondname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
        },
        password: {
            type: String,
            min: 8,
        },
        confirmpassword: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: "user",
        },
        service: {
            type: String,
            ref: "Service",
        },
        location: String,
        distric: String,
        state: String,
        access: {
            type: Boolean,
            default: true,
        },
        profilepicture: {
            type: Array,
        },
        subscription: {
            type: mongoose.Types.ObjectId,
            ref: "Subscription",
        },
        requests: {
            type: [
                {
                    requstedUserId: {
                        type: mongoose.Types.ObjectId,
                        ref: "User",
                    },

                    requestStatus: {
                        type: Boolean,
                        default: false,
                    },
                },
            ],
            default: [],
        },
        decleration: {
            type: String,
            max: 200,
        },

        subscriptiondate : Date,
        subscriptionexpirydate: Date,
    },
    { timestamps: true }
);

const user = mongoose.model("User", userSchema);
export default user;
