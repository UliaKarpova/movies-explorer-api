require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { requestLogger, errorLogger } = require('./src/middlewares/logger');
const errorProcessing = require('./src/middlewares/errorProcessing');
const router = require('./src/routes/index');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
const { PORT = 3001 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});


app.use('/', router);

app.use(errorLogger);
app.use(errorProcessing);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})
