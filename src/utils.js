import statuses from 'statuses';
import { isValidUuid } from './uuid';

export function sendError(code) {
  return (req, res) => res
    .status(code)
    .format({
      'application/json': () => res.send({ error: statuses[code] || String(code) }),
      default: () => res.end(statuses[code] || String(code)),
    });
}

export function sendOptions(allow) {
  return (req, res) => res
    .set('Allow', allow.join(', '))
    .end();
}

export function notFoundOrGone(req, res) {
  const validUuid = isValidUuid(req.params.id);
  return sendError(validUuid ? 410 : 404)(req, res);
}

export function sendJsonOrNotAcceptable(body) {
  return (req, res) => res
    .format({
      'application/json': () => res.send(body),
      default: sendError(406),
    });
}
