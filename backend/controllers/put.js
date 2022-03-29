import express from "express";
import { readFile, writeFile } from 'fs';
import { database } from '../config/index.js';

const router = express.Router();

router.put('/mark-done/:id', (req, res) => {
    let id = req.params.id;
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Not able to read file' })
            return
        }

        const json = JSON.parse(data);

        const jsonId = json.findIndex((el) => el.id == id);
        if (jsonId === -1) {
            res.json({ status: 'failed', message: 'Not able to find the element' });
            return
        }

        json[jsonId].done = json[jsonId].done ? false : true;

        let jsonString = JSON.stringify(json);

        writeFile(database, jsonString, 'utf8', (err) => {
            if (err) {
                res.json({ status: 'failed', message: 'Not able to save the file' });
            } else {
                res.json({ status: 'success', message: 'Task status changed' });
            }
        })
    })
})

router.put('/edit/:id', (req, res) => {
    let id = req.params.id;
    let editedTask = req.body.task;
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

        json[jsonId].task = editedTask;

        let jsonString = JSON.stringify(json);

        writeFile(database, jsonString, 'utf8', (err) => {
            if (err) {
                res.json({ status: 'failed', message: 'Not able to get element' });
            } else {
                res.json({ status: 'success', message: 'Task succesfully edited' });
            }
        })
    })
})

export default router;