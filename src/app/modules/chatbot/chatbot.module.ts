import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatBubbleComponent} from "./chat-bubble/chat-bubble.component";
import {HttpClientModule} from '@angular/common/http';
import {ChatbotComponent} from './chatbot/chatbot.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {AngularSvgIconModule} from 'angular-svg-icon';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';


@NgModule({
  declarations: [
    ChatBubbleComponent,
    ChatbotComponent
  ],
  exports: [
    ChatBubbleComponent,
    ChatbotComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CommonModule,
    FontAwesomeModule,
    AngularSvgIconModule.forRoot(),
    AutocompleteLibModule
  ]
})
export class ChatbotModule {
}
