import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraficoComponent } from './app/grafico/grafico.component';


const routes: Routes = [{
  path: '',
  component: GraficoComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],  
  declarations: []
})

export class AppRoutingModule {}