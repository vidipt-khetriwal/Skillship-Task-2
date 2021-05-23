require('dotenv').config()

const express = require('express')
const app=express()
const jwt = require('jsonwebtoken')

app.use(express.json())

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

app.get('/posts',authenticateToken,(req,res) => {
    // let result = posts.filter((post) => {
    //     if (post.email === req.body.email)
    //     {
    //         if (post.password === req.body.password)
    //             return {
    //                 email: req.body.email,
    //                 // password:req.body.password
    //             }
    //     }
    //     return {'Error': "Credentials do not match"}
    // })
    // res.json(result)
    return res.json(posts.filter(post => ((post.email === req.user.email) && (post.password === req.user.password))))
})


app.post('/login',(req,res) => {
    //Authenticate user

    const email = req.body.email
    const user = { email:email, password:password}

    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
})

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token =authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) => {
        if (err) return res.sendStatus(403)
        
        req.user = user
        next()
    })
}

app.listen(3000)