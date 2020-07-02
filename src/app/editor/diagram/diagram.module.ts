import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from './diagram.component';
import { EntityComponent } from './entity/entity.component';
import { AttributeComponent } from './property/attribute.component';
import { ConnectionComponent } from './connection/connection.component';
import { DiagramElementDirective } from 'src/app/shared/directives/diagram-element.directive';
import {MatSliderModule} from '@angular/material/slider';



@NgModule({
  declarations: [EntityComponent, AttributeComponent, ConnectionComponent, DiagramComponent, DiagramElementDirective],
  imports: [
    CommonModule,
    MatSliderModule,
  ],
  
  exports: [DiagramComponent]
})
export class DiagramModule { }
