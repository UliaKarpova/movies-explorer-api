require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { NODE_ENV, mongoDB } = process.env;

const { mongo } = require('./src/utils/config');
const { requestLogger, errorLogger } = require('./src/middlewares/logger');
const rateLimit = require('./src/middlewares/rateLimit');
const errorProcessing = require('./src/middlewares/errorProcessing');
const router = require('./src/routes/index');

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(requestLogger);
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const { PORT = 3001 } = process.env;
mongoose.connect(NODE_ENV === 'production' ? mongoDB : mongo);

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});
app.use('/api', router);

app.use(errorLogger);
app.use(errorProcessing);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
