import mongoose from "mongoose";

const dbConnection = async() =>{

    try {
        
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser:true,
            useUnifiedTopology: true
        });

        console.log("Base de Datos Online");

    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar la base de datos');
    }

};

export {dbConnection};