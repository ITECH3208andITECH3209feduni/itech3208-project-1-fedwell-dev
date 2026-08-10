const express = require('express');
const pool = require('../db');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM health_checks ORDER BY created_at DESC'
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Fetch records error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const {
    session_id,
    check_date,
    age,
    gender,
    postcode,
    seen_gp,
    loc,
    clinic_postcode,
    student_nurse,
    supervisor,
    bp_sys,
    bp_dia,
    pulse,
    resp,
    oxysat,
    temp,
    waist,
    height,
    weight,
    bmi,
    diab,
    notes
  } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO health_checks
        (
          session_id,
          check_date,
          age,
          gender,
          postcode,
          seen_gp,
          loc,
          clinic_postcode,
          student_nurse,
          supervisor,
          bp_sys,
          bp_dia,
          pulse,
          resp,
          oxysat,
          temp,
          waist,
          height,
          weight,
          bmi,
          diab,
          notes
        )
      VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
        )
      RETURNING *
      `,
      [
        session_id,
        check_date,
        age,
        gender,
        postcode,
        seen_gp,
        loc,
        clinic_postcode,
        student_nurse,
        supervisor,
        bp_sys,
        bp_dia,
        pulse,
        resp,
        oxysat,
        temp,
        waist,
        height,
        weight,
        bmi,
        diab,
        notes
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('Create record error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;