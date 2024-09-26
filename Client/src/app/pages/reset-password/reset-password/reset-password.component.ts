import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthourizationService } from "../../../services/users/authourization.service";
import { MyTranslateService } from "../../../services/translation/my-translate.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  resetMessage: string = "";
  isLoading: boolean = false;
  token: string | null = null;
  passwordVisible = true;
  confirmPasswordVisible = true;

  constructor(
    private _authourizationService: AuthourizationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _myTranslateService:MyTranslateService
  ) {
    this.resetForm = this.fb.group({
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?:.*[!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>?/\\|`~])?.{8,}$"
          ),
        ],
      ],
      confirmPassword: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params["token"];
      if (!this.token) {
        this.resetMessage = "Invalid or missing reset token.";
      }
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      return;
    }

    const { password, confirmPassword } = this.resetForm.value;
    if (password !== confirmPassword) {
      this.resetMessage = "Passwords do not match.";
      return;
    }

    if (!this.token) {
      this.resetMessage = "Reset token is missing.";
      return;
    }

    this.isLoading = true;

    this._authourizationService.resetPassword(this.token, password).subscribe({
      next: (response: any) => {
        this.resetMessage = response.message;
        this.resetForm.reset();
        setTimeout(() => this.router.navigate(["/signin"]), 2000); // Redirect after 2 seconds
      },
      error: (error) => {
        console.log(error);

        this.resetMessage = "An error occurred. Please try again.";
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  togglePasswordVisibility(field: "password" | "confirmPassword") {
    if (field === "password") {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === "confirmPassword") {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }
  changeLang(lang: string) {
    this._myTranslateService.changLang(lang);
  }
}
