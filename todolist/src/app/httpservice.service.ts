import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getEntries() {
    return this.http.get('http://127.0.0.1:10451/entries')
  }

  updateEntry(id: string, contents: string, completed: boolean) {
    const url = 'http://127.0.0.1:10451/entries'
    const body = {'id': id, 'contents': contents, 'completed': completed}
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    return this.http.patch(url, body, options)
  }
}
