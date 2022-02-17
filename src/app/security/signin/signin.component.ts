import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';

import {AuthService} from '../../_services/auth.service';
import {UserinfoService} from '../../_services/Userinfo.service';
import { ServerMsg } from 'src/app/_types/ServerMsg';

@Component({
  selector: 'security-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent implements OnInit {
  content="";
  upw="";
  umail="";

  errorMessage="";
  signinForm:FormGroup;
  // loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  constructor(
    private formBuilder:FormBuilder,
    private auth: AuthService,
    private userinfo: UserinfoService,
    private http: HttpClient
    ) {

    }

  ngOnInit() {
        this.signinForm = this.formBuilder.group({
            umail: ['', Validators.required],
            upw: ['', Validators.required]
        });

        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.signinForm.controls; }

  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.signinForm.invalid) {
        return;
    }

    this.loading = true;
    this.auth.login(this.f.umail.value, this.f.upw.value)
        .subscribe({
          next: data => {
              this.userinfo.set_signin_status(data);
          },
          error: error => {
              this.errorMessage = error.message;
              console.error('There was an error!', error);
          }
      });

    // this.signinForm.get('umail').setValue( this.umail);
    // this.signinForm.get('upw').setValue( this.upw);
    // console.log(this.signinForm.value)
    // this.http.post<serv_msg>(
    //   'https://pdm.pw/auth/signin',this)
    //   .subscribe({
    //       next: data => {
    //           this.serv_response = data;
    //       },
    //       error: error => {
    //           this.errorMessage = error.message;
    //           console.error('There was an error!', error);
    //       }
    //   })
  }
}
