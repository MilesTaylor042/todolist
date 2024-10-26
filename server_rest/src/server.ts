import http, { Server } from 'http'
import url from 'url'
const host = '127.0.0.1'
const port = 10451

var entries = [{'id': 10, 'contents': 'Entry 1', 'completed':'false'}, {'id': 11, 'contents': 'Entry 2', 'completed':'false'}, {'id': 12, 'contents': 'Entry 3', 'completed':'false'}]

const server: Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    const reqUrl = url.parse(req.url ?? "", true)
    console.log()
    console.log(req.url)
    console.log(req.method)
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.method == 'OPTIONS') {
        var headers: any = {}
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
    else if (reqUrl.pathname == '/entries' && req.method == 'DELETE') {
        deleteEntry(req, res)
    }
    else if (reqUrl.pathname == '/entries' && req.method == 'PATCH') {
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
        entries[index].completed = JSON.parse(body)['completed']
        var response = [{"message": 'Entry at index '+ index + ' updated.'}]
        res.statusCode = 200
        res.setHeader('content-Type', 'Application/json')
        res.end(JSON.stringify(response))
    })
}

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`)
})