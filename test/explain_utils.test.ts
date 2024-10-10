import * as explainUtils from '../lib/explain/explain_utils';

describe('explain_utils', () => {
  describe('getWebJSON', () => {
    let xhrMock: {open: jest.Mock, send: jest.Mock, setRequestHeader: jest.Mock};

    beforeEach(() => {
      xhrMock = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn()
      };
      (global as any).XMLHttpRequest = jest.fn(() => xhrMock);
    });

    it('should make a GET request', () => {
      const successCallback = jest.fn();
      explainUtils.getWebJSON('http://example.com', successCallback);

      expect(xhrMock.open).toHaveBeenCalledWith('GET', 'http://example.com', true);
      expect(xhrMock.send).toHaveBeenCalled();
    });

    it('should make a POST request', () => {
      const successCallback = jest.fn();
      explainUtils.getWebJSON('http://example.com', successCallback, undefined, 'message');

      expect(xhrMock.open).toHaveBeenCalledWith('POST', 'http://example.com', true);
      expect(xhrMock.send).toHaveBeenCalledWith('message');
    });

    it('should set content type if provided', () => {
      const successCallback = jest.fn();
      explainUtils.getWebJSON('http://example.com', successCallback, undefined, 'message', 'application/json');

      expect(xhrMock.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    });
  });

  describe('getURL', () => {
    it('should create a correct URL with query parameters', () => {
      const url = explainUtils.getURL('http://example.com', { foo: 'bar', baz: 42 });
      expect(url).toBe('http://example.com?foo=bar&baz=42');
    });

    it('should handle empty query data', () => {
      const url = explainUtils.getURL('http://example.com', {});
      expect(url).toBe('http://example.com');
    });

    it('should encode query parameters', () => {
      const url = explainUtils.getURL('http://example.com', { 'foo bar': 'baz qux' });
      expect(url).toBe('http://example.com?foo%20bar=baz%20qux');
    });
  });
});