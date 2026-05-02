import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema(
    {
        title : {
            type : String,
            maxlength : 100,
            required : true
        },
        description : {
            type : String,
            maxlength : 2000
        },
        owner : {
            type : Schema.ObjectId,
            ref : "User",
            required : true
        },
        content : {
            type : [{
                type : Schema.ObjectId,
                ref : "Post"
            }]
        }
    },
    {
        timestamps : true
    }
);

export const Collection = mongoose.model("Collection", collectionSchema);