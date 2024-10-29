# ToDoList App
This app allows a user to manage a to do list by adding, removing and completing entries.
A MySQL database is used to store user information and the to do lists.
In order to run the app, follow these steps:

1. A MySQL database is required to store the app's data. Enter the host, username, password, and database name for the app to use in ```./server_rest/dbconfig.json```.

2. Install any dependencies for the server and client using ```npm install``` inside both ```./server_rest``` and ```./todolist```.

3. Start the server using the command ```node server.js``` inside ```./server_rest/src```. If the credentials entered are correct, you should see the message "Connected to mysql server" alongside the host and port of the server.

4. Start the angular app by using the command ```ng serve --open``` inside ```./todolist```. This should open the app in a new browser window.

5. Register as a new user, then login to access the to do list.