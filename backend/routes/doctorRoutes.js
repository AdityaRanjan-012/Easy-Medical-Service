import express from "express";
import { assignDoctorToIllness } from "../controllers/hospitalController.js";

const router = express.Router();

router.post("/:hospitalId/assign-doctor", assignDoctorToIllness);

export default router;
