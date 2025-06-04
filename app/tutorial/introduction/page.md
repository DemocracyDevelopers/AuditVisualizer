# Introduction: IRV RLAs with RAIRE

Risk-Limiting Audits (RLAs) for Instant Runoff Voting (IRV) elections can be efficiently conducted using the RAIRE tool. RAIRE helps
election administrators verify whether the announced winner in an IRV
election is correct by generating a set of assertions. These
assertions are conditions comparing different sets of ballots and
determining if the winner had more support than any other candidates.

RAIRE uses a cost-effective method to select the necessary sample size
for verification, relying on Cast Vote Records (CVRs) from paper
ballots. The tool focuses on validating the winner and deliberately
ignores less critical details, like the elimination order of
candidates. Auditing tools used for plurality elections can be adapted
for IRV by integrating RAIRE.

## The Audit Process from Beginning to End:

1. Commit to the ballot manifest and CVRs.
2. Choose contest(s) for audit.
3. **Run RAIRE to generate assertions for audit.**
4. **Use the RAIRE assertion validation and visualisation module to check that the assertions imply the announced winner won.**
5. Generate a trustworthy random seed, e.g., by public dice rolling.
6. Estimate the required sample size, based on the margin, **for each assertion**.
7. Use the seed to generate the list of sampled ballots.
8. Retrieve the required ballots, compare them to their CVRs, and calculate the discrepancies **for each assertion**.
9. Update the risk **for each assertion** based on the observed discrepancies.
10. For each contest under audit, if the measured risk is below the risk limit **for each assertion**, stop the audit and accept the result.
11. If some results have not yet been confirmed, decide whether to escalate (sample more ballots) or conduct a full manual count.
