import './configs/dotenv.js'
import { connectDB } from "./configs/db.js";
import { app } from "./app.js";
import { initCloudinary } from "./utils/cloudinary.util.js";

const port = process.env.APP_PORT || 7000;

connectDB()
.then(() => {
    app.listen(port);
    console.log("now App is listen on port :- ", port);
    
})
.catch((err) => {
    console.log("DB Connection Error :- ", err);
    process.exit(1);
    
});

initCloudinary();