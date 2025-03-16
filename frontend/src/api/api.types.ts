export interface Repository {
  _id: string;
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  issues: number;
  created_at: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoriesResponse {
  repositories: Repository[];
}

export interface RepositoryResponse {
  repository: Repository;
}

export interface AuthResponse {
  token: string;
  userId: string;
}
