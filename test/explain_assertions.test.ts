import * as explainAssertions from '../lib/explain/explain_assertions';
import * as explainUtils from '../lib/explain/explain_utils';
import * as prettyPrint from '../lib/explain/prettyprint_assertions_and_pictures';

jest.mock('../lib/explain/explain_utils', () => ({
  ...jest.requireActual('../lib/explain/explain_utils'),
  add: jest.fn().mockReturnValue({ innerText: '' }),
  removeAllChildElements: jest.fn(),
  getWebJSON: jest.fn(),
}));
jest.mock('../lib/explain/prettyprint_assertions_and_pictures');

describe('explain_assertions', () => {
  const originalConsoleLog = console.log;

  beforeAll(() => {
    console.log = jest.fn();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <input id="Input" />
      <div id="Format"></div>
      <div id="Output"></div>
      <div id="Explanation"></div>
    `;
  });

  describe('explain_assertions', () => {
    it('should handle valid JSON input', () => {
      const inputElement = document.getElementById('Input') as HTMLInputElement;
      inputElement.value = JSON.stringify({ metadata: {}, solution: {} });

      explainAssertions.explain_assertions();

      expect(explainUtils.removeAllChildElements).toHaveBeenCalledTimes(3);
      expect(prettyPrint.describe_raire_result).toHaveBeenCalled();
      expect(explainUtils.add).toHaveBeenCalledWith(expect.any(HTMLElement), "p");
    });

    it('should handle invalid JSON input', () => {
      const inputElement = document.getElementById('Input') as HTMLInputElement;
      inputElement.value = 'invalid json';

      explainAssertions.explain_assertions();

      expect(explainUtils.add).toHaveBeenCalledWith(expect.any(HTMLElement), 'p', 'error');
    });
  });

  describe('interpret_input_formats', () => {
    it('should recognize raire-rs format', () => {
      const input = { metadata: {}, solution: {} };
      const result = explainAssertions.interpret_input_formats(input);
      expect(result).toEqual({ format: 'raire-rs', contests: [input] });
    });

    it('should recognize Michelle Blom RAIRE format', () => {
      const input = { parameters: {}, audits: [] };
      const result = explainAssertions.interpret_input_formats(input);
      expect(result?.format).toBe('Michelle Blom RAIRE');
    });

    it('should recognize ShangriLa log format', () => {
      const input = { seed: 123, contests: {} };
      const result = explainAssertions.interpret_input_formats(input);
      expect(result?.format).toBe('ShangriLa log');
    });

    it('should return null for unrecognized format', () => {
      const input = { unknownProperty: {} };
      const result = explainAssertions.interpret_input_formats(input);
      expect(result).toBeNull();
    });
  });

  describe('convert_from_Michelle_format', () => {
    it('should correctly convert Michelle format', () => {
      const input = {
        parameters: {},
        audits: [{
          contest: 'Test Contest',
          winner: 'Candidate A',
          eliminated: ['Candidate B', 'Candidate C'],
          assertions: []
        }]
      };
      const result = explainAssertions.convert_from_Michelle_format(input);
      expect(result).toHaveLength(1);
      expect(result?.[0].metadata.contest).toBe('Test Contest');
      expect(result?.[0].metadata.candidates).toEqual(['Candidate A', 'Candidate B', 'Candidate C']);
    });

    it('should return null for invalid input', () => {
      const input = { parameters: {} };
      const result = explainAssertions.convert_from_Michelle_format(input);
      expect(result).toBeNull();
    });
  });

  describe('parseMichelleAssertions', () => {
    it('should parse IRV_ELIMINATION assertions', () => {
      const assertions = [{
        assertion_type: 'IRV_ELIMINATION',
        winner: 'Candidate A',
        loser: 'Candidate B',
        already_eliminated: ['Candidate C']
      }];
      const candidates = ['Candidate A', 'Candidate B', 'Candidate C'];
      const result = explainAssertions.parseMichelleAssertions(assertions, candidates);
      expect(result).toHaveLength(1);
      expect(result?.[0].assertion.type).toBe('NEN');
    });

    it('should parse WINNER_ONLY assertions', () => {
      const assertions = [{
        assertion_type: 'WINNER_ONLY',
        winner: 'Candidate A',
        loser: 'Candidate B'
      }];
      const candidates = ['Candidate A', 'Candidate B', 'Candidate C'];
      const result = explainAssertions.parseMichelleAssertions(assertions, candidates);
      expect(result).toHaveLength(1);
      expect(result?.[0].assertion.type).toBe('NEB');
    });

    it('should return null for invalid assertion type', () => {
      const assertions = [{
        assertion_type: 'INVALID_TYPE',
        winner: 'Candidate A',
        loser: 'Candidate B'
      }];
      const candidates = ['Candidate A', 'Candidate B', 'Candidate C'];
      const result = explainAssertions.parseMichelleAssertions(assertions, candidates);
      expect(result).toBeNull();
    });
  });

  describe('convert_from_ShangriLa_log_format', () => {
    it('should correctly convert ShangriLa log format', () => {
      const input = {
        seed: 123,
        contests: {
          'Test Contest': {
            n_winners: 1,
            reported_winners: ['Candidate A'],
            choice_function: 'IRV',
            candidates: ['Candidate A', 'Candidate B', 'Candidate C'],
            assertion_json: []
          }
        }
      };
      const result = explainAssertions.convert_from_ShangriLa_log_format(input);
      expect(result).toHaveLength(1);
      expect(result?.[0].metadata.contest).toBe('Test Contest');
      expect(result?.[0].metadata.candidates).toEqual(['Candidate A', 'Candidate B', 'Candidate C']);
    });

    it('should return null for invalid input', () => {
      const input = { seed: 123 };
      const result = explainAssertions.convert_from_ShangriLa_log_format(input);
      expect(result).toBeNull();
    });
  });
});