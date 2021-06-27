import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { CodeinoneService } from '../codeinone.service';

@Component({
  selector: 'app-iframe-com',
  template:`
  <div style="height: 100%;" [ngClass]="{exp: this.expand}" >
      <iframe id="ifr" title="doc" [app-srcdoc]="text" frameBorder="0" width="100%" height="100%">

    </iframe>
  </div>
  `,
  styles:[`iframe{ background-color:white; }.exp{ height:100vh !important; }`]
})
export class IframeComComponent implements OnInit, OnDestroy {

  @Input() text:string="";
  cr!:any;
  expand = false;
  ob:any;

  constructor(private codein:CodeinoneService,private router:Router) {
    this.ob = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
                      .subscribe(event =>
                        {

                          this.cr = event;
                          if(this.cr.url.indexOf("result") >=0){
                            this.text = this.codein.iframeInit()[0];
                            this.expand = true;
                          }
                          else
                            this.expand = false;

                        });
    // console.log('iframe');
  }
  ngOnDestroy(): void {
    this.ob.unsubscribe();
  }

  ngOnInit(): void {
  }



}
