// __tests__/lazy_explain.test.ts
import {
  findNodeByPath,
isNodeExpanded,
collapseTreeByNode,
expandTreeByNode,
createInitialTree,
createTreeFromFile,
TreeNode,
} from '../app/explain-assertions/components/lazy_explain';
import {
Assertion,
EffectOfAssertionOnEliminationOrderSuffix as Eff,
assertion_ok_elimination_order_suffix,
} from '../lib/explain/prettyprint_assertions_and_pictures';

// Mock assertion_ok_elimination_order_suffix to control pruning
jest.mock('../lib/explain/prettyprint_assertions_and_pictures', () => {
  const original = jest.requireActual('../lib/explain/prettyprint_assertions_and_pictures');
  return {
    ...original,
    assertion_ok_elimination_order_suffix: jest.fn(() => original.EffectOfAssertionOnEliminationOrderSuffix.Ok),
  };
});

describe('findNodeByPath & isNodeExpanded', () => {
  const assertions: Assertion[] = [];
  const tree = createInitialTree(0, 3, assertions);
  tree.path = [0]; // root path

  it('findNodeByPath locates root', () => {
    const node = findNodeByPath(tree, [0]);
    expect(node).toBe(tree);
  });

  it('returns null when path not present', () => {
    expect(findNodeByPath(tree, [1,0])).toBeNull();
  });

  it('isNodeExpanded is false for fresh tree', () => {
    expect(isNodeExpanded(tree)).toBe(false);
  });
});

describe('expandTreeByNode & collapseTreeByNode', () => {
  const assertions: Assertion[] = [];
  let tree: TreeNode;

  beforeEach(() => {
    tree = createInitialTree(0, 4, assertions);
  });

  it('expands root to children', () => {
    const expanded = expandTreeByNode(tree, [0]);
    expect(isNodeExpanded(expanded)).toBe(true);
    const ids = expanded.children.map(c => c.id).sort();
    expect(ids).toEqual([1,2,3]);
  });

  it('throws on invalid path', () => {
    expect(() => expandTreeByNode(tree, [99])).toThrow();
  });

  it('collapseTreeByNode clears children', () => {
    let t = expandTreeByNode(tree, [0]);
    expect(isNodeExpanded(t)).toBe(true);
    t = collapseTreeByNode(t, [0]);
    expect(isNodeExpanded(t)).toBe(false);
  });
});

describe('createTreeFromFile', () => {
  const payload = {
    metadata: { candidates: ['A','B'] },
    solution: { Ok: { winner: 1, assertions: [ { assertion: { type:'NEB', winner:1, loser:0 } } ] } }
  };
  const json = JSON.stringify(payload);

  it('builds tree matching file content', () => {
    const tree = createTreeFromFile(json, 1);
    expect(tree.id).toBe(1);
    expect(tree.path).toEqual([1]);
    expect(tree.remaining).toEqual([0]);
    expect(tree.remainingAssertions.length).toBe(1);
  });

  it('throws on invalid JSON', () => {
    expect(() => createTreeFromFile('bad', 0)).toThrow('Invalid JSON file content');
  });

  it('throws when solution.Ok missing', () => {
    const bad = JSON.stringify({ metadata:{candidates:['A']} });
    expect(() => createTreeFromFile(bad, 0)).toThrow('Missing solution.Ok in file');
  });
});
