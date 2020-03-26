import { Shallow } from 'shallow-render';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { NgxsModule, Store } from '@ngxs/store';
import { HomeState, ShowSymbolData } from './store/home.state';
import { of } from 'rxjs/internal/observable/of';

import {
  MatSnackBar,
  MatSnackBarModule,
  MAT_SNACK_BAR_DATA
} from '@angular/material/snack-bar';
import { ShallowTestComponent } from 'src/app/core/test/shallow-test-component';
import { ShallowComponentMock } from 'src/app/core/test/shallow-component.mock';
import { IShallowTestComponent } from 'src/app/core/test/shallow-test-component.interface';
import { HomeModule } from './home.module';
import { mockHomeModule } from './home.shallow';
import { ElementsDataService } from 'src/app/shared/services/elements-data.service';

describe('HomeComponent', () => {
  let shallow: HomeTestComponent;

  beforeEach(() => {
    const ngxs = NgxsModule.forRoot([HomeState]);
    shallow = new HomeTestComponent(HomeComponent, HomeModule, mockHomeModule)
      .dontMock(MatSnackBarModule)
      .mock(ElementsDataService, {
        get: () => of([]),
        getBySymbol: () => of(null)
      })
      .provideMock([{ provide: MAT_SNACK_BAR_DATA, useValue: {} }]);
  });

  it('should display title', async () => {
    const page = await shallow.render();
    expect(page.find('app-grid-sample')).toHaveFoundOne();
  });

  it('should display alert with symbol on click', async () => {
    const page = await shallow.render();
    spyOn(page.instance, 'onSymbolClick').and.callThrough();
    spyOn(page.get(Store), 'dispatch').and.callThrough();
    spyOn(page.get(MatSnackBar), 'openFromComponent');

    await page.gridSample.symbolClick('test-symbol');

    expect(page.instance.onSymbolClick).toHaveBeenCalledWith('test-symbol');
    expect(page.get(Store).dispatch).toHaveBeenCalledWith([
      new ShowSymbolData('test-symbol')
    ]);
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
