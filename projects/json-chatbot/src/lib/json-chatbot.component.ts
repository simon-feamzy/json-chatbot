import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ChatMessage, ChatResponse, MessageType} from './models/message';
import {Answer, AnswerType, Step} from './models/script';
import {JsonChatbotService} from './json-chatbot.service';
import {of, ReplaySubject, Subject, Subscription} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {ChatbotDirectiveComponent} from "./chatbot-directive.component";
import {ExecService, ScriptComponent} from "./interfaces/script.component";

@Component({
  selector: 'lib-json-chatbot',
  templateUrl: './json-chatbot.component.html',
  styleUrls: ['./json-chatbot.component.scss']
})
export class JsonChatbotComponent implements OnInit, OnDestroy {
  @Input() botName = 'bot';
  @Input() botIcon = '';
  @Input() userName = '';
  @Input() userIcon = '';
  @Input() jsonFile = '';
  @Input() withDate = false;
  @Input() loaderIcon = '';
  @Input() execService: ExecService;
  @Input() componentInstances: Map<string, any> = new Map();
  @Output() mapResult = new EventEmitter<ChatResponse>();
  @ViewChild('chatbotContent', { static: false }) chatbotContent: ElementRef;
  @ViewChild(ChatbotDirectiveComponent) adHost!: ChatbotDirectiveComponent;

  args: Map<string, any> = new Map();
  messages: ChatMessage[] = [];
  selectedContent: any = {id: '', value: ''};
  content: any;
  currentMsg?: Step;

  currentAnswers: Answer[] = [];

  // subject use to save user input (keep only 3 last values)
  dataSearchTerms: ReplaySubject<string> = new ReplaySubject<string>(3);
  // subscriptions save as variable to call unsubscribre on destroy
  dataSubscription: Subscription = new Subscription();
  // data use to display select values
  data: Subject<string[]> = new Subject<string[]>();
  areDataLoading = false;
  hasDataContent = false;

  readonly DEBOUNCE_TIME_IN_MS: number = 300;
  readonly MIN_CHAR = 3;
  public static UNKNOW_ITEM_KEY = "not-found";
  public static UNKNOW_ITEM = "Je ne trouve pas";

  constructor(private utilsService: JsonChatbotService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.utilsService.parseJson(this.jsonFile).subscribe((rootElt: Step) => {
      this.currentMsg = rootElt;
      this.displayStep();
    });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  resetToolbar(): void {
    this.currentAnswers = [];
    this.content = '';
    this.hasDataContent = false;
    this.data.next([]);
  }

  displayStep(): void {
    // display bot message (with loader if asks)
    const msg = new ChatMessage(MessageType.MSG_RES, this.botName, this.currentMsg ? this.currentMsg.text : '',
      JsonChatbotService.getEpoch(), this.currentMsg ? this.currentMsg.timer : 0);
    msg.avatar = this.botIcon;
    this.messages.push(msg);

    // wait timer value to display real message and footer content
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

    // if select content is loaded from url, subscribe to this url to get data
    if (this.currentMsg?.src) {
      var url = this.currentMsg.src.url;

      // replace variable in url from args values
      const reg = new RegExp("<([a-zA-Z0-9\\-_]+)>");
      if (reg.test(url)) {
        var res = url.match(reg)
        url = url.replace(reg, encodeURI(this.args.get(res[1])));
      }
      console.log("url source : " + url);
      this.dataSubscription.unsubscribe();
      this.dataSearchTerms = new ReplaySubject(3);
      if (this.currentMsg?.src.static) {
        this.utilsService.getStaticSelectData(url, this.currentMsg.src.path).subscribe(data => {
          this.data.next(data);
        });
      } else {
        this.dataSubscription = this.dataSearchTerms.pipe(
          debounceTime(this.DEBOUNCE_TIME_IN_MS),
          distinctUntilChanged(),
          tap(() => this.areDataLoading = true),
          switchMap((term: string) => {
            if (this.currentMsg?.src.static) {
              return this.utilsService.getStaticSelectData(url, this.currentMsg.src.path);
            } else {
              return this.utilsService.getSelectData(url, term, this.MIN_CHAR);
            }
          }),
          catchError((error) => {
            console.log(error);
            return of([])
          }),
          tap(() => this.areDataLoading = false)
        ).subscribe((data:string[]) => {
          this.data.next(data);
          // specify if data has content
          if (data.length > 0) {
            this.hasDataContent = true;
          } else {
            this.hasDataContent = false;
          }
        });
      }
    }
  }

  async sendMessage(type: AnswerType | undefined, answer: Answer) {
    console.log('IonicChatbotComponent.sendMessage : ' + JSON.stringify(answer) + ', with content : ' + this.content);
    if ((answer.answerType === AnswerType.SELECT || answer.answerType === AnswerType.AUTOCOMPLETE) && this.currentMsg.src?.id?.length > 0) {
      this.args.set(this.currentMsg.id, this.selectedContent.id);
    } else {
      this.args.set(this.currentMsg.id, this.content);
    }
    // display user message
    let msg: ChatMessage;
    if (type === AnswerType.INPUT) {
      msg = new ChatMessage(MessageType.MSG_REQ, this.userName, this.content, JsonChatbotService.getEpoch(), 0);
    } else if (type === AnswerType.SELECT || type === AnswerType.AUTOCOMPLETE) {
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
    if (answer.answerType === AnswerType.SELECT && this.currentMsg.src?.id?.length > 0) {
      resp.value = this.selectedContent;
    } else {
      resp.value = this.content;
    }
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

  scrollToBottom() {
    this.chatbotContent.nativeElement.scroll({
      top: this.chatbotContent.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onKey(value: string): void {
    this.content = value;
  }

  selectContent(value: any): void {
    if (this.currentMsg.src?.id?.length > 0) {
      this.selectedContent.id = value[this.currentMsg.src?.id];
      this.selectedContent.label = value[this.currentMsg.src.label];
      this.content = value[this.currentMsg.src?.label];
    } else {
      this.content = value;
    }
  }

  tapSelect(value: string): void {
    this.dataSearchTerms.next(value);
  }

  hasComponent(): boolean {
    return this.currentMsg?.answers?.filter(answer => answer.answerType === AnswerType.COMPONENT).length > 0;
  }

  get unknowItem() {
    return JsonChatbotComponent.UNKNOW_ITEM;
  }

  get unknowItemKey() {
    return JsonChatbotComponent.UNKNOW_ITEM_KEY;
  }
}
