import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthourizationService } from '../../services/users/authourization.service';
import { Router } from '@angular/router'; // Import Router
import { CookieService } from 'ngx-cookie-service';

// Default values shown

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FormsModule, NgClass],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [CookieService],
})
export class SigninComponent {
  successLogMsg: string = '';
  errLogMsg: string = '';
  isLoading: boolean = false;

  constructor(
    private _authourizationService: AuthourizationService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  // get email if in  cookies
  ngOnInit() {
    const savedEmail = this.cookieService.get('savedEmail');
    if (savedEmail) {
      this.loginForm.get('email')?.setValue(savedEmail);
    }
  }
  /*----------Login Form ----------- */
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    this.errLogMsg = '';
    this.successLogMsg = '';
    if (this.loginForm.valid === false) {
      this.loginForm.markAllAsTouched();
    } else {
      this.isLoading = true;
      const email = this.loginForm.get('email')?.value;
      const rememberMe = (
        document.getElementById('default-checkbox') as HTMLInputElement
      )?.checked;

      if (rememberMe) {
        this.cookieService.set('savedEmail', email, 30); //saved 30 days
      } else {
        this.cookieService.delete('savedEmail');
      }
      this._authourizationService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading = false;
          this.loginForm.reset();
          this._authourizationService.saveUserToken(res.token);

          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.log(err);
          this.errLogMsg = err.error.message;
          this.isLoading = false;
        },
      });
    }
  }
}
