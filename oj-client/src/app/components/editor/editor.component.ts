import { Component, OnInit } from '@angular/core';
import { CollaborationService} from '../../services/collaboration.service';
import { ActivatedRoute, Params} from '@angular/router';
declare var ace: any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  languages: string[] = ['Java','Python'];
  language: string = 'Java';


	editor: any;

  defaultContent = {
    'Java': `public class Example {
      public static void main(String[] args) {
      // Type your Java code here
      }
}`,
    'Python': `class Solution:
    def example():
      # write your python code here.
    `
  };

  sessionId: string;

  constructor(private collaboration: CollaborationService, private route: ActivatedRoute) { }

  ngOnInit() {
    // use problem id as session id
    // since we subscribe the changes, every time the params changes
    // sessionId will be updated and the editor will be initized
    this.route.params
      .subscribe(params => {
        this.sessionId = params['id'];
        this.initEditor();
        this.collaboration.restoreBuffer();
      })
  }

  initEditor() : void {
  	this.editor = ace.edit("editor");
  	this.editor.setTheme("ace/theme/eclipse");
  	this.editor.getSession().setMode("ace/mode/java");
    this.editor.setValue(this.defaultContent['Java']);


    //setup collaboration socket
    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    // registrer change callback
    this.editor.on("change", (e) => {
      console.log('editor changes: ' + JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e))
      }
    })



  }

  resetEditor(): void {
    //console.log(this.language);
    this.editor.setValue(this.defaultContent[this.language]);
    this.editor.getSession().setMode("ace/mode/" + this.language.toLowerCase());

  }

  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  submit(): void {
    let user_code = this.editor.getValue();
    console.log(user_code);
  }


}
