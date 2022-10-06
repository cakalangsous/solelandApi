import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization']

    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(200).json({status: false, message: 'Unauthorized'})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(200).json({ status: false, message: 'Something went wrong. Please try again.'})
        
        req.email = decoded.email
        req.id = decoded.id

        next()
    })
}

export default verifyToken