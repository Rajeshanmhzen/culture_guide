import bcrypt from "bcrypt"
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const register = async(req,res)=> {
    try {
        const {fullname, email, password} = req.body
        
    const user = await User.findOne({ email });

    if (user) {
      throw new Error("Already user exits.");
    }

        if(!fullname) {
            throw new Error("Full name is required!")
        }
        if(!password) {
            throw new Error("Password is requried ")
        }else if(password.length <7) {
            throw new Error("Password must contain astleast 7 characters")
        }
        if(!email) {
            throw new Error("Email is required! ")
        }
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password,salt)
        if(!hashPassword) {
            throw new Error("Somthing went wrong when hashing!")
        }
        const payload = {
            ...req.body,
            password:hashPassword
        }
        const userData = new User(payload)
        const saveUser  = await userData.save()
        saveUser.password = undefined
        res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message: "User created Successfully!",
    });
    } catch (error) {
        res.status(400).json({
            message:error.message || error,
            error:true,
        })
    }
   

}
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new Error("Email is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    if (password.length < 7) {
      throw new Error("Password must contain at least 7 characters");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const comparePassword = await bcrypt.compare(password, user.password); // ✅ Await this!
    if (!comparePassword) {
      throw new Error("Invalid password");
    }

    const tokenData = {
      userId: user._id,
      email: user.email,
      role: user.role,
      profilePic:user.profilePic,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "1d",
    });

    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
    };

    res
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({
        message: `Welcome back ${safeUser.fullname}`,
        user: safeUser,
        success: true,
        error: false,
      });
  } catch (err) {
    console.log("Login error:", err.message); 
    res.status(400).json({
      message: err.message || "Something went wrong",
      error: true,
    });
  }
};
export const getProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!fullname || !email) {
      return res.status(400).json({ success: false, message: "Fullname and email are required" });
    }

    const updateData = { fullname, email };

    if (req.file) {
      // Remove old profile picture
      if (user.profilePic) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const uploadsDir = path.resolve(__dirname, "../uploads/user-profiles");
        const oldFilePath = path.join(uploadsDir, user.profilePic);

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          // console.log("Old profile pic deleted:", user.profilePic);
        } else {
          console.warn("Old profile pic not found:", oldFilePath);
        }
      }

      // Update to new filename
      updateData.profilePic = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const changePassword = async (req, res) => {
  try {
    const userId = req.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both current and new passwords are required.",
        success: false,
        error: true,
      });
    }

    if (newPassword.length < 7) {
      return res.status(400).json({
        message: "New password must be at least 7 characters.",
        success: false,
        error: true,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
        error: true,
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
        success: false,
        error: true,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully.",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal Server Error",
      success: false,
      error: true,
    });
  }
};
export const logout = (req,res)=> {
    try {
         res.clearCookie("token")
          res.send({ message: "Logout successfully", success: true, error: false });

    } catch (err) {
        console.log(err)
    }
}