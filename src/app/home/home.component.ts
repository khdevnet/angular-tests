import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import {
  HomeState,
  PeriodicElement,
  GetData,
  ShowSymbolData
} from './store/state';
import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElementPreviewComponent } from './element-preview/element-preview.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Select(HomeState.data) data$: Observable<PeriodicElement[]>;
  @Select(HomeState.symbol) symbol$: Observable<PeriodicElement>;

  constructor(private store: Store, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.store.dispatch([new GetData()]);
  }

  onSymbolClick(symbol: string) {
    this.store
      .dispatch([new ShowSymbolData(symbol)])
      .pipe(withLatestFrom(this.symbol$))
      .subscribe(([_, data]) => {
        this.snackBar.openFromComponent(ElementPreviewComponent, {
          duration: 3 * 1000,
          data
        });
      });
  }
}
