import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatBubbleComponent} from "./chat-bubble/chat-bubble.component";
import {HttpClientModule} from '@angular/common/http';
import {IonicChatbotComponent} from './ionic-chatbot/ionic-chatbot.component';
import {IonicModule} from "@ionic/angular";


@NgModule({
  declarations: [
    ChatBubbleComponent,
    IonicChatbotComponent
  ],
  exports: [
    ChatBubbleComponent,
    IonicChatbotComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule,
    CommonModule,
  ]
})
export class ChatbotModule {
}
