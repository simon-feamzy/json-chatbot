import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ChatMessage, ChatResponse, MessageType} from './models/message';
import {Answer, AnswerType, Step} from './models/script';
import {JsonChatbotService} from './json-chatbot.service';
import {of, Subject, Subscription} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {ChatbotDirectiveComponent} from "./chatbot-directive.component";
import {ExecService, ScriptComponent} from "./interfaces/script.component";

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
  @Input() execService: ExecService;
  @Input() componentInstances: Map<string, any> = new Map();
  @Output() mapResult = new EventEmitter<ChatResponse>();
  args: Map<string, string> = new Map();

  @ViewChild(ChatbotDirectiveComponent) adHost!: ChatbotDirectiveComponent;

  messages: ChatMessage[] = [];
  content: any;
  currentMsg?: Step;

  currentAnswers: Answer[] = [];

  dataSearchTerms: Subject<string> = new Subject<string>();
  dataSubscription: Subscription = new Subscription();
  data: string[] = [];
  areDataLoading = false;
  readonly DEBOUNCE_TIME_IN_MS: number = 300;
  minChar = 3;
  componentRef;

  constructor(private utilsService: JsonChatbotService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.utilsService.parseJson(this.jsonFile).subscribe((rootElt: Step) => {
      this.currentMsg = rootElt;
      this.displayStep();
    });
  }

  resetToolbar(): void {
    this.currentAnswers = [];
    this.content = '';
  }

  displayStep(): void {
    const msg = new ChatMessage(MessageType.MSG_RES, this.botName, this.currentMsg ? this.currentMsg.text : '',
      JsonChatbotService.getEpoch(), this.currentMsg ? this.currentMsg.timer : 0);
    msg.avatar = this.botIcon;
    this.messages.push(msg);
    setTimeout(() => {
      msg.loading = false;
      this.currentAnswers = this.currentMsg.answers;
      const answerComponent = this.currentMsg.answers.filter(answer => answer.answerType === AnswerType.COMPONENT);
      if (answerComponent && answerComponent.length > 0) {
        const componentFactory: ComponentFactory<ScriptComponent> = this.componentFactoryResolver.resolveComponentFactory(this.componentInstances.get(answerComponent[0].component));
        const viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        componentRef.changeDetectorRef.detectChanges();
        componentRef.instance.init();
      }
    }, msg.timer);
    if (this.currentMsg?.src) {
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

  async sendMessage(type: AnswerType | undefined, answer: Answer) {
    console.log('IonicChatbotComponent.sendMessage : ' + JSON.stringify(answer) + ', with content : ' + this.content);
    this.args[this.currentMsg.id] = this.content;
    // display user message
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

    // construct message send to execService
    const resp = new ChatResponse();
    resp.id = this.currentMsg.id;
    resp.type = type;
    resp.value = this.content;
    resp.args = this.args;
    resp.actions = answer.actions;
    console.log('IonicChatbotComponent.execService.execute : ' + JSON.stringify(resp));

    this.execService.execute(resp).then(result=>{
      console.log("execService.execute : "+result);
      const nextStep = answer.actions.find(action => {
        const reg = new RegExp(action.value);
        return reg.test(result);
      }).next;


      this.resetToolbar();
      this.currentMsg = this.utilsService.getNextStep(nextStep);
      if (this.currentMsg) {
        this.displayStep();
      }

    });

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
  }

  onKey(value: string): void {
    this.content = value;
  }

  tapSelect(value: string): void {
    this.dataSearchTerms.next(value);
  }

}
