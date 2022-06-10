import { Component, NgZone, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import {AuthService} from '../../_services/auth.service';
import {UserinfoService} from '../../_services/userinfos.service';
import { ServerMsg } from 'src/app/_types/ServerMsg';
import { EmscriptenWasmComponent } from '../emscripten/emscripten-wasm.component';
import { c20 } from '../emscripten/c20wasm';
import { NotesService } from '../../_services/notes.service';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { EncryptionService } from '../enc/encryption.service';
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

export class SigninComponent extends EmscriptenWasmComponent<c20>   implements OnInit {
  content="";
  upw="";
  umail="";
  uname='';
  timeout=2000;
  errorMessage="";
  signinForm:FormGroup;
  signupForm:FormGroup;
  // loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  allAc = UserAc;
  signup:UserAc=this.allAc.SignIn;
  error = '';
  cur_function="Sign In";
  signup_msg="wait...";
  signup_email:String="";
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
    private formBuilder:FormBuilder,
    private auth: AuthService,
    private userinfo: UserinfoService,
    private notes_serv:NotesService,
    private encrypt:EncryptionService,
    private http: HttpClient,
    private ngzone:NgZone,
  ) {
    super("Cc20Module", "notes.js");
    console.log('sign in construction' );
    this.signup_sub= this.userinfo.signin_status_value.subscribe(
    data=>{
      this.local_usr = JSON.parse(JSON.stringify(data));
      this.signup_email=data.email;
      console.log("Gotten usr: "+this.local_usr.status);
      if(this.signup_email == "" || this.signup_email.length < 1){
        this.signup_msg="This email was already signed up for another account. Use a different email.";
      }
      else {
        this.signup_msg="Account registered! Click the link in the email sent to "
                        +this.signup_email
                        +" to activate.";
      }
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
      if(!environment.production){
        setTimeout(() => {
          let tmp1 = this.encrypt.enc("hahaha");
          let tmp2 = this.encrypt.dec(tmp1);
          console.log("encrypt: "+tmp1);
          console.log("decrypt: "+tmp2);

        },
        3000);
        // this.mocking = this.userinfo.debug_mock.subscribe(
        //   data=>{
        //     this.debug_mocking=data;
        //     // User signin status
        //     this.signup_sub = this.userinfo.signin_status_value.subscribe(
        //       {
        //         next: data=>{
        //           this.local_usr = JSON.parse(JSON.stringify(data)); // make a copy
        //           this.local_usr.receiver =
        //           this.module.loader_out(this.userinfo.b,
        //             this.local_usr.receiver.toString());
        //         },
        //         error: data=>{
        //           console.log("?");
        //         }
        //       }
        //     );
        //   }
        // );
      }

      // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
      this.auth.signup(this.module.loader_check(this.f2.upw.value, this.f2.uname.value)
        , this.f2.umail.value
        , this.module.get_hash(this.f2.upw.value+this.f2.upw.value)) // server only knows the hash of the pass+pass
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
      console.log(this.module.get_hash(this.f.upw.value+this.f.upw.value));
      this.auth.login(
        this.f.umail.value
        , this.module.get_hash(this.f.upw.value+this.f.upw.value) // server only knows the hash of the pass+pass
      ).subscribe({
          next: data => {
            this.usr_setup(data);
          },
          error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
      });
    }
  }

  usr_setup(data){
    data.receiver = this.module.loader_out(this.f.upw.value, data.receiver.toString());
    data.utime = formatDate(Number(data.time), "medium",'en-US' ).toString();
    this.local_usr = JSON.parse(JSON.stringify(data));
    this.userinfo.set_signin_status(data);
    setTimeout(() => {
      this.notes_serv.get_notes_heads().subscribe()
    }, this.notes_serv.loadingTimeout);
  }

  set_server_msg(a:ServerMsg){
    this.server_back = a;
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
      this.mocking.unsubscribe();
    }
    this.signup_sub.unsubscribe();
  }
}
