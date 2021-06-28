import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  MonacoEditorComponent,
  MonacoEditorConstructionOptions
} from '@materia-ui/ngx-monaco-editor';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { CodeinoneService } from '../codeinone.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit , AfterViewInit {

  // @ViewChild(MonacoEditorComponent, { static: false })
  // monacoComponent: MonacoEditorComponent | undefined;

  shrinkTab = [
    false,
    false,
    false,
    false
  ]

  htmlOps: MonacoEditorConstructionOptions = {
    theme: 'vs-dark',
    language: 'html',
    roundedSelection: true,
    autoIndent: 'brackets',
    tabCompletion:'on',
    automaticLayout:true,
    scrollBeyondLastLine:true
  };

  styleOps: MonacoEditorConstructionOptions = {
    theme: 'vs-dark',
    language: 'css',
    roundedSelection: true,
    autoIndent: 'brackets',
    tabCompletion:'on',
    automaticLayout:true,
    scrollBeyondLastLine:true
  };

  scriptOps: MonacoEditorConstructionOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    roundedSelection: true,
    autoIndent: 'brackets',
    tabCompletion:'on',
    automaticLayout:true,
    scrollBeyondLastLine:true
  };

  htmlData:string = "";
  styleData:string = "";
  scriptData:string = "";

  editorEl:any;
  keyUpObservable$:any;

  text:string;

  refresh$: Observable<boolean>;

  dwlink:string;

  constructor(public codein:CodeinoneService) {
    let data = this.codein.iframeInit(this.scriptData,this.styleData,this.htmlData,true);

    this.text = data[0];
    this.htmlData = data[1].html;
    this.scriptData = data[1].inScript;
    this.styleData = data[1].inStyle;

    this.dwlink = 'data:text/html;charset=utf-8,' + encodeURIComponent(this.text);

    this.refresh$ = this.codein.watchRefresh();
    this.refresh$.subscribe(data=>{
      if(data){
        this.changeContent();
        // console.log("done");
      }

    });
  }

  ngAfterViewInit(): void {

    this.editorEl = document.getElementsByClassName('textEditorContainer');
    this.keyUpObservable$ = fromEvent(this.editorEl,'keyup').pipe(
      debounceTime(1500)
    ).subscribe(i=>{
      this.changeContent();
      // console.log('key up');
    });

  }


  changeContent() {

      this.text = this.codein.iframeInit(this.scriptData,this.styleData,this.htmlData,false)[0];

      this.codein.storeIframeData();
  }

  shrinkStatus(n:number){
    this.shrinkTab[n] = !this.shrinkTab[n];
    if(this.shrinkTab[0] && this.shrinkTab[1] && this.shrinkTab[2])
        this.shrinkTab[0] = false;
  }


  ngOnInit(): void {

    const add = (data:any)=>{
      this.codein.consoleData.push(data);
    }

    window.addEventListener('message', function(response) {
      // Make sure message is from our iframe, extensions like React dev tools might use the same technique and mess up our logs
      if (response.data && response.data.source === 'iframe') {
        // Do whatever you want here.
        console.log(response.data.message, response.data.type);
        add({msg :response.data.message, type :response.data.type})
      }
    });
  }

  openModal(){
    this.codein.open();
  }

  dowloadFile(){
    var link = document.createElement('a');
    link.setAttribute('download', 'index.html');
    let html = this.codein.exportFile();
    link.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
    link.click();
  }

}
