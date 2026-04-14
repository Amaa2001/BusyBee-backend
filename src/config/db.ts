import mongoose from "mongoose"; 

const connectDB = async () => { 
  try {
    const conn = await mongoose.connect( 
      process.env.MONGO_URI as string
    );

    console.log("MongoDB Connected"); // om anslutningen lyckas loggas detta i terminalen
  } catch (error) { 
    console.error("MongoDB connection failed");
    process.exit(1);
  }
};

export default connectDB;

// ansluter till mongodb db med hjälp av mongoose biblioteket
