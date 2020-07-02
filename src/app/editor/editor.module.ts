import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorPageComponent } from './editor-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { DiagramModule } from './diagram/diagram.module';
import { OpenFileDialogComponent } from './open-file-dialog/open-file-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NewEntityDialogComponent } from './new-entity-dialog/new-entity-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NewAttributeDialogComponent } from './new-attribute-dialog/new-attribute-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const routes: Routes = [{path: '', component: EditorPageComponent}];


@NgModule({
  declarations: [EditorPageComponent, OpenFileDialogComponent, NewEntityDialogComponent, NewAttributeDialogComponent],
  imports: [
    CommonModule,
    DiagramModule,
    MatDialogModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    RouterModule.forChild(routes)
  ]
})
export class EditorModule { }
