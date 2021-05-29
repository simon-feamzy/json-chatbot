import { Injectable } from '@angular/core';
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  static getEpoch(): number {
    return moment().unix();
  }

  public static getCalendarDay(epoch: number | undefined): string {
    if (!epoch) {
      return "";
    }
    let timeString = 'h:mm A';
    return moment(epoch * 1000).calendar(null, {
      sameDay: '[Today] ' + timeString,
      lastDay: '[Yesterday] ' + timeString,
      sameElse: 'MM/DD ' + timeString
    });
  }
}
