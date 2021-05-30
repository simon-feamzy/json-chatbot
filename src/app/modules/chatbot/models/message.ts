export class ChatMessage {
  type: MessageType = MessageType.MSG_REQ;
  author: string="";
  message: string="";
  epoch?: number;

  constructor(type: MessageType, author: string, message: any, epoch: number) {
    this.type = type;
    this.author = author;
    this.message = message;
    this.epoch = epoch;
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
