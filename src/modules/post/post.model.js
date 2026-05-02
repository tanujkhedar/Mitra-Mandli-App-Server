import { match } from "assert";
import mongoose, { Schema } from "mongoose";
import { type } from "os";

const postSchema = new Schema(
    {
        title : {
            type : String,
            required : true,
            maxlength : 100
        },
        description : {
            type : String,
            maxlength : 2000
        },
        isPublic : {
            type : Boolean,
            default : true
        },
        resourceType : {
            type : String,
            enum : ["image", "video"],
            required : true
        },
        likeCount : {
            type : Number,
            default : 0
        },
        viewCount : {
            type : Number,
            default : 0
        },
        commentCount : {
            type : Number,
            default : 0
        },
        owner : {
            type : Schema.ObjectId,
            ref : "User",
            index : true
        },
        file : {
            url : {
                type : String,
                required : true
            },
            public_id : {
                type : String,
                required : true
            }
        }
    },
    {
        timestamps : true
    }
);

export const Post = mongoose.model("Post", postSchema);