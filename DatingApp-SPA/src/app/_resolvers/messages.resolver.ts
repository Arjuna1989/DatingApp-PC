import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/Operators';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Message } from '../_models/message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  /**
   *
   */
  pageNumber = 1;
  pageSize =5;
  messageContainer = 'Unread';
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.userService.getMessages(this.authService.decodedToken.nameid,this.pageNumber,this.pageSize,this.messageContainer).pipe(
        catchError(error=>{
            this.alertify.error('Problem retrieving messages');
            this.router.navigate(['/home']);
            return of(null);
        })
    );
  }
}
