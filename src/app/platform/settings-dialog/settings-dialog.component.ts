import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'settingsDialogComponent',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit {
  panelOpenState = false;
  constructor() { }

  ngOnInit() {}

}
