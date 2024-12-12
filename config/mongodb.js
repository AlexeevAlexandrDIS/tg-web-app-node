const mongoose = require('mongoose');


const connectDB = async () => {

    mongoose.connection.on(`connected`,() =>{
        console.log('MongoDB Connected');
    })

    await mongoose.connect(`mongodb://127.0.0.1:27017`)  ;

}