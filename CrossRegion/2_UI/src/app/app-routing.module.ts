import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './views/login/login.component';

const mainRoutes: Routes = [
  {
    path: '',
    loadChildren: './views/views.module#ViewsModule',
  },
  {
    path: 'login',
    component: LoginComponent
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(
      mainRoutes
      // ,{enableTracing: true}
    )
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
