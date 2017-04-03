import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import cors from 'cors';
import helmet from 'helmet';
import { uuid } from './uuid';
import { sendError, sendOptions, notFoundOrGone, sendJsonOrNotAcceptable } from './utils';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

const baseURL = 'https://v1.api.ajmay.co';

app.route('/dev')
  .get(sendJsonOrNotAcceptable({
    null: `${baseURL}/dev/null`,
    rand: `${baseURL}/dev/rand`,
  }))
  .options(sendOptions(['HEAD', 'GET', 'OPTIONS']))
  .all(sendError(405));

app.route('/dev/null')
  .get(sendJsonOrNotAcceptable([]))
  .post((req, res) => res
    .status(201)
    .location(`${baseURL}/dev/null/${uuid()}`)
    .json(req.body))
  .options(sendOptions(['HEAD', 'GET', 'POST', 'OPTIONS']))
  .all(sendError(405));

app.route('/dev/null/:id')
  .get(notFoundOrGone)
  .put(notFoundOrGone)
  .patch(notFoundOrGone)
  .delete(notFoundOrGone)
  .options(sendOptions(['HEAD', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']))
  .all(sendError(405));

app.route('/dev/rand')
  .get((req, res) => res
    .format({
      'application/json': () => res.send({ value: crypto.randomBytes(Number(req.query.bytes) || 1024).toString('binary') }),
      'text/plain': () => res.send(crypto.randomBytes(Number(req.query.bytes) || 1024).toString('binary')),
      default: sendError(406),
    }))
  .get(sendJsonOrNotAcceptable({ value: crypto.randomBytes(1024).toString('binary') }))
  .options(sendOptions(['HEAD', 'GET', 'OPTIONS']))
  .all(sendError(405));

app.route('*')
  .all(sendError(404));

app.listen(80);
