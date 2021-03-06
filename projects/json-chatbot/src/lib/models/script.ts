export class Script {
  root = '';
  children: Step[] = [];
  defaultError = '';
}

export class Step {
  id = '';
  text = '';
  answers: Answer[] = [];
  timer = 0;
  src: Source;
}

export class Source {
  url = '';
  path = '';
  static = false;
  id = '';
  label = '';
}

export class Answer {
  text = '';
  actions: Action[] = [];
  answerType: AnswerType = AnswerType.BUTTON;
  checkUrl = '';
  component?: string;

}

export enum AnswerType {
  BUTTON = 'BUTTON', INPUT = 'INPUT', SELECT = 'SELECT', AUTOCOMPLETE = 'AUTOCOMPLETE', COMPONENT = 'COMPONENT', CLOSE = 'CLOSE'
}

export class Action {
  next: string;
  value: string;
}
