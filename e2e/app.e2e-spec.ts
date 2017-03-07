import { Router4Page } from './app.po';

describe('router4 App', function() {
  let page: Router4Page;

  beforeEach(() => {
    page = new Router4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
