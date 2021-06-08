// use by component to add it in footer
import {EventEmitter} from "@angular/core";
import {ChatResponse} from "../models/message";

export declare interface ScriptComponent {
  data: any;
  init(): void;
  getResult(): ScriptComponentResult[];
}

export class ScriptComponentResult{
  name:string;
  value: EventEmitter<string>;
}

export declare interface ExecService{
  execute(resp : ChatResponse): Promise<string>
}
