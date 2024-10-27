import { Component } from '@angular/core';
import { HttpService } from '../httpservice.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { response } from 'express';

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
  constructor(private httpService: HttpService, private formBuilder: FormBuilder, private router: Router) {}
  loginForm = this.formBuilder.group({username: '', password: ''}, {validators: [Validators.required, Validators.required]})

  onSubmit() {
    var username = this.loginForm.value['username']
    var password = this.loginForm.value['password']
    if (username && password) {
      console.log('trying to log in with credentials ' + username + ', ' + password)
      this.httpService.validateUser(username, password).subscribe(
        (response: any) => {
          console.log(response)
          if (response.statusCode != 200) {
            console.log('INVALID CREDENTIALS')
          } 
          else {
            this.router.navigate(['/list'])
          }
        }
      )
      
    }
  }
}
