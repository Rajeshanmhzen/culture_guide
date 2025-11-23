import express from "express" 
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv"
import { DBConnect } from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()
import locationRouter from "./routes/location.route.js"
import userRouter from './routes/user.route.js'

const app = express ()
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())


const corsOptions = {
    origin: "http://localhost:5173",
    credentials:true,
    exposeHeaders: ['Access-Control-Allow-Credentials'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// For heritage picture files
app.use('/uploads/heritage-pic', express.static(path.join(__dirname, 'uploads/heritage-pic')));

// For user profile pictures
app.use('/uploads/profile-pic', express.static(path.join(__dirname, 'uploads/user-profiles')));

app.use("/api/v1/user",userRouter )
app.use("/api/v1/place",locationRouter )

const PORT = process.env.PORT || 3000
DBConnect()
.then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Server is running at port http://localhost:${PORT}`)
    });
})
