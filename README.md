# Angular Testing Best Practices
* [Which kind of test? Isolated, shallow or integration Test](https://www.freecodecamp.org/news/the-front-end-test-pyramid-rethink-your-testing-3b343c2bca51/).
* [Can I use Mocks, Stubs or Spies? Dependencies should be covered by their own tests. Using them can boost your tests without losing efficacy.](https://blog.pragmatists.com/test-doubles-fakes-mocks-and-stubs-1a7491dfa3da)
* Sync or Async? Does your test makes asynchronous calls? Uses XHR, Promises, Observables, etc. Is the Component using TemplateUrl or styleUrls or inline? Make sure you are using the corresponding APIs.
* Use code coverage in CI
* [Use Presentational and Container Components pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
* Create small reusable components this will help simplify tests, because you render only html tags for them.
* Use [shallow render](https://getsaf.github.io/shallow-render/#why-not-just-use-testbed) for angular shallow component tests 
* [Configure mocks globally for store, service, component etc..](https://github.com/khdevnet/angular-tests/blob/master/src/test.ts)
* [Configure mocks per Module for store, service, component etc..](https://github.com/khdevnet/angular-tests/blob/master/src/app/pages/home/home.shallow.ts)
* Don't create Test data object in each Test, create emptyObject and then extends it with spread operators ({...emptyTestData, name: 'john'})
* [When you write shallow tests create TestComponent(page) class which will contains common logic with interaction with page elements](https://github.com/khdevnet/angular-tests/blob/master/src/app/core/test/shallow-test-component.ts)
* Access the DOM with debugElement instead of directly calling nativeElement. This is because debugElement provides an abstraction for the underlying runtime environment. This will reduce unnecessary errors.
* Prefer By.css instead of queryselector if you are running the app on the server as well. This is because the queryselector works only in the browser. if we are running the app on the server, this will fail. But, we have to unwrap the result to get the actual value.
* Use Jasmine Spyon to validate if Service, Component etc.. methods are called, preffer to use .toHaveBeenCalledWith if arguments passed to method
* [Javascript query selectors](https://www.javascripttutorial.net/javascript-dom/javascript-queryselector/)

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
}
```

### Use .mock(UserService, { advancedSearch: () => of([]) }) in beforeEach to mock service for all tests

```
describe('SearchAndInfoComponent', () => {
  let shallow: Shallow<SearchAndInfoComponent>;

  beforeEach(async(() => {
    shallow = configureAdministrationModule(new Shallow(SearchAndInfoComponent, AdministrationModule))
      .mock(UserService, { advancedSearch: () => of([]) })
  }));
  ....
}); 
```

### Use .mock(UserService, { advancedSearch: () => of([]) }) in test to mock service for specific test

```
it('should display empty search result message', async () => {
  const page = await createTestPage(shallow
    .mock(UserService, {
      advancedSearch: () => of(<SearchItem[]>[])
    }));

 await page.search(<SearchCriteria>{});

 expect(page.userList.el).toHaveFound(0);
 expect(page.emptySearch).toHaveFoundOne();
});
```

### Don't create Test data object in each Test, create emptyObject and then extends it with spread operators ({...emptyTestData, name: 'john'})

```
const emptyProfile = <ProfileView>{
  tecComId: '',
  logoPath: '',
};


it('should display add partner button and profile title', async () => {
  const page = await shallow.render({
    bind: {
      showDefaultTitle: false,
      isAlreadyFriend: false,
      profileView: { ...emptyProfile, Id: '1234567890', general: { name: 'test' } }
    }
  });

  expect(page.find('[data-test-id="name"]').nativeElement.textContent.trim()).toBe('test');
});
```

### Use Jasmine spyOn to validate if Service, Component etc.. methods are called
### Use Jasmine spyOn(page.instance, 'search').and.callThrough(); to validate if real method implementation called
### Preffer to use .toHaveBeenCalledWith when you test method called with arguments passed to it, combine it with spread operator to avoid comparing objects by reference .toHaveBeenCalledWith({ ...searchCriteria})

```
it('should display partners list table if search successfully', async () => {
  const page = await createTestPage(shallow
    .mock(PartnerService, {
      advancedSearch: () => of([<PartnerSearchItem>{}])
    }));
  spyOn(page.instance, 'search').and.callThrough();
  spyOn(page.get(Store), 'dispatch').and.callThrough();

  const searchCriteria = <PartnerSearchCriteria>{ name: 'test' };
  await page.searchForMembers(searchCriteria);

  expect(page.partnersList.el).toHaveFoundOne();
  expect(page.instance.search).toHaveBeenCalledWith(searchCriteria);
  expect(page.get(UserService).advancedSearch).toHaveBeenCalledWith(searchCriteria);
  expect(page.get(Store).dispatch).toHaveBeenCalledWith([new AdvancedSearch(searchCriteria)]);
});
```

### Use  instance.addPartner = jasmine.createSpyObj('EventEmitter', ['emit']); to mock and test EventEmitter has been called
```
it('should add user on button click', async () => {
  const { find, instance, get} = await shallow
    .mock(AppInsightsService, { trackEvent(name: string, properties?: any, measurements?: any): void {} })
    .render({
    bind: {
      isAlreadyFriend: false,
      profileView: { ...emptyProfile, tecComId: '1234567890' }
    }
  });
  instance.addUser = jasmine.createSpyObj('EventEmitter', ['emit']);

  find('[data-test-id="addUser"]').nativeElement.click();
  expect(instance.addUser.emit).toHaveBeenCalledWith('1234567890');
  expect(get(AppInsightsService).trackEvent).toHaveBeenCalledWith('mpv-add-user-btn-clicked');
});
```
