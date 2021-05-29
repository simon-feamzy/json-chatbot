import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from './chatbot.component';
import {ChatBubbleComponent} from "./chat-bubble/chat-bubble.component";
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ChatbotComponent,
    ChatBubbleComponent
  ],
  exports: [
    ChatbotComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class ChatbotModule { }
