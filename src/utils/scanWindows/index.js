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

// all the keys we are looking for, paird with how they should be called in our request
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

const keysEncr = [['Protection Status', 'protection_status']]

const keysAll = [keysSerial, keysSys, keysSec, keysEncr]

// turning "True" into true and "False" into false
const boolify = (str) => str.toLowerCase() === 'true' ? true :
                            str.toLowerCase() === 'false' ? false : str

// getting key values out of basic cmd output array
const getValues = (arr, keys, res = {}) => {
    // search for keys in arr and push them and them + values to res
    keys.forEach(key => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].includes(key[0])) {
                res[key[1]] = boolify(arr[i].split(':')[1].trim());
                break;
            }
        }
    });
    return res
}

// get the startup apps into a nice array of objects
const getStartup = (arr1, res = []) => {
    // get rid of that one line that was too long and put on a new line
    const arr = arr1.map((e, i, arr) => {
        if(e.includes(':')) {
            if (arr[i + 1] && !arr[i + 1].includes(':')) {
                return e + arr[i + 1].trim()
            }
            return e
        }
    }).filter(e => e && e.includes(':'));
    // turn 4 lines at a time into an object
    for (let i = 0; i < arr.length / 4; i++) {
        res.push({
            name: arr[i * 4].split(':')[1].trim(),
            command: arr[i * 4 + 1].split(':')[1].trim(),
            location: arr[i * 4 + 2].split(':')[1].trim(),
            user: arr[i * 4 + 3].split(':')[1].trim(),
        })
    }
    return { startup_apps: res }
}

// get the entry starting at a particular index out of a long string
const getKeyword = (str, indKey) => str.substring(indKey, str.indexOf('  ', indKey))

// get the installed apps into a nice array of objects
const getInstalled = (arr, res = []) => {
    // find out where in lines our info sits
    const indName = arr[0].indexOf('Name');
    const indVendor = arr[0].indexOf('Vendor');
    const indVersion = arr[0].indexOf('Version');
    const indDate = arr[0].indexOf('InstallDate');
    // retrieve our info from every line and push it to res as an object
    for (let i = 1; i < arr.length; i++) {
        res.push({
            name: getKeyword(arr[i], indName),
            vendor: getKeyword(arr[i], indVendor),
            version: getKeyword(arr[i], indVersion),
            install_date: getKeyword(arr[i], indDate)
        });
    }
    return { installed_apps: res }
}

// this is where all the magic happens
const getAsync = async cmds => {
    // execute all our commands asynchronously
    // then split their output into arrays by lines 
    const arr = cmds.map(async cmd => {
        const res = await exec(cmd)
        return res.stdout.split('\n').filter(e => e.length > 2)
    })
    // resolve promises and get output in the format we want
    return Promise.all(arr).then(
        values => { 
            const data = [
                getValues(values[0], keysAll[0]),
                { agent_version: process.env.npm_package_version },
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

// what we export:
// this returns the promise of a nicely formatted object for the body of a post request
const scanWindows = () => {
    return getAsync(commands);
}

export default scanWindows;