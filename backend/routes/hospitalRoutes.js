import express from "express";
import { getDoctorAppointments } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/:doctorId/appointments", getDoctorAppointments);

export default router;
