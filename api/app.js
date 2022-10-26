const express = require("express")
const cors = require("cors");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const { actionCodeSettings, admin } = require("./config/firebase-admin")
const {isLoggedIn} = require("./middlewares/auth")


const app = express()

app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))

app.get("/", (req, res) => {
    res.json({ msg: "welcome" })
})

const JWT_SECRET = "scsdcdsd23r325432r235234$%$%^$#@E#D@R@#$%"
const isUndefined = (param)=> typeof param === "undefined"
const isEmpty = (param) => param === ""

function sendRes(res, status=200, error = false, message="", data = {}){
    res.status(status).json({
        error,
        message,
        data
    })
}

function genAccessToken(payload) {
    if (payload === "" || payload === undefined) {
      return console.error("Access token requires a payload field but got none");
    }
  
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1yr" });
}

function genRefreshToken(payload) {
    if (payload === "" || payload === undefined) {
        return console.error("Refresh token requires a payload field but got none");
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1yr" });
}
  

let tempDB = []

// Login 
// : by Google
app.post("/api/auth/google", (req, res) => {

    const {email, token, username, image, uid, type} = req.body;
    const payload = req.body;

    if(type === "signup_with_google"){
        if(isUndefined(email) || isEmpty(email)){
            return sendRes(res, 400, true, "email is empty")
        }
        if(isUndefined(username) || isEmpty(username)){
            return sendRes(res, 400, true, "username is empty")
        }
        if(isUndefined(token) || isEmpty(token)){
            return sendRes(res, 400, true, "something went wrong signing up with google.. please, use email and password")
        }
    
        // check if email exists
        const filteredUser = tempDB.length === 0 ? [] : tempDB.filter((user)=> user.email === email);
    
        if(filteredUser.length > 0){
            return sendRes(res, 404, true, "user with this email already exists...")
        }
    
        tempDB.push({
            id: uid || Math.floor(Math.random() * 100000),
            email,
            token: "",
            username,
            hash: "",
            image,
            createdAt: Date.now()
        })
    
        return sendRes(res, 200, true, "Sign up successfull", {email,username,image,token})
    }
    if(type === "signin_with_google"){
        if(isUndefined(email) || isEmpty(email)){
            return sendRes(res, 400, true, "email is empty")
        }
        if(isUndefined(username) || isEmpty(username)){
            return sendRes(res, 400, true, "username is empty")
        }
        if(isUndefined(token) || isEmpty(token)){
            return sendRes(res, 400, true, "something went wrong signing up with google.. please, use email and password")
        }
    
        // check if email exists
        const filteredUser = tempDB.length === 0 ? [] : tempDB.filter((user)=> user.email === email);
    
        if(filteredUser.length === 0){
            return sendRes(res, 404, true, "user with this email dont exists...")
        }

        const refToken = genRefreshToken({email, id: uid})
        const accToken = genAccessToken({email, id: uid}) 

        const notIncluded = tempDB.filter((user)=> user.email !== email)

        filteredUser[0].token = refToken;

        const allData = [...notIncluded, ...filteredUser]
    
        tempDB = allData;
    
        return sendRes(res, 200, true, "Sign in successfull", {email,username,image,token: accToken})
    }
})

// : by Email
app.post("/api/auth/mail", (req, res) => {

    const {email, password, username, uid, type} = req.body;
    const payload = req.body;

    if(type === "signup_with_mail"){
        if(isUndefined(email) || isEmpty(email)){
            return sendRes(res, 400, true, "email is empty")
        }
        if(isUndefined(username) || isEmpty(username)){
            return sendRes(res, 400, true, "username is empty")
        }
        if(isUndefined(password) || isEmpty(password)){
            return sendRes(res, 400, true, "password is empty")
        }
    
        // check if email exists
        const filteredUser = tempDB.length === 0 ? [] : tempDB.filter((user)=> user.email === email);
    
        if(filteredUser.length > 0){
            return sendRes(res, 404, true, "user with this email already exists...")
        }
    
        tempDB.push({
            id: uid || Math.floor(Math.random() * 100000),
            email,
            token: "",
            hash: password,
            username,
            image: `https://avatars.dicebear.com/api/avataaars/${username}.svg`,
            createdAt: Date.now()
        })
    
        return sendRes(res, 200, true, "Sign up successfull", {email,username})
    }

    if(type === "signin_with_mail"){
        if(isUndefined(email) || isEmpty(email)){
            return sendRes(res, 400, true, "email is empty")
        }
        if(isUndefined(password) || isEmpty(password)){
            return sendRes(res, 400, true, "password is empty")
        }
    
        // check if email exists
        const filteredUser = tempDB.length === 0 ? [] : tempDB.filter((user)=> user.email === email);
    
        if(filteredUser.length === 0){
            return sendRes(res, 404, true, "user with this email dont exists...")
        }

        const {hash} = filteredUser[0]

        // return console.log(filteredUser)
        
        if(hash !== password){
            return sendRes(res, 404, true, "invalid credentials...") 
        }
        

        const uuid = Math.floor(Math.random() * 100000)
        const refToken = genRefreshToken({email, id: uuid})
        const accToken = genAccessToken({email, id: uuid})
    
        tempDB.push({
            id: uuid,
            email,
            token: refToken,
            username,
            image: `https://avatars.dicebear.com/api/avataaars/${username}.svg`,
            createdAt: Date.now()
        })
    
        return sendRes(res, 200, true, "Sign in successfull", {email,username, token: accToken})
    }
})

app.get("/user", isLoggedIn, (req, res)=>{
    const userId = req?.user?.id;
    const filteredUser = tempDB.filter((user)=> user.id === userId);

    sendRes(res, 200, false, "user fetched sucesfully", filteredUser)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server started http://localhost:${PORT}`)
})

