const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  updateProfile,
  getNotifications,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/signup", signup);
router.post("/login", login);
router.get("/notifications", auth, role("customer"), getNotifications);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.get("/notifications", auth, getNotifications);

module.exports = router;
