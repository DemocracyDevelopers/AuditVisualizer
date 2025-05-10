import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TooltipWithIcon from "@/app/dashboard/components/Information-icon-text";
import { getSmartDisplayName } from "@/components/ui/avatar";

interface Assertion {
  index: number;
  winner: number;
  content: string;
  type: string;
  difficulty: number;
  margin: number;
}

interface Candidate {
  id: number;
  name: string;
}

interface AssertionsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assertions: Assertion[];
  maxDifficulty: number;
  minMargin: number;
  candidates: Candidate[];
}

const pageSize = 10;

const AssertionsDetailsModal: React.FC<AssertionsDetailsModalProps> = ({
  isOpen,
  onClose,
  assertions,
  maxDifficulty,
  minMargin,
  candidates,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(assertions.length / pageSize);

  const pagedAssertions = assertions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center relative">
            Assertions Details
            <TooltipWithIcon
              title="Need Help?"
              description="For detailed guidance on understanding the assertion attributes, please refer to our"
              linkText="Tutorial"
              linkHref="/tutorial"
            />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Candidate Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Candidates</h3>
            <ul className="list-disc list-inside text-gray-700">
              {candidates.map((candidate) => {
                const { shortName } = getSmartDisplayName(
                  candidate.id,
                  candidates,
                );
                return (
                  <li key={candidate.id}>
                    <strong>{shortName}</strong> – {candidate.name}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Difficulty and Margin */}
          <div>
            <p className="text-gray-700">
              <span className="font-semibold">Maximum Difficulty:</span>{" "}
              <Badge variant="outline">{maxDifficulty}</Badge>{" "}
              <span className="font-semibold">Minimum Margin:</span>{" "}
              <Badge variant="outline">{minMargin}</Badge>
            </p>
          </div>

          {/* Table with Pagination */}
          <div className="space-y-3">
            <div className="max-h-[300px] overflow-auto border rounded">
              <Table className="min-w-full">
                <TableHeader className="sticky top-0 bg-white z-10 shadow">
                  <TableRow>
                    <TableHead>Index</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedAssertions.map((assertion) => (
                    <TableRow key={assertion.index}>
                      <TableCell>{assertion.index}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar
                            candidateId={assertion.winner}
                            className="mr-2"
                          />
                          <span>{assertion.content}</span>
                        </div>
                      </TableCell>
                      <TableCell>{assertion.type}</TableCell>
                      <TableCell>{assertion.difficulty}</TableCell>
                      <TableCell>{assertion.margin}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </Button>

              <span className="text-sm text-gray-700">Page</span>
              <select
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ),
                )}
              </select>
              <span className="text-sm text-gray-700">of {totalPages}</span>

              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssertionsDetailsModal;
