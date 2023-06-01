import * as express from 'express';

//
const app = express();

app.use('/', (_, res) => {
  res.json('Hi from Comms');
});

app.listen(3000, () => {
  console.log('Comms server started successfully!');
});
