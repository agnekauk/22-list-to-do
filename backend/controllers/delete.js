import express from "express";
import { readFile, writeFile } from 'fs';
import { database } from '../config/index.js';

const router = express.Router();

router.delete('/delete-toDo/:id', (req, res) => {
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

        json.splice(jsonId, 1);
        let jsonString = JSON.stringify(json);

        writeFile(database, jsonString, 'utf8', (err) => {
            if (err) {
                res.json({ status: 'failed', message: 'Not able to save the file' });
            } else {
                res.json({ status: 'success', message: 'Element successfully deleted' });
            }
        })
    })
})

router.delete('/mass-delete', (req, res) => {
    let ids = req.body.ids;

    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Not able to read the file' })
            return
        }

        const json = JSON.parse(data);
        let dataArray = [];
        json.forEach((value, index) => {
            if (!ids.includes(value.id.toString())) {
                dataArray.push(value);
            }
        })

        let jsonString = JSON.stringify(dataArray);

        writeFile(database, jsonString, 'utf8', (err) => {
            if (err) {
                res.json({ status: 'failed', message: 'Not able to save the file' });
            } else {
                res.json({ status: 'success', message: 'Element successfully deleted' });
            }
        })
    })
})

export default router;