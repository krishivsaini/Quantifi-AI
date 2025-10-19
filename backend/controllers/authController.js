const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
// generate JWT token
const generateToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1h'});
}

// Register User
exports.registerUser = async (req, res) => {
    const { name, email, password, profileImageUrl } = req.body;
    if (!name || !email || !password ) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    try{
        // check if email already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "Email already in use" });
        }

        // create the user 
        const user = await User.create({ name, email, password, profileImageUrl });
        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    try{
        // check if email exists
        const user = await User.findOne({ email });
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Get User Info
exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
