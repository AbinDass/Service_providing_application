import mongoose from "mongoose";
import Postdb from "../../model/post.js";
import userdb from "../../model/user.js";
export const createPosts = async (req, res) => {
    try {
        console.log(req.body,1234);
        const caption = req.body.post;
        const userId = req.body.id;
        const image = req.body.imageurl;

        const newPost = new Postdb({
            userId,
            caption: caption,
            image,
        });
        newPost.save();
        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json({ errr: `internal server error` });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Postdb.find({ isDeleted: false }).populate("userId").sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ errr: `internal server error` });
    }
};

export const createLike = async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.body.userId);
        const postId = mongoose.Types.ObjectId(req.body.postId);

        const likedUser = await Postdb.findOne({
            $and: [{ _id: postId }, { likedUsers: { $elemMatch: { $eq: userId } } }],
        });
        if (likedUser) {
            const post = await Postdb.updateOne({ _id: postId }, { isLiked: false });
            const unLike = await Postdb.updateOne(
                {
                    _id: postId,
                },
                {
                    $pull: { likedUsers: userId },
                    isLiked: false,
                }
            );

            res.status(200).json({ unLike });
        } else {
            const post = await Postdb.updateOne({ _id: postId }, { isLiked: true }).populate("userId");
            const liked = await Postdb.updateOne(
                {
                    _id: postId,
                },
                {
                    $push: { likedUsers: userId },
                    isLiked: true,
                }
            );
            res.status(200).json({ liked });
        }
    } catch (err) {
        res.status(500).json({ err: `internal server error` });
    }
};

export const getMypost = async (req, res) => {
    try {
        const { userId } = req.query;
        const myPosts = await Postdb.find({ userId: userId }).sort({ createdAt: -1 });
        console.log(myPosts);
        res.status(200).json(myPosts);
    } catch (error) {
        res.status(200).json({ error: "internal server error" });
    }
};

export const deleteMyPost = async (req, res) => {
    try {
        console.log(req.query)
        const post = await Postdb.findByIdAndDelete({ _id: req.query.postid})
        console.log(post)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({error:`internal server error`})
    }
};