import {AnswerType} from "./script";

export class ChatMessage {
  type: MessageType = MessageType.MSG_REQ;
  author = '';
  message = '';
  epoch?: number;
  timer = 0;
  avatar = '';
  loading = false;

  constructor(type: MessageType, author: string, message: any, epoch: number, timer: number) {
    this.type = type;
    this.author = author;
    this.message = message;
    this.epoch = epoch;
    this.timer = timer;
    if (this.timer>0){
      this.loading = true;
    }
  }
}

export class MessageType {
  public static readonly MSG_REQ: string = 'message_request';
  public static readonly MSG_RES: string = 'message_response';
}

export class ChatResponse {
  action = '';
  type: AnswerType;
  value = '';
  args: [] = [];
}
