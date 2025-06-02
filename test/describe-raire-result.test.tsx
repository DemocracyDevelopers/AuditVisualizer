// test/describe-raire-result.test.tsx
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DescribeRaireResult from '../app/explain-assertions/components/describe-raire-result';

describe('DescribeRaireResult', () => {
  const baseData = {
    metadata: { candidates: ['A', 'B', 'C'] },
    solution: {
      Ok: {
        assertions: [
          { assertion: { type: 'NEN', winner: 0, loser: 1, continuing: [0,1,2] } },
          { assertion: { type: 'NEB', winner: 2, loser: 1 } },
        ],
        winner: 0,
        num_candidates: 3,
        time_to_determine_winners: { seconds: 0.05, work: 10 },
        time_to_find_assertions:   { seconds: 1.234, work: 50 },
        time_to_trim_assertions:   { seconds: 0.5, work: 20 },
        warning_trim_timed_out: true,
      },
    },
  };

  it('renders warning and timing info', () => {
    render(<DescribeRaireResult data={baseData} />);
    expect(screen.getByText(/Warning: Trimming timed out/)).toBeInTheDocument();
    expect(screen.getByText(/Time to determine winners:/)).toBeInTheDocument();
    expect(screen.getByText(/Time to find assertions:/)).toBeInTheDocument();
  });

  it('renders Assertions section and assertion entries', () => {
    render(<DescribeRaireResult data={baseData} />);
    expect(screen.getByRole('heading', { level: 3, name: /Assertions/ })).toBeInTheDocument();
    expect(screen.getByText(/NEN:/)).toBeInTheDocument();
    expect(screen.getByText(/NEB/)).toBeInTheDocument();
  });

  it('renders Err case with custom message', () => {
    const errData = {
      metadata: { candidates: ['A'] },
      solution: { Err: 'InvalidTimeout' },
    };
    render(<DescribeRaireResult data={errData} />);
    expect(screen.getByText(/Timeout is not valid/)).toBeInTheDocument();
  });

  it('renders fallback error for wrong format', () => {
    render(<DescribeRaireResult data={{}} />);
    expect(screen.getByText(/Output is wrong format/)).toBeInTheDocument();
  });
});
