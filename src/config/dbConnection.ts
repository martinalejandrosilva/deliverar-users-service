const mongoose = require('mongoose');
//This Should be in a .env file
const db = "mongodb+srv://dbuser:jmZ09DHFXArzA7A6@uade-deliverar-users.ufhkfq0.mongodb.net/";


export const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');
    } catch(err) {
        // Exit process with failure
        process.exit(1);
    }
}