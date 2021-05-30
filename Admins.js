const mongoose=require('mongoose').Schema;

var AdminsShema=new mongoose.Schema({
    
    UserName:String,
    Email:String,
    Password:String,
    Profil:String
})



var AdminsModel=mongoose.model('Admins',AdminsShema);

module.exports=AdminsModel;