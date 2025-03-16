import express from 'express';

const router = express.Router();

router.get('/list', (req, res) => {
  // Fetch list of hospitals
  res.json({ hospitals: ['Hospital A', 'Hospital B'] });
});

export default router;
