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
              // redirect depending on whether machine is safe or not
              app.status = responseData.status === 'ok' ? 'response-positive' : 'response-negative'
              app.report = responseData;
            })
        } else if (response.status == 401 || response.status == 403) {
            // agent has not been registered yet
            app.status = 'agent-registration';
        } else {
            // something else went wrong
            app.status = 'request-error';
        }
      })
    })
}