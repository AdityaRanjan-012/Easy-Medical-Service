import User from "../models/User.js"; // ✅ Use 'import' instead of 'require'
import bcrypt from "bcryptjs";

// Manual User Signup
export const signupUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Manual User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(200).json({ message: "Login successful", user: userWithoutPassword });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
