require('dotenv').config()

const MongoClient=require('mongodb').MongoClient;
const ObjectID=require('mongodb').ObjectID;
const dbname='AMOFOOD-db';
const url="mongodb+srv://AMOFOOD-DB:"+process.env.passwordDB+"@amofood-cluster.xo1gn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const mongoOptions={useNewUrlParser:true,useUnifiedTopology: true};

const state={
    db:null
};
const connect=(callback)=>{
    if(state.db)
        callback();
    else{
        MongoClient.connect(url,mongoOptions,(err,client)=>{
            if(err){
                callback(err)
            }else{
                state.db=client.db(dbname);
                callback();
            }
        });
    }
}

const getPrimaryKey=(_id)=>{
    return ObjectID(_id);
}

const getDB=()=>{
    return state.db;
}


module.exports={getDB,connect,getPrimaryKey};