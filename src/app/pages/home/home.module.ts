import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { GridSampleComponent } from './grid-sample/grid-sample.component';
import { ElementPreviewComponent } from './element-preview/element-preview.component';
import { NgModule } from '@angular/core';
import { HomeState } from './store/home.state';
import { NgxsModule } from '@ngxs/store';
import { ElementViewComponent } from './element-view/element-view.component';

@NgModule({
  declarations: [
    HomeComponent,
    GridSampleComponent,
    ElementPreviewComponent,
    ElementViewComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    NgxsModule.forFeature([HomeState])
  ],
  providers: []
})
export class HomeModule { }
