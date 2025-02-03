const router = require('express').Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const courseValidation = require("../validation").courseValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res ,next) =>{
    console.log("正在接收一個跟auth有關的請求");
    next();
});

router.get("/testAPI", (req, res) => {
    return res.send("成功連結 auth route...");
});

router.post("/register", async (req, res) => {
    //使用者註冊資訊驗證
    let {error} =   registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //檢查email是否已經存在
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("此email已經被註冊過了");
    //製作新用戶
    let {username, email, password, role} = req.body;
    let newUser = new User({username, email, password, role});
    try{
        let savedUser = await newUser.save();
        return res.send({
            msg: "使用者成功儲存",
            savedUser,
        });
    }catch(e){
        return res.status(500).send("無法儲存使用者");
    }
});

router.post("/login", async (req, res) => {
    //使用者註冊資訊驗證
    let {error} =   loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //檢查email是否已經存在
    const foundUser = await User.findOne({email: req.body.email});
    if(!foundUser){
        return res.status(401).send("無法找到使用者,請確認信箱是否正確");
    } 

    foundUser.comparePassword(req.body.password, (err, isMatch) =>{
        if(err) return res.status(500).send(err);
        if(isMatch){
            //製作token
            const tokenObject = { _id: foundUser.id, email: foundUser.email};
            const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
            return res.send({
                msg: "成功登入",
                token: "JWT " + token,
                user: foundUser,
            });
        }else{
            return res.status(401).send("密碼錯誤"); 
        }
    });
});

module.exports = router;