const { remote } = require('electron');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
// exec is imported as an asynchronous function


// cmd commands to get our data
const commands = [
    'powershell -command "gwmi win32_bios | fl SerialNumber"',
    'systeminfo', 
    'powershell -command "Get-MpComputerStatus"',
    'manage-bde -status C:',
    'powershell -command "Get-CimInstance Win32_StartupCommand | Select-Object Name, command, Location, User | Format-List"',
    'wmic product | more'
]

// all the keys we are looking for, paired with how they should be called in the body of our request
const keysSerial = [['SerialNumber', 'system_serial_number']];

const keysSys = [
    ['OS Name', 'os_type'], 
    ['OS Version', 'os_version'],
    ['System Manufacturer', 'system_manufacturer'],
    ['System Model', 'system_model'],
    ['System Type', 'system_type'],
    ['BIOS Version', 'bios_version'],
];

const keysSec = [
    ['AntispywareEnabled', 'antispyware_enabled'],
    ['AntispywareSignatureLastUpdated', 'antispyware_signature_last_updated'],
    ['AntivirusEnabled', 'antivirus_enabled'],
    ['AntivirusSignatureLastUpdated', 'antivirus_signature_last_updated'],
    ['BehaviorMonitorEnabled', 'behavior_monitor_enabled'],
    ['FullScanAge', 'full_scan_age'],
    ['NISEnabled', 'nis_enabled'],
    ['NISSignatureLastUpdated', 'nis_signature_last_updated'],
    ['NISSignatureVersion', 'nis_signature_version'],
    ['OnAccessProtectionEnabled', 'on_access_protection_enabled'],
    ['QuickScanAge', 'quick_scan_age'],
    ['RealTimeProtectionEnabled', 'real_time_protection_enabled'],
];

const keysEncr = [['Protection Status', 'disk_encryption_status']]

const keysAll = [keysSerial, keysSys, keysSec, keysEncr]

// turning "True" into true and "False" into false
const boolify = str => str.toLowerCase() === 'true' ? true :
                            str.toLowerCase() === 'false' ? false : str

// getting the value after ':'
const val = str => str.substring(str.indexOf(':') + 1).trim()

// getting key values out of basic cmd output array
const getValues = (arr, keys, res = {}) => {
    // search for keys in arr and push them and them + values to res
    keys.forEach(key => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].includes(key[0])) {
                res[key[1]] = boolify(val(arr[i]));
                break;
            }
        }
    });
    return res
}

// get rid of that one line that breaks because it's too long
const cleanStartUp = arr => {
    const res = arr.map((e, i, arr) => {
        if(e.includes(':')) {
            if (arr[i + 1] && !arr[i + 1].includes(':')) {
                return e + arr[i + 1].trim()
            }
            return e
        }
    })
    // clean again
    return res.filter(e => e && e.includes(':'));
}

// get the startup apps into a nice array of objects
const getStartup = (arr, res = []) => {
    const arr2 = cleanStartUp(arr);
    for (let i = 0; i < arr2.length / 4; i++) {
        res.push({
            name: val(arr2[i * 4]),
            command: val(arr2[i * 4 + 1]),
            location: val(arr2[i * 4 + 2]),
            user: val(arr2[i * 4 + 3]),
        })
    }
    return { startup_apps: res }
}

// get the entry starting at a particular index out of a long string
const getKeywordByIndex = (str, indKey) => str.substring(indKey, str.indexOf('  ', indKey))

// get the installed apps into a nice array of objects
const getInstalled = (arr, res = []) => {
    // get indeces out of first line
    const indName = arr[0].indexOf('Name');
    const indVendor = arr[0].indexOf('Vendor');
    const indVersion = arr[0].indexOf('Version');
    const indDate = arr[0].indexOf('InstallDate');
    // retrieve our info from every subsequent line and push it to res as an object
    for (let i = 1; i < arr.length; i++) {
        res.push({
            name: getKeywordByIndex(arr[i], indName),
            vendor: getKeywordByIndex(arr[i], indVendor),
            version: getKeywordByIndex(arr[i], indVersion),
            install_date: getKeywordByIndex(arr[i], indDate)
        });
    }
    return { installed_apps: res }
}

// execute command and split output by line
const execAndClean = async cmd => {
    const output = await exec(cmd)
    return output.stdout.split('\n').filter(e => e.length > 2)
}

// put everything together
const retrieveAllAndFormatAsync = async cmds => {
    const promises = cmds.map(execAndClean)
    // resolve promises and get output in the format we want
    return Promise.all(promises).then(
        values => { 
            const data = [
                getValues(values[0], keysAll[0]),
                { agent_version: remote.app.getVersion() },
                getValues(values[1], keysAll[1]),
                getValues(values[2], keysAll[2]),
                getValues(values[3], keysAll[3]),
                getStartup(values[4]),
                getInstalled(values[5]),
            ];
            // turn all the outputs into one single object
            return Object.assign(...data);
        }
    )
}

// this returns the promise of a nicely formatted object for the body of a post request
export default () => {
    return retrieveAllAndFormatAsync(commands);
}