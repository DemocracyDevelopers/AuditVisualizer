"use strict";
import { add, getWebJSON, removeAllChildElements } from "./explain_utils";
import { describe_raire_result } from "./prettyprint_assertions_and_pictures";
// Main logic entry point
export function explain_assertions(): void {
  const inputElement = document.getElementById("Input") as HTMLInputElement;
  const input = inputElement.value;

  console.log("原始输入:", input); // Log raw input

  const format_div = document.getElementById("Format") as HTMLElement;
  const output_div = document.getElementById("Output") as HTMLElement;
  const explanation_div = document.getElementById("Explanation") as HTMLElement;

  removeAllChildElements(format_div);
  removeAllChildElements(output_div);
  removeAllChildElements(explanation_div);

  let parsed_input: any = null;

  try {
    // Use JSON.parse() to convert string into object and store in parsed_input
    parsed_input = JSON.parse(input);
    console.log("parsed解析之后的输入:", parsed_input);
  } catch (e) {
    add(output_div, "p", "error").innerText = "Error: input is not JSON";
    return;
  }

  // interpret_input_formats() detects format: raire, Michelle Blom RAIRE, or ShangriLa log
  const contests = interpret_input_formats(parsed_input);

  console.log("Contests打印解释后的格式:", contests); // Log detected format and contest structure

  if (contests && contests.format) {
    add(format_div, "p").innerText = "Format: " + contests.format;
    for (const contest of contests.contests) {
      // Business logic continues: describe_raire_result() from prettyprint_assertions_and_pictures.js
      describe_raire_result(output_div, explanation_div, contest);
    }
  } else {
    add(output_div, "p", "error").innerText =
      "Error: could not establish input format";
  }
}

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

export function load_example(url: string): void {
  function failure(message: string) {
    alert("Could not load " + url + " sorry. Message: " + message);
  }
  function success(text: string) {
    (document.getElementById("Input") as HTMLInputElement).value = text;
    explain_assertions();
  }
  getWebJSON(url, success, failure, null, null, "text");
}

export function make_examples(): void {
  function make_example(name: string, url: string, where: string) {
    const dom = document.getElementById(where) as HTMLElement;
    const a = add(dom, "a", "example") as HTMLAnchorElement;
    a.href = url;
    a.textContent = name;
    a.onclick = function () {
      load_example(url);
      return false;
    };
  }
  // Create "a guide to RAIRE" example list
  for (const name of [
    "guide",
    "NEB_assertions",
    "one_candidate_dominates",
    "two_leading_candidates",
    "why_not_audit_every_step",
  ]) {
    make_example(
      name.replace("_", " "),
      "example_assertions/a_guide_to_RAIRE_eg_" + name + ".json",
      "EgGuideToRaire",
    );
  }
  make_example(
    "San Francisco IRV RLA pilot 2019",
    "https://raw.githubusercontent.com/DemocracyDevelopers/SHANGRLA/main/shangrla/Examples/Data/SF2019Nov8Assertions.json",
    "MichelleExamples",
  );
  make_example(
    "San Francisco IRV RLA pilot 2019",
    "SHANGRLA_SF2019_log_with_write_in.json",
    "SHANGRLAExamples",
  ); // candidate 45 added to "https://github.com/DemocracyDevelopers/SHANGRLA/blob/main/shangrla/Examples/log.json"
}

window.onload = function () {
  make_examples();
  const inputFileElement = document.getElementById(
    "InputFile",
  ) as HTMLInputElement;
  inputFileElement.addEventListener("change", function () {
    const filereader = new FileReader();
    filereader.onload = () => {
      (document.getElementById("Input") as HTMLInputElement).value =
        filereader.result as string;
    };
    if (this.files && this.files[0]) {
      filereader.readAsText(this.files[0]);
    }
  });
  (document.getElementById("ExpandAtStart") as HTMLElement).addEventListener(
    "change",
    explain_assertions,
  );
  (document.getElementById("DrawAsText") as HTMLElement).addEventListener(
    "change",
    explain_assertions,
  );
  (document.getElementById("HideWinner") as HTMLElement).addEventListener(
    "change",
    explain_assertions,
  );
  (
    document.getElementById(
      "ShowEffectOfEachAssertionSeparately",
    ) as HTMLElement
  ).addEventListener("change", explain_assertions);
  (
    document.getElementById("preventTextOverlapping") as HTMLElement
  ).addEventListener("change", explain_assertions);
  (
    document.getElementById("showAssertionIndex") as HTMLElement
  ).addEventListener("change", explain_assertions);
  (
    document.getElementById("showAssertionText") as HTMLElement
  ).addEventListener("change", explain_assertions);
  (
    document.getElementById("splitGreaterThanLines") as HTMLElement
  ).addEventListener("change", explain_assertions);
};
