import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BraveSearchClient } from '../../src/search/brave-client.js';

describe('BraveSearchClient', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn(async () =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          web: {
            results: [
              {
                title: 'Example',
                url: 'https://example.com',
                description: 'An example',
                age: '1d',
              },
            ],
          },
        }),
      } as Response),
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('maps Brave web results', async () => {
    const client = new BraveSearchClient('test-key');
    const results = await client.search('stellar', { count: 3 });
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Example');
    expect(global.fetch).toHaveBeenCalled();
  });
});
