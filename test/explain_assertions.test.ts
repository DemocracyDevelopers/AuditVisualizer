import { explain_assertions, interpret_input_formats, convert_from_Michelle_format, convert_from_ShangriLa_log_format } from '../lib/explain/explain_assertions';

// Mock DOM elements for explain_assertions to manipulate
const mockInputElement = {
value: '',
addEventListener: jest.fn(),
} as unknown as HTMLInputElement;

const mockOutputElement = document.createElement('div');
const mockExplanationElement = document.createElement('div');
const mockFormatElement = document.createElement('div');

// Mocking document.getElementById
jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
  if (id === 'Input') return mockInputElement;
  if (id === 'Output') return mockOutputElement;
  if (id === 'Explanation') return mockExplanationElement;
  if (id === 'Format') return mockFormatElement;
  return null;
});

// Mock utility functions
jest.mock('../lib/explain/explain_utils', () => ({
  add: jest.fn((parent, tag, className) => {
    const el = document.createElement(tag);
    if (className) el.classList.add(className);
    parent.appendChild(el);
    return el;
  }),
  getWebJSON: jest.fn(),
  removeAllChildElements: jest.fn((parent) => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }),
}));

// 创建假输入数据
const validRaireInput = {
  metadata: {
    contest: "Election Contest",
    candidates: ["Alice", "Bob", "Charlie"],
  },
  solution: {
    Ok: {
      assertions: [],
      winner: 1,
      num_candidates: 3,
    },
  },
};

const invalidInput = {
  contest: "Election Contest",
  // 缺少必要的 "solution" 字段
};

describe('explain_assertions', () => {
  beforeEach(() => {
    // 重置 mock 元素内容
    mockInputElement.value = JSON.stringify(validRaireInput);
    mockOutputElement.innerHTML = '';
    mockExplanationElement.innerHTML = '';
    mockFormatElement.innerHTML = '';
  });

  test('should correctly parse RAIRE input format', () => {
    const result = interpret_input_formats(validRaireInput);
    expect(result).not.toBeNull();
    expect(result?.format).toBe("raire-rs");
  });

  test('should return null for invalid input format', () => {
    const result = interpret_input_formats(invalidInput);
    expect(result).toBeNull();
  });

  test('should handle Michelle format', () => {
    const michelleInput = {
      parameters: "test",
      audits: [
        {
          contest: "Test Contest",
          winner: "Alice",
          eliminated: ["Bob", "Charlie"],
          assertions: [
            { winner: "Alice", loser: "Bob", assertion_type: "IRV_ELIMINATION", already_eliminated: [] }
          ]
        }
      ]
    };
    const result = convert_from_Michelle_format(michelleInput);
    expect(result).not.toBeNull();
    expect(result?.[0].metadata.contest).toBe("Test Contest");
  });

  test('should return null for invalid Michelle format', () => {
    const invalidMichelleInput = {
      parameters: "test",
      // 缺少 audits
    };
    const result = convert_from_Michelle_format(invalidMichelleInput);
    expect(result).toBeNull();
  });

  test('should handle ShangriLa format', () => {
    const shangriLaInput = {
      seed: 1234,
      contests: {
        "Contest1": {
          n_winners: 1,
          reported_winners: ["Alice"],
          candidates: ["Alice", "Bob", "Charlie"],
          choice_function: "IRV",
          assertion_json: [
            { winner: "Alice", loser: "Bob", assertion_type: "IRV_ELIMINATION", already_eliminated: [] }
          ]
        }
      }
    };
    const result = convert_from_ShangriLa_log_format(shangriLaInput);
    expect(result).not.toBeNull();
    expect(result?.[0].metadata.contest).toBe("Contest1");
  });

  test('should return null for invalid ShangriLa format', () => {
    const invalidShangriLaInput = {
      seed: 1234,
      // contests 不存在
    };
    const result = convert_from_ShangriLa_log_format(invalidShangriLaInput);
    expect(result).toBeNull();
  });
});
