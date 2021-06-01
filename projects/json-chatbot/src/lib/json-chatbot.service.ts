import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Script, Step} from './models/script';


const httpOptionsGet = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class JsonChatbotService {

  script?: Script;

  static getEpoch(): number {
    return moment().unix();
  }

  public static getCalendarDay(epoch: number | undefined): string {
    if (!epoch) {
      return '';
    }
    const timeString = 'h:mm A';
    return moment(epoch * 1000).calendar(null, {
      sameDay: '[Today] ' + timeString,
      lastDay: '[Yesterday] ' + timeString,
      sameElse: 'MM/DD ' + timeString
    });
  }

  constructor(private httpClient: HttpClient) {
  }

  parseJson(jsonFile: string): Observable<Step> {
    return this.httpClient.get<Script>(jsonFile).pipe(map((data: Script) => {
      this.script = data;
      return this.getNextStep(this.script?.root);
    }));
  }

  getNextStep(name: string): Step {
    const result = this.script?.children.filter(child => child.id === name)[0];
    // @ts-ignore
    return result;
  }

  getSelectData(url: string, searchTerm: string, searchTermMinLength: number): Observable<string[]> {

    if (!searchTerm.trim() || searchTerm.length < searchTermMinLength) {
      return of([]);
    }
    return this.httpClient.get(url + searchTerm, httpOptionsGet)
      .pipe(
        map((data: any) => {
          if (data) {
            return data?._embedded?.stringList.sort();
          }
          return [];
        })
      );
  }


}
