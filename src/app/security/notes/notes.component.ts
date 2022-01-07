import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'security-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  content="";
  constructor() { }

  ngOnInit() {
  }

}
