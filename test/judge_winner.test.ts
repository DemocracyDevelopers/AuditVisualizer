// test/judge_winner.test.ts
import { verifyWinnerByDP } from '../lib/explain/judge_winner';

describe('verifyWinnerByDP', () => {
  it('returns null if reported winner not in candidates', () => {
    expect(verifyWinnerByDP([], ['A','B'], 'C')).toBeNull();
  });

  it('returns empty path when only one candidate', () => {
    expect(verifyWinnerByDP([], ['A'], 'A')).toEqual({ winner: 'A', path: [] });
  });

  it('infers elimination with a simple NEN assertion', () => {
    const assertions = [{ high: 'A', low: 'B', context: ['A','B'] }];
    expect(verifyWinnerByDP(assertions, ['A','B'], 'A')).toEqual({
      winner: 'A',
      path: ['B'],
    });
  });

  it('returns null when assertions cannot guarantee winner', () => {
    const assertions = [{ high: 'A', low: 'B', context: [] }];
    expect(verifyWinnerByDP(assertions, ['A','B'], 'A')).toBeNull();
  });
});
