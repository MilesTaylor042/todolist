import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'todolist';
  dummy_list = [{id: 0, contents: "Item 1"}, {id: 1, contents: "Item 2"}, {id: 2, contents: "Item 3"}, {id: 3, contents: "Item 4"}]
}