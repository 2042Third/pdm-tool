import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNotesEdit]'
})
export class NotesEditDirective {

  constructor(
    private el: ElementRef
  ) {

    this.el.nativeElement.bind('keydown', function (event) {
      console.log(this.el.nativeElement.val());
      if (event.which == 9) {
        event.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        el.nativeElement.val(el.nativeElement.val().substring(0, start)
          + '\t' + el.nativeElement.val().substring(end));
        this.selectionStart = this.selectionEnd = start + 1;
        el.nativeElement.triggerHandler('change');
      }
    });
  }

}
