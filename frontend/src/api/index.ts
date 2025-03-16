import { AuthResponse, Repository, RepositoriesResponse, RepositoryResponse } from "./api.types";
import api from "./axios";

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (
  email: string,
  password: string
): Promise<void> => {
  await api.post("/auth/register", { email, password });
};

export const fetchRepositories = async (): Promise<Repository[]> => {
  const response = await api.get<RepositoriesResponse>("/repositories");
  return response.data.repositories;
};

export const addRepository = async (repoPath: string): Promise<Repository> => {
  const response = await api.post<RepositoryResponse>("/repositories/add", {
    repoPath,
  });
  return response.data.repository;
};

export const deleteRepository = async (id: string): Promise<void> => {
  await api.delete(`/repositories/${id}`);
};

export const updateRepository = async (id: string): Promise<Repository> => {
  const response = await api.put<RepositoryResponse>(`/repositories/${id}`);
  return response.data.repository;
};
