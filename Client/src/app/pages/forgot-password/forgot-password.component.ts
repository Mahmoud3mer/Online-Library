import { Component } from "@angular/core";
import { NgClass, NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthourizationService } from "../../services/users/authourization.service";
@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule],
  templateUrl: "./forgot-password.component.html",
  styleUrl: "./forgot-password.component.scss",
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;
  resetMessage: string = "";
  isLoading: boolean = false;

  constructor(
    private _authourizationService: AuthourizationService,
    private fb: FormBuilder
  ) {
    this.resetForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  requestPasswordReset() {
    if (this.resetForm.invalid) {
      return;
    }

    this.isLoading = true;
    const email = this.resetForm.get("email")?.value;

    this._authourizationService.requestPasswordReset(email).subscribe({
      next: (response: any) => {
        this.resetMessage = response.message;
        this.resetForm.reset();
      },
      error: (error) => {
        this.resetMessage = error.error.message;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
