import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/_services/notes.service';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';

@Component({
  selector: 'security-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  content="";
  nt_disabled = false;
  constructor(
    private notes_nav:NotesService
    ) {

  }
  toggleRightSidenav() {
    this.notes_nav.toggle();
  }
  ngOnInit() {
  }

  handleKeyDown(e){
    /**
     * Tab indent
    */
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    if(e.keyCode === 9 && !this.nt_disabled){
      e.preventDefault();
      this.content = this.content.substring(0,start)+"\t"+this.content.substring(end,this.content.length);
      e.target.focus();
      e.target.setSelectionRange(0,0);
      // e.target.selectionStart = start;
    }
  }

}
