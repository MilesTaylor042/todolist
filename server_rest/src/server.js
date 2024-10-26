"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const host = '127.0.0.1';
const port = 10451;
var entries = [{ 'id': '10', 'contents': 'Entry 1', 'completed': 'false' }, { 'id': '11', 'contents': 'Entry 2', 'completed': 'false' }, { 'id': '12', 'contents': 'Entry 3', 'completed': 'false' }];
const server = http_1.default.createServer((req, res) => {
    var _a, _b, _c, _d, _e;
    const reqUrl = url_1.default.parse((_a = req.url) !== null && _a !== void 0 ? _a : "", true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method == 'OPTIONS') {
        var headers = {};
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Credentials', 'false');
        res.setHeader('Access-Control-Max-Age', 86400);
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        res.statusCode = 200;
        res.end();
    }
    else if (reqUrl.pathname == '/entries' && req.method == 'GET') {
        getEntries(req, res);
    }
    else if (reqUrl.pathname == '/entries' && req.method == 'POST') {
        addEntry(req, res);
    }
    else if (((_b = reqUrl.pathname) === null || _b === void 0 ? void 0 : _b.indexOf('/entries')) == 0 && req.method == 'DELETE') {
        var id = (_c = req.url) === null || _c === void 0 ? void 0 : _c.split("/")[2];
        deleteEntry(req, res, id);
    }
    else if (((_d = reqUrl.pathname) === null || _d === void 0 ? void 0 : _d.indexOf('/entries')) == 0 && req.method == 'PATCH') {
        var id = (_e = req.url) === null || _e === void 0 ? void 0 : _e.split("/")[2];
        console.log(id);
        updateEntry(req, res, id);
    }
});
function getEntries(req, res) {
    console.log(req.method + ' ' + req.url);
    var response = entries;
    res.statusCode = 200;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(response));
}
function addEntry(req, res) {
    console.log(req.method + ' ' + req.url);
    var body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        entries.push(JSON.parse(body)['entry']);
        var response = [JSON.parse(body)];
        res.statusCode = 201;
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(response));
    });
}
function deleteEntry(req, res, id) {
    console.log(req.method + ' ' + req.url);
    var index = entries.findIndex((entry) => entry.id == id);
    entries.splice(index, 1);
    var response = [{ 'message': 'Entry deleted.' }];
    res.statusCode = 200;
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(response));
}
function updateEntry(req, res, id) {
    console.log(req.method + ' ' + req.url);
    console.log(id);
    var body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        console.log(id);
        var index = entries.findIndex((entry) => entry.id == id);
        entries[index].contents = JSON.parse(body)['contents'];
        entries[index].completed = JSON.parse(body)['completed'];
        var response = [{ "message": 'Entry at index ' + index + ' updated.' }];
        res.statusCode = 200;
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(response));
    });
}
server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
