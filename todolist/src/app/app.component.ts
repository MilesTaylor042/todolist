import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpService } from './httpservice.service';
import { NgFor } from '@angular/common';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    this.httpService.getEntries().subscribe(
      (response: any) => { 
        this.entries = response
      },
      (error) => { console.log(error) }
    )
  }

  addItem(contents: string) {
    if (!contents) {
      console.log('no contents provided.')
      return
    }

    //var newEntry: Entry = {id: randomUUID(), contents: contents, completed: false}

    //this.entries.push(newEntry)
  }

  toggleCompleted(e: MatCheckboxChange, entry: Entry) {
    console.log(e)
    this.httpService.updateEntry(entry.id, entry.contents, e.checked).subscribe(
      (response: any) => {
        console.log(response)
      }
    )
  }

  deleteEntry(entry: Entry) {
    console.log(entry)
  }
}