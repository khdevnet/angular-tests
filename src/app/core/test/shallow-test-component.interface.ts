import { Type, DebugElement, InjectionToken, AbstractType } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { QueryMatch } from 'shallow-render/dist/lib/models/query-match';

export interface IShallowTestComponent {
  find: (
    cssOrDirective: string | Type<any>,
    options?:
      | {
          query?: string | undefined;
        }
      | undefined
  ) => QueryMatch<DebugElement>;

  fixture: ComponentFixture<any>;
  get: <TValue>(
    queryClass: Type<TValue> | InjectionToken<TValue> | AbstractType<TValue>
  ) => TValue;
  detectChanges(): Promise<void>;
}
