import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { PeriodicElement } from '../store/state';

@Component({
  selector: 'app-element-preview',
  templateUrl: './element-preview.component.html',
  styleUrls: ['./element-preview.component.scss']
})
export class ElementPreviewComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
