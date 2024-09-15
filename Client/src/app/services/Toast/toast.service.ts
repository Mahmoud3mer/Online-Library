import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  // Observable to track toast messages
  public message$ = new BehaviorSubject<{ text: string; type: 'success' | 'error' | '' }>({
    text: '',
    type: '',
  });

  // Function to show success toast
  showSuccess(message: string) {
    this.message$.next({ text: message, type: 'success' });
    this.clearToastAfterDelay();
  }

  // Function to show error toast
  showError(message: string) {
    this.message$.next({ text: message, type: 'error' });
    this.clearToastAfterDelay();
  }

  // Function to clear the toast after 3 seconds
  private clearToastAfterDelay() {
    setTimeout(() => {
      this.message$.next({ text: '', type: '' });
    }, 3000); // 3 seconds
  }
}
