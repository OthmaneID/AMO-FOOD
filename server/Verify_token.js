// require('dotenv').config();
const { request } = require('express');
const jwt=require('jsonwebtoken');

module.exports= function (req,res,next){
    //get the auth header value
    const bearerHeader= req.headers['authorization']

    //check if bearer is undefined
    if(typeof bearerHeader !=='undefined'){
        //split at the space
        const bearer=bearerHeader.split(' ');
        // Get token from array
        const bearertoken=bearer[1];
        // Set the token
        req.token=bearertoken;
        //Next MidldleWare
        next();

    }else{
        //Forbidden
        res.json({Message:'the bearerHeader Variable is undefined'});
    }
}

