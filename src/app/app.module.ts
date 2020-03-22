import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatTableModule} from '@angular/material/table'
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { GridSampleComponent } from './home/grid-sample/grid-sample.component';
import { SharedModule } from './shared/shared.module';
import { HomeState } from './home/store/state';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ElementPreviewComponent } from './home/element-preview/element-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    GridSampleComponent,
    ElementPreviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSnackBarModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    NgxsModule.forRoot([HomeState]), NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
