import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        likedTo : {
            type : Schema.ObjectId,
            ref : "Post",
            required : true,
            index : true
        },
        likedBy : {
            type : Schema.ObjectId,
            ref : "User",
            required : true,
            index : true
        }
    },
    {
        timestamps : true
    }
);

export const Like = mongoose.model("Like", likeSchema);