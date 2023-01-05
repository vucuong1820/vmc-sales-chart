/* eslint-disable no-console */
const next = require('next');
const dbConnect = require('./configs/dbConnect');
const serverConnect = require('./configs/serverConnect');
const agendaConnect = require('./configs/agendaConnect');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT;
const app = next({ dev, port });

app.prepare().then(async () => {
  await dbConnect();
  serverConnect(app);
  agendaConnect();
});
