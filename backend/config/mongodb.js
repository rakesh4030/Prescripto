import mongoose from "mongoose"

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"))
        const uri = process.env.MONGODB_URI?.replace(/\/$/, '')
        await mongoose.connect(`${uri}/prescripto`)
    } catch (error) {
        console.error('Database connection failed:', error.message)
        process.exit(1)
    }
}

export default connectDB