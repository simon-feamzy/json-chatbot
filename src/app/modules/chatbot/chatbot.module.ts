import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatBubbleComponent} from "./chat-bubble/chat-bubble.component";
import {HttpClientModule} from '@angular/common/http';
import {ChatbotComponent} from './chatbot/chatbot.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {FormsModule} from "@angular/forms";


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
    FormsModule,
    AngularSvgIconModule.forRoot(),
    AutocompleteLibModule
  ]
})
export class ChatbotModule {
}
