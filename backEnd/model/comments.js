import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        comments: [
            {
                content: String,

                UserId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                Date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
