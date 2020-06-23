import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [{ path: '', component: LandingPageComponent }]

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule
  ]
})
export class LandingModule { }
