import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpService } from './httpservice.service';
import { error } from 'console';
import { NgFor } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, MatCheckboxModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'todolist';
  entries: any
  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.httpService.getEntries().subscribe(
      (response) => { 
        this.entries = response
        console.log('Fetched current entries in list.')
      },
      (error) => { console.log(error) }
    )
  }
}