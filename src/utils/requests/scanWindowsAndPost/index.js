import scanWindows from '../../scanWindows';
import { makeRequest } from '../';

export default async (app) => {
    // get scanData
    app.status = 'collecting-data'
    scanWindows()
    .then(data => {
      console.log('scan successful', data)
      app.status = 'sending-request';
      app.number = data.system_serial_number;

      // send scanData
      makeRequest('response/', 'POST', data).then(response => {
        console.log('posted agent response', response)
        if (response.ok) {
            response.json().then(responseData => { 
              console.log('Status report: ', responseData) 
              app.status = responseData.status === 'ok' ? 'response-positive' : 'response-negative'
            })
        } else if (response.status == 401 || response.status == 403) {
            app.status = 'agent-registration';
        } else {
            app.status = 'request-error';
        }
      })
    })
}