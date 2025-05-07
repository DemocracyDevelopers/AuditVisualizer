import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
import { X } from "lucide-react";
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
  name: string; // full name
}

interface AssertionsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assertions: Assertion[];
  maxDifficulty: number;
  minMargin: number;
  candidates: Candidate[];
}

const AssertionsDetailsModal: React.FC<AssertionsDetailsModalProps> = ({
  isOpen,
  onClose,
  assertions,
  maxDifficulty,
  minMargin,
  candidates,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
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

          <div>
            <p className="text-gray-700">
              <span className="font-semibold">Maximum Difficulty:</span>{" "}
              <Badge variant="outline">{maxDifficulty}</Badge>{" "}
              <span className="font-semibold">Minimum Margin:</span>{" "}
              <Badge variant="outline">{minMargin}</Badge>
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Index</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assertions.map((assertion) => (
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssertionsDetailsModal;
