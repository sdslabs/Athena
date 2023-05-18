import path from 'path';
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	res.sendFile(path.join(path.resolve(), './static/index.html')); // DONE
});

router.get('/timer', (req, res) => {
	res.sendFile(path.join(path.resolve(), './static/timer.html')); // DONE
});

export default router;
