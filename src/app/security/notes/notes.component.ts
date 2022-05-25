import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/_services/notes.service';

@Component({
  selector: 'security-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  content="";
  nt_disabled = false;
  constructor(
    private notes_nav:NotesService,
    ) {
  }
  toggleRightSidenav() {
    this.notes_nav.toggle();
  }

  ngOnInit() {
  }


}
