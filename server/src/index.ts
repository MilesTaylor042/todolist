import {
    Server,
    ServerCredentials,
    loadPackageDefinition,
} from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

var packageDefinition = protoLoader.loadSync(
    '/../todo.proto',
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var todo_proto = loadPackageDefinition(packageDefinition).todo

function addItem(call, callback) {
    callback()
}

function main() {
    var server = new Server()
    server.addService(todo_proto.List.service, {addItem: addItem})
    server.bindAsync('0.0.0.0:10451', ServerCredentials.createInsecure(), () => {
        console.log("Server running on 0.0.0.0:10451")
    })
}