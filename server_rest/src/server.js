"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const crypto_1 = require("crypto");
const bcrypt = __importStar(require("bcrypt"));
const url_1 = __importDefault(require("url"));
const mysql_1 = __importDefault(require("mysql"));
const host = '127.0.0.1';
const port = 10451;
//dummy list for testing without mysql database
//var entries = [{'id': '10', 'contents': 'Entry 1', 'completed':'false'}, {'id': '11', 'contents': 'Entry 2', 'completed':'false'}, {'id': '12', 'contents': 'Entry 3', 'completed':'false'}]
var sessions = [];
const con = mysql_1.default.createConnection({
    host: 'localhost',
    user: 'miles',
    password: 'pass123',
    database: 'todolist'
});
con.connect(function (err) {
    if (err)
        throw err;
    console.log('Connected to mysql server.');
    con.query('SHOW TABLES LIKE \'list1\'', function (err, result) {
        if (err)
            throw err;
        if (result.length == 0) {
            con.query('CREATE TABLE list1 (id VARCHAR(36), contents VARCHAR(500), completed BOOL)', function (err, result) {
                if (err)
                    throw err;
                console.log('Created table list1 as it did not exist.');
            });
        }
    });
    con.query('SHOW TABLES LIKE \'users\'', function (err, result) {
        if (err)
            throw err;
        if (result.length == 0) {
            con.query('CREATE TABLE users (username VARCHAR(255), password BINARY(60))', function (err, result) {
                if (err)
                    throw err;
                console.log('Created table users as it did not exist.');
            });
        }
    });
});
const server = http_1.default.createServer((req, res) => {
    var _a, _b, _c, _d, _e;
    const reqUrl = url_1.default.parse((_a = req.url) !== null && _a !== void 0 ? _a : "", true);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method == 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.setHeader('Allow-Origin-With-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
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
        updateEntry(req, res, id);
    }
    else if (reqUrl.pathname == '/login' && req.method == "POST") {
        validateUser(req, res);
    }
    else if (reqUrl.pathname == '/users' && req.method == "POST") {
        addUser(req, res);
    }
});
function validateUser(req, res) {
    console.log(req.method + ' ' + req.url);
    var body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        var credentials = JSON.parse(body);
        con.query('SELECT CAST(password AS CHAR) FROM users WHERE username = ?', credentials.username, function (err, result) {
            if (err) {
                var response = { 'message': err.sqlMessage };
                res.statusCode = 500;
                res.setHeader('content-Type', 'Application/json');
                res.end(JSON.stringify(response));
                throw err;
            }
            var hash = result[0]['CAST(password AS CHAR)'];
            if (bcrypt.compareSync(credentials.password, hash)) {
                var grantedResponse = { 'message': 'Credentials correct.' };
                res.statusCode = 200;
                var session = (0, crypto_1.randomBytes)(16).toString('base64');
                sessions.push(session);
                res.setHeader('Set-Cookie', 'session=' + session);
                res.setHeader('content-Type', 'Application/json');
                res.end(JSON.stringify(grantedResponse));
            }
            else {
                var deniedResponse = { 'message': 'Access denied.' };
                res.statusCode = 401;
                res.setHeader('content-Type', 'Application/json');
                res.end(JSON.stringify(deniedResponse));
            }
        });
    });
}
function addUser(req, res) {
    console.log(req.method + ' ' + req.url);
    var body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        var credentials = JSON.parse(body);
        var username = credentials.username;
        con.query('SELECT username FROM users WHERE username = ?', credentials.username, function (err, result) {
            if (err) {
                var response = { 'message': err.sqlMessage };
                res.statusCode = 500;
                res.setHeader('content-Type', 'Application/json');
                res.end(JSON.stringify(response));
                throw err;
            }
            else if (result.length > 0) {
                var responseExists = { 'message': 'A user with this username already exists.' };
                res.statusCode = 400;
                res.setHeader('content-Type', 'Application/json');
                res.end(JSON.stringify(responseExists));
                return;
            }
        });
        var salt = bcrypt.genSaltSync(10);
        var passwordHash = bcrypt.hashSync(credentials.password, salt);
        con.query('INSERT INTO users SET ?', { username: username, password: passwordHash }, function (err, result) {
            if (err) {
                var response = { 'message': err.sqlMessage };
                res.statusCode = 500;
                res.setHeader('content-Type', 'Application/json');
                res.end(JSON.stringify(response));
                throw err;
            }
        });
        con.query('CREATE TABLE ' + username + ' (id VARCHAR(36), contents VARCHAR(500), completed BOOL)', function (err, result) {
            if (err) {
                var response = { 'message': err.sqlMessage };
                res.statusCode = 500;
                res.setHeader('content-Type', 'Application/json');
                res.end(JSON.stringify(response));
                throw err;
            }
            var responseSuccess = { 'message': 'created new user ' + username + '.' };
            res.statusCode = 201;
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(responseSuccess));
        });
    });
}
function getEntries(req, res) {
    console.log(req.method + ' ' + req.url);
    con.query('SELECT * FROM list1', function (err, result, fields) {
        if (err) {
            var response = { 'message': err.sqlMessage };
            res.statusCode = 500;
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(response));
            throw err;
        }
        var responseEntries = result;
        res.statusCode = 200;
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(responseEntries));
    });
}
function addEntry(req, res) {
    console.log(req);
    console.log(req.method + ' ' + req.url);
    var body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        var newEntry = JSON.parse(body);
        con.query('INSERT INTO list1 SET ?', newEntry, function (err, result) {
            if (err) {
                var response = { 'message': err.sqlMessage };
                res.statusCode = 500;
                res.setHeader('content-Type', 'Application/json');
                res.end(JSON.stringify(response));
                throw err;
            }
            var response = { 'message': 'Added new entry to list.' };
            res.statusCode = 201;
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(response));
        });
    });
}
function deleteEntry(req, res, id) {
    console.log(req.method + ' ' + req.url);
    con.query('DELETE FROM list1 WHERE ?', { id: id }, function (err, result) {
        if (err) {
            var response = { 'message': err.sqlMessage };
            res.statusCode = 500;
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(response));
            throw err;
        }
        var response = { 'message': 'Entry deleted.' };
        res.statusCode = 200;
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(response));
    });
}
function updateEntry(req, res, id) {
    console.log(req.method + ' ' + req.url);
    var body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        con.query('UPDATE list1 SET ? WHERE id = ?', [JSON.parse(body), id], function (err, result) {
            if (err) {
                var response = { 'message': err.sqlMessage };
                res.statusCode = 500;
                res.setHeader('content-Type', 'Application/json');
                res.end(JSON.stringify(response));
                throw err;
            }
            var response = { "message": 'Entry with id ' + id + ' updated.' };
            res.statusCode = 200;
            res.setHeader('content-Type', 'Application/json');
            res.end(JSON.stringify(response));
        });
    });
}
server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
