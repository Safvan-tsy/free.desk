var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId
const nodemailer = require("nodemailer");

module.exports = {

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginstatus = false
            let response = {}
            let user = await db.get().collection(collection.ENGINEER_COLLECTION).findOne({ email: userData.email })
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
    getAllComplaints: (data) => {
        return new Promise(async (resolve, reject) => {

            let complaints = await db.get().collection(collection.USER_COLLECTION).find({ engineer: data.name }).toArray()
            resolve(complaints)
        })
    },
    sendResponse: (cId, resp) => {

        return new Promise(async (resolve, reject) => {

            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(cId) }).then((data) => {

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
                    let email = data.email;
                    let respo = resp.response;

                    // send mail with defined transport object
                    let info = await transporter.sendMail({
                        from: "freeDesk-Reply@outlook.com", // sender address
                        to: email, // list of receivers
                        subject: "Response to your complaint", // Subject line                       
                        text: respo, // plain text body
                        html: "", // html body

                    });

                    console.log("Message sent: %s", info.messageId);
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    db.get().collection(collection.USER_COLLECTION)
                        .updateOne({ _id: objectId(cId) }, {
                            $set: {
                                response: resp.response
                            }
                        }).then((respo) => {
                            resolve()
                        })


                }

                main().catch(console.error);
                resolve(data)

                

            })
        })

    },
}