var data = require('app/model').data,
    config = require('app/config');

// json-server init
var jsonServer = require('json-server');
var server = jsonServer.create();
server.use(jsonServer.defaults());

// static data
initStaticJsonData('transport', 'buses', data.buses);
initStaticJsonData('transport', 'stops', data.stops);
initStaticJsonData('transport', 'lines', removeFields(data.lines, ['positions', 'pos']));
initStaticJsonData('transport', 'latencies', removeFields(data.lines, ['positions', 'pos', 'stops', 'departures', 'dTimes']));
initStaticJsonData('transport', 'rawData', data);
initStaticTxtData('transport', 'streetMap', require('app/utils/streetMap')(data, config.gridSize));
initStaticJsonData('transport', 'stopNames', require('app/fixtures/stopNames'));

function initStaticJsonData(domain, dataType, jsonData) {
    server.get('/' + domain + '/' + dataType + '.json', function (req, res) {
        res.json(jsonData);
    });
}

function initStaticTxtData(domain, dataType, txtData) {
    server.get('/' + domain + '/' + dataType + '.txt', function (req, res) {
        res.write(txtData);
        res.end();
    });
}
// data storage
initStoreRouter('transport');
initStoreRouter('events');
initStoreRouter('currencies');
initStoreRouter('monuments');
server.listen(process.env.PORT || 5000);

function initStoreRouter(domain) {
    server.use('/' + domain, jsonServer.router('src/node_modules/app/db/' + domain + '.json'));
}

function removeFields(orgData, fieldsToRemove) {
    return JSON.parse(JSON.stringify(orgData, function (k, v) {
        if (fieldsToRemove.indexOf(k)>=0) {
            return undefined;
        }
        return v;
    }));
}
