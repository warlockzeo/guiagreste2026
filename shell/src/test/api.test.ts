import { describe, it, expect } from 'vitest';
import { api } from '../utils/api';

describe('api', () => {
  it('should be configured with base URL', () => {
    expect(api.defaults.baseURL).toBeDefined();
  });

  it('should have Content-Type header', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });
});
