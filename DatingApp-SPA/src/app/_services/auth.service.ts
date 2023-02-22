import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'
import { JwtHelperService } from '@auth0/angular-jwt';
import {map} from 'rxjs/Operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  baseUrl = environment.apiUrl + "auth/"; 
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/businessman-character-avatar-isolated_24877-60111.avif');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) {  }

  changeMemberPhoto(photoUrl :string){
    this.photoUrl.next(photoUrl);
  }


  login(model: any) {
    return this.http.post(this.baseUrl + "login", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('user',JSON.stringify(user.user));
          localStorage.setItem('token', user.token);
          this.currentUser = user.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn(){

    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
