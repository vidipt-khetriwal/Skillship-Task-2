require('dotenv').config()

const express = require('express')
const app=express()
const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

app.delete('/logout',(req,res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/token',(req,res)=>{
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err, user)=>{
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ email: user.email, password: user.password})
        res.json({accessToken : accessToken})
    })
})

const posts = [
    {
        email: 'vidipt@gmail.com',
        password: 'abc'
    },
    {
        email: 'jim@gmail.com',
        password: 'xyz'
    }
]


app.post('/login',(req,res) => {
    //Authenticate user

    const email = req.body.email
    const password = req.body.password
    const user = { email:email, password:password}

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '30s' })
}

app.listen(4000)