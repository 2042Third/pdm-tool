import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import {AuthService} from '../../_services/auth.service';
import {UserinfoService} from '../../_services/Userinfo.service';
import { ServerMsg } from 'src/app/_types/ServerMsg';
import { EmscriptenWasmComponent } from '../emscripten/emscripten-wasm.component';
import { c20 } from '../emscripten/c20wasm';

@Component({
  selector: 'security-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent extends EmscriptenWasmComponent<c20>   implements OnInit {
  content="";
  upw="";
  umail="";
  uname='';

  errorMessage="";
  signinForm:FormGroup;
  signupForm:FormGroup;
  // loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  signup=false;
  error = '';
  cur_function="Sign In";
  signup_msg="wait...";
  signup_email="";
  signup_status=false;
  server_back:ServerMsg;
  public signup_async: Observable<ServerMsg>;
  private signup_sub:Subscription;
  constructor(
    private formBuilder:FormBuilder,
    private auth: AuthService,
    private userinfo: UserinfoService,
    private http: HttpClient
  ) {
    super("Cc20Module", "notes.js");
    this.signup_async= this.auth.signupSubject.asObservable();
    this.signup_sub = this.signup_async.subscribe(
    data=>{
      this.signup_email=data.v2;
      if(this.signup_email == "" || this.signup_email.length < 1){
        this.signup_status = false;
        this.signup_msg="This email was already signed up for another account. Use a different email.";
      }
      else {
        this.signup_status = true;
        this.signup_msg="Account registered! Click the link in the email sent to "
                        +this.signup_email
                        +" to activate.";
      }
    });
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
      // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.signinForm.controls; }
  get f2() { return this.signupForm.controls; }

  onSubmit(){
    this.submitted = true;
    // signup form submission
    if(this.signup){
      // stop here if form is invalid
      if (this.signupForm.invalid) {
          return;
      }
      console.log("top call request for signup");
      this.auth.signup(this.f2.uname.value, this.f2.umail.value, this.f2.upw.value)
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
      // var temp1 = this.f.umail.value;
      // var temp2 = this.f.upw.value;
      // console.log("entering password: "+ temp2);
      this.userinfo.set_pswd(this.f.upw.value);
      console.log(this.module.loader_check('1234',this.f.upw.value));
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
    }
  }

  set_server_msg(a:ServerMsg){
    this.server_back = a;
  }

  sign_up(){
    this.cur_function = "Sign Up";
    this.signup = true;
  }
  back_to_sign_in(){
    this.cur_function = "Sign In";
    this.signup = false;
  }
}
