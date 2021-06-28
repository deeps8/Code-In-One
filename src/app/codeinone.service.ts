import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IframeConent{
  inScript:string,
  inStyle:string,
  html:string,
  exStyle:Array<any>,
  exScript:Array<any>
};

@Injectable({
  providedIn: 'root'
})
export class CodeinoneService {

  ifc:IframeConent = {
    inScript:"",
    inStyle:"",
    exScript:[{link:""}],
    exStyle:[{link:""}],
    html:""
  };

  consoleData:Array<any> = [];

  private display$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private refresh$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  iframeInit(js:string="",css:string="",html:string="",local:boolean=true):Array<any>{

    let ls = localStorage.getItem('iframe-content');
    // get data from local storage if present;
    if(ls != null && local){
        this.ifc = JSON.parse(ls);
        // console.log(this.ifc);
    }
    else{
      this.ifc.html = html;
      this.ifc.inScript = js;
      this.ifc.inStyle = css;
    }

    let ifdata = `<!doctype html>
                  <html lang="en">
                    <head>
                    <meta charset="utf-8">
                    <title>Index</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    ${this.ifc.exStyle.map((sl) => `<link rel="stylesheet" href="${sl.link}" \>`).join("")}
                    </head>
                    <body>${this.ifc.html}</body>
                    <style>${this.ifc.inStyle}</style>
                    ${this.ifc.exScript.map((sl) => `<script src="${sl.link}" ></script>`).join("")}
                    <script>
                    const _log = console.log;
                    console.log = function(...rest) {
                      window.parent.postMessage(
                        {
                          source: 'iframe',
                          type:'log',
                          message: rest.toString(),
                        },
                        '*'
                      );
                    };

                    const _warn = console.warn;
                    console.warn = function(...rest) {
                      window.parent.postMessage(
                        {
                          source: 'iframe',
                          type:'warn',
                          message: rest.toString(),
                        },
                        '*'
                      );
                    };

                    const _error = console.error;
                    console.error = function(...rest) {
                      window.parent.postMessage(
                        {
                          source: 'iframe',
                          type:'error',
                          message: rest.toString(),
                        },
                        '*'
                      );
                    };
                    </script>
                    <script>${this.ifc.inScript}</script>
                  </html>`;


    return [ifdata,this.ifc];
  }

  storeIframeData(){
    localStorage.setItem('iframe-content', JSON.stringify(this.ifc));
  }

  exportFile():string{
    return `<!doctype html>
                  <html lang="en">
                    <head>
                    <meta charset="utf-8">
                    <title>Index</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    ${this.ifc.exStyle.map((sl) => `<link rel="stylesheet" href="${sl.link}" \>`).join("")}
                    </head>
                    <body>${this.ifc.html}</body>
                    <style>${this.ifc.inStyle}</style>
                    ${this.ifc.exScript.map((sl) => `<script src="${sl.link}" ></script>`).join("")}
                    <script>${this.ifc.inScript}</script>
                  </html>`;
  }

  watch():Observable<boolean>{
    return this.display$.asObservable();
  }

  open(){
    this.display$.next(true);
  }

  close(){
    this.display$.next(false);
  }


  watchRefresh():Observable<boolean>{
    return this.refresh$.asObservable();
  }

  refreshIframe(){
    this.refresh$.next(true);
  }

}
