const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect("mongodb+srv://SumanManna:Suman12141@sumancluster.4nmqzsw.mongodb.net/")
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(`Error: Not able to connect to the database [${error.message}]`);
        process.exit(1);
    }
}

module.exports= connectDB