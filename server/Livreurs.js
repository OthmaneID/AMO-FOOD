const mongoose=require('mongoose').Schema;

var LivreursShema=new mongoose.Schema({
    CIN:String,
    Nom:String,
    Prenom:String,
    Email:String,
    MotDP:String,
    Profil:String,
    state:String,
    Phone:String,
})



var LivreursModel=mongoose.model('Livreurs',LivreursShema);

module.exports=LivreursModel;