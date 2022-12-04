var db = require('../config/connection')
var collection = require('../config/collections')
const nodemailer = require("nodemailer");
var bcrypt = require('bcrypt');
//const { Promise } = require('mongodb');
var objectId = require('mongodb').ObjectId
///const { Promise } = require('mongodb')

module.exports = {

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginstatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.user = user
                        response.status = true
                        resolve(response)
                    }
                    else {
                        console.log('login failed');
                        resolve({ status: false })
                    }
                })
            }
            else {
                console.log('login failed');
                resolve({ status: false })
            }
        })
    },
    doSubmit: (userData,cId) => {
        return new Promise(async (resolve, reject) => {

            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(cId)},{
                $set:{                    
                    contact:userData.email,
                    subject:userData.subject,
                    complaint:userData.complaint
                }
            }).then((data) => {
                
                "use strict";
                

                // async..await is not allowed in global scope, must use a wrapper
                async function main() {

                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: "smtp.outlook.com",
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: "freeDesk-Reply@outlook.com", // generated ethereal user
                            pass: "safvan@21", // generated ethereal password
                        },
                    });
                    let email= userData.email;
                    /// refId = data.insertedId.toStrilng();
                    //let mssg = document.write(refId,"hello");
                    // send mail with defined transport object
                    let info = await transporter.sendMail({
                        from: "freeDesk-Reply@outlook.com" , // sender address
                        to: email, // list of receivers
                        subject: "Feedback recieved", // Subject line                       
                        text: "Thank you for helping us to improve . Your feedback has been submitted .", // plain text body
                        html: "", // html body
                        
                    });

                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    //console.log(refId)
                    
                    
                }

                main().catch(console.error);
                ///let dat =data.insertedId.toString();
                resolve(data)

            })
        })
    },

    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                db.get().collection(collection.USER_COLLECTION).findOne({ _id: data.insertedId }).then((user) => {
                    resolve(user)
                })
            })
        })

    },

}