import { Shallow, RecursivePartial } from 'shallow-render';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Rendering } from 'shallow-render/dist/lib/models/rendering';
import {
  ModuleWithProviders,
  Type,
  InjectionToken,
  DebugElement,
  AbstractType,
  Provider
} from '@angular/core';
import { QueryMatch } from 'shallow-render/dist/lib/models/query-match';
import { ComponentFixture } from '@angular/core/testing';
import { IShallowTestComponent } from './shallow-test-component.interface';

export abstract class ShallowTestComponent<TTestComponent>
  implements IShallowTestComponent {
  shallow: Shallow<TTestComponent>;
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
  instance: TTestComponent;

  constructor(
    testComponent: Type<TTestComponent>,
    testModule: Type<any> | ModuleWithProviders,
    mockModule: <T>(shallow: Shallow<T>) => Shallow<T> = null
  ) {
    this.shallow = mockModule
      ? mockModule(new Shallow(testComponent, testModule))
      : new Shallow(testComponent, testModule);
  }

  import(...imports: (Type<any> | ModuleWithProviders)[]): this {
    this.shallow.import(...imports);
    return this;
  }

  provideMock(providers: Provider[]): this {
    this.shallow.provideMock(providers);
    return this;
  }

  dontMock(...things: any[]): this {
    this.shallow.dontMock(...things);
    return this;
  }

  mock<TMock>(
    thingToMock: Type<TMock> | InjectionToken<TMock>,
    stubs: RecursivePartial<TMock>
  ): this {
    this.shallow.mock(thingToMock, stubs);
    return this;
  }

  async render(): Promise<this> {
    const render = await this.shallow.render();
    this.find = render.find;
    this.fixture = render.fixture;
    this.get = render.get;
    this.instance = render.instance;
    return this;
  }

  async detectChanges(): Promise<void> {
    await this.fixture.whenStable();
    this.fixture.detectChanges();
  }

  destroy() {
    this.fixture.destroy();
  }

  setInputValue(element: HTMLInputElement, value: string) {
    element.value = value;
    element.dispatchEvent(new Event('input'));
  }

  setSelectValue(element: HTMLSelectElement, value: string): void {
    if (value === '') {
      element.value = '';
    } else {
      element.value = Array.from(element.options).find(opt =>
        opt.value.includes(`: ${value}`)
      ).value;
    }
    element.dispatchEvent(new Event('change'));
  }

  setMatSelectValue(element: HTMLElement, value: string): Promise<void> {
    element.click();
    this.fixture.detectChanges();

    const overlay = this.get(OverlayContainer).getContainerElement();

    const matOption = Array.from(
      overlay.querySelectorAll<HTMLElement>('.mat-option span.mat-option-text')
    ).find(opt => opt.textContent.includes(value));
    matOption.click();

    this.fixture.detectChanges();
    return this.fixture.whenStable();
  }

  query<E>(selector: string) {
    return <E>this.find(selector).nativeElement;
  }

  queryAll<E>(selector: string) {
    return <E[]>this.find(selector).map(el => el.nativeElement);
  }
}
