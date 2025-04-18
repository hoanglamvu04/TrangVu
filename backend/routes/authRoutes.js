const express = require("express");
const router = express.Router();
const resetCtrl = require("../controllers/resetPasswordController");

router.post("/send-reset-code", resetCtrl.sendResetCode);
router.post("/verify-code", resetCtrl.verifyResetCode); 
router.post("/reset-password", resetCtrl.resetPassword);

module.exports = router;
