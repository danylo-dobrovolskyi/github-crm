import { useEffect, useState, useCallback } from "react";
import {
  fetchRepositories,
  deleteRepository,
  updateRepository,
  addRepository,
} from "../api/index";
import { useAuthContext } from "../context/AuthContext";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import { Repository } from "../api/api.types";
import Loader from "../components/Loader";
import RepositoryTable from "../components/RepositoryTable";

const Dashboard = () => {
  const { isLogged, token, logout } = useAuthContext();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [repoPath, setRepoPath] = useState<string>("");
  const [error, setError] = useState<string>("");

  const loadRepositories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const repositories = await fetchRepositories();
      setRepositories(repositories);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      setError("Failed to fetch repositories.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isLogged) return;
    loadRepositories();
  }, [isLogged, loadRepositories]);

  const handleAddRepository = async () => {
    if (!repoPath.trim()) return;
    setError("");

    try {
      await addRepository(repoPath);
      setRepoPath("");
      await loadRepositories();
    } catch (error) {
      console.error("Error adding repository:", error);
      setError("Failed to add repository.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRepository(id);
      setRepositories((prev) => prev.filter((repo) => repo._id !== id));
    } catch (error) {
      console.error("Error deleting repository:", error);
      setError("Failed to delete repository.");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const updatedRepo = await updateRepository(id);
      setRepositories((prev) =>
        prev.map((repo) => (repo._id === id ? updatedRepo : repo))
      );
    } catch (error) {
      console.error("Error updating repository:", error);
      setError("Failed to update repository.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">📂 My Repositories</Typography>
        <Button variant="contained" color="secondary" onClick={logout}>
          Logout
        </Button>
      </Box>

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <TextField
          label="Repository path (owner/repo)"
          variant="outlined"
          fullWidth
          value={repoPath}
          onChange={(e) => setRepoPath(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRepository}
        >
          Add
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Loader />
      ) : (
        <RepositoryTable
          repositories={repositories}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </Container>
  );
};

export default Dashboard;
