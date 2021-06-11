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
  srcId = '';
  srcLabel = '';
  staticSrcData='';
  staticSrc='';
}

export class Answer {
  text = '';
  actions: Action[] = [];
  answerType: AnswerType = AnswerType.BUTTON;
  checkUrl = '';
  component?: string;

}

export enum AnswerType {
  BUTTON = 'BUTTON', INPUT = 'INPUT', SELECT = 'SELECT', COMPONENT = 'COMPONENT', CLOSE = 'CLOSE'
}

export class Action{
  next:string;
  value:string;
}
