import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorPageComponent } from './editor-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [{path: '', component: EditorPageComponent}];


@NgModule({
  declarations: [EditorPageComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    RouterModule.forChild(routes)
  ]
})
export class EditorModule { }
