const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./src/middlewares/logger');
const errorProcessing = require('./src/middlewares/errorProcessing');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

const app = express();
app.use(express.json());
app.use(requestLogger);


app.use(errorLogger);
app.use(errorProcessing);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})
