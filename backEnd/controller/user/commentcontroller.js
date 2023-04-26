import mongoose from "mongoose";
import commentdb from "../../model/comments.js";
import postdb from "../../model/post.js";
export const createComment = async (req, res) => {
    try {
        const { comment, userId } = req.body;
        const postId = req.body.postId;
        const Id = mongoose.Types.ObjectId(userId);
        const oldcomment = await commentdb.findOne({ postId: postId });
        if (!oldcomment) {
            const newComment = await commentdb({ postId: postId, comments: { UserId: Id, content: comment } });
            newComment.save();
            return res.status(200).json({ newComment, message: "commented successfully" });
        }
        const Comments = await commentdb.findByIdAndUpdate(oldcomment._id, {
            $push: { comments: { UserId: Id, content: comment } },
        });
        res.status(201).json(Comments);
    } catch (err) {
        res.status(500).json({ err: `internal server error` });
    }
};

export const getAllComments = async (req, res) => {
    try {
        const showComments = await commentdb
            .findOne({ postId: req.params.id })
            .populate("comments.UserId")
            .sort({ createdAt: -1 });
        const comments = showComments.comments;
        res.status(200).json(showComments);
    } catch (err) {
        res.status(500).json({ err: `internal server error` });
    }
};
