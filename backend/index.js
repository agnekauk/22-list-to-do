import express from 'express';
import { readFile, writeFile } from 'fs';
import cors from 'cors';

const app = express();
const database = './database.json'

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: false
}))

app.get('/', (req, res) => {

    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Not able to read the file' })
        } else {
            data = JSON.parse(data);
            res.json({ status: 'success', data })
        }
    })
})

app.get('/:id', (req, res) => {
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

app.post('/add-toDo', (req, res) => {
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

app.delete('/delete-toDo/:id', (req, res) => {
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

app.delete('/mass-delete', (req, res) => {
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

app.put('/mark-done/:id', (req, res) => {
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

app.put('/edit/:id', (req, res) => {
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

app.listen(5004, () => {
    console.log("Server works");
})