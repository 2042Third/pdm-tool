import { Component, NgZone, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule } from "@angular/common/http";
import { UntypedFormBuilder, UntypedFormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import {AuthService} from '../../_services/auth.service';
import {UserinfoService} from '../../_services/userinfos.service';
import { ServerMsg } from 'src/app/_types/ServerMsg';
import { NotesService } from '../../_services/notes.service';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';


import { NgxIndexedDBService } from 'ngx-indexed-db';
// User action
enum UserAc {
SignIn,
SignUp,
ChangePassword,
SuccessSignIn,
};

@Component({
  selector: 'security-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent implements OnInit {
  content="";
  upw="";
  umail="";
  uname='';
  timeout=2000;
  errorMessage="";
  signinForm:UntypedFormGroup;
  signupForm:UntypedFormGroup;
  // loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  allAc = UserAc;
  signup:UserAc=this.allAc.SignIn;
  error = '';
  cur_function="Sign In";
  signup_msg="wait...";
  server_back:ServerMsg;
  phps="Password";
  phemail="Email";
  phuser="User Name";
  local_usr:ServerMsg = new ServerMsg();

  public signup_async: Observable<ServerMsg>;
  private signup_sub:Subscription;
  mocking: Subscription;
  debug_mocking: Boolean;
  constructor(
    private formBuilder:UntypedFormBuilder,
    private auth: AuthService,
    private userinfo: UserinfoService,
    private notes_serv:NotesService,
    private dbService: NgxIndexedDBService,

  ) {
    console.log('sign in construction' );
    this.signup_sub= this.userinfo.signin_status_value.subscribe(
    data=>{
      this.local_usr = JSON.parse(JSON.stringify(data));
      console.log("Gotten usr: "+this.local_usr.status);
      if(this.local_usr.status == 'fail'){
        console.log("not user");
        return;
      }
      this.usr_setup(this.local_usr);
    });

    // LOCALE
    this.phps=$localize`:meaning|:Password`;
    this.phemail=$localize`:meaning|:Email`;
    this.phuser=$localize`:meaning|:Username`;
  }

  ngOnInit() {
      this.signinForm = this.formBuilder.group({
          umail: ['', Validators.required],
          upw: ['', Validators.required]
      });
      this.signupForm = this.formBuilder.group({
          uname: ['', Validators.required],
          umail: ['', Validators.required],
          upw: ['', Validators.required]
      });

  }

  // convenience getter for easy access to form fields
  get f() { return this.signinForm.controls; } // Sign In
  get f2() { return this.signupForm.controls; } // Sign Up

  onSubmit(){
    this.submitted = true;
    // signup form submission
    if(this.signup===this.allAc.SignUp){
      // stop here if form is invalid
      if (this.signupForm.invalid) {
          return;
      }
      console.log("top call request for signup");
      this.auth.signup(this.userinfo.enc2(this.f2.upw.value, this.f2.uname.value)
        , this.f2.umail.value
        , this.userinfo.hash(this.f2.upw.value+this.f2.upw.value)) // server only knows the hash of the pass+pass
      .pipe().subscribe(data =>this.set_server_msg(data));
      return ;
    }
    // signin form submission
    else {
      // stop here if invalid
      if (this.signinForm.invalid) {
          return;
      }
      this.loading = true;
      this.userinfo.set_pswd(this.f.upw.value);
      this.upw=this.f.upw.value;
      this.umail = this.f.umail.value;
      // this.userinfo.clear_ponce();
      // this.userinfo.ponce_process(this.umail, this.upw);
      this.auth.login(
        this.f.umail.value
        , this.userinfo.hash(this.f.upw.value+this.f.upw.value) // server only knows the hash of the pass+pass
      ).subscribe({
          next: data => {
            // original before correction
            this.userinfo.clear_same_email();
            this.usr_setup(data);
              // *moved to userinfo after pass set
              // this.first_setup(data);
          },
          error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
      });
    }
  }

  usr_setup(data){
    console.log("beforedate:"+data.time);
    data.utime = formatDate(Number(data.time), "medium",'en-US' ).toString();
    data.username = data.receiver;
    this.local_usr = JSON.parse(JSON.stringify(data));
  }


  set_server_msg(a:ServerMsg){
    this.server_back = a;
  }
  sign_out(){
    this.userinfo.sign_out();
  }
  sign_up(){
    this.cur_function = "Sign Up";
    this.signup = UserAc.SignUp;
  }
  back_to_sign_in(){
    this.cur_function = "Sign In";
    this.signup = UserAc.SignIn;
  }
   ngOnDestroy(){

    if(!environment.production){
      // this.mocking.unsubscribe();
    }
    this.signup_sub.unsubscribe();
  }
}
