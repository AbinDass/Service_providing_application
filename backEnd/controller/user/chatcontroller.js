import mongoose from "mongoose";
import conversationdb from "../../model/conversation.js";
import messagedb from "../../model/message.js";
import userdb from "../../model/user.js";

//set Chat
export const CreateConversation = async (req, res) => {
    const { senderId, recieverId } = req.body;
    console.log("recieverId", recieverId);
    console.log("sender", senderId);

    const conversation = await conversationdb.findOne({
        members: { $all: [senderId, recieverId] },
    });

    console.log(conversation, "poppopooppopopo");
    try {
        if (!conversation) {
            const newConversation = new conversationdb({
                members: [senderId, recieverId],
            });
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation);
        } else {
            res.status(200).json({ meassage: "converssation already created" });
        }
    } catch (error) {
        res.status(200).json({ error: "internal server error " });
    }
};

// get Chat

export const getConversation = async (req, res) => {
    const userId = req.params.userId;
    try {
        const conversation = await conversationdb.find({
            members: { $in: [userId] },
        });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
};

//add message
export const sendMessage = async (req, res) => {
    console.log(req.body);
    const { conversationId, sender, text } = req.body.message;
    const newMessage = new messagedb({
        conversationId,
        sender,
        text,
    });
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (error) {
        res.status(500).json({ error: "internal servor error" });
    }
};

//get chats
export const getAllmessages = async (req, res) => {
    try {
        const meassages = await messagedb.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(meassages);
    } catch (error) {
        res.status(500).json({ error: "internal servor error" });
    }
};

// get conversation b/w 2 USERS

export const getConversationsBWtwo = async (req, res) => {
    const { user1Id, user2Id } = req.params;

    try {
        const reciever = await userdb.findOne({ _id: user2Id });
        const conversation = await conversationdb.findOne({
            members: { $all: [user1Id, user2Id] },
        });
        res.status(200).json({ conversation, reciever });
    } catch (error) {
        res.status(500).json({ error: "internal servor error" });
    }
};


export const searchUsers = async (req, res) => {
    try {
        console.log(req.query)
        const user = new RegExp(req.query?.username, "i");
        if(user !== " "){
            const search_result = await userdb.find({ firstname: user});
            console.log(search_result)
            res.status(200).send(search_result);
        }
    } catch (error) {
        res.status(200).json({ error: "internal servor error" });
    }
};