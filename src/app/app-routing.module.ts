import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IframeComComponent } from './iframe-com/iframe-com.component';

const routes: Routes = [
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'result',
    component:IframeComComponent
  },
  {
    path:"**",
    component:HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
