import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema (
    {
        fullName : {
            type : String,
            required : true,
            trim : true,
            match: [/^[A-Za-z ]+$/, "Full name must contain only alphabets"]
        },
        userName : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
            minlength : 3,
            maxlength : 50,
            index : true,
            match: [/^[a-z0-9_-]+$/, "Invalid username format"]
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true,
        },
        password : {
            type : String,
            required : true,
            select : false
        },
        avatar : {
            url : {
                type : String
            },
            public_id : {
                type : String
            }
        },
        coverImage : {
            url : {
                type : String
            },
            public_id : {
                type : String
            }
        },
        refreshToken : {
            type : String,
            select : false
        },
        tokenVersion : {
            type : String,
            default : '0',
            select : false
        },
        isProfilePublic : {
            type : Boolean,
            default : true
        },
        blockedUsers : {
            type : [
                {
                    type : Schema.ObjectId,
                    ref : "User"
                }
            ],
            select : false
        },
        followerCount : {
            type : Number,
            default : 0
        },
        followingCount : {
            type : Number,
            default : 0
        },
        postCount : {
            type : Number,
            default : 0
        },
        bio : {
            type : String,
            maxlength : 50,
            trim : true
        }
    },
    {
        timestamps : true
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 9);
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);