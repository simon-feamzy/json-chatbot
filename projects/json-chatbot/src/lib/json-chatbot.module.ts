import {NgModule} from '@angular/core';
import {JsonChatbotComponent} from './json-chatbot.component';
import {ChatBubbleComponent} from './chat-bubble/chat-bubble.component';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';


@NgModule({
  declarations: [
    JsonChatbotComponent,
    ChatBubbleComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    AngularSvgIconModule,
    AutocompleteLibModule
  ],
  exports: [
    JsonChatbotComponent,
    ChatBubbleComponent,
  ]
})
export class JsonChatbotModule {
}
