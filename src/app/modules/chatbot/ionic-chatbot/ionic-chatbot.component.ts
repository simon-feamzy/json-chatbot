import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage, MessageType} from "../../models/message";
import {Answer, AnswerType, Step} from "../../models/script";
import {UtilsService} from "../../services/utils.service";

@Component({
  selector: 'app-ionic-chatbot',
  templateUrl: './ionic-chatbot.component.html',
  styleUrls: ['./ionic-chatbot.component.scss']
})
export class IonicChatbotComponent implements OnInit {
  @Input() botName: string = "bot";
  @Input() userName: string = "you";
  @Input() jsonFile: string = "";

  messages: ChatMessage[] = [];
  colorCode?: string
  content: any;
  currentMsg?: Step;

  answerInput: boolean = false;
  answerButton: boolean = false;
  currentAnswers?: Answer[];

  constructor(private utilsService: UtilsService) {
  }

  ngOnInit(): void {
    this.utilsService.parseJson(this.jsonFile).subscribe((rootElt: Step) => {
      this.currentMsg = rootElt;
      this.displayStep();
    });
  }

  displayStep(){
    const msg = new ChatMessage(MessageType.MSG_RES, this.botName, this.currentMsg?.text, UtilsService.getEpoch());
    this.messages.push(msg);
    if (this.currentMsg?.answerType == AnswerType.BUTTON) {
      this.answerButton = true;
      this.currentAnswers = this.currentMsg.answers;
    }
  }

  sendMessage(answer: Answer) {
    console.debug("IonicChatbotComponent.sendMessage : "+answer);
    const msg = new ChatMessage(MessageType.MSG_REQ, this.userName, answer.text, UtilsService.getEpoch());
    setTimeout(function () {}, 1000);
    this.messages.push(msg);
    this.currentMsg = this.utilsService.getNextStep(answer.action);
    this.answerButton = false;
    this.currentAnswers = [];
      setTimeout(function () {}, 1000);
    this.displayStep();
  }
}
