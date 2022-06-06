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
  signin_stat_str: String = "Not Signed In";
  signin_stat: boolean = false;
  notes_heads: NotesMsg;
  named_notes_heads:NoteHead[];

  has_heads=false;
  notes_subject : Subscription;
  saving_subject:Subscription;
  saving_str : String ="";
  notes_obj : NotesMsg;
  // signin_async: Observable<ServerMsg>;
  private signup_sub:Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public userinfo: UserinfoService,
    private themeService: ThemeService,
    public notes_serv:NotesService,
    public ngzone: NgZone ,
  ) {
      console.log ("MAKING NAV COMPONENTS");
    this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
            this.currentRoute = event.url;
              console.log(event);
        }
    });
    console.log("NAV signin_obj subscribed");
    // User signin status
    this.signup_sub = this.userinfo.signin_status_value.subscribe(
      {
        next: data=>{
            // this.signin_obj.sender = data.sender;
            this.signin_obj = JSON.parse(JSON.stringify(data)); // make a copy
            console.log("NAV this.signin_obj="+this.signin_obj);
            console.log("NAV this.signin_obj.status="+this.signin_obj.status);
            this.signin_stat_str = data.receiver;
            if(this.signin_obj.status != "fail"){
              this.signin_stat = true;
            }
            else {
              // this.signin_stat_str="Not Signed In";
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
    this.notes_subject = notes_serv.notesSubject.subscribe(
      data=>{
        this.notes_obj = JSON.parse(JSON.stringify(data));
        console.log("NAV COMPONENT recieved content: "+ this.notes_obj.content);
        if(this.notes_obj.ntype == "heads_return"){
          console.log("NAV COMPONENT recieved is heads"+JSON.stringify(this.notes_obj.content));
          this.notes_heads = this.notes_obj;
          this.ngzone.run(()=>{
            this.has_heads=false;
            this.named_notes_heads=JSON.parse(JSON.stringify(this.notes_obj.content));
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

  peak_heads(){
    this.notesnav.toggle();
    let i=0;
    for (i=0;i<this.named_notes_heads.length;i++){
    this.named_notes_heads[i].id = Number(this.named_notes_heads[i].note_id);
      if(this.named_notes_heads[i].head == null){
        this.named_notes_heads[i].head = "unnamed note";
      }
      console.log("head part " +i+"-->"+this.named_notes_heads[i].head);
    }
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


  ngOnDestroy() {
    this.signup_sub.unsubscribe();
    this.notes_subject.unsubscribe();
    this.saving_subject.unsubscribe();
  }
}
