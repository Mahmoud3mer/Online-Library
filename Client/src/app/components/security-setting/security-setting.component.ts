import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormControl, FormGroup , ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { UserSettingsService } from '../../services/user-settings/user-settings.service';
import { ConfirmationUpdateSettingsComponent } from '../confirmation-update-settings/confirmation-update-settings.component';
import { Router } from '@angular/router';
import {ProfilePasswordInterface} from '../../interfaces/profilePassword.interface';

@Component({
  selector: 'app-security-setting',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmationUpdateSettingsComponent],
  templateUrl: './security-setting.component.html',
  styleUrl: './security-setting.component.scss'
})

export class SecuritySettingComponent {

  userId: any = '';
  token: string | null = '';
  isBrowser: boolean = false;
  formData: FormData = new FormData();
  isLoading: boolean = false;

  // Message from database
  successMessage: string = '';
  errorMessagePassword: string = '';

  showConfirmationDialog:boolean = false

  router = inject(Router);

  passwordInfoForm: FormGroup = new FormGroup({
    currentPassword: new FormControl('',[Validators.required]),
    newPassword: new FormControl('',[Validators.required,Validators.pattern(
      "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?:.*[!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>?/\\|`~])?.{8,}$"
    ),]),
    confirmPassword: new FormControl('',[Validators.required]),
  },
  {
    validators: [this.match("newPassword", "confirmPassword")],
  }
)

constructor( @Inject(PLATFORM_ID) platformId: object ,private _userSettingsService: UserSettingsService){
  this.isBrowser = isPlatformBrowser(platformId);
}

// Password-Repassword matching Fn
match(controlName: string, checkControlName: string): ValidatorFn {
  return (controls: AbstractControl) => {
    const control = controls.get(controlName);
    const checkControl = controls.get(checkControlName);

    if (checkControl?.errors && !checkControl.errors["matching"]) {
      return null;
    }

    if (control?.value !== checkControl?.value) {
      controls.get(checkControlName)?.setErrors({ matching: true });
      return { matching: true };
    } else {
      return null;
    }
  };
}


  updateUserProfile(){
    const passwordData: ProfilePasswordInterface = {
      currentPassword: this.passwordInfoForm.get('currentPassword')?.value,
      newPassword: this.passwordInfoForm.get('newPassword')?.value,
      confirmPassword: this.passwordInfoForm.get('confirmPassword')?.value
    };

    this._userSettingsService.updateUserPassword(passwordData).subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.successMessage = res.message
        this.errorMessagePassword = '';
        // console.log(this.successMessage);
        this.openConfirmationDialog();
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.errorMessagePassword = err.error.message
        this.successMessage = ''
        // console.log(this.errorMessagePassword);
        this.openConfirmationDialog();
      },
      complete: () => {
        console.log("Update Profile Completed");
        this.isLoading = false;
        this.errorMessagePassword = '';
      }
    })
  }

  saveSettings(){
    this.errorMessagePassword = '';
    this.successMessage = '';

    if (this.passwordInfoForm.valid == false) {
      this.passwordInfoForm.markAllAsTouched()
    }
    else{
      this.isLoading = true;
      this.updateUserProfile();
    }
    
    console.log(this.passwordInfoForm);
  }


  //confirmation //
  openConfirmationDialog(): void {

    if (this.successMessage) {
      this.showConfirmationDialog = true;
    } else if (this.errorMessagePassword) {
      this.showConfirmationDialog = true;
    }else{
      this.showConfirmationDialog = false;
    }
  }

  handleConfirm(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token'); //logout
      this.router.navigate(['/signin'])
    }
  }

  handleCancel(){
    this.errorMessagePassword = ''
    this.showConfirmationDialog = false;
  }
}

