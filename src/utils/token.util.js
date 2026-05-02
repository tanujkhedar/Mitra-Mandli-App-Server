import jwt from "jsonwebtoken";

export const generateAcessToken = (user) => {
    return jwt.sign(
        {
            _id : user._id,
            tokenVersion : user.tokenVersion
        },
        process.env.ACCESSTOKEN_SECRET_KEY,
        {
            expiresIn : "15m"
        }
    );
}

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            _id : user._id
        },
        process.env.REFRESHTOKEN_SECRET_KEY,
        {
            expiresIn : "7d"
        }
    );
}

export const decodeAcessToken = (token) => {
    return jwt.verify(
        token,
        process.env.ACCESSTOKEN_SECRET_KEY,
    );
}

export const decodeRefreshToken = (token) => {
    return jwt.verify(
        token,
        process.env.REFRESHTOKEN_SECRET_KEY,
    );
}