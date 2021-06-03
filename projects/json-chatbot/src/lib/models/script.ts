import {OnInit, Type} from "@angular/core";
import {ScriptComponent} from "../interfaces/script.component";

export class Script {
  root = '';
  children: Step[] = [];
}

export class Step {
  id = '';
  text = '';
  answers: Answer[] = [];
  timer = 0;
  src = '';
}

export class Answer {
  text = '';
  action = '';
  answerType: AnswerType = AnswerType.BUTTON;
  checkUrl = '';
  component?: string;

}

export enum AnswerType {
  BUTTON = 'BUTTON', INPUT = 'INPUT', SELECT = 'SELECT', COMPONENT = 'COMPONENT', CLOSE = 'CLOSE'
}

