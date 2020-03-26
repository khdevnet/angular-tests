import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PeriodicElement } from 'src/app/shared/models/periodic-element.model';
import { ElementsDataService } from 'src/app/shared/services/elements-data.service';
import { tap } from 'rxjs/operators';

export class GetData {
  static readonly type = '[Home] GetData';
}

export class ShowSymbolData {
  constructor(public payload: string) {}
  static readonly type = '[Home] ShowSymbolData';
}

export interface HomeStateModel {
  data: PeriodicElement[];
  symbol: PeriodicElement;
}

@State<HomeStateModel>({
  name: 'home',
  defaults: {
    data: [],
    symbol: null
  }
})
export class HomeState {
  @Selector()
  static data(state: HomeStateModel): PeriodicElement[] {
    return state.data;
  }

  @Selector()
  static symbol(state: HomeStateModel): PeriodicElement {
    return state.symbol;
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
    const state = ctx.getState();
    ctx.setState({
      ...state,
      symbol: { ...state.data.find(x => x.symbol === action.payload) }
    });
  }
}
