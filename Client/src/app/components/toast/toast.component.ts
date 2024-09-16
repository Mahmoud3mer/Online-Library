import { Component, OnInit } from '@angular/core';
 
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/Toast/toast.service';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})


export class ToastComponent implements OnInit {
  message = { text: '', type: '' };
  subscription: Subscription | undefined;

  constructor(private _toastService:ToastService) {}

  ngOnInit() {
    // Subscribe to toast messages from the service
    this.subscription = this._toastService.message$.subscribe((msg) => {
      this.message = msg;
    });
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
