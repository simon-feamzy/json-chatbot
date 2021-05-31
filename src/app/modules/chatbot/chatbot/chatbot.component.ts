import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatMessage, ChatResponse, MessageType} from "../models/message";
import {Answer, AnswerType, Step} from "../models/script";
import {UtilsService} from "../services/utils.service";
import {of, Subject, Subscription} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from "rxjs/operators";

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  @Input() botName: string = "bot";
  @Input() userName: string = "you";
  @Input() jsonFile: string = "";
  @Output() mapResult = new EventEmitter<ChatResponse>();

  messages: ChatMessage[] = [];
  content: any;
  currentMsg?: Step;

  answerInput: boolean = false;
  answerButton: boolean = false;
  answerSelect: boolean = false;
  currentAnswers: Answer[] = [];

  dataSearchTerms: Subject<string> = new Subject<string>();
  dataSubscription: Subscription = new Subscription();
  data: string[] = [];
  areDataLoading: boolean = false;
  readonly DEBOUNCE_TIME_IN_MS: number = 300;
  minChar: number = 3;

  constructor(private utilsService: UtilsService) {
  }

  ngOnInit(): void {
    this.utilsService.parseJson(this.jsonFile).subscribe((rootElt: Step) => {
      this.currentMsg = rootElt;
      this.displayStep();
    });
  }

  resetToolbar() {
    this.answerButton = false;
    this.answerInput = false;
    this.currentAnswers = []
  }

  displayStep() {
    const msg = new ChatMessage(MessageType.MSG_RES, this.botName, this.currentMsg ? this.currentMsg.text : "", UtilsService.getEpoch(), this.currentMsg ? this.currentMsg.timer : 0);
    this.messages.push(msg);
    if (this.currentMsg?.answerType == AnswerType.BUTTON) {
      this.answerButton = true;
      this.currentAnswers = this.currentMsg.answers;
    } else if (this.currentMsg?.answerType == AnswerType.INPUT) {
      this.answerInput = true;
      this.currentAnswers = this.currentMsg.answers;
    } else if (this.currentMsg?.answerType == AnswerType.SELECT) {
      this.answerSelect = true;
      this.currentAnswers = this.currentMsg.answers;
      this.dataSubscription = this.dataSearchTerms.pipe(
        debounceTime(this.DEBOUNCE_TIME_IN_MS),
        distinctUntilChanged(),
        tap(() => this.areDataLoading = true),
        switchMap((term: string) => this.utilsService.getSelectData(this.currentMsg ? this.currentMsg.src : "", term, this.minChar)),
        catchError(() => of([])),
        tap(() => this.areDataLoading = false)
      ).subscribe((data => this.data = data));
    }
  }

  sendMessage(type: AnswerType | undefined, answer: Answer) {
    console.debug("IonicChatbotComponent.sendMessage : " + answer);
    let msg: ChatMessage;
    if (type == AnswerType.INPUT) {
      msg = new ChatMessage(MessageType.MSG_REQ, this.userName, this.content, UtilsService.getEpoch(), 0);
    } else {//    if (type == AnswerType.BUTTON) {
      msg = new ChatMessage(MessageType.MSG_REQ, this.userName, answer.text, UtilsService.getEpoch(), 0);
    }
    let resp = new ChatResponse();
    resp.key = answer.action;
    resp.value = this.content;
    this.mapResult.emit(resp);
    this.messages.push(msg);
    this.resetToolbar();
    this.currentMsg = this.utilsService.getNextStep(answer.action);
    this.displayStep();
  }

  onKey(value: string) {
    debugger
    this.content = value;
  }

  tapSelect(value: string) {
    this.dataSearchTerms.next(value);
  }

  keyword = 'name';

}
