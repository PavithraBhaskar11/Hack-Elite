let mysql = require('mysql');
let bcrypt = require('bcrypt');
const res = require("express");
const dotenv = require("dotenv");

dotenv.config({path:"./.env"})

let connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

module.exports.connect = () => {
    connection.connect(err => {
        if (err) {
            console.log(err)
            console.error('error connecting: ' + err.stack);
            return
        }

        console.log('The database is Connected')
        console.log('connected as id ' + connection.threadId);
    })
}

module.exports.getNgoVolunteers = (ngoId)=>{
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM volunteers t1 NATURAL JOIN volunteers_for t2 WHERE ngo_id =?",[ngoId],(err,rows)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(rows)
            }
        })
    })
}

module.exports.setSponsorStatus = (sponsorId,message,ngoId)=>{
    return new Promise((resolve, reject) => {
        connection.beginTransaction(err=>{
            if(err){
                console.log(err)
                return reject(err)
            }else {
                console.log("entered database")
                connection.query("UPDATE sponsors_for SET status = ? where u_id = ? AND ngo_id = ?",[message,sponsorId,ngoId],((err)=>{
                    if (err){
                        console.log("status of sponsor not updated")
                        return reject(err)
                    }else {
                        connection.query("SELECT * FROM sponsors_for",[],(err,rows)=>{
                            if (err){
                                console.log("err is selecting all sponsor_for details")
                                return reject(err)
                            }else {
                                connection.commit()
                                return resolve(rows)
                            }
                        })
                    }
                }))
            }
        })
    })
}

module.exports.getNgoSponsors = (ngoId)=>{
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM sponsors t1 NATURAL JOIN sponsors_for t2 WHERE ngo_id =?",[ngoId],(err,rows)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(rows)
            }
        })
    })
}

module.exports.setVolunteerStatus = (volunteerId,message,ngoId)=>{
    return new Promise((resolve, reject) => {
        connection.beginTransaction(err=>{
            if(err){
                console.log(err)
                return reject(err)
            }else {
                console.log("entered database")
                connection.query("UPDATE volunteers_for SET status = ? where u_id = ? AND ngo_id = ?",[message,volunteerId,ngoId],((err)=>{
                    if (err){
                        console.log("status of volunteers not updated")
                        return reject(err)
                    }else {
                        connection.query("SELECT * FROM volunteers_for",[],(err,rows)=>{
                            if (err){
                                console.log("err is selecting all volunteers_for details")
                                return reject(err)
                            }else {
                                connection.commit()
                                return resolve(rows)
                            }
                        })
                    }
                }))
            }
        })
    })
}

module.exports.getNgoDetails = (ngoId)=>{
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM ngo t1 NATURAL JOIN ngo_address t2 WHERE ngo_id =?",[ngoId],async(err,rows)=>{
            if(err){
                return reject(err)
            }else{
                for(let i=0; i<rows.length; i++){
                    rows[i].category = await getAllCategory(rows[i].ngo_id);
                }
                return resolve(rows)
            }
        })
    })
}

module.exports.getAllSponsors = ()=>{
    return new Promise(((resolve, reject) => {
        connection.query("SELECT * FROM sponsors",[],(err,rows)=>{
            if(err){
                return reject(err)
            }
            else {
                return resolve(rows);
            }
        })
    }))
}
module.exports.getAllSponsorsFor = ()=>{
    return new Promise(((resolve, reject) => {
        connection.query("SELECT * FROM ngo t1 natural JOIN ngo_address t3  join sponsors_for t2 ON (t2.ngo_id = t1.ngo_id) && (t2.ngo_id = t3.ngo_id) ",[],async (err,rows)=>{
            if(err){
                return reject(err)
            }
            else {
                for(let i=0; i<rows.length; i++){
                    rows[i].category = await getAllCategory(rows[i].ngo_id);
                }
                return resolve(rows);
            }
        })
    }))
}

module.exports.getAllVolunteers = ()=>{
    return new Promise(((resolve, reject) => {

        connection.query("SELECT * FROM  volunteers ",[],(err,rows)=>{
            if (err){
                console.log("err in getting volunteers data")
                return reject(err);
            }else{
                return resolve(rows)
            }
        })
    }))
}
module.exports.getAllVolunteersFor = ()=>{
    return new Promise(((resolve, reject) => {

        connection.query("SELECT * FROM ngo t1 natural JOIN ngo_address t3  join volunteers_for t2 ON (t2.ngo_id = t1.ngo_id) && (t2.ngo_id = t3.ngo_id)",[],async(err,rows)=>{
            if (err){
                console.log("err in getting volunteers ngo details data")
                return reject(err);
            }else{
                for(let i=0; i<rows.length; i++){
                    rows[i].category = await getAllCategory(rows[i].ngo_id);
                }
                return resolve(rows)
            }
        })
    }))
}


module.exports.setStatus = (ngoId , status) =>{
    return new Promise(((resolve, reject) => {
        connection.beginTransaction(err=>{
            if(err){
                console.log(err)
                return reject(err)
            }else {
                connection.query("UPDATE ngo SET status = ? where ngo_id = ?",[status,ngoId],((err)=>{
                    if (err){
                        console.log("status of ngo not updated")
                        return reject(err)
                    }else {
                        connection.query("SELECT * FROM ngo t1 NATURAL JOIN ngo_address t2",[],(err,rows)=>{
                            if (err){
                                console.log("err is selecting all ngo")
                                return reject(err)
                            }else {
                                connection.commit()
                                return resolve(rows)
                            }
                        })

                    }

                }))
            }
        })
    }))
}

module.exports.volunteerApply = (uid,ngoId,status)=>{
    return new Promise(((resolve, reject) => {
        connection.query("SELECT * FROM volunteers_for WHERE u_id = ? AND ngo_id = ?",[uid,ngoId],(err,rows)=>{
            if (err){
                console.log("err in exiting ", err)
                return reject(err);
            }
            console.log("rows",rows)
            if (rows.length > 0){
                console.log("user already applied")
                return reject("Already applied to that NGO can't Apply again")
            }else {
                connection.query("INSERT INTO volunteers_for(u_id,ngo_id,status) VALUES(?,?,?)",[uid,ngoId,status],err=>{
                    if(err){
                        console.log("error in adding volunteers_for data", err)
                        return reject(err)
                    }
                    resolve("Applied successfully")
                })
            }
        })

    }))
}

module.exports.sponsorApply = (uid,ngoId,description,status)=>{
    return new Promise(((resolve, reject) => {
        connection.query("SELECT * FROM sponsors_for WHERE u_id = ? AND ngo_id = ?",[uid,ngoId],(err,rows)=>{
            if(err){
                return reject(err)
            }
            if(rows.length > 0){
                return reject("Already applied to that NGO can't Apply again")
            }else{
                connection.query("INSERT INTO sponsors_for(u_id,ngo_id,spon_description,status) VALUES(?,?,?,?)",[uid,ngoId,description,status],err=>{
                    if(err){
                        console.log("error in adding sponsor_for data")
                        return reject(err)
                    }
                    resolve("Application successful")
                })
            }
        })
    }))
}

module.exports.getVolunteerDetails = (uid)=>{
    return new Promise(((resolve, reject) => {
        connection.query("SELECT * FROM volunteers  WHERE u_id = ?",[uid] , (err,rows)=>{
            if(err){
                return reject(err)
            }
            else {
                return resolve(rows)
            }
        })

    }))
}
module.exports.getVolunteersNgo = (uid)=>{
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM ngo t1 natural JOIN ngo_address t3  join volunteers_for t2 ON (t2.ngo_id = t1.ngo_id) && (t2.ngo_id = t3.ngo_id) && u_id = ?",[uid],async (err,rows)=>{
            if(err){
                return reject(err)
            }
            else{
                for(let i=0; i<rows.length; i++){
                    rows[i].category = await  getAllCategory(rows[i].ngo_id);
                }
                return resolve(rows)
            }
        })
    })
}


module.exports.getSponsorDetails = (uid)=>{
    return new Promise(((resolve, reject) => {
        connection.query("SELECT * FROM sponsors  WHERE u_id = ?",[uid] , (err,rows)=>{
            if(err){
                return reject(err)
            }
            else {
                return resolve(rows)
            }
        })

    }))
}
module.exports.getSponsorsNgo = (uid)=>{
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM ngo t1 natural JOIN ngo_address t3  join sponsors_for t2 ON (t2.ngo_id = t1.ngo_id) && (t2.ngo_id = t3.ngo_id) && u_id = ?",[uid],async (err,rows)=>{
            if(err){
                return reject(err)
            }
            else{
                for(let i=0; i<rows.length; i++){
                    rows[i].category = await  getAllCategory(rows[i].ngo_id);
                }
                return resolve(rows)
            }
        })
    })
}

module.exports.getPreferredCityNgo = (uid)=>{
    return new Promise(((resolve, reject) => {

                connection.query("SELECT * FROM ngo_address t1 NATURAL JOIN (SELECT * FROM ngo WHERE status = 'Accepted') t2 WHERE city = (SELECT pref_city FROM volunteers WHERE u_id = ?)",[uid],async (err,rows)=>{
                    if(err){
                        return reject(err)
                    }
                    else {
                        for(let i=0; i<rows.length; i++){
                            rows[i].category = await  getAllCategory(rows[i].ngo_id);
                        }
                        return resolve(rows)
                    }
                })

          }))
}

module.exports.getAllNgo = ()=>{
    return new Promise(((resolve, reject) => {
        connection.query("SELECT * FROM ngo t1 NATURAL JOIN ngo_address t2 ",[],async (err,rows)=>{
            if(err){
                return reject(err)
            }
            else {
                for(let i=0; i<rows.length; i++){
                    rows[i].category = await  getAllCategory(rows[i].ngo_id);
                }
                return resolve(rows)
            }
        })
    }))
}

async function getAllCategory(ngo_id) {
    return new Promise((resolve,reject)=>{
        connection.query("SELECT category from ngo_category where ngo_id = ? ",[ngo_id],(err,rows)=>{
            if(err){
                return reject(err)
            }
            else {
                let string = "";
                for(let i =0; i<rows.length; i++){
                    string += rows[i].category;
                    string += ((rows.length - 2 ) === i)? " and " : ((rows.length -1) === i)? "" : ", ";
                }
                string += ".";
                console.log("String -> ", string);
                return resolve(string)
            }
        })
    })
}

module.exports.getAllAcceptedNgo = ()=>{
    return new Promise(((resolve, reject) => {
        connection.beginTransaction(err=>{
            if (err){
                console.log("transaction cancelled")
                return  reject(err)
            }else {
                connection.query("SELECT * FROM ngo_address t1 NATURAL JOIN (SELECT * FROM ngo WHERE status ='Accepted') t2 ",[],async (err,rows)=>{
                    if (err){
                        return reject(err);
                    }
                    else {
                        console.log("getting only accepted ngo's")

                        for(let i=0; i<rows.length; i++){
                            rows[i].category = await getAllCategory(rows[i].ngo_id);
                        }
                        return resolve(rows)
                    }
                })
            }
        })
    }))
}
module.exports.loginUser = (uid, password) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM users WHERE vol_id=? or spon_id=? or ngo_id=?", [uid,uid,uid], (err, rows) => {
            console.log("err", err);
            console.log("rows", rows);
            if (err) {
                return reject(err)
            }
            if (rows.length === 0) {
                console.log("Inside If")
                return reject("Invalid User ID..")
            }
            bcrypt.compare(password,rows[0].password,function (err,result){
                if (result === true) {
                    return resolve(rows[0])
                } else {
                    return reject("Invalid Password....")
                }
            })

        })
    })
}

module.exports.signUpNgo = (ngoName, classification,category, contact, description,ngoLink, hashedPassword, type,area, city, state ,status) =>{
    return new Promise((resolve, reject) => {
        connection.beginTransaction(err=>{
            if(err){
                connection.rollback()
                return reject(err)
            }else {
                let newId;
                connection.query("SELECT * FROM ngo WHERE ngo_name = ?",[ngoName],(err,rows)=>{
                    if(err) {
                        return reject(err)
                    }
                    if(rows.length > 0){
                        return reject( "NGO with this name already registered");
                    }
                    connection.query("SELECT * FROM ngo ORDER BY ngo_id desc limit 1", async (err, rows) => {
                        let lastId;
                        if (err) {
                            return reject(err)
                        }

                        if (rows === undefined || rows.length === 0) {
                            newId = 'NGO@000001';
                            console.log(newId)
                        } else {
                            lastId = rows[0].ngo_id;
                            newId = "NGO@" + ("000000" + (parseInt(lastId.toString().substring(4)) + 1)).slice(-6);
                            console.log(newId)
                        }


                        connection.query("INSERT INTO ngo(ngo_id,ngo_name,classification,contact,description,ngo_link,status) VALUES(?,?,?,?,?,?,?)",[newId,ngoName, classification, contact, description,ngoLink,status],err =>{

                            if(err) {
                                connection.rollback()
                                return reject(err)
                            }
                            else{
                                connection.query("INSERT INTO ngo_address(ngo_id,area,city,state) VALUES (?,?,?,?)", [newId,area,city,state], err=>{
                                    if(err) {
                                        connection.rollback();
                                        return reject(err.message)
                                    }
                                    else{
                                        connection.query("INSERT INTO users(ngo_id , type , password) VALUES (?,?,?)" ,[newId , type ,hashedPassword], async err =>{
                                            if(err){
                                                connection.rollback();
                                                return reject(err)
                                            }
                                            // == Insert code hear ==
                                            if(Array.isArray(category)){
                                                for (const c of category) {
                                                    let r = await connection.query("INSERT INTO ngo_category (category,ngo_id) VALUES (?,?) ", [c,newId], (error)=>{
                                                        if(error){
                                                            console.log("Something went wrong err->", error)
                                                            return false;
                                                        }
                                                        return true;
                                                    })
                                                    if(!r){
                                                        connection.rollback();
                                                        reject("Something Went wrong");
                                                    }
                                                    console.log(`The Result of Category ${category} is ${r}`);
                                                }
                                            }else{
                                                let r = await connection.query("INSERT INTO ngo_category (category,ngo_id) VALUES (?,?) ", [category , newId], (error)=>{
                                                    if(error){
                                                        console.log("Something went wrong err->", error)
                                                        return false;
                                                    }
                                                    return true;
                                                })
                                                if(!r){
                                                    connection.rollback();
                                                    return reject("Something Went wrong")
                                                }
                                            }

                                            console.log("Committing the data ")
                                            connection.commit()
                                            return resolve("User Added Successfully..")
                                        })

                                    }
                                })
                            }
                        })
                    })
                })


            }
        })
    })
}

module.exports.addBranch = (ngo_id,area,city,state) =>{
    return new Promise((resolve,reject)=>{
        connection.query("INSERT INTO ngo_address(ngo_id,area,city,state) VALUES (?,?,?,?)", [ngo_id,area,city,state], err=> {
            if (err) {
                connection.rollback();
                return reject(err.message)
            } else {
                resolve("Branch added")
            }
        })
    })
}
async function insertCategory(ngoId, catogory){
    console.log("category",catogory)
    console.log("NgoId", ngoId)
    return await connection.query("INSERT INTO ngo_category (category,ngo_id) VALUES (?,?) ", [catogory,ngoId], (error)=>{
        return !error;
    })
}

module.exports.signUpVolunteer = (uid,username, address, phoneNumber, email, password, type, preferredCity,availableTime) => {
    console.log("sql")
    return new Promise((resolve, reject) => {
        connection.beginTransaction(err => {
            console.log("begin transaction");
            if (err) {
                return reject(err)
            }

            connection.query("SELECT * FROM volunteers WHERE u_id = ? ",[uid],(err,rows)=>{
                console.log("checking if user already exists");
                if(err){
                    console.log("err in checking");
                    return reject(err)
                }
                if (rows.length >0){
                    return reject( "User with this User Id already registered");
                }

                connection.query("INSERT INTO volunteers(u_id ,name, address ,phone_no ,email , pref_city ,available_time) VALUES(?,?,?,?,?,?,?) ", [uid,username, address, phoneNumber, email, preferredCity, availableTime], err => {
                    console.log("inserting data to table ");
                    if (err) {
                        return reject(err)
                    }

                    connection.query("INSERT Into users(vol_id ,type , password) VALUES(?,?,?) ", [uid,type, password, username], err => {
                        if (err) {
                            return reject(err)
                        }
                        connection.commit();
                        resolve("User Added Successfully")
                    })
                })
            })
        })
    })
}

module.exports.signUpSponsor = (uid,username, address, phoneNumber, email, password, type) => {
    console.log("sql")
    return new Promise((resolve, reject) => {
        connection.beginTransaction(err => {
            console.log("begin transaction");
            if (err) {
                return reject(err)
            }

            connection.query("SELECT * FROM sponsors WHERE u_id = ? ",[uid],(err,rows)=>{
                console.log("checking if user already exists");
                if(err){
                    console.log("err in checking");
                    return reject(err)
                }
                if (rows.length >0){
                    return reject( "User with this User Id already registered");
                }

                connection.query("INSERT INTO sponsors(u_id ,name, address ,phone_no ,email ) VALUES(?,?,?,?,?) ", [uid,username, address, phoneNumber, email], err => {
                    console.log("inserting data to table ");
                    if (err) {
                        return reject(err)
                    }

                    connection.query("INSERT Into users(spon_id ,type, password) VALUES(?,?,?) ", [uid,type, password], err => {
                        if (err) {
                            return reject(err)
                        }
                        connection.commit();
                        resolve("User Added Successfully")
                    })
                })
            })
        })
    })
}