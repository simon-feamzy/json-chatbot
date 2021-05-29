import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {ChatbotModule} from "./modules/chatbot/chatbot.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ChatbotModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
