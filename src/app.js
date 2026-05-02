import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

app.use(cors({
    origin : process.env.APP_ORIGIN,
    credentials : true
}));

app.use(cookieParser());

app.use(express.json({
    limit : "16kb"
}));

app.use(express.urlencoded({
    limit : "16kb",
    extended : true
}));

app.use(helmet());

app.use(rateLimit({
    windowMs : 1 * 60 * 1000,
    max : 60
}));

import { userRouter } from "./modules/user/user.route.js";
import { postRouter } from "./modules/post/post.route.js";
import { likeRouter } from "./modules/like/like.route.js";
import { followRouter } from "./modules/follow/follow.route.js";
import { commentRouter } from "./modules/comment/comment.route.js";
import { collectionRouter } from "./modules/collection/collection.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/collection", collectionRouter);

import { errorHandler } from "./middlewares/error.middleware.js";

app.use(errorHandler);

export { app }