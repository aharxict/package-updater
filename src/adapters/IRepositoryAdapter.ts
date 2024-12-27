import { RepositoryDetails } from "../types/RepositoryDetails";

export interface IRepositoryAdapter {
  fetchFile(
    repositoryDetails: RepositoryDetails,
    filePath: string
  ): Promise<string>;

  updateFile(
    repositoryDetails: RepositoryDetails,
    filePath: string,
    content: string,
    commitMessage: string
  ): Promise<void>;

  createPullRequest(
    repositoryDetails: RepositoryDetails,
    title: string,
    sourceBranch: string,
    targetBranch: string
  ): Promise<string>;
}
