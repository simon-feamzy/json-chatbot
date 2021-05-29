import {Injectable} from '@angular/core';
import * as moment from 'moment'
import {Step, Script} from "../models/script";
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  script?: Script;

  constructor(private httpClient: HttpClient) {
  }

  parseJson(jsonFile: string): Observable<Step> {
    return this.httpClient.get<Script>(jsonFile).pipe(map((data: Script) => {
      this.script = data
      return this.getNextStep(this.script?.root);
    }));
  }

  getNextStep(name:string):Step {
    let result= this.script?.children.filter(child => child.id == name)[0];
    // @ts-ignore
    return result;
  }

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
