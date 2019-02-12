import 'jest-localstorage-mock';
import { getSessionData, setSessionData, clearSessionData, getCookie, clearCookie } from 'utils/session';

const cookieValue = "not-awesome";

describe('session manager', () => {

  beforeEach(function(){
    document.cookie = "awesomeCookie=" + cookieValue + "; domain=; path=/; expires=1434555910537";
  });

  it("should fetch cookie", function() {
      expect(getCookie("awesomeCookie")).toBe(cookieValue);
  });

  it("should clear cookie", function() {
    expect(clearCookie()).toBe();
  });
  
  it('should save to localStorage', () => {
    const KEY = 'foo',
      VALUE = 'bar';
    setSessionData(KEY, VALUE);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(KEY, VALUE);
    expect(localStorage.__STORE__[KEY]).toBe(VALUE);
    expect(Object.keys(localStorage.__STORE__).length).toBe(1);
  });

  it('should fetch from localStorage', () => {
    const KEY = 'foo';
    getSessionData(KEY);
    expect(localStorage.getItem).toHaveBeenLastCalledWith(KEY);
    expect(Object.keys(localStorage.__STORE__).length).toBe(1);
  });

  it('should have cleared the localStorage', () => {
    clearSessionData();
    expect(localStorage.clear).toHaveBeenCalledTimes(1);
    expect(localStorage.__STORE__).toEqual({}); 
    expect(localStorage.length).toBe(0);
  });

});