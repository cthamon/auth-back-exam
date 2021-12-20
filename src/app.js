const express = require('express');
const cors = require('cors');

const connect = require('./models/dbConnect');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use(routes);
app.use('/static', express.static('public'));
app.use(errorHandler);

app.listen(port, async () => {
    console.log(`App is running at http://localhost:${port}`);
    await connect();
});