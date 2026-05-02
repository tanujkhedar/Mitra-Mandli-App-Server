import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        commentBy : {
            type : Schema.ObjectId,
            ref : "User",
            required : true
        },
        commentTo : {
            type : Schema.ObjectId,
            ref : "Post",
            required : true
        },
        content : {
            type : String,
            required : true,
            maxlength : 2000
        },
    },
    {
        timestamps : true
    }
);

export const Comment = mongoose.model("Comment", commentSchema);