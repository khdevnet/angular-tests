# Angular Testing Best Practices
* [Which kind of test? Isolated, shallow or integration Test](https://www.freecodecamp.org/news/the-front-end-test-pyramid-rethink-your-testing-3b343c2bca51/).
* [Can I use Mocks, Stubs or Spies? Dependencies should be covered by their own tests. Using them can boost your tests without losing efficacy.](https://blog.pragmatists.com/test-doubles-fakes-mocks-and-stubs-1a7491dfa3da)
* Sync or Async? Does your test makes asynchronous calls? Uses XHR, Promises, Observables, etc. Is the Component using TemplateUrl or styleUrls or inline? Make sure you are using the corresponding APIs.
* Use code coverage in CI
* [Use Presentational and Container Components pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
* Create small reusable components this will help simplify tests.
* Use [shallow render](https://getsaf.github.io/shallow-render/#why-not-just-use-testbed) for angular shallow component tests 
* [Configure mocks globally for store, service, component etc..](https://github.com/khdevnet/angular-tests/blob/master/src/test.ts)
* [Configure mocks per Module for store, service, component etc..](https://github.com/khdevnet/angular-tests/blob/master/src/app/pages/home/home.shallow.ts)
* Don't create Test data object in each Test, create emptyObject and then extends it with spread operators ({...emptyTestData, name: 'john'})
* [When you write shallow tests create TestComponent(page) class which will contains common logic with interaction with page elements](https://github.com/khdevnet/angular-tests/blob/master/src/app/core/test/shallow-test-component.ts)
* Access the DOM with debugElement instead of directly calling nativeElement. This is because debugElement provides an abstraction for the underlying runtime environment. This will reduce unnecessary errors.
* Prefer By.css instead of queryselector if you are running the app on the server as well. This is because the queryselector works only in the browser. if we are running the app on the server, this will fail. But, we have to unwrap the result to get the actual value.
* Use Jasmine Spyon to validate if Service, Component etc.. methods are called, preffer to use .toHaveBeenCalledWith if arguments passed to method

### Configure mocks globally for store, service, component etc.. [test.ts]
```js
Shallow
.alwaysReplaceModule(BrowserAnimationsModule, NoopAnimationsModule);
```

###  Configure mocks per Module for store, service, component etc.. [home.shallow.ts]
```js
import { HomeState } from './store/home.state';
import { Shallow } from 'shallow-render';
import { NgxsModule } from '@ngxs/store';

export const mockHomeModule = <T>(shallow: Shallow<T>) => {
  const ngxs = NgxsModule.forRoot([ HomeState ]);

  return shallow
    .import(ngxs)
    .dontMock(ngxs);
};
```

### When you write shallow tests create TestComponent(page) class which will contains common logic with interaction with page elements [shallow-test-component.ts]
```js
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

  query<E>(selector: string) {
    return <E>this.find(selector).nativeElement;
  }

  queryAll<E>(selector: string) {
    return <E[]>this.find(selector).map(el => el.nativeElement);
  }
}
```

