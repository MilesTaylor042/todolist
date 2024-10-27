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
import { response } from 'express';
import { error } from 'console';


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
  entries: Entry[] = []
  constructor(private httpService: HttpService, private formBuilder: FormBuilder) {}

  addForm = this.formBuilder.group({contents: ''})

  onSubmit(): void {
    if (this.addForm.value['contents'] != '') {
      this.addEntry(this.addForm.value['contents']!)
    }
    this.addForm.reset()
  }

  ngOnInit() {
    this.getEntries()
  }

  getEntries() {
    this.httpService.getEntries().subscribe(
      (response: any) => { 
        this.entries = []
        for (var item of response) {
          item.completed = Boolean(item.completed)
          this.entries.push(item)
        }
      }
    )
  }

  addEntry(contents: string) {
    if (!contents) {
      throw new Error('no contents provided')
    }

    this.httpService.addEntry(contents).subscribe(
      (response: any) => {
        console.log(response)
        this.getEntries()
      }
    )
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