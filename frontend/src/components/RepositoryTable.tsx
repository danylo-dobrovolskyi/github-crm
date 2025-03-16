import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import RepositoryRow from "./RepositoryRow";
import { Repository } from "../api/api.types";

interface RepositoryTableProps {
  repositories: Repository[];
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}

const RepositoryTable = ({
  repositories,
  onUpdate,
  onDelete,
}: RepositoryTableProps) => (
  <TableContainer component={Paper} sx={{ mt: 3 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Owner</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>URL</TableCell>
          <TableCell>Stars</TableCell>
          <TableCell>Forks</TableCell>
          <TableCell>Issues</TableCell>
          <TableCell>Created At</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {repositories.map((repo) => (
          <RepositoryRow
            key={repo._id}
            repository={repo}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default RepositoryTable;
