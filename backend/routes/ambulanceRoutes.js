import express from 'express';

const router = express.Router();

router.post('/request', (req, res) => {
  const { location } = req.body;
  // Logic to find nearest hospital and send an ambulance
  res.json({ message: 'Ambulance dispatched!', location });
});

export default router;
