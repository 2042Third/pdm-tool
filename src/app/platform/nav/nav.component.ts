/**
 * By Yang Yi
 *  2/2022
 *
*/
import {AfterViewInit, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {UserinfoService} from '../../_services/userinfos.service';
import {from, Subscription} from 'rxjs';
import {faLightbulb as faSolidLightbulb, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {faLightbulb as faRegularLightbulb} from "@fortawesome/free-regular-svg-icons";
import {ThemeService} from "src/app/theme/theme.service";
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, Event, NavigationEnd, ParamMap, Router} from '@angular/router';
import {MatDrawer, MatDrawerMode, MatSidenav} from '@angular/material/sidenav';
import {NotesService} from 'src/app/_services/notes.service';
import {ServerMsg} from 'src/app/_types/ServerMsg';
import {NoteHead, NotesMsg} from '../../_types/User';
import {Platform} from '@ionic/angular';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DialogNotificationsComponent} from "../dialogNotifications/dialogNotifications.component";
import {SettingsDialogComponent} from "../settings-dialog/settings-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

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
  @ViewChild('titlebar') titleBar:ElementRef;
  @ViewChild('rightDrawer') public notesnav: MatSidenav;
  errorMessage: any;
  feature_sub: Subscription;
  signin_obj: ServerMsg;
  signin_stat_str: String = 'Not Signed In';
  signin_stat: boolean = false;
  notes_heads: NotesMsg;
  named_notes_heads:NoteHead[];
  nav_open_mode:MatDrawerMode = "side"; // nav mode for mobile or desktop
  has_heads=false;
  notes_subject : Subscription;
  saving_subject:Subscription;
  saving_str : String ="";
  notes_obj : NotesMsg;
  enc_back:string = "";
  // signin_async: Observable<ServerMsg>;
  private signup_sub:Subscription;
  timeout: number=1000;
  hideTimeout: number=1000;
  // User view
  isMobileDevice=false;
  //LOCALE
  cur_locale = "en";
  private dialogRef: MatDialogRef<SettingsDialogComponent, any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public userinfo: UserinfoService,
    private themeService: ThemeService,
    public notes_serv:NotesService,
    public dialog: MatDialog,
    public ngzone: NgZone ,
    private dbService: NgxIndexedDBService,
    private platform:Platform, // test block
  ) {
    // console.log("current platform "+ (platform.is('ios')? 'ios':"not ios"));

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
            this.signin_stat_str = data.username;
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
    //routes to the notes if it is none
    if(this.currentRoute == "/"){
      this.router.navigateByUrl('/notes');
      return;
    }
    // Per-route
    this.route.queryParams
      .subscribe(params => {
        if(params.locale!=null){
          this.cur_locale = params.locale;
          console.log("Getting locale: "+this.cur_locale);
        }
      }
    );
    // mobile config
    if (this.isMobileDevice) {
      this.titleBar.nativeElement.style.flexGrow = '7';
      this.nav_open_mode = "over"; // blur the main area
      setTimeout(()=>{ // show and close the menu
        if(this.notesnav!= null)
          this.notesnav.toggle();
        if(this.maindrawer!=null)
          this.maindrawer.toggle();
      },
        500
      );
    } else { // desktop, open and close the nav's
      this.nav_open_mode = "side";
      setTimeout(()=>{ // show and close the menu
          if(this.notesnav!= null) {
            this.notesnav.toggle();
            this.notesnav.toggle();
          }
          if(this.maindrawer!=null) {
            this.maindrawer.toggle();
            this.maindrawer.toggle();
          }
        },
        500
      );
    }
  }

  ngOnInit() {


    this.setLightbulb();
    // Feature sub
    this.route.paramMap.pipe(
      switchMap((params: ParamMap)=>
        this.feature = params.get('feature')
      )
    );

    // Set the notes sidenav
    this.notes_serv.setSidenav(this.notesnav);

  }

  refresh(){
    window.location.reload();
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
  hashTest(){
    let msg = "this is a message.";
    console.log(`Message: ${msg}`);
    console.log(`hash   : ${this.userinfo.hash(msg)}`);
  }
  encTestRound (){
    let enc = this.userinfo.enc2("1234","this is a message.");
    let dec = this.userinfo.dec2("1234",enc);
    console.log("Round encrypt =>"+ (enc  ));
    console.log("Round decrypt =>"+ (dec  ));
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

  openSettingsDialog(){
    let enterDialog: MatDialogConfig= new MatDialogConfig();
    enterDialog.autoFocus = true;
    enterDialog.data = {dialogType:"Enter",dialogTitle:"Application Password", message:"Set an application password for this computer."};
    enterDialog.panelClass= 'custom-modalbox';
    this.dialogRef = this.dialog.open(SettingsDialogComponent);
  }

  /**
   * Destructor
   * */
  ngOnDestroy() {
    this.signup_sub.unsubscribe();
    this.notes_subject.unsubscribe();
    this.saving_subject.unsubscribe();
  }
}
