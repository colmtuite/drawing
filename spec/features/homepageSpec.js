describe('Homepage', function() {
  beforeEach(function() {
    browser.get('http://localhost:9000/');
  });

  it('should have a heading', function() {
    expect(element(by.css('h1')).getText()).toEqual('Homepage');
  });
});
