"use strict";

interface Contest {
  metadata: {
    contest: string;
    candidates: string[];
  };
  solution: {
    Ok: {
      assertions: any[];
      winner: number;
      num_candidates: number;
    };
  };
}

interface ContestsResult {
  format: string;
  contests: Contest[];
}

export function interpret_input_formats(input: any): ContestsResult | null {
  if (input.hasOwnProperty("metadata") && input.hasOwnProperty("solution")) {
    return { format: "raire-rs", contests: [input] };
  } else {
    const Michelle = convert_from_Michelle_format(input);
    if (Michelle) return { format: "Michelle Blom RAIRE", contests: Michelle };
    const ShangriLa = convert_from_ShangriLa_log_format(input);
    if (ShangriLa) return { format: "ShangriLa log", contests: ShangriLa };
    return null;
  }
}

export function convert_from_Michelle_format(input: any): Contest[] | null {
  if (!input.hasOwnProperty("parameters")) return null;
  if (!Array.isArray(input.audits)) return null;

  const contests: Contest[] = [];

  for (const audit of input.audits) {
    const candidates = [audit.winner].concat(audit.eliminated);
    const metadata = {
      contest: audit.contest || "Unnamed contest",
      candidates: candidates,
    };
    const assertions = parseMichelleAssertions(audit.assertions, candidates);
    if (assertions === null) return null;

    contests.push({
      metadata: metadata,
      solution: {
        Ok: {
          assertions: assertions,
          winner: 0,
          num_candidates: candidates.length,
        },
      },
    });
  }

  return contests;
}

export function parseMichelleAssertions(
  audit_assertions: any[],
  candidates: string[],
): any[] | null {
  const candidate_id_of_name: { [key: string]: number } = {}; // Reverse map from candidate name to index
  const num_candidates = candidates.length;

  for (let i = 0; i < num_candidates; i++) {
    candidate_id_of_name[candidates[i]] = i;
  }

  const assertions: any[] = [];

  for (const assertion of audit_assertions) {
    const out: any = {
      winner: candidate_id_of_name[assertion.winner],
      loser: candidate_id_of_name[assertion.loser],
    };

    if (assertion.assertion_type === "IRV_ELIMINATION") {
      out.type = "NEN";
      out.continuing = [];
      for (let i = 0; i < num_candidates; i++) {
        if (!assertion.already_eliminated.includes(candidates[i])) {
          out.continuing.push(i);
        }
      }
    } else if (assertion.assertion_type === "WINNER_ONLY") {
      out.type = "NEB";
    } else {
      return null;
    }
    assertions.push({ assertion: out });
  }
  return assertions;
}

export function convert_from_ShangriLa_log_format(
  input: any,
): Contest[] | null {
  if (!input.hasOwnProperty("seed")) return null;
  if (!input.hasOwnProperty("contests")) return null;

  const contests: Contest[] = [];

  for (const contest_id of Object.getOwnPropertyNames(input.contests)) {
    const contest = input.contests[contest_id];
    if (contest.n_winners !== 1) continue;
    if (!Array.isArray(contest.reported_winners)) continue;
    if (contest.reported_winners.length !== 1) continue;
    if (contest.choice_function !== "IRV") continue;

    const winner = contest.candidates.indexOf(contest.reported_winners[0]);
    if (winner === -1) continue;

    const assertions = parseMichelleAssertions(
      contest.assertion_json,
      contest.candidates,
    );
    if (assertions === null) return null;

    contests.push({
      metadata: { contest: contest_id, candidates: contest.candidates },
      solution: {
        Ok: {
          assertions: assertions,
          winner: winner,
          num_candidates: contest.candidates.length,
        },
      },
    });
  }

  return contests;
}
