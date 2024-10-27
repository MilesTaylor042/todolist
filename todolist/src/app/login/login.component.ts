import { Component } from '@angular/core';
import { HttpService } from '../httpservice.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule,
            MatInputModule,
            MatFormFieldModule,
            ReactiveFormsModule,
            FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private httpService: HttpService, private formBuilder: FormBuilder) {}
  loginForm = this.formBuilder.group({username: '', password: ''})

  onSubmit() {
    var username = this.loginForm.value['username']
    var password = this.loginForm.value['password']
    if (username && password) {
      console.log('trying to log in with credentials ' + username + ', ' + password)
    }
  }
}
