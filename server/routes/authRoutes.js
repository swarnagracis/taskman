const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);
router.post("/change-password", protect, changePassword);

module.exports = router;
