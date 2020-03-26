# Angular Testing Best Practices
* [Which kind of test? Isolated, shallow or integration Test](https://www.freecodecamp.org/news/the-front-end-test-pyramid-rethink-your-testing-3b343c2bca51/).
* [Can I use Mocks, Stubs or Spies? Dependencies should be covered by their own tests. Using them can boost your tests without losing efficacy.](https://blog.pragmatists.com/test-doubles-fakes-mocks-and-stubs-1a7491dfa3da)
* Sync or Async? Does your test makes asynchronous calls? Uses XHR, Promises, Observables, etc. Is the Component using TemplateUrl or styleUrls or inline? Make sure you are using the corresponding APIs.
* Use code coverage in CI
* [Use Presentational and Container Components pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
* Create small reusable components this will help simplify tests.
* Configure reusable store, service, component etc.. mocks globally
* Configure reusable store, service, component etc.. mocks per Module
* Don't create Test data object in each Test, create emptyObject and then extends it with spread operators ({...emptyTestData, name: 'john'})
* When you write shallow tests create TestComponent(page) class which will contains common logic with interaction with page elements
* Access the DOM with debugElement instead of directly calling nativeElement. This is because debugElement provides an abstraction for the underlying runtime environment. This will reduce unnecessary errors.
* Prefer By.css instead of queryselector if you are running the app on the server as well. This is because the queryselector works only in the browser. if we are running the app on the server, this will fail. But, we have to unwrap the result to get the actual value.
* Use Jasmine Spyon to validate if Service, Component etc.. methods are called, preffer to use .toHaveBeenCalledWith if arguments passed to method

