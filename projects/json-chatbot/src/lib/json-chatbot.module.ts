import {NgModule} from '@angular/core';
import {JsonChatbotComponent} from './json-chatbot.component';
import {ChatBubbleComponent} from './chat-bubble/chat-bubble.component';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AvatarModule} from "ngx-avatar";
import {ChatbotDirectiveComponent} from "./chatbot-directive.component";
import {NgObjectPipesModule, NgPipesModule} from "ngx-pipes";


@NgModule({
  declarations: [
    JsonChatbotComponent,
    ChatBubbleComponent,
    ChatbotDirectiveComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    AvatarModule,
    NgObjectPipesModule,
    NgPipesModule,
  ],
  exports: [
    JsonChatbotComponent,
    ChatBubbleComponent
  ],
  providers:[

  ]
})
export class JsonChatbotModule {

}
