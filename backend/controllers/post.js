import express from "express";
import { readFile, writeFile } from 'fs';
import { database } from '../config/index.js';

const router = express.Router();

router.post('/add-toDo', (req, res) => {
    let task = req.body.task;

    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Not able to read the file' })
            return
        }
        let json = JSON.parse(data);
        let id = json.length > 0 ? json[json.length - 1].id + 1 : 0;
        json.push({ id, task, done: false })

        writeFile(database, JSON.stringify(json), 'utf8', err => {
            if (err) {
                res.json({ status: 'failed', message: 'Not able to save the file' })
            } else {
                res.json({ status: 'success', message: 'File successfully saved' })
            }
        })
    })
})

export default router;