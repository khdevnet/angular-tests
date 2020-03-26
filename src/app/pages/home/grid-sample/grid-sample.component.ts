import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PeriodicElement } from 'src/app/shared/models/periodic-element.model';

@Component({
  selector: 'app-grid-sample',
  templateUrl: './grid-sample.component.html',
  styleUrls: ['./grid-sample.component.scss']
})
export class GridSampleComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  @Input() dataSource: PeriodicElement[];
  @Output() symbolClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

}
