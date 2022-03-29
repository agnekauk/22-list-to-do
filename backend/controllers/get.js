import express from "express";
import { readFile } from 'fs';
import { database } from '../config/index.js';

const router = express.Router();

router.get('/', (req, res) => {

    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Not able to read the file' })
        } else {
            data = JSON.parse(data);
            res.json({ status: 'success', data })
        }
    })
})

router.get('/:id', (req, res) => {
    let id = req.params.id;
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Not able to read the file' })
            return
        }

        const json = JSON.parse(data);

        const jsonId = json.findIndex((el) => el.id == id);
        if (jsonId === -1) {
            res.json({ status: 'failed', message: 'Not able to find the element' });
            return
        }
        let info = json[jsonId];
        res.json({ status: 'success', info });
    })
})

export default router;