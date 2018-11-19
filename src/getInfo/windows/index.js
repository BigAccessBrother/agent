
import { exec } from 'child_process';

// turn execs in to promises and resolve them all at once!

// const util = require('util');
// const exec = util.promisify(require('child_process').exec);

// also, make an object out of this mess!

const keysSys = [
    'OS Name', 
    'OS Version', 
    'OS Manufacturer', 
    'System Model', 
    'System Type', 
    'BIOS Version'
];

const keysSerial = ['SerialNumber'];

const keysSec = [
    'AntispywareEnabled',
    'AntispywareSignatureLastUpdated',
    'AntivirusEnabled',
    'AntivirusSignatureLastUpdated',
    'BehaviorMonitorEnabled',
    'FullScanAge',
    'NISEnabled',
    'NISSignatureLastUpdated',
    'NISSignatureVersion',
    'OnAccessProtectionEnabled',
    'QuickScanAge',
    'RealTimeProtectionEnabled'
];

const keysEncr = ['Protection Status']


const getArr = (cmd, callback) => {
    exec(
        cmd,
        (err, stdout, stderr) => {
            // splitting output to array and removing empty lines
            let arr = stdout.split('\n').filter(info => info.length > 2);
            callback(arr);
        }
    )
}

const getValues = (res, keys) => arr => {
    // search for keys in arr and push them and them + values to res
    keys.forEach(key => {
        arr.forEach(string => {
            if (string.includes(key)) {
                res[key] = string.split(':')[1].trim();
                console.log(Object.keys(res).length, res);
            }
        });
    });
}


const getWindows = () => {
    let res = {}
    
    getArr(
        'powershell -command "gwmi win32_bios | fl SerialNumber"', 
        getValues(res, keysSerial)
    );
    getArr(
        'systeminfo', 
        getValues(res, keysSys)
    );
    getArr(
        'powershell -command "Get-MpComputerStatus"', 
        getValues(res, keysSec)
    );
    getArr(
        'manage-bde -status C:', 
        getValues(res, keysEncr)
    );
    getArr(
        'powershell -command "Get-CimInstance Win32_StartupCommand | Select-Object Name, command, Location, User | Format-List"', 
        arr => {
            res['list_of_start_up_apps'] = arr;
        }
    );
    getArr(
        'wmic product | more', 
        arr => {
            res['list_of_installed_apps'] = arr
        }
    );

}

export default getWindows;