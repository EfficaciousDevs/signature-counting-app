import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userDetails: any = { email: '', password: '' };
  authorizationStatus: boolean = false;
  uploadLimit: number = 0;

  
  constructor(private httpService: HttpClient, private snackBar: MatSnackBar, private routerService: Router) { }

  authenticate(email: string, password: string) {
    this.userDetails = {
      email: email,
      password: password
    };
    // this.httpService.post('http://52.172.252.7:8080/Signature-Counting/api/v1/authenticate/login', this.userDetails,{responseType: 'text'})
    this.httpService.post('http://localhost:8086/api/v1/authenticate/login', this.userDetails,{responseType: 'text'})
    .subscribe((response: any) => {
         this.authorizationStatus = JSON.parse(response);
         console.log(this.authorizationStatus);
         if(this.authorizationStatus){
          this.snackBar.open("Login successful.",'close');
          setTimeout(()=>{
            this.snackBar.dismiss();
            this.routerService.navigateByUrl('/signature-details');
          },1000);
          
        }else{
          this.snackBar.open("Invalid Credentials. Please try again.",'close');

        setTimeout(()=>{
          this.snackBar.dismiss();
        },2000);
        }
      });
  
  }

  checkCount(): Observable<any>{
    // return this.httpService.put<any>('http://52.172.252.7:8080/Signature-Counting/api/v1/authenticate/update',this.userDetails)
    return this.httpService.put<any>('http://localhost:8086/api/v1/authenticate/update',this.userDetails);
    }

  fetchCount(): Observable<any>{
    // return this.httpService.post<any>('http://52.172.252.7:8080/Signature-Counting/api/v1/authenticate/count',this.userDetails);
    return this.httpService.post<any>('http://localhost:8086/api/v1/authenticate/count',this.userDetails);
  }
}
