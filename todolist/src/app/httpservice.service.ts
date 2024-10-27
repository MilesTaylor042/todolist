import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as uuid from 'uuid'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getEntries() {
    return this.http.get('http://127.0.0.1:10451/entries')
  }

  addEntry(contents: string) {
    const url = 'http://127.0.0.1:10451/entries'
    const body = {'id': uuid.v4(), 'contents': contents, 'completed': false}
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    return this.http.post(url, body, options)
  }

  updateEntry(id: string, contents: string, completed: boolean) {
    const url = 'http://127.0.0.1:10451/entries/' + id
    const body = {'contents': contents, 'completed': completed}
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    return this.http.patch(url, body, options)
  }

  deleteEntry(id: string) {
    const url = 'http://127.0.0.1:10451/entries/' + id
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    return this.http.delete(url, options)
  }
}
