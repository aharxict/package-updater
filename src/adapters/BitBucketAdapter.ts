import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";
import { IRepositoryAdapter } from "./IRepositoryAdapter";
import { RepositoryDetails } from "../types/RepositoryDetails";

const BITBUCKET_API_URL = "https://api.bitbucket.org/2.0";

dotenv.config();

export class BitBucketAdapter implements IRepositoryAdapter {
  private authToken: string | undefined;

  constructor() {
    this.authToken =  process.env.AUTH_TOKEN;

    if (!this.authToken) {
      throw new Error('Authorization token is missing. Please check your .env file');
    }
  }

  async fetchFile(
    repositoryDetails: RepositoryDetails,
    filePath: string
  ): Promise<string> {
    const { workspace, repoSlug, branch } = repositoryDetails;
    const url = `${BITBUCKET_API_URL}/repositories/${workspace}/${repoSlug}/src/${branch}/${filePath}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });
  
      // Ensure the response data is a string
      if (typeof response.data === 'string') {
        return response.data;
      }
  
      // If response is not a string, handle it
      return JSON.stringify(response.data);
    } catch (error) {
      //TODO: Handle errors (e.g., file not found, permission denied)
      if (error instanceof Error) {
        console.error("Error fetching file:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      throw new Error('Failed to fetch file');
    }
  }

  async updateFile(
    repositoryDetails: RepositoryDetails,
    filePath: string,
    content: string,
    commitMessage: string
  ): Promise<void> {
    const { workspace, repoSlug, branch } = repositoryDetails;
    const url = `${BITBUCKET_API_URL}/repositories/${workspace}/${repoSlug}/src`;

    try {
      const data = qs.stringify({
        message: commitMessage,
        branch: branch,
        [filePath]: content,
      });
  
      const response = await axios.post(
        url,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      if (response.status !== 201) {
        console.error("Error during commit:", response.data);
        throw new Error("Failed to update file in the repository.");
      }
  
      console.log(`File updated successfully with commit message: ${commitMessage}`);
    } catch (error) {
      // TODO: Handle errors (e.g., merge conflicts, validation errors)
      if (error instanceof Error) {
        console.error("Error updating file:", error.message);
      } else {
        console.error("An unknown error occurred during the file update:", error);
      }
  
      throw new Error("Failed to update file in the repository.");
    }
  }

  async createPullRequest(
    repositoryDetails: RepositoryDetails,
    title: string,
    sourceBranch: string,
    targetBranch: string
  ): Promise<string> {
    const { workspace, repoSlug } = repositoryDetails;
    const url = `${BITBUCKET_API_URL}/repositories/${workspace}/${repoSlug}/pullrequests`;
  
    try {
      const response = await axios.post(
        url,
        {
          title,
          source: { branch: { name: sourceBranch } },
          destination: { branch: { name: targetBranch } },
        },
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );
  
      // Return the PR link if successful
      return response?.data?.links?.html?.href;
    } catch (error) {
      //TODO: Handle errors (e.g., PR conflicts, API errors)
      if (error instanceof Error) {
        console.error("Error creating pull request:", error.message);
      } else {
        console.error("Unknown error occurred:", error);
      }

      throw new Error("Failed to create pull request.");
    }
  }
}
