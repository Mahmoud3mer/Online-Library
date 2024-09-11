import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { NgIf } from '@angular/common';
import { apiUrl } from '../../../util/apiUrl';

interface VerificationResponse {
  message: string;
}

@Component({
  selector: 'app-email-verified',
  standalone: true,
  imports: [NgIf],
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.scss'],
})
export class EmailVerifiedComponent implements OnInit {
  message: string = '';
  error: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.verifyEmail(token);
      } else {
        this.error = 'Invalid or missing token.';
      }
    });
  }

  verifyEmail(token: string): void {
    this.http
      .get<VerificationResponse>(`${apiUrl}/signup/verify-email`, {
        params: { token },
      })
      .pipe(
        catchError((err) => {
          this.error = err.error.message;
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.message = response.message;
        }
      });
  }
}
