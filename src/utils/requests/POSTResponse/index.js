import { baseAPIUrl } from '../../../constants';
// import https from 'https';

const init = {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' })
}

// const init2 = {
//     method: 'POST',
//     headers: new Headers({ 'Content-Type': 'application/json' }),
//     body: JSON.stringify(resolve)
// }

export default async () => fetch(baseAPIUrl + 'home/', init);
// export default fetch(baseAPIUrl + 'agent/response/', init2)


// https.get('https://swapi.co/api/people/1/', res => {
//   res.on('data', data => { console.log(data) })
// }).on('error', e => { console.error(e) });