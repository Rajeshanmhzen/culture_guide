import mongoose from "mongoose"

export const DBConnect = async()=> {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log("Database connected Successfully")
    } catch (err) {
        console.log("Error while connecting", err)
        
    }
}
