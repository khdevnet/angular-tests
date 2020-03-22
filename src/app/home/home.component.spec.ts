import { Shallow } from 'shallow-render';
import { HomeComponent } from './home.component';
import { AppModule } from '../app.module';
import { AppRoutingModule } from '../app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { NgxsModule, Store } from '@ngxs/store';
import { HomeState, ShowSymbolData } from './store/state';
import { of } from 'rxjs/internal/observable/of';
import {
  ShallowTestComponent,
  ShallowComponentMock,
  IShallowTestComponent
} from '../core/test/ShallowPage';
import { MatSnackBar, MatSnackBarModule, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

describe('HomeComponent', () => {
  let shallow: HomeTestComponent;

  beforeEach(() => {
    const ngxs = NgxsModule.forRoot([HomeState]);
    shallow = new HomeTestComponent(HomeComponent, AppModule)
      .import(ngxs)
      .dontMock(MatSnackBarModule)
      .provideMock([{ provide: MAT_SNACK_BAR_DATA, useValue: {}}])
      .dontMock(ngxs);
  });

  it('should display title', async () => {
    const page = await shallow.render();
    expect(page.find('app-grid-sample')).toHaveFoundOne();
  });

  it('should display alert with symbol on click', async () => {
    const page = await shallow.render();
    spyOn(page.instance, "onSymbolClick").and.callThrough();
    spyOn(page.get(Store), "dispatch").and.callThrough();
    spyOn(page.get(MatSnackBar), "openFromComponent");

    await page.gridSample.symbolClick('test-symbol');

    expect(page.instance.onSymbolClick).toHaveBeenCalledWith('test-symbol');
    expect(page.get(Store).dispatch).toHaveBeenCalledWith([new ShowSymbolData('test-symbol')]);
    expect(page.get(MatSnackBar).openFromComponent).toHaveBeenCalled();
  });
});

class HomeTestComponent extends ShallowTestComponent<HomeComponent> {
  public get gridSample(): GridSampleComponentMock {
    return new GridSampleComponentMock('app-grid-sample', this);
  }
}

class GridSampleComponentMock extends ShallowComponentMock {
  constructor(
    elementSelector: string,
    shallowComponent: IShallowTestComponent
  ) {
    super(elementSelector, shallowComponent);
  }

  public async symbolClick(symbol: string): Promise<void> {
    this.el.triggerEventHandler('symbolClick', symbol);
    this.detectChanges();
  }
}
