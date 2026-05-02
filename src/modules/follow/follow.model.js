import mongoose, { Schema } from "mongoose";

const followSchema = new Schema(
    {
        followedTo : {
            type : Schema.ObjectId,
            ref : "User",
            required : true
        },
        followedBy : {
            type : Schema.ObjectId,
            ref : "User",
            required : true
        }
    },
    {
        timestamps : true
    }
);

export const Follow = mongoose.model("Follow", followSchema);