import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatMessage, ChatResponse, MessageType} from './models/message';
import {Answer, AnswerType, Step} from './models/script';
import {JsonChatbotService} from './json-chatbot.service';
import {of, Subject, Subscription} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'lib-json-chatbot',
  templateUrl: './json-chatbot.component.html',
  styleUrls: ['./json-chatbot.component.scss']
})
export class JsonChatbotComponent implements OnInit {
  @Input() botName = 'bot';
  @Input() botIcon = '';
  @Input() userName = 'you';
  @Input() userIcon = '';
  @Input() jsonFile = '';
  @Input() withDate = false;
  @Input() loaderIcon = '';
  @Output() mapResult = new EventEmitter<ChatResponse>();

  messages: ChatMessage[] = [];
  content: any;
  currentMsg?: Step;

  answerInput = false;
  answerButton = false;
  answerSelect = false;
  currentAnswers: Answer[] = [];

  dataSearchTerms: Subject<string> = new Subject<string>();
  dataSubscription: Subscription = new Subscription();
  data: string[] = [];
  areDataLoading = false;
  readonly DEBOUNCE_TIME_IN_MS: number = 300;
  minChar = 3;

  constructor(private utilsService: JsonChatbotService) {
  }

  ngOnInit(): void {
    this.utilsService.parseJson(this.jsonFile).subscribe((rootElt: Step) => {
      this.currentMsg = rootElt;
      this.displayStep();
    });
  }

  resetToolbar(): void {
    this.answerButton = false;
    this.answerInput = false;
    this.currentAnswers = [];
    this.content = '';
  }

  displayStep(): void {
    const msg = new ChatMessage(MessageType.MSG_RES, this.botName, this.currentMsg ? this.currentMsg.text : '',
      JsonChatbotService.getEpoch(), this.currentMsg ? this.currentMsg.timer : 0);
    msg.avatar = this.botIcon;
    this.messages.push(msg);
    if (this.currentMsg?.answerType === AnswerType.BUTTON || this.currentMsg?.answerType === AnswerType.CLOSE) {
      this.answerButton = true;
      this.currentAnswers = this.currentMsg.answers;
    } else if (this.currentMsg?.answerType === AnswerType.INPUT) {
      this.answerInput = true;
      this.currentAnswers = this.currentMsg.answers;
    } else if (this.currentMsg?.answerType === AnswerType.SELECT) {
      this.answerSelect = true;
      this.currentAnswers = this.currentMsg.answers;
      this.dataSubscription = this.dataSearchTerms.pipe(
        debounceTime(this.DEBOUNCE_TIME_IN_MS),
        distinctUntilChanged(),
        tap(() => this.areDataLoading = true),
        switchMap((term: string) => this.utilsService.getSelectData(this.currentMsg ? this.currentMsg.src : '', term, this.minChar)),
        catchError(() => of([])),
        tap(() => this.areDataLoading = false)
      ).subscribe((data => this.data = data));
    }
  }

  sendMessage(type: AnswerType | undefined, answer: Answer): void {
    console.log('IonicChatbotComponent.sendMessage : ' + answer);

    //   "id": "action2",
    //     "text": "Ok, c'est bien compris. Je vous laisse inviter les membres de votre foyer pour vous organiser ensemble",
    //     "answerType": "CLOSE",
    //     "timer": 1000,
    //     "answers": [
    //     {
    //       "text": "Continuer",
    //       "action": "invit-parent"
    //     }
    //   ]
    // },
    const resp = new ChatResponse();
    resp.action = answer.action;
    resp.type = type;
    resp.value = this.content;
    this.mapResult.emit(resp);
    let msg: ChatMessage;
    if (type === AnswerType.INPUT) {
      msg = new ChatMessage(MessageType.MSG_REQ, this.userName, this.content, JsonChatbotService.getEpoch(), 0);
    } else if (type === AnswerType.SELECT) {
      msg = new ChatMessage(MessageType.MSG_REQ, this.userName, this.content, JsonChatbotService.getEpoch(), 0);
    } else if (type === AnswerType.BUTTON) {
      msg = new ChatMessage(MessageType.MSG_REQ, this.userName, answer.text, JsonChatbotService.getEpoch(), 0);
    } else {
      //type == CLOSE
    }
    if (msg) {
      this.messages.push(msg);
    }
    this.resetToolbar();
    this.currentMsg = this.utilsService.getNextStep(answer.action);
    if (this.currentMsg) {
      this.displayStep();
    }
  }

  onKey(value: string): void {
    this.content = value;
  }

  tapSelect(value: string): void {
    this.dataSearchTerms.next(value);
  }

}
