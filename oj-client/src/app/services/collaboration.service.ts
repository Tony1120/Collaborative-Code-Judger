import { Injectable } from '@angular/core';
declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {


  collaborationSocket: any;
  constructor() { }

  init(editor: any, sessionId: string): void{
  	this.collaborationSocket = io(window.location.origin, {query: 'sessionId = ' + sessionId});

  	// handle the changes sent from server
  	this.collaborationSocket.on("change", (delta: string) => {
  		console.log("collabration: editor changes by " + delta);
  		delta = JSON.parse(delta);
  		editor.lastAppliedChange = delta;
  		editor.getSession().getDocument().applyDeltas([delta]);
  	})
  }

  change(delta: string): void {
  	this.collaborationSocket.emit("change", delta);
  }
}
