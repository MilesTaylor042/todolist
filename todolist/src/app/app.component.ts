import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpService } from './httpservice.service';
import { NgFor } from '@angular/common';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'
import { FormsModule, FormBuilder, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Entry } from './entry';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
            NgFor, 
            MatCheckboxModule, 
            MatButtonModule,
            MatIconModule,
            MatDividerModule,
            ReactiveFormsModule,
            FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'todolist';
  entries: Entry[] = []
  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.getEntries()
  }

  getEntries() {
    this.httpService.getEntries().subscribe(
      (response: any) => { 
        this.entries = response
      }
    )
  }

  addEntry(contents: string) {
    if (!contents) {
      console.log('no contents provided.')
      return
    }

    //var newEntry: Entry = {id: randomUUID(), contents: contents, completed: false}

    //this.entries.push(newEntry)
  }

  toggleCompleted(e: MatCheckboxChange, entry: Entry) {
    this.httpService.updateEntry(entry.id, entry.contents, e.checked).subscribe(
      (response: any) => {
        console.log(response)
      }
    )
  }

  deleteEntry(entry: Entry) {
    this.httpService.deleteEntry(entry.id).subscribe(
      (response: any) => {
        console.log(response)
        var index = this.entries.findIndex((localEntry) => localEntry.id == entry.id)
        this.entries.splice(index, 1)
      }
    )
  }
}