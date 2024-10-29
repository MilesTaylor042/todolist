import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpService } from '../httpservice.service';
import { NgFor } from '@angular/common';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatListModule } from '@angular/material/list'
import { FormsModule, FormBuilder, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Entry } from '../entry';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterOutlet, 
            NgFor, 
            MatCheckboxModule, 
            MatButtonModule,
            MatIconModule,
            MatDividerModule,
            MatInputModule,
            MatFormFieldModule,
            ReactiveFormsModule,
            MatListModule,
            FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  title: string = 'todolist';
  constructor(private httpService: HttpService, private formBuilder: FormBuilder, private cookieService: CookieService) {}

  //Local array of list entries
  entries: Entry[] = []

  //Form control group to add a new entry
  addForm = this.formBuilder.group({contents: ''})

  ngOnInit() {
    if (this.cookieService.get('login')) {
      console.log(this.cookieService.get('login'))
    }
    this.getEntries()
  }

  //Adds an entry to the list then resets the form
  onSubmit(): void {
    if (this.addForm.value['contents'] != '') {
      this.addEntry(this.addForm.value['contents']!)
    }
    this.addForm.reset()
  }

  //Uses HTTP service to get all entries in the list from the API, then updates the local list
  getEntries() {
    this.httpService.getEntries().subscribe(
      (response: any) => { 
        this.entries = []
        for (var item of response) {
          //Cast to boolean to convert from mysql boolean data type
          item.completed = Boolean(item.completed)
          this.entries.push(item)
        }
      }
    )
  }

  //Uses HTTP service to add an entry to the list, then updates the local list
  addEntry(contents: string) {
    if (!contents) {
      throw new Error('no contents provided')
    }

    this.httpService.addEntry(contents).subscribe(
      (response: any) => {
        this.getEntries()
      }
    )
  }

  //Uses HTTP service to update an entry's completed 
  toggleCompleted(e: MatCheckboxChange, entry: Entry) {
    this.httpService.updateEntry(entry.id, entry.contents, e.checked).subscribe(
      (response: any) => { }
    )
  }

  //Uses HTTP service to delete an entry from the list
  deleteEntry(entry: Entry) {
    this.httpService.deleteEntry(entry.id).subscribe(
      (response: any) => {
        var index = this.entries.findIndex((localEntry) => localEntry.id == entry.id)
        this.entries.splice(index, 1)
      }
    )
  }
}