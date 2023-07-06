import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) {}
  ngOnInit(): void {
  }

  email: string = '';
  password: string = '';

  onSubmit(){
    this.authService.authenticate(this.email, this.password);
  }

  handleKeyUp(e){
    if(e.keyCode === 13){
       this.onSubmit();
    }
 }

}
