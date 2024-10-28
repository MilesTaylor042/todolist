import { Component } from '@angular/core';
import { HttpService } from '../httpservice.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'
import { randomUUID } from 'crypto';

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
  constructor(private httpService: HttpService, private formBuilder: FormBuilder, private router: Router, private cookieService: CookieService) {}
  //Form control groups for login and register forms
  loginForm = this.formBuilder.group({username: '', password: ''}, {validators: [Validators.required, Validators.required]})
  registerForm = this.formBuilder.group({username: '', password: ''}, {validators: [Validators.required, Validators.required]})

  //Attempts a login after the login form has been filled
  login() {
    var username = this.loginForm.value['username']
    var password = this.loginForm.value['password']
    if (username && password) {
      this.httpService.validateUser(username, password).subscribe(
        (response: any) => {
          var status = response.status
          if (status == 200) {
            this.cookieService.set('login', username!, 1000)
            this.router.navigate(['/list'])
          } 
          else {
            console.log('INVALID CREDENTIALS')
          }
        }
      )
      this.loginForm.reset()
    }
  }

  //Attempts to register a user on the server
  register() {
    var username = this.registerForm.value['username']
    var password = this.registerForm.value['password']
    if (username && password) {
      this.httpService.addUser(username, password).subscribe(
        (response: any) => {
          console.log(response)
        }
      )
      this.registerForm.reset()
    }
  }
}
