import http, { Server } from 'http'
import url from 'url'
import mysql from 'mysql'
const host = '127.0.0.1'
const port = 10451

//dummy list for testing without mysql database
//var entries = [{'id': '10', 'contents': 'Entry 1', 'completed':'false'}, {'id': '11', 'contents': 'Entry 2', 'completed':'false'}, {'id': '12', 'contents': 'Entry 3', 'completed':'false'}]

const con = mysql.createConnection({
    host: 'localhost',
    user: 'miles',
    password: 'pass123',
    database: 'todolist'
})

con.connect(function(err) {
    if (err) throw err
    console.log('Connected to mysql server.')
    con.query('SHOW TABLES LIKE \'list1\'', function (err, result) {
        if (err) throw err
        if (result.length == 0) {
            con.query('CREATE TABLE list1 (id VARCHAR(36), contents VARCHAR(500), completed BOOL)', function (err, result) {
                if (err) throw err
                console.log('Created table list1 as it did not exist.')
            })
        }
    })
})

const server: Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const reqUrl = url.parse(req.url ?? "", true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.method == 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Credentials', 'false')
        res.setHeader('Access-Control-Max-Age', 86400)
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
        res.statusCode = 200
        res.end()
    }
    else if (reqUrl.pathname == '/entries' && req.method == 'GET') {
        getEntries(req, res)
    }
    else if (reqUrl.pathname == '/entries' && req.method == 'POST') {
        addEntry(req, res)
    }
    else if (reqUrl.pathname?.indexOf('/entries') == 0 && req.method == 'DELETE') {
        var id = req.url?.split("/")[2]
        deleteEntry(req, res, id!)
    }
    else if (reqUrl.pathname?.indexOf('/entries') == 0 && req.method == 'PATCH') {
        var id = req.url?.split("/")[2]
        updateEntry(req, res, id!)
    } else if (reqUrl.pathname == '/login' && req.method == "POST") {
        validateUser(req, res)
    }
})

function validateUser(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(req.method + ' ' + req.url)
    var body = ''
    req.on('data',  function(chunk) {
        body += chunk;
    })

    req.on('end', function() {
        var credentials: {username: string, password: string} = JSON.parse(body)
        if (credentials.username == 'miles' && credentials.password == 'pass123') {
            res.statusCode = 200
            res.end()
        }
        else {
            res.statusCode = 401
            res.end()
        }
    })
}

function getEntries(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(req.method + ' ' + req.url)
    con.query('SELECT * FROM list1', function (err, result, fields) {
        if (err) {
            var response = {'message': err.sqlMessage!}
            res.statusCode = 500
            res.setHeader('content-Type', 'Application/json')
            res.end(JSON.stringify(response))
            throw err
        }
        var responseEntries = result
        res.statusCode = 200
        res.setHeader('content-Type', 'Application/json')
        res.end(JSON.stringify(responseEntries))
    })
}

function addEntry(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(req.method + ' ' + req.url)
    var body = ''
    req.on('data',  function(chunk) {
        body += chunk;
    })

    req.on('end', function() {
        var newEntry = JSON.parse(body)
        con.query('INSERT INTO list1 SET ?', newEntry, function(err, result) {
            if (err) {
                var response = {'message': err.sqlMessage!}
                res.statusCode = 500
                res.setHeader('content-Type', 'Application/json')
                res.end(JSON.stringify(response))
                throw err
            }
            var response = {'message': 'Added new entry to list.'}
            res.statusCode = 201
            res.setHeader('content-Type', 'Application/json')
            res.end(JSON.stringify(response))
        })
    })
}

function deleteEntry(req: http.IncomingMessage, res: http.ServerResponse, id: string) {
    console.log(req.method + ' ' + req.url)
    con.query('DELETE FROM list1 WHERE ?', {id: id}, function (err, result) {
        if (err) {
            var response = {'message': err.sqlMessage!}
            res.statusCode = 500
            res.setHeader('content-Type', 'Application/json')
            res.end(JSON.stringify(response))
            throw err
        }
        var response = {'message': 'Entry deleted.'}
        res.statusCode = 200
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(response))
    })
}

function updateEntry(req: http.IncomingMessage, res: http.ServerResponse, id: string) {
    console.log(req.method + ' ' + req.url)
    var body = ''
    req.on('data',  function(chunk) {
        body += chunk;
    })

    req.on('end', function() {
        con.query('UPDATE list1 SET ? WHERE id = ?', [JSON.parse(body), id], function (err, result) {
            if (err) {
                var response = {'message': err.sqlMessage!}
                res.statusCode = 500
                res.setHeader('content-Type', 'Application/json')
                res.end(JSON.stringify(response))
                throw err
            }
            var response = {"message": 'Entry with id '+ id + ' updated.'}
            res.statusCode = 200
            res.setHeader('content-Type', 'Application/json')
            res.end(JSON.stringify(response))
        })
    })
}

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})