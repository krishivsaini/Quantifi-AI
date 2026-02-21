const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
// generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Register User
exports.registerUser = async (req, res) => {
    const { name, email, password, profileImageUrl } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    try {
        // check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
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
    try {
        // check if email exists
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
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
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        console.log("updateUserProfile called with body:", req.body);
        const { name, email, profileImageUrl, oldPassword, newPassword } = req.body;

        // Find user
        console.log("Looking for user ID:", req.user?.id);
        const user = await User.findById(req.user.id);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // Check if email is being updated to an existing email
        if (email && email !== user.email) {
            console.log("Checking if new email exists:", email);
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log("Email already in use");
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // Handle password update if oldPassword and newPassword are provided
        if (oldPassword && newPassword) {
            console.log("Verifying old password");
            const isMatch = await user.comparePassword(oldPassword);
            if (!isMatch) {
                console.log("Old password incorrect");
                return res.status(400).json({ message: "Incorrect old password" });
            }
            console.log("Setting new password");
            user.password = newPassword;
        }

        // Update other fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (profileImageUrl !== undefined) user.profileImageUrl = profileImageUrl;

        console.log("Saving user object...");
        // Save updated user (password hashing is handled by pre-save hook in user model)
        await user.save();
        console.log("User saved successfully");

        res.status(200).json({
            id: user._id,
            user,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error", details: error.message });
    }
}

