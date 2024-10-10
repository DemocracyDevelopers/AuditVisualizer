import { interpret_input_formats, convert_from_Michelle_format, parseMichelleAssertions } from '../lib/explain/explain_assertions';

describe('interpret_input_formats', () => {
  it('returns format information for raire-rs input', () => {
    const input = { metadata: {}, solution: {} };
    const expected = { format: "raire-rs", contests: [input] };
    expect(interpret_input_formats(input)).toEqual(expected);
  });

  it('returns null for unrecognized input', () => {
    const input = { unknown: {} };
    expect(interpret_input_formats(input)).toBeNull();
  });
});

describe('convert_from_Michelle_format', () => {
  it('returns null if input lacks parameters', () => {
    const input = { audits: [] };
    expect(convert_from_Michelle_format(input)).toBeNull();
  });

  it('converts valid Michelle format input', () => {
    const input = { parameters: {}, audits: [{ winner: 'Alice', eliminated: ['Bob'], contest: 'Test Contest', assertions: [] }] };
    const expectedOutput = [{
      metadata: { contest: 'Test Contest', candidates: ['Alice', 'Bob'] },
      solution: { Ok: { assertions: [], winner: 0, num_candidates: 2 } }
    }];
    expect(convert_from_Michelle_format(input)).toEqual(expectedOutput);
  });
});

describe('parseMichelleAssertions', () => {
  it('parses assertions correctly', () => {
    const assertions = [{ winner: 'Alice', loser: 'Bob', assertion_type: 'IRV_ELIMINATION', already_eliminated: [] }];
    const candidates = ['Alice', 'Bob'];
    const expected = [{ assertion: { winner: 0, loser: 1, type: 'NEN', continuing: [0, 1] } }];
    expect(parseMichelleAssertions(assertions, candidates)).toEqual(expected);
  });

  it('returns null for invalid assertion types', () => {
    const assertions = [{ winner: 'Alice', loser: 'Bob', assertion_type: 'UNKNOWN' }];
    const candidates = ['Alice', 'Bob'];
    expect(parseMichelleAssertions(assertions, candidates)).toBeNull();
  });
});
