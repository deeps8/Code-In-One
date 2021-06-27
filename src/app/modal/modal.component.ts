import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CodeinoneService } from '../codeinone.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  modal$: Observable<boolean>;

  exStyle:Array<any>;
  exScript:Array<any>;

  errorMsg:string="";

  constructor( private codein: CodeinoneService ) {
    this.modal$ = this.codein.watch();
    this.exStyle = this.codein.ifc.exStyle;
    this.exScript = this.codein.ifc.exScript;
  }

  ngOnInit(): void {

  }

  removeLinks(t:string,i:number){
    if(t==="css"){
      this.exStyle.splice(i,1);
    }else{
      this.exScript.splice(i,1);
    }
  }

  addLinks(t:string){
    if(t==="css"){
      this.exStyle.push({link:""});
    }else{
      this.exScript.push({link:""});
    }
  }

  closeModal(){
    this.codein.close();
  }

  addExtLinks(){
    //checking urls
    // if(this.checkUrls()){
      this.codein.ifc.exScript = this.exScript;
      this.codein.ifc.exStyle = this.exStyle;
      this.codein.refreshIframe();
      this.closeModal();
    // }

  }

  checkUrls(){
    var urlRegex = new RegExp('(\S*?\.(?:js|css))\b');

    // .*link.*href=["|\']?(.*[\\\|\/]?.*)\.css["|\']?.*

    this.exStyle.map((el:any) => {
      if(el.link.match(urlRegex)){
        this.errorMsg = el.link+`<br> Is not a url`;
        console.log(el);
      }
    });


    this.exScript.map((el:any) => {
      if(el.link.match(urlRegex)){
        this.errorMsg = el.link+`<br> Is not a url`;
      }
    });

    if(this.errorMsg==="")
      return true;

    return false;
  }

}
