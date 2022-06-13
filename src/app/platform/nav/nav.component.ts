/**
 * By Yang Yi
 *  2/2022
 *
*/
import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { UserinfoService } from '../../_services/userinfos.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { faLightbulb as faSolidLightbulb, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as faRegularLightbulb } from "@fortawesome/free-regular-svg-icons";
import { ThemeService } from "src/app/theme/theme.service";
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap,Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { NotesService } from 'src/app/_services/notes.service';
import { ServerMsg } from 'src/app/_types/ServerMsg';
import { NoteHead, NotesMsg } from '../../_types/User';
import { formatDate } from '@angular/common';
import { take } from 'rxjs/operators';
import { IndexDetails, NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements AfterViewInit {
  faLightbulb!: IconDefinition;
  feature:string="chat";

  currentRoute="";
  note_status:String="no id";
  // elements
  @ViewChild('drawer') maindrawer: MatDrawer;
  @ViewChild('rightDrawer') public notesnav: MatSidenav;
  errorMessage: any;
  feature_sub: Subscription;
  signin_obj: ServerMsg;
  signin_stat_str: String = 'Not Signed In';
  signin_stat: boolean = false;
  notes_heads: NotesMsg;
  named_notes_heads:NoteHead[];
  nav_open_mode = "side"; // nav mode for mobile or desktop
  has_heads=false;
  notes_subject : Subscription;
  saving_subject:Subscription;
  saving_str : String ="";
  notes_obj : NotesMsg;
  enc_back:string = "";
  // signin_async: Observable<ServerMsg>;
  private signup_sub:Subscription;
  timeout: number=1000;
  // User view
  isMobileDevice=false;
  //LOCALE
  cur_locale = "en";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public userinfo: UserinfoService,
    private themeService: ThemeService,
    public notes_serv:NotesService,
    public ngzone: NgZone ,
    private dbService: NgxIndexedDBService,
  ) {
    // START QUOTE , from https://www.geeksforgeeks.org/how-to-detect-whether-the-website-is-being-opened-in-a-mobile-device-or-a-desktop-in-javascript/
    //Checking is mobile or not
    /* Storing user's device details in a variable*/
    let details = navigator.userAgent;

    /* Creating a regular expression
    containing some mobile devices keywords
    to search it in details string*/
    let regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    /* Using test() method to search regexp in details
    it returns boolean value*/
    this.isMobileDevice = regexp.test(details);
    // END QUOTE

    if (this.isMobileDevice) {
      this.nav_open_mode = "over";
      setTimeout(()=>{
        this.notesnav.toggle();
        this.maindrawer.toggle();
      },
        500
      );
    } else {
      this.nav_open_mode = "side";
    }

    this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
            this.currentRoute = event.url;
            this.currentRoute = this.currentRoute.substring(0,this.currentRoute.indexOf('?') );
            console.log(this.currentRoute);
        }
    });
    // LOCALE
    this.signin_stat_str=$localize`:meaning|:Not Signed In`;
    // User signin status
    this.signup_sub = this.userinfo.signin_status_value.subscribe(
      {
        next: data=>{
            this.signin_obj = JSON.parse(JSON.stringify(data)); // make a copy
            this.signin_stat_str = data.receiver;
            if(this.signin_obj.status != "fail"){
              this.signin_stat = true;
              this.maindrawer.toggle();
              this.maindrawer.toggle();
            }
            else {
              this.signin_stat_str="Not Signed In";
              this.signin_stat = false;
            }
          },
        error: data=>{
          console.log("?");
        }
      }
      );
    this.themeService.setDarkTheme();
    // User notes listing
    this.notes_subject = notes_serv.notesSubjectHead.subscribe(
      data=>{
        this.notes_obj = JSON.parse(JSON.stringify(data));
        if(this.notes_obj.ntype == "heads_return"){
          this.notes_heads = this.notes_obj;
          this.ngzone.run(()=>{
            this.has_heads=false;
            this.named_notes_heads=JSON.parse(this.notes_obj.content.toString());
            this.peak_heads();
          });
        }
      }
    );

    //saving status
    this.saving_subject = notes_serv.notesSaveSubject.subscribe(
      data=>{
        this.saving_str = data;
      }
    );
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if(params.locale){
          this.cur_locale = params.locale;
          console.log("Getting locale: "+this.cur_locale);
        }
      }
    );
    this.setLightbulb();
    // Feature
    this.route.paramMap.pipe(
      switchMap((params: ParamMap)=>
        this.feature = params.get('feature')
      )
    );
    this.notes_serv.setSidenav(this.notesnav);

  }

  getNoteId(index:number, a:NoteHead):number {
    a.id = Number(a.note_id);
    return a.id;
  }
  encTest (a:string){
    this.enc_back = this.userinfo.enc(a);
    console.log("Nav encrypt =>"+ (this.enc_back  ));
  }
  decTest(a:string){
    let v = this.userinfo.dec(a);
    console.log("Nav decrypt =>"+ (v  ));
  }

  peak_heads(){
    this.notesnav.toggle();
    this.has_heads = true;
    this.notesnav.toggle();
  }

  toNotes(){
    this.feature="notes";
  }

  toChat(){
    this.feature="chat";
  }

  toSignin(){
    this.feature="signin";
  }

  setLightbulb() {
    if (this.themeService.isDarkTheme()) {
      this.faLightbulb = faRegularLightbulb;
    } else {
      this.faLightbulb = faSolidLightbulb;
    }
  }
  public ConvertStringToNumber(input: String) {
      var numeric = Number(input);
      return numeric;
  }
  toggleTheme() {
    if (this.themeService.isDarkTheme()) {
      this.themeService.setLightTheme();
    } else {
      this.themeService.setDarkTheme();
    }

    this.setLightbulb();
  }


  newNote(){
    this.notes_serv.new_note().subscribe({
          next: data => {
            this.note_status=data.note_id;
            console.log(this.note_status);
            setTimeout(() => {
              this.getNotesHeads()
            }, this.timeout);
          },
          error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
      });
  }

  getNotesHeads(){
    this.notes_serv.get_notes_heads().subscribe({
      next: data => {
        this.notes_heads=data;
        console.log(this.notes_heads);
      },
      error: error => {
        this.errorMessage = error.message;
        console.error('There was an error!', error);
      }
    });
  }

  updateNote(){
    console.log("Updating note ");
    this.notes_serv.liveUpdateNote().subscribe({
          next: data => {
            this.note_status=data.note_id;
            console.log(this.note_status);
          },
          error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
      });
  }

  getNote(a:String){
    console.log("Retrieving note: "+a);
    this.notes_serv.get_note(a).subscribe({
          next: data => {
            this.note_status=data.note_id;
            console.log(this.note_status);
          },
          error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
      });
  }

  // DataBase
  clear_email(){// DEBUG ONLY
    // if(!this.local_usr.email){
    //   return;
    // }
    let email = "18604713262@163.com";
    let local_id ;
    this.dbService.clear('pdmTable').subscribe(
      data=>{
        local_id = JSON.parse(JSON.stringify(data));
        console.log("gotten: "+ local_id);
      }
    );
  }
  set_mock_db(){// DEBUG ONLY
    this.dbService.add('pdmTable', {
      username: "some usr",
      val: "1234",
      view: "signin",
      email: "18604713262@163.com"
    })
    .subscribe((key) => {
      console.log('DEBUG indexeddb key: ', key);
    });
  }
  get_all_db(){
    let local_all;
    this.dbService.getAll('pdmTable')
    .subscribe((kpis) => {
      local_all = JSON.parse(JSON.stringify(kpis));
      console.log(local_all);
    })
  }
  ponce_process (){
    this.dbService.add('pdmSecurity', {
      email: "18604713262@163.com",
      ponce_status: false,
      secure: "1234"
    })
    .subscribe((key) => {
      console.log('indexeddb key: ', key);
    });
  }
  clear_ponce(){
    let local_all;
    this.dbService.getAll('pdmSecurity')
    .subscribe((kpis) => {
      local_all = JSON.parse(JSON.stringify(kpis));
      console.log(local_all);
    });
    if(local_all==null){
      return;
    }
    for (let i=0; i< local_all.length; i++){
      this.dbService.delete('pdmSecurity', local_all[i].id).subscribe((data) => {
        console.log('deleted:', data);
      });
    }
  }
  ngOnDestroy() {
    this.signup_sub.unsubscribe();
    this.notes_subject.unsubscribe();
    this.saving_subject.unsubscribe();
  }
}
