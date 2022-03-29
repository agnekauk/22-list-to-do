import get from './controllers/get.js';
import post from './controllers/post.js';
import deleted from './controllers/delete.js';
import put from './controllers/put.js';
import express from 'express';
import { readFile, writeFile } from 'fs';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: false
}))

app.use('/', get);
app.use('/', post);
app.use('/', deleted);
app.use('/', put);

app.listen(5004, () => {
    console.log("Server works");
})