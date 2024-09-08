// sign-in-sign-up.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in-sign-up.component.html',
  styleUrls: ['./sign-in-sign-up.component.scss'],
})
export class SignInSignUpComponent {
  isRightPanelActive = false;

  onSignUp(event: Event) {
    event.preventDefault();
    // Add your sign-up logic here
  }

  onSignIn(event: Event) {
    event.preventDefault();
    // Add your sign-in logic here
  }

  togglePanel(panel: 'signUp' | 'signIn') {
    this.isRightPanelActive = panel === 'signUp';
  }
}
