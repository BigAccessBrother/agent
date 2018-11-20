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

const getValues = (obj, keys, res = {}) => {
    const arr = obj.stdout.split('\n').filter(e => e.length > 2)
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

const getAsync = async cmds => {
    const arr = cmds.map(async cmd => await exec(cmd))
    return Promise.all(arr).then(
        values => { 
            const data = [
                getValues(values[0], keysAll[0]),
                getValues(values[1], keysAll[1]),
                getValues(values[2], keysAll[2]),
                getValues(values[3], keysAll[3]),
            ];
            return Object.assign(
                ...data,
                { list_of_startup_apps: values[4].stdout },
                { list_of_installed_apps: values[5].stdout }
            );
        }
    )
}

const getWindows = () => {
    return getAsync(commands);
}

export default getWindows;