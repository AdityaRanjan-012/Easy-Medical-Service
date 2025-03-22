const mongoose = require('mongoose');
require('dotenv').config();

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('hospitalprofiles');
        
        // Drop the userId index
        await collection.dropIndex('userId_1');
        console.log('Successfully dropped userId index');

        // List remaining indexes
        const indexes = await collection.indexes();
        console.log('Remaining indexes:', indexes);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
};

dropIndex(); 