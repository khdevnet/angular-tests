import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import {
  HomeState,
  GetData,
  ShowSymbolData,
  ResetSymbolData
} from './store/home.state';
import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElementPreviewComponent } from './element-preview/element-preview.component';
import { PeriodicElement } from 'src/app/shared/models/periodic-element.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Select(HomeState.data) data$: Observable<PeriodicElement[]>;
  @Select(HomeState.element) element$: Observable<PeriodicElement>;

  constructor(private store: Store, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.store.dispatch([new GetData()]);
  }

  onSymbolClick(symbol: string) {
    this.store
      .dispatch([new ShowSymbolData(symbol)])
      .pipe(withLatestFrom(this.element$))
      .subscribe(([_, data]) => {
        this.snackBar.openFromComponent(ElementPreviewComponent, {
          duration: 3 * 1000,
          data
        });
      });
  }

  onClose() {
    this.store.dispatch([new ResetSymbolData()]);
  }
}
