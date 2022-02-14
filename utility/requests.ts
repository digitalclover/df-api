import * as https from 'https';

export const getRequest = (path = '', authCookie?: string): Promise<string> =>
  new Promise((res, rej) => {
    const cookie = authCookie ? authCookie : process.env.AuthCookie;
    const hasSlash = path.substring(0, 1) === '/'
    const options = {
      hostname: 'www.digitalfoundry.net',
      port: 443,
      path: hasSlash ? path : `/${path}`,
      method: 'GET',
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-US,en;q=0.9',
        'upgrade-insecure-requests': '1',
        cookie: cookie,
      },
    };

    const req = https.request(options, response => {
      let data: string;
      response.on('data', d => {
        data += d.toString('utf-8');
      });

      response.on('end', () => {
        res(data);
      });
    });

    req.on('error', error => {
      rej(error);
    });

    req.end();
  });
