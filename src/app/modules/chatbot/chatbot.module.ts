import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatBubbleComponent} from "./chat-bubble/chat-bubble.component";
import {HttpClientModule} from '@angular/common/http';
import {ChatbotComponent} from './chatbot/chatbot.component';


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
  ]
})
export class ChatbotModule {
}
