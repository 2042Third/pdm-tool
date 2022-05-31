/**
 * By Yang Yi
 *  2/2022
 *
*/
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserinfoService } from '../../_services/Userinfo.service';
import { Subscription, Observable } from 'rxjs';
import { faLightbulb as faSolidLightbulb, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as faRegularLightbulb } from "@fortawesome/free-regular-svg-icons";
import { ThemeService } from "src/app/theme/theme.service";
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap,Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { NotesService } from 'src/app/_services/notes.service';
import { ServerMsg } from 'src/app/_types/ServerMsg';
import { NotesMsg } from '../../_types/User';

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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userinfo: UserinfoService,
    private themeService: ThemeService,
    public notes_serv:NotesService,
  ) {
    this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
            this.currentRoute = event.url;
              console.log(event);
        }
    });
    this.feature_sub = this.userinfo.signin_status.subscribe(
      data=>{
        // this.signin_stat_str=" \n\t";
        this.signin_obj = data;
        this.signin_stat_str = data.receiver;
        if(this.signin_obj.status != "fail"){
          this.signin_stat = true;
        }
        else {
          this.signin_stat_str="Not Signed In";
          this.signin_stat = false;
        }
      });
    this.themeService.setDarkTheme();
  }

  ngAfterViewInit(): void {
    this.notes_serv.setSidenav(this.notesnav);
  }

  ngOnInit() {
    this.setLightbulb();
    this.route.paramMap.pipe(
      switchMap((params: ParamMap)=>
        this.feature = params.get('feature')
      )
    );
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

  toggleTheme() {
    if (this.themeService.isDarkTheme()) {
      this.themeService.setLightTheme();
    } else {
      this.themeService.setDarkTheme();
    }

    this.setLightbulb();
  }

  ngOnDestroy() {
    this.feature_sub.unsubscribe();
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
}
