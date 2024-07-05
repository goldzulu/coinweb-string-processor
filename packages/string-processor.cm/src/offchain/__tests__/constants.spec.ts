import { DEFAULT_HANDLER_NAME, REVERSER, TOGGLE_CASER, contractId } from '../constants';

describe('Constants', () => {
  it('should have the correct values', () => {
    expect(DEFAULT_HANDLER_NAME).toEqual('DEFAULT');
    expect(REVERSER).toEqual('REVERSER');
    expect(TOGGLE_CASER).toEqual('TOGGLE-CASER');
    expect(contractId).toBeDefined();
  });
});
