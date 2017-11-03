import { AnalogPage } from './app.po';

describe('analog App', () => {
  let page: AnalogPage;

  beforeEach(() => {
    page = new AnalogPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
