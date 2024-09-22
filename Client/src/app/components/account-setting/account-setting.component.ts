import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormControl, FormGroup , ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { UserSettingsService } from '../../services/user-settings/user-settings.service';
import { ConfirmationUpdateSettingsComponent } from '../confirmation-update-settings/confirmation-update-settings.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';
import { MyTranslateService } from '../../services/translation/my-translate.service';

@Component({
  selector: 'app-account-setting',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmationUpdateSettingsComponent, TranslateModule],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss'
})
export class AccountSettingComponent {

  userId: any = '';
  token: string | null = '';
  isBrowser: boolean = false;
  profilePicture: string = '';
  profilePictureFromDB: string = '';
  selectedFileImage: File | null = null
  formData: FormData = new FormData();

  // Message from database
  successMessage: string = '';
  errorMessage: string = '';

  showConfirmationDialog:boolean = false
  isLoading: boolean = false;

  router = inject(Router);

  settingsForm: FormGroup = new FormGroup({
    fName: new FormControl('',[Validators.required , Validators.pattern("^[a-zA-Z]+$"),Validators.minLength(3)]),
    lName: new FormControl('',[Validators.required, Validators.pattern("^[a-zA-Z]+$"),Validators.minLength(3)]),
    email: new FormControl('',[Validators.required , Validators.email]),
    phone: new FormControl('',[Validators.required , Validators.pattern("^01\\d{9}$")]),
  }
)

constructor( @Inject(PLATFORM_ID) platformId: object ,private _userSettingsService: UserSettingsService, private _myTranslateService:MyTranslateService ){
  this.isBrowser = isPlatformBrowser(platformId);
  this.getPrfile()
}

  onProfilePictureChange(event: any){
    this.profilePictureFromDB = ''
    const file = event.target.files[0];
    if (file) {
      this.selectedFileImage = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        // console.log('Image URL:', imageUrl);
        // console.log(imageUrl);
        this.profilePicture = imageUrl
      };
      reader.readAsDataURL(file);
    }
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
        this.profilePictureFromDB = res.user.profilePic

        this._userSettingsService.saveProfileImage(this.profilePictureFromDB)
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
    }else if(!this.profilePictureFromDB){
      this.formData.append('profilePic','');
    }

    // تحقق من محتويات formData قبل الإرسال (لأغراض الفحص)
    // this.formData.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });

    this._userSettingsService.updateUser(this.formData).subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        console.log("form dataaaaa success:", this.formData)
        this._userSettingsService.saveProfileImage(this.profilePictureFromDB)
        this.alertWithSuccess(res.message)
        
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        console.log("form dataaaaa error:", this.formData)
        this.alertWithError(err.error.message)
      },
      complete: () => {
        console.log("Update Profile Completed");
        this.isLoading = false;
        this.getPrfile()
      }
    })
  }

  deleteProfilePicture(){
    this.profilePicture = ''
    this.profilePictureFromDB = ''
    this.selectedFileImage = null
  }


  saveSettings(){
    
    if (this.settingsForm.valid == false) {
      this.settingsForm.markAllAsTouched()
    }
    else{
      this.isLoading = true;
      this.updateUserProfile();
      this.getPrfile()
    }
    console.log(this.settingsForm);
  }


  // ! Sweet Alert
  alertWithSuccess(message: string){
    Swal.fire('Thank you...', `${message}!`, 'success')
  }

  alertWithError(message: string){
    Swal.fire({
      icon: "error",
      title: "Error...",
      text: `${message}!`,
    });
  }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }

}
