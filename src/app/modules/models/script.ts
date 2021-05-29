export class Script {
  root: string = "";
  children: Child[] = [];
}

export class Child {
  id: string = "";
  text: string = "";
  answer: Answer[] = [];
}

export class Answer {
  type: AnswerType = AnswerType.BUTTON;
  text: string = "";

}

export enum AnswerType {
  BUTTON, INPUT, SELECT, COMPONENT
}
