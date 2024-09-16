import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormControl, FormGroup , ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { UserSettingsService } from '../../services/user-settings/user-settings.service';
import { ConfirmationUpdateSettingsComponent } from '../confirmation-update-settings/confirmation-update-settings.component';
import { Router } from '@angular/router';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-setting',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmationUpdateSettingsComponent],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss'
})
export class AccountSettingComponent {

  userId: any = '';
  token: string | null = '';
  isBrowser: boolean = false;
  profilePicture: string = '';
  selectedFileImage: File | null = null
  formData: FormData = new FormData();

  // Message from database
  successMessage: string = '';
  errorMessagePassword: string = '';

  showConfirmationDialog:boolean = false

  router = inject(Router);

  settingsForm: FormGroup = new FormGroup({
    fName: new FormControl('',[Validators.required , Validators.pattern("^[a-zA-Z]+$"),Validators.minLength(3)]),
    lName: new FormControl('',[Validators.required, Validators.pattern("^[a-zA-Z]+$"),Validators.minLength(3)]),
    email: new FormControl('',[Validators.required , Validators.email]),
    phone: new FormControl('',[Validators.required , Validators.pattern("^01\\d{9}$")]),
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
  this.getPrfile()
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


  onProfilePictureChange(event: any){
    const file = event.target.files[0];
    if (file) {
      this.selectedFileImage = file;

      const reader = new FileReader();
      // this.uploadProfilePicture(file);

      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        // console.log('Image URL:', imageUrl);
        // console.log(imageUrl);
        this.profilePicture = imageUrl
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(){

  }


  getPrfile(){
    this._userSettingsService.getUser().subscribe({
      next: (res) => {
        console.log(res.user);
        this.settingsForm.patchValue({
          fName: res.user.fName, 
          lName: res.user.lName ,
          email: res.user.email ,
          phone: res.user.phone ,
        })
        // !profile picture
        this.profilePicture = res.user.profilePic
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log("Get Profile Completed");
        
      }
    })
  }

  updateUserProfile(){

    Object.keys(this.settingsForm.controls).forEach(key => {
      const control = this.settingsForm.get(key);
      if (control && control.value) {
        this.formData.append(key, control.value);
      }
    });
  
    if (this.selectedFileImage) {
      this.formData.append('profilePic',this.selectedFileImage , this.selectedFileImage.name);
    }

    // تحقق من محتويات formData قبل الإرسال (لأغراض الفحص)
    // this.formData.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });

    
    this._userSettingsService.updateUser(this.formData).subscribe({
      next: (res) => {
        console.log(res);
        this.successMessage = res.message
        // console.log(this.successMessage);
        this.openConfirmationDialog();
        
      },
      error: (err) => {
        console.log(err);
        this.errorMessagePassword = err.error.message
        // console.log(this.errorMessagePassword);
        this.openConfirmationDialog();
      },
      complete: () => {
        console.log("Update Profile Completed");
        this.errorMessagePassword = '';
      }
    })
  }

  deleteProfilePicture(){
    this.profilePicture = ''
    this.selectedFileImage = null
  }


  saveSettings(){
    if (this.settingsForm.valid == false) {
      this.settingsForm.markAllAsTouched()
    }
    else{
      this.updateUserProfile();
    }
    
    console.log(this.settingsForm);
  }


  //confirmation //
  openConfirmationDialog(): void {
    // this.showConfirmationDialog = true;
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
    this.showConfirmationDialog = false;
  }
}
