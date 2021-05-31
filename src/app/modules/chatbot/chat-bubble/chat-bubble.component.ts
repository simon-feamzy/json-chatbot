import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage, MessageType} from "../models/message";
import {UtilsService} from "../services/utils.service";

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements OnInit {
  @Input() chatMessage?: ChatMessage;
  loading: boolean = false;

  constructor() {
  }


  ngOnInit(): void {
    if (this.chatMessage?.timer && this.chatMessage?.timer > 0) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false
      }, this.chatMessage.timer);
    }else{
      this.loading = false
    }
  }

  formatEpoch(epoch: number | undefined): string {
    return UtilsService.getCalendarDay(epoch);
  }

  getPosition() {
    return this.chatMessage?.type === MessageType.MSG_REQ ? 'right' : 'left'
  }
}
