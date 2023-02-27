import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from './../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = `${environment.API_URL}/api/auth`;

  constructor(
    private http: HttpClient,
    private tokenServide: TokenService
  ) { }

  LoginAndGet(email: string, password: string){
    return  this.login(email, password)
    .pipe(
      switchMap(rta => this.getProfile())
    )
  }

  login(email: string, password: string) {
    return this.http.post<Auth>(`${this.apiURL}/login`, { email, password })
      .pipe(
        tap(response => this.tokenServide.saveToken(response.access_token))
      );
  }

  getProfile() {
    // const headers = new HttpHeaders();
    // headers.set('Authorization', `Bearer ${token}`)
    return this.http.get<User>(`${this.apiURL}/profile`)
  }


}
