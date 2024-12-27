import { BitBucketAdapter } from "./adapters/BitBucketAdapter";
import { IRepositoryAdapter } from "./adapters/IRepositoryAdapter";
import { FileUtils } from "./utils/FileUtils";
import { RepositoryDetails } from "./types/RepositoryDetails";

async function main() {
  console.log("Starting main");
  const packageName = process.argv[2];
  const packageVersion = process.argv[3];
  const workspace = process.argv[4] ?? "soft";
  const repoSlug = process.argv[5] ?? "redocly";
  const branch = process.argv[6] ?? "main";

  if (!packageName || !packageVersion) {
    console.error("Usage: node dist/main.js <package-name> <package-version>");
    process.exit(1);
  }

  const repositoryDetails: RepositoryDetails = {
    workspace: workspace,
    repoSlug: repoSlug,
    branch: branch,
  };

  const adapter: IRepositoryAdapter = new BitBucketAdapter();

  try {
    const packageJsonPath = "package.json";
    const packageJsonContent = await adapter.fetchFile(
      repositoryDetails,
      packageJsonPath
    );

    // Validate the content of package.json
    if (!FileUtils.validatePackageJson(packageJsonContent)) {
      throw new Error("Invalid package.json file content.");
    }

    const packageJson = JSON.parse(packageJsonContent);

    if (!packageJson.dependencies || !packageJson.dependencies[packageName]) {
      throw new Error(`Package "${packageName}" not found in dependencies.`);
    }

    packageJson.dependencies[packageName] = packageVersion;

    const updatedContent = JSON.stringify(packageJson, null, 2);
    const commitMessage = `chore: update ${packageName} to version ${packageVersion}`;
    const updatedBranch = `${repositoryDetails.branch}-update-${packageName}`;

    await adapter.updateFile(
      { ...repositoryDetails, branch: updatedBranch },
      packageJsonPath,
      updatedContent,
      commitMessage
    );

    const prTitle = `Update ${packageName} to version ${packageVersion}`;
    const prUrl = await adapter.createPullRequest(
      repositoryDetails,
      prTitle,
      updatedBranch,
      repositoryDetails.branch
    );

    console.log(`Pull request created: ${prUrl}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    process.exit(1);
  }
}

main();
