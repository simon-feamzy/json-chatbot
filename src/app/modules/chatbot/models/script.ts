export class Script {
  root: string = "";
  children: Step[] = [];
}

export class Step {
  id: string = "";
  text: string = "";
  answerType: AnswerType = AnswerType.BUTTON;
  answers: Answer[] = [];
}

export class Answer {
  text: string = "";
  action: string = "";
}

export enum AnswerType {
  BUTTON="BUTTON", INPUT="INPUT", SELECT="SELECT", COMPONENT="COMPONENT"
}
