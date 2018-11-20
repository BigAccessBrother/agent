const util = require('util');
const exec = util.promisify(require('child_process').exec);

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

const keysAll = [
    keysSerial,
    keysSys,
    keysSec,
    keysEncr
]

const commands = [
    'powershell -command "gwmi win32_bios | fl SerialNumber"',
    'systeminfo', 
    'powershell -command "Get-MpComputerStatus"',
    'manage-bde -status C:',
    'powershell -command "Get-CimInstance Win32_StartupCommand | Select-Object Name, command, Location, User | Format-List"',
    'wmic product | more'
]

const getValues = (arr, keys, res = {}) => {
    // search for keys in arr and push them and them + values to res
    keys.forEach(key => {
        arr.forEach(string => {
            if (string.includes(key)) {
                res[key] = string.split(':')[1].trim();
            }
        });
    });
    return res
}

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

const getInstalled = (obj, res = []) => {
    return true
}

const getAsync = async cmds => {
    const arr = cmds.map(async cmd => {
        const res = await exec(cmd)
        return res.stdout.split('\n').filter(e => e.length > 2)
    })
    return Promise.all(arr).then(
        values => { 
            const data = [
                getValues(values[0], keysAll[0]),
                getValues(values[1], keysAll[1]),
                getValues(values[2], keysAll[2]),
                getValues(values[3], keysAll[3]),
                getStartup(values[4]),
            ];
            return Object.assign(
                ...data,
                // { list_of_installed_apps: values[5] }
            );
        }
    )
}

const getWindows = () => {
    return getAsync(commands);
}

export default getWindows;