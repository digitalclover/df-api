import * as https from 'https';

export const getRequest = <T>(url:string): Promise<T> => 
  new Promise((res,rej)=>{
    let data;
    https
    .get(url, response => {
      response.on('data', d => {
        data += d.toString('utf-8');
      });

      response.on('end', () => {
        res(data as T);
      });
    })
    .on('error', error => {
      rej(error);
    });
  });