# Package Updater
This project is a Node.js script written in TypeScript that updates the package.json file in the client repository and creates a pull request using the API. It follows the Adapter Pattern for scalability and extensibility, making it easy to add support for other repository providers like GitHub and others in the future.

## Features
- Updates package.json in a specified branch of a client repository.
- Creates a pull request to merge the changes.
- Extended design for better maintainability and future extension.

## Project Structure
```
src/
├── adapters/
│   ├── IRepositoryAdapter.ts   # Interface for repository adapters
│   ├── BitBucketAdapter.ts     # Adapter implementation for Bitbucket
├── utils/
│   ├── FileUtils.ts            # Utility functions for file operations
├── types/
│   ├── RepositoryDetails.ts    # Type definition for repository details
├── main.ts                     # Entry point of the script
package.json                    # Project metadata and dependencies
tsconfig.json                   # TypeScript configuration
.env                            # Environment variables
```

## Prerequisites
- Node.js (v16 or later) and npm installed.
- A Bitbucket API Token with write permissions for the repository.
- TypeScript compiler (tsc) installed globally or via dev dependencies.

## Installation
Clone the repository:

```
git clone https://github.com/aharxict/package-updater.git
cd package-updater
```

Install dependencies:

```
npm install
```

Compile TypeScript files:

```
npm run build
```

## Usage
Run the script:

```
node dist/main.js <package-name> <package-version> <workspace> <repoSlug> <branch>
```
Replace `<package-name>` with the name of the package to update and `<package-version>` with the version to set.

`<workspace> <repoSlug> <branch>` are optional and default to "soft" "redocly" "main"

Example: To update axios to version ^1.5.0:

```
node dist/main.js axios ^1.5.0
```

## Security
Ensure you added `AUTH_TOKEN` to your environment variables.

## Development
Run the TypeScript compiler in watch mode for development:

```
npx tsc --watch
```

## Extending the Project
This project uses the Adapter Pattern, making it easy to add support for other repository providers. To add a new provider:

Create a new adapter (e.g., GitHubAdapter.ts) in the adapters folder.
Implement the IRepositoryAdapter interface in the new adapter.
Update the main.ts file to use the new adapter when required.

## Notes
This script currently handles only `package.json` updates. Modify the logic in `main.ts` for other use cases.
Basic error handling is implemented. You can improve this by catching and handling specific errors (e.g., network issues, invalid inputs).
