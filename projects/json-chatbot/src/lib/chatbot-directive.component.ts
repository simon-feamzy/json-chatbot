import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[adHost]',
})
export class ChatbotDirectiveComponent {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
