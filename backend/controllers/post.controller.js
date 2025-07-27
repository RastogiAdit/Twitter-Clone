import {v2 as cloudinary} from "cloudinary"
import Notification from "../models/notification.model.js";

//models
import Post from "../models/post.model.js";
import User from "../models/user.model.js";


export const createPost = async (req,res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();
        
        //check if user exist or not 
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});

        //post should have text or image
        if(!text && !img) return res.status(400).json({message: "Post atleast have a test or image"});

        if(img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        //creating post
        const newPost = new Post({
            user: userId,
            text,
            img
        });

        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.log("Error in createPost: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deletePost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({error: "Post not found"});

        if(post.user.toString() != req.user._id.toString())
        {
            return res.status(401).json({error: "You are not authorized to delete this post"});
        }
        
        //delete the image from cloudnary
        if(post.img) {
            await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0]);
        }

        await Post.findByIdAndDelete(req.params.id);

        return res.status(200).json({message: "Post deleted successfully"});


    } catch (error) {
        console.log("Error in deletePost: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const commentOnPost = async (req,res) => {
    try {

        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text) {
            //bad request
            return res.status(400).json({error: "Text feild is required"});
        }
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({error: "Post not Found"});
        }

        const comment = {
            user: userId,
            text: text
        }

        post.comments.push(comment);
        await post.save();

        return res.status(200).json(post);
        
        
    } catch (error) {
        console.log("Error in commentOnPost: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const likeUnlikePost = async (req,res) => {
    try {
        const userId = req.user._id;
        const {id:postId} = req.params;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({error: "Post not found"});

        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost) {
            //unlike post
            await Post.updateOne({_id:postId},{$pull: {likes: userId}});
            return res.status(200).json({message: "Post unliked successfully"});
        } else{
            //like post
            post.likes.push(userId);
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save();
            return res.status(200).json({message: "Post liked successfully"});
        }
        
    } catch (error) {
        console.log("Error in likeUnlikePost: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
