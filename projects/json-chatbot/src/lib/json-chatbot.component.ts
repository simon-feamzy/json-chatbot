import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
  public static UNKNOW_ITEM_KEY = "not-found";
  public static UNKNOW_ITEM = "Je ne trouve pas";
  unknowItem = JsonChatbotComponent.UNKNOW_ITEM;
  unknowItemKey = JsonChatbotComponent.UNKNOW_ITEM_KEY;

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

      const url = this.currentMsg.src.replace(/<([a-zA-Z0-9\-_]+)>/, this.args["$1"])
      console.log("url source : " + url);
      this.dataSubscription = this.dataSearchTerms.pipe(
        debounceTime(this.DEBOUNCE_TIME_IN_MS),
        distinctUntilChanged(),
        tap(() => this.areDataLoading = true),
        switchMap((term: string) => this.utilsService.getSelectData(url, term, this.minChar)),
        catchError(() => of([])),
        // map(lst => {
        //   lst.push(JsonChatbotService.SEPARATOR_ITEM);
        //   lst.push(JsonChatbotService.UNKNOW_ITEM)
        //   return lst;
        // }),
        tap(() => this.areDataLoading = false)
      ).subscribe((data => this.data = data));
    }
  }

  async sendMessage(type: AnswerType | undefined, answer: Answer) {
    console.log('IonicChatbotComponent.sendMessage : ' + JSON.stringify(answer) + ', with content : ' + this.content);
    this.args.set(this.currentMsg.id, this.content);
    // display user message
    let msg: ChatMessage;
    if (type === AnswerType.INPUT) {
      msg = new ChatMessage(MessageType.MSG_REQ, this.userName, this.content, JsonChatbotService.getEpoch(), 0);
    } else if (type === AnswerType.SELECT) {
      var label: string = this.content;
      if (label === JsonChatbotComponent.UNKNOW_ITEM_KEY) {
        label = JsonChatbotComponent.UNKNOW_ITEM;
      }
      msg = new ChatMessage(MessageType.MSG_REQ, this.userName, label, JsonChatbotService.getEpoch(), 0);
    } else if (type === AnswerType.BUTTON) {
      var label: string = answer.text;
      if (label === JsonChatbotComponent.UNKNOW_ITEM_KEY) {
        label = JsonChatbotComponent.UNKNOW_ITEM;
      }
      msg = new ChatMessage(MessageType.MSG_REQ, this.userName, label, JsonChatbotService.getEpoch(), 0);
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

    this.execService.execute(resp).then(result => {
      console.log("execService.execute : " + result);
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

  onKey(value: string): void {
    this.content = value;
  }

  selectContent(value: string): void {
    this.content = value;
    this.data = [];
  }

  tapSelect(value: string): void {
    this.dataSearchTerms.next(value);
  }

  hasComponent(): boolean {
    return this.currentMsg?.answers?.filter(answer => answer.answerType === AnswerType.COMPONENT).length > 0;
  }
}
