import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ElementsDataService } from './services/elements-data.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  providers: [ElementsDataService],
  declarations: [CheckboxComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatIconModule
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    CheckboxComponent,
    CommonModule,
    MatTableModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatIconModule,
    HttpClientModule
  ]
})
export class SharedModule {}
