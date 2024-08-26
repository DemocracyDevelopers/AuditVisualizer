# Branch Management Guidelines

```bash
- `main`
  - `doc`
  - `release`
    - `feature/<feature-name>`
    - `feature/<feature-name>`
      - `feature/<feature-name>-<developer-name>`
    - `feature/<feature-name>`
  - `test/<test-name>`
```

## 1. Branch Structure Overview

- Main Branch (`main`)
  - Represents the stable version of the project.
  - Code must undergo a pull request (PR) and pass code reviews.
  - Only merges from:
    - `release`
    - `doc`
- Documentation Branch (`doc`)
  - Used exclusively for documentation.
  - Cannot merge from any other branches.
- Release Branch (`release`)
  - Contains stable code ready for delivery.
  - Code must undergo a pull request (PR) and pass code reviews.
  - Only merges from `feature/*` branches.
- Feature Branches (`feature/*`)
  - Used for specific feature development.
  - Developers pull the latest code from main or release as needed.
  - Can be organized as:
    - `feature/<feature-name>`
    - `feature/<feature-name>-<developer-name>`
  - Periodically merges into release.
- Test Branches (`test/*`)
  - Used for testing specific aspects of the project.
  - Should not merge into any other branch but can receive merges.

> protected branches: `main`, `release`

## 2. Best Practices

### Tool Recommendations

- GitHub Desktop: Preferred for beginners due to its user-friendly guidance.
- VSCode: Use the GitLens plugin for enhanced Git experience.
- SourceTree: An alternative option for managing Git operations.

### Code Review:

Mandatory before merging into protected branches.

### Regular Updates

Frequently pull from the main or release branch to stay up-to-date.

<!-- ```bash
- `main`
  - `doc`
  - `release`
    - `feature/<feature-name>`
    - `feature/<feature-name>`
      - `feature/<feature-name>-<developer-name>`
    - `feature/<feature-name>`
```

- It is recommended to use GitHub Desktop for handling Git operations.
  - If using VSCode, the GitLens extension is recommended.
  - You can also use Sourcetree for handling Git.
  - Choose one of these tools; GitHub Desktop is preferred as it provides the most user-friendly guidance for beginners.
  - Other tools besides GitHub Desktop typically offer more features, such as a visual representation of branches. However, they may also come with more bugs.

- The `main` branch should be kept stable over the long term. It should only be merged from the `release` branch when a business feature is fully developed and needs to be delivered.
  - The `main` branch should only be merged from the `doc` or `release` branches. The `doc` branch should not contain any code changes.
- The `release` branch should only merge from `feature/*` branches.
- Code can always flow from the main branch to feature branches; developers should pull the latest changes as needed.
- Code should be regularly merged from feature branches back to the main branch, but this requires a code review.
- Direct changes are not allowed on the `main` and `release` branches; changes must be merged through feature branches. If there is a need to make changes that do not belong to any existing branches, a temporary branch should be created locally, and after the changes are made, the branch should be pushed to the remote repository, followed by a pull request.