import http, { Server } from 'http'
import url from 'url'
const host = '127.0.0.1'
const port = 10451

var entries = [{'id': 10, 'contents': 'Entry 1'}, {'id': 11, 'contents': 'Entry 2'}, {'id': 12, 'contents': 'Entry 3'}]

const server: Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const reqUrl = url.parse(req.url ?? "", true)
    if (reqUrl.pathname == '/entries' && req.method == 'GET') {
        getEntries(req, res)
    }
    if (reqUrl.pathname == '/entries' && req.method == 'POST') {
        addEntry(req, res)
    }
    if (reqUrl.pathname == '/entries' && req.method == 'DELETE') {
        deleteEntry(req, res)
    }
    if (reqUrl.pathname == '/entries' && req.method == 'PATCH') {
        updateEntry(req, res)
    }
})

function getEntries(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(req.method + ' ' + req.url)
    var response = entries
    res.statusCode = 200
    res.setHeader('content-Type', 'Application/json');
    res.end(JSON.stringify(response))
}

function addEntry(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(req.method + ' ' + req.url)
    var body = ''
    req.on('data',  function(chunk) {
        body += chunk;
    })

    req.on('end', function() {
        entries.push(JSON.parse(body)['entry'])
        var response = [JSON.parse(body)]
        res.statusCode = 201
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(response))
    })
}

function deleteEntry(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(req.method + ' ' + req.url)
    var body = ''
    req.on('data',  function(chunk) {
        body += chunk;
    })

    req.on('end', function() {
        var index = entries.findIndex((entry) => entry.id == JSON.parse(body).id)
        entries.splice(index, 1)
        var response = [{'message': 'Entry at index '+ index + ' deleted.'}]
        res.statusCode = 200
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(response))
    })
}

function updateEntry(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(req.method + ' ' + req.url)
    var body = ''
    req.on('data',  function(chunk) {
        body += chunk;
    })

    req.on('end', function() {
        var index = entries.findIndex((entry) => entry.id == JSON.parse(body).id)
        entries[index].contents = JSON.parse(body)['contents']
        var response = [{"message": 'Entry at index '+ index + ' updated.'}]
        res.statusCode = 200
        res.setHeader('content-Type', 'Application/json')
        res.end(JSON.stringify(response))
    })
}

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})