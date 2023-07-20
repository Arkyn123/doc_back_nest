import { config } from 'src/utils/config';
import errors from 'src/utils/errors';
import fetch from 'node-fetch';

const formatName = (rawWord) => {
  return rawWord
    .trim()
    .split(' ')
    .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
    .join(' ');
};

export default async function setUserToRequest(req, res) {
  if (!req.permissions.authenticated) return;

  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) return res.sendStatus(errors.unauthorized.code);

  try {
    const response = await fetch(
      config[process.env.NODE_ENV].services.gatewayDecode,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: authorizationHeader.split(' ')[1],
        }),
      },
    );

    const userFromService = await response.json();

    const user = {
      id: userFromService.emp,
      fullname: formatName(userFromService.FIO),
    };

    req.user = user;
    req.user.token = authorizationHeader.split(' ')[1];

    // ===> SetRolesToRequest
  } catch (error) {
    return res.sendStatus(errors.badRequest.code);
  }
}
