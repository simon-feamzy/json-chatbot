import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ChatMessage, MessageType} from "../models/message";
import {Child, Script} from "../models/script";
import {UtilsService} from "../services/utils.service";

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  @Input() botName:string="bot";
  @Input() jsonFile: string = "";
  script?: Script;
  messages: ChatMessage[]=[];

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.httpClient.get<any>(this.jsonFile).subscribe((data: Script) => {
      this.script = data
      let rootElt: Child = this.script.children.filter(child => child.id == this.script?.root)[0];
      let msg = new ChatMessage(MessageType.MSG_RES, this.botName, rootElt.text, UtilsService.getEpoch());
      this.messages.push(msg);
    });
  }

}
