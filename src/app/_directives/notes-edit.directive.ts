import { Directive,HostListener,Input } from '@angular/core';

@Directive({
  selector: '[appNotesEdit]',
  host: {
    '(input)': 'onChange($event)'
  },
  // inputs:['vals'],
})

export class NotesEditDirective {
  @Input('appNotesEdit') vals:String;
  @HostListener('window:keydown.tab', ['$event'])
  handleKeyDown($evt) {
    $evt.preventDefault();
    /**
     * Tab indent
    */
    const start = $evt.target.selectionStart;
    const end = $evt.target.selectionEnd;
    $evt.preventDefault();
    $evt.target.value = $evt.target.value.substring(0,start)
                        +"\t"
                        +$evt.target.value.substring(end,$evt.target.value.length);
    $evt.target.focus();
    $evt.target.setSelectionRange(start+1,start+1);
  }

  constructor(
  ) {
  }
  onChange($event) {
  }
}
