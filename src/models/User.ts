import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema({ 
  email: { 
    type: String, 
    required: true, 
    unique: true
  }, 
  password: { 
    type: String, 
    required: true }
});

export default mongoose.model("User", userSchema); 
// User modellen representerar användare i databasen och innehåller fält för email och password. Änvands för att skapa, uppdatera och ta bort användare i MongoDB-databasen.
// User schema- definierar schema som modellen använder