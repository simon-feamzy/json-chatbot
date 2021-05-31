export class ChatMessage {
  type: MessageType = MessageType.MSG_REQ;
  author: string="";
  message: string="";
  epoch?: number;
  timer:number=0;

  constructor(type: MessageType, author: string, message: any, epoch: number, timer: number) {
    this.type = type;
    this.author = author;
    this.message = message;
    this.epoch = epoch;
    this.timer = timer;
  }
}

export class MessageType {
  public static readonly MSG_REQ: string = "message_request";
  public static readonly MSG_RES: string = "message_response"
}

export class ChatResponse{
  key:string="";
  value:string="";
}
