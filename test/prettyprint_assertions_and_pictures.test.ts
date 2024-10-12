import * as prettyPrint from '../lib/explain/prettyprint_assertions_and_pictures';

describe('prettyprint_assertions_and_pictures', () => {
  describe('assertion_ok_elimination_order_suffix', () => {
    describe('NEN assertions', () => {
      it('should return Contradiction when the winner is eliminated first', () => {
        const assertion: prettyPrint.Assertion = {
          type: 'NEN',
          winner: 0,
          loser: 1,
          continuing: [0, 1, 2],
        };
        const eliminationOrderSuffix = [0, 1, 2];

        const result = prettyPrint.assertion_ok_elimination_order_suffix(assertion, eliminationOrderSuffix);

        expect(result).toBe(prettyPrint.EffectOfAssertionOnEliminationOrderSuffix.Contradiction);
      });

      it('should return Ok when the winner is not eliminated first', () => {
        const assertion: prettyPrint.Assertion = {
          type: 'NEN',
          winner: 0,
          loser: 1,
          continuing: [0, 1, 2],
        };
        const eliminationOrderSuffix = [1, 2, 0];

        const result = prettyPrint.assertion_ok_elimination_order_suffix(assertion, eliminationOrderSuffix);

        expect(result).toBe(prettyPrint.EffectOfAssertionOnEliminationOrderSuffix.Ok);
      });

      it('should return NeedsMoreDetail when the elimination order is incomplete', () => {
        const assertion: prettyPrint.Assertion = {
          type: 'NEN',
          winner: 0,
          loser: 1,
          continuing: [0, 1, 2],
        };
        const eliminationOrderSuffix = [2];

        const result = prettyPrint.assertion_ok_elimination_order_suffix(assertion, eliminationOrderSuffix);

        expect(result).toBe(prettyPrint.EffectOfAssertionOnEliminationOrderSuffix.NeedsMoreDetail);
      });
    });

    describe('NEB assertions', () => {
      it('should return Ok when the winner is ranked before the loser', () => {
        const assertion: prettyPrint.Assertion = {
          type: 'NEB',
          winner: 0,
          loser: 1,
        };
        const eliminationOrderSuffix = [2, 1, 0];

        const result = prettyPrint.assertion_ok_elimination_order_suffix(assertion, eliminationOrderSuffix);

        expect(result).toBe(prettyPrint.EffectOfAssertionOnEliminationOrderSuffix.Ok);
      });

      it('should return Contradiction when the loser is ranked before the winner', () => {
        const assertion: prettyPrint.Assertion = {
          type: 'NEB',
          winner: 0,
          loser: 1,
        };
        const eliminationOrderSuffix = [2, 0, 1];

        const result = prettyPrint.assertion_ok_elimination_order_suffix(assertion, eliminationOrderSuffix);

        expect(result).toBe(prettyPrint.EffectOfAssertionOnEliminationOrderSuffix.Contradiction);
      });

      it('should return NeedsMoreDetail when neither winner nor loser is in the elimination order', () => {
        const assertion: prettyPrint.Assertion = {
          type: 'NEB',
          winner: 0,
          loser: 1,
        };
        const eliminationOrderSuffix = [2];

        const result = prettyPrint.assertion_ok_elimination_order_suffix(assertion, eliminationOrderSuffix);

        expect(result).toBe(prettyPrint.EffectOfAssertionOnEliminationOrderSuffix.NeedsMoreDetail);
      });
    });
  });

  describe('assertion_allowed_suffixes', () => {
    it('should return an empty array for contradicted suffix when not just getting enough info', () => {
      const assertion: prettyPrint.Assertion = {
        type: 'NEN',
        winner: 0,
        loser: 1,
        continuing: [0, 1, 2],
      };
      const eliminationOrderSuffix = [0, 1, 2];
      const numCandidates = 3;

      const result = prettyPrint.assertion_allowed_suffixes(assertion, eliminationOrderSuffix, numCandidates, false);

      expect(result).toEqual([]);
    });

    it('should return the original suffix for contradicted suffix when just getting enough info', () => {
      const assertion: prettyPrint.Assertion = {
        type: 'NEN',
        winner: 0,
        loser: 1,
        continuing: [0, 1, 2],
      };
      const eliminationOrderSuffix = [0, 1, 2];
      const numCandidates = 3;

      const result = prettyPrint.assertion_allowed_suffixes(assertion, eliminationOrderSuffix, numCandidates, true);

      expect(result).toEqual([eliminationOrderSuffix]);
    });

    it('should return extended suffixes when more information is needed', () => {
      const assertion: prettyPrint.Assertion = {
        type: 'NEN',
        winner: 0,
        loser: 1,
        continuing: [0, 1, 2],
      };
      const eliminationOrderSuffix = [2];
      const numCandidates = 3;

      const result = prettyPrint.assertion_allowed_suffixes(assertion, eliminationOrderSuffix, numCandidates, false);

      expect(result).toEqual([[0, 2]]);
    });
  });

  describe('explain', () => {
    it('should generate correct explanations for given assertions', () => {
      const assertions: prettyPrint.Assertion[] = [
        { type: 'NEN', winner: 0, loser: 1, continuing: [0, 1, 2] },
        { type: 'NEB', winner: 2, loser: 1 },
      ];
      const candidateNames = ['Alice', 'Bob', 'Charlie'];

      const result = prettyPrint.explain(assertions, candidateNames, false, false, 0);

      expect(result).toHaveLength(3);
      expect(result[0].winnerInfo.name).toBe('Alice');
      expect(result[1].winnerInfo.name).toBe('Bob');
      expect(result[2].winnerInfo.name).toBe('Charlie');
      expect(result[0].data.type).toBe('step-by-step');
      expect(result[0].data.process).toHaveLength(3);
    });

    it('should not include winner explanation when hiding the winner', () => {
      const assertions: prettyPrint.Assertion[] = [
        { type: 'NEN', winner: 0, loser: 1, continuing: [0, 1, 2] },
        { type: 'NEB', winner: 2, loser: 1 },
      ];
      const candidateNames = ['Alice', 'Bob', 'Charlie'];

      const result = prettyPrint.explain(assertions, candidateNames, false, true, 0);

      expect(result).toHaveLength(2);
      expect(result[0].winnerInfo.name).toBe('Bob');
      expect(result[1].winnerInfo.name).toBe('Charlie');
    });
  });

  describe('candidate_class', () => {
    it('should return correct candidate class', () => {
      const assertion: prettyPrint.Assertion = {
        type: 'NEN',
        winner: 0,
        loser: 1,
        continuing: [0, 1, 2],
      };

      expect(prettyPrint.candidate_class(0, assertion)).toBe('winner');
      expect(prettyPrint.candidate_class(1, assertion)).toBe('loser');
      expect(prettyPrint.candidate_class(2, assertion)).toBe('continuing');
      expect(prettyPrint.candidate_class(3, assertion)).toBe('eliminated');
    });

    it('should return no_assertion when there is no assertion', () => {
      expect(prettyPrint.candidate_class(0, null)).toBe('no_assertion');
    });
  });

  describe('assertion_description', () => {
    it('should generate correct NEN assertion description', () => {
      const assertion: prettyPrint.Assertion = {
        type: 'NEN',
        winner: 0,
        loser: 1,
        continuing: [0, 1, 2],
      };
      const candidateNames = ['Alice', 'Bob', 'Charlie'];

      const description = prettyPrint.assertion_description(assertion, candidateNames);

      expect(description).toBe('Alice beats Bob if only {Alice,Bob,Charlie} remain');
    });

    it('should generate correct NEB assertion description', () => {
      const assertion: prettyPrint.Assertion = {
        type: 'NEB',
        winner: 0,
        loser: 1,
      };
      const candidateNames = ['Alice', 'Bob', 'Charlie'];

      const description = prettyPrint.assertion_description(assertion, candidateNames);

      expect(description).toBe('Alice beats Bob always');
    });
  });

  describe('all_elimination_orders', () => {
    it('should return all possible elimination orders', () => {
      const result = prettyPrint.all_elimination_orders(3);
      expect(result).toEqual(expect.arrayContaining([
        [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]
      ]));
      expect(result.length).toBe(6);
    });
  });

  describe('all_elimination_order_suffixes', () => {
    it('should return all possible single-candidate elimination order suffixes', () => {
      const result = prettyPrint.all_elimination_order_suffixes(3);
      expect(result).toEqual([[0], [1], [2]]);
    });
  });

  describe('factorial', () => {
    it('should correctly calculate factorial', () => {
      expect(prettyPrint.factorial(0)).toBe(1);
      expect(prettyPrint.factorial(1)).toBe(1);
      expect(prettyPrint.factorial(5)).toBe(120);
    });
  });
});