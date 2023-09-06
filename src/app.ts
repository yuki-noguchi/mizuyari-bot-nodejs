import express from 'express';

const app = express();

app.listen(process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_, res) => res.json({ hello: 'world' }));