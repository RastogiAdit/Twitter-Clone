import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPosts, getLikedPosts } from "../controllers/post.controller.js";


const router = express.Router();

//all the paths
router.get("/likes/:id", protectRoute, getLikedPosts)
router.get("/all", protectRoute, getAllPosts)
router.post("/create", protectRoute, createPost)
router.post("/like/:id", protectRoute, likeUnlikePost)
router.post("/comment/:id", protectRoute, commentOnPost)
router.delete("/:id", protectRoute, deletePost)



export default router; 

