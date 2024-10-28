import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as uuid from 'uuid'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  //Check if a user's login details are valid
  validateUser(username: string, password: string) {
    const url = 'http://127.0.0.1:10451/login'
    const body = {'username': username, 'password': password}
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'}), observe: 'response' as 'body', withCredentials: true}
    return this.http.post(url, body, options)
  }

  //Add a user's credentials to the server
  addUser(username: string, password: string) {
    const url = 'http://127.0.0.1:10451/users'
    const body = {'username': username, 'password': password}
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'}), observe: 'response' as 'body', withCredentials: true}
    return this.http.post(url, body, options)
  }

  //Get all list entries from the server
  getEntries() {
    return this.http.get('http://127.0.0.1:10451/entries', {withCredentials: true})
  }

  //Add an entry to the server to do list
  addEntry(contents: string) {
    const url = 'http://127.0.0.1:10451/entries'
    const body = {'id': uuid.v4(), 'contents': contents, 'completed': false}
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'}), withCredentials: true}
    return this.http.post(url, body, options)
  }

  //Update an entry in the server to do list
  updateEntry(id: string, contents: string, completed: boolean) {
    const url = 'http://127.0.0.1:10451/entries/' + id
    const body = {'contents': contents, 'completed': completed}
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'}), withCredentials: true}
    return this.http.patch(url, body, options)
  }

  //Delete an entry from the server to do list
  deleteEntry(id: string) {
    const url = 'http://127.0.0.1:10451/entries/' + id
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'}), withCredentials: true}
    return this.http.delete(url, options)
  }
}
