import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PeriodicElement } from 'src/app/shared/models/periodic-element.model';
import { ElementsDataService } from 'src/app/shared/services/elements-data.service';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export class GetData {
  static readonly type = '[Home] GetData';
}

export class ShowSymbolData {
  constructor(public payload: string) {}
  static readonly type = '[Home] ShowSymbolData';
}

export class ResetSymbolData {
  static readonly type = '[Home] ResetSymbolData';
}

export interface HomeStateModel {
  data: PeriodicElement[];
  element: PeriodicElement;
}
@Injectable()
@State<HomeStateModel>({
  name: 'home',
  defaults: {
    data: [],
    element: null
  }
})
export class HomeState {
  @Selector()
  static data(state: HomeStateModel): PeriodicElement[] {
    return state.data;
  }

  @Selector()
  static element(state: HomeStateModel): PeriodicElement {
    return state.element;
  }

  constructor(private elementsDataService: ElementsDataService) {}

  @Action(GetData)
  getData(ctx: StateContext<HomeStateModel>) {
    return this.elementsDataService.get().pipe(
      tap(data => {
        ctx.patchState({ data });
      })
    );
  }

  @Action(ShowSymbolData)
  ShowSymbolData(ctx: StateContext<HomeStateModel>, action: ShowSymbolData) {
    return this.elementsDataService.getBySymbol(action.payload).pipe(
      tap(data => {
        ctx.patchState({
          element: { ...data }
        });
      })
    );
  }

  @Action(ResetSymbolData)
  ResetSymbolData(ctx: StateContext<HomeStateModel>) {
    ctx.patchState({
      element: null
    });
  }
}
