export class Script {
  root = '';
  children: Step[] = [];
}

export class Step {
  id = '';
  text = '';
  answerType: AnswerType = AnswerType.BUTTON;
  answers: Answer[] = [];
  timer = 0;
  src = '';
}

export class Answer {
  text = '';
  action = '';
}

export enum AnswerType {
  BUTTON = 'BUTTON', INPUT = 'INPUT', SELECT = 'SELECT', COMPONENT = 'COMPONENT'
}
