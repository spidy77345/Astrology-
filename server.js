require('dotenv').config();
const path = require("path");
const express = require("express");
const cors = require('cors');
const logger = require('morgan');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const { authRoute, apiRoute, testRoute } = require("./routes");

const app = express();
const mongoConnect = process.env.MONGO_URL;
const port = process.env.NODE_ENV === 'development' ? 5000 : process.env.PORT;

// Data parsing
app.use(express.json());
app.use(cors({
  origin: [process.env.API_DEV, 'http://localhost:3000'],
  credentials: true
}));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') app.use(logger('dev'));

let url;
url = process.env.API_DEV;

app.listen(port, () => {
  console.log(`Server is live at ${url}:${port}`);
});

// Check if mongo url is in the right environment
if (!mongoConnect) {
  console.log(mongoConnect);
  console.log("Please set up all of your environment variables");
  console.log("Process exited with code: 1");
  process.exit(1);
}

// Connect to DB
mongoose.connect(mongoConnect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(e => {
  console.error('Error on connecting mongoose: ', e);
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected!!');
});

// HTTP request logger
app.use('/auth', authRoute);
app.use('/test', testRoute)
app.use('/api', apiRoute);

app.get('/', (req, res) => { res.send('Hello from Express!') });
