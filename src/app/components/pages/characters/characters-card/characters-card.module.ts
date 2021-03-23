import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersCardComponent } from './characters-card.component';
import {RouterModule} from '@angular/router';



@NgModule({
    declarations: [CharactersCardComponent],
    exports: [
        CharactersCardComponent
    ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class CharactersCardModule { }
