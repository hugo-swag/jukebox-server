const express = require('express');
const router = express.Router();
const CausesController = require('./controller');
const auth = require('../../auth/middleware/auth');

router.use(auth);
router.use(express.json());

router.get('/causes', async (req, res) => {
  const controller = new CausesController();
  const userId = req.user.id;
  try {
    const causes = await controller.indexForUser(userId);
    res.json(causes);
  } catch (e) {
    console.error(e);
    res.status(500).send('Causes Not Found');
  }
});

router.get('/causes/:id', async (req, res) => {
  const controller = new CausesController();
  const causeId = req.params.id;
  let cause;
  try {
    cause = await controller.getCause(causeId);
  } catch (e) {
    console.log(e);
  }
  if (cause) {
    return res.json(cause);
  } else {
    res.status(404).send(`Not Found: ${causeId}`);
  }
});

router.post('/causes/new', async (req, res) => {
  const user = req.user;
  const controller = new CausesController();
  try {
    const causeObj = req.body;
    const cause = await controller.createCause(causeObj, user.id);
    res.json(cause);
  } catch (e) {
    console.log(e);
    res.status(500).send('Error creating cause.');
  }
});

router.delete('/causes/:id', async (req, res) => {
  const user = req.user;
  const userId = user.id;
  const controller = new CausesController();
  const causesId = req.params.id;
  try {
    await controller.deleteCause(causesId, userId);
    res.json({ status: 'deleted' });
  } catch (e) {
    console.log(e);
    res.status(500).send(`Error deleting cause ${causesId}`);
  }

});

module.exports = router;