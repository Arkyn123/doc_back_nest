import { config } from 'src/utils/config';
import errors from 'src/utils/errors';
import fetch from 'node-fetch';

//Форматирование имени (ИВАНОВ ИВАН ИВАНОВИЧ => Иванов Иван Иванович)
const camelCase = (rawWord) => {
  return rawWord
    .trim()
    .split(' ')
    .map((w) => w.toLowerCase())
    .map((w) => (w = w[0].toUpperCase() + w.substring(1)))
    .join(' ');
};

export default async function setUserToRequest(req, res) {
  return !req.permissions.authenticated
    ? null
    : !req.headers.authorization
    ? res.sendStatus(errors.unauthorized.code)
    : (async () => {
        try {
          const response = await fetch(
            config[process.env.NODE_ENV].services.gatewayDecode,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: req.headers.authorization.split(' ')[1],
              }),
            },
          );

          const userFromService = await response.json();
          const user = {
            id: parseInt(userFromService.emp, 10),
            fullname: camelCase(userFromService.FIO),
          };
          req.user = user;
          req.token = req.headers.authorization.split(' ')[1];
          // ===> SetRolesToRequest
        } catch (error) {
          return res.sendStatus(errors.badRequest.code);
        }
      })();
}
