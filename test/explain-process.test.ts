// __tests__/explain-process.test.ts
import { getCandidateNumber, getAssertions } from '../app/explain-assertions/components/explain-process';

describe('getCandidateNumber', () => {
  it('returns correct count for valid JSON', () => {
    const json = JSON.stringify({ metadata: { candidates: ['X','Y','Z'] } });
    expect(getCandidateNumber(json)).toBe(3);
  });

  it('returns -1 for invalid JSON', () => {
    expect(getCandidateNumber('not json')).toBe(-1);
  });

  it('returns -1 when metadata.candidates missing', () => {
    const json = JSON.stringify({ metadata: {} });
    expect(getCandidateNumber(json)).toBe(-1);
  });
});

describe('getAssertions', () => {
  it('extracts assertions array on valid input', () => {
    const arr = [1,2,3];
    const json = JSON.stringify({ solution: { Ok: { assertions: arr } } });
    expect(getAssertions(json)).toEqual(arr);
  });

  it('returns empty array for invalid JSON', () => {
    expect(getAssertions('oops')).toEqual([]);
  });

  it('returns empty array when assertions missing', () => {
    const json = JSON.stringify({ solution: { Ok: {} } });
    expect(getAssertions(json)).toEqual([]);
  });
});
