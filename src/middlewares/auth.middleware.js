import { User } from "../modules/user/user.model.js";
import { ApiError } from "../utils/apiError.util.js";
import { decodeAcessToken } from "../utils/token.util.js";

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header?.authorization?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(400, "unauthorized access");
        }

        const decodedToken = decodeAcessToken(token);

        const user = await User.findById(decodedToken._id).select("+tokenVersion").lean();
        
        if (!user) {
            throw new ApiError(400, "Invalid or Expiry Token");
        }

        if (decodedToken.tokenVersion != user.tokenVersion) {
            throw new ApiError(400, "oldAuthorized access");
        }

        req.user = user;
        return next();
    } catch (error) {
        next(error)
    }
}