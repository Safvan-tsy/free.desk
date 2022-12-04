var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt =require('bcrypt')
var objectId = require('mongodb').ObjectId

module.exports={
   
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginstatus = false
            let user=null
            let status=null
            let response = {}
            if(userData.username=="user@1234"){
                if(userData.password=="user@1234"){
                    console.log('login success');
                        response.user = user
                        response.status = true
                        resolve(response)
                }
                else {
                    console.log('login failed');
                    resolve({ status: false })
                }
            }
            else {
                console.log('login failed');
                resolve({ status: false })
            }
            
        })
    },

    getAllComplaints:()  =>{
        return new Promise(async(resolve,reject)=>{
            let complaints=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(complaints)
            
        })
    },
    create:(userData)=>{
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.ENGINEER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data);
            })
        })    
    },
    getEngineers:()=>{
        return new Promise(async(resolve,reject)=>{
            let engineers=await db.get().collection(collection.ENGINEER_COLLECTION).find().toArray()
            resolve(engineers)
        })
    },
    sendEngineer:(cId,resp)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION)
            .updateOne({_id:objectId(cId)},{
                $set:{                    
                    engineer:resp.engineer
                    
                }
            }).then((respo)=>{
                resolve()
            })
        })
    },
    deleteEng:(engId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ENGINEER_COLLECTION).deleteOne({_id:objectId(engId)}).then((response)=>{
                resolve(response);
            })
        })
    },

}