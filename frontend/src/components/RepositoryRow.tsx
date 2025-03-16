import { TableRow, TableCell, IconButton } from "@mui/material";
import { Refresh, Delete } from "@mui/icons-material";
import { Repository } from "../api/api.types";

interface RepositoryRowProps {
  repository: Repository;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}

const RepositoryRow = ({
  repository,
  onUpdate,
  onDelete,
}: RepositoryRowProps) => {
  const { _id, owner, name, url, stars, forks, issues, created_at } =
    repository;

  return (
    <TableRow key={_id}>
      <TableCell>{owner}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </TableCell>
      <TableCell>{stars}</TableCell>
      <TableCell>{forks}</TableCell>
      <TableCell>{issues}</TableCell>
      <TableCell>{new Date(created_at).toLocaleString()}</TableCell>
      <TableCell>
        <IconButton onClick={() => onUpdate(_id)}>
          <Refresh />
        </IconButton>
        <IconButton onClick={() => onDelete(_id)} color="error">
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default RepositoryRow;
