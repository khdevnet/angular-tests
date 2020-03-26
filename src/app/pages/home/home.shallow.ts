import { HomeState } from './store/home.state';
import { Shallow } from 'shallow-render';
import { NgxsModule } from '@ngxs/store';

export const mockHomeModule = <T>(shallow: Shallow<T>) => {
  const ngxs = NgxsModule.forRoot([ HomeState ]);

  return shallow
    .import(ngxs)
    .dontMock(ngxs);
};
