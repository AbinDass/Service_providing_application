import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            ref: "User",
            required: true,
        },
        caption: {
            type: String,
            max: 50,
        },
        image: {
            type: Array,
            default: [{}],
        },
        likedUsers: {
            type: Array,
            default: [],
        },
        isLiked: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
