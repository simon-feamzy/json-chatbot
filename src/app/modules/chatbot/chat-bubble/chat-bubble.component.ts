import {Component, OnInit, Input} from '@angular/core';
import {ChatMessage, MessageType} from "../models/message";
import {UtilsService} from "../services/utils.service";

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements OnInit {
  @Input() chatMessage?: ChatMessage;

  constructor() {
  }

  ngOnInit(): void {
  }

  formatEpoch(epoch: number | undefined): string {
    return UtilsService.getCalendarDay(epoch);
  }

  getPosition() {
    return this.chatMessage?.type === MessageType.MSG_REQ ? 'right' : 'left'
  }
}
