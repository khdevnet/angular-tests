import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PeriodicElement } from 'src/app/shared/models/periodic-element.model';

@Component({
  selector: 'app-element-view',
  templateUrl: './element-view.component.html',
  styleUrls: ['./element-view.component.scss']
})
export class ElementViewComponent {
  @Input() element: PeriodicElement
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
}
