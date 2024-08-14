# AuditVisualizer
## Project Description

## Team Member
| Name        | Roles                |
| ----------- | -------------------- |
| Yang Xu     | Lead Programmer      |
| Emily Zhang | Project Manager      |
| Yilin Lyu   | Scrum Mater          |
| Fuxing Zhao | Front-end programmer |
| Aaron Lee   | Technical Officer    |
| linsheng Ge | Architecture Lead    |
| Yuling Mao  | Test Officer         |
| Chang Liu   | Front-end programmer |
| Weijia Kong | Back-end programmer  |
| Jiamin Gu   | Back-end programmer  |

# Technologies Used
- react
- typescript
- nextjs
- tailwind css
- shadcn
- zustand
- jest
- husky

# Environment and Tools
- vscode
  - used for frontend development
  - extension
    - required
      - Prettier - Code formatter
      - Tailwind CSS IntelliSense
    - strongly recommended
      - Markdown All in One
      - vscode-icons
      - Code Spell Checker
      - GitHub Copilot
        - [apply for free education license](https://education.github.com/pack/offers)
    - recommended
      - ES7+ React/Redux/React-Native snippets
      - GitLens — Git supercharged
  - [vscode setting](./docs/VSCODE_SETTING.md)
- github desktop

# Getting Started
1. git clone repository
## frontend
1. run `nvm use` to initialize the right node version for the frontend development environment
   1. if you don't have nvm, you need to install it
      - windows
        - https://github.com/coreybutler/nvm-windows
      - linux/macos
        - https://github.com/nvm-sh/nvm
   2. nvm allows you to quickly install and use different versions of node via the command line
2. run `pnpm i` to install all the dependency for the frontend development environment
   1. if you don't have pnpm, you may need to install it
      - run `npm install -g pnpm` in terminal or following the official tutorial https://pnpm.io/installation
      - pnpm is a node module manager better than npm


# Git
## Commit Message Format
- feat: New feature
- fix: Bug fix
- docs: Documentation only changes
- style: Code style changes (e.g., formatting, missing semicolons)
- refactor: Code changes that neither fix a bug nor add a feature
- perf: Performance improvements
- test: Adding or correcting tests
- revert: Revert previous commits
- chore: Other changes that don't modify source or test files (e.g., configuration files)

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense, not capitalized, no period at the end.
  │       │
  │       └─⫸ Commit Scope (optional): 
  │            animations|common|core|forms|http|router|service-worker|docs
  │
  └─⫸ Commit Type: feat|fix|docs|style|refactor|pref|test|revert|chore

```

> reference: [commit message header](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit-message-header)

## Branch Management
- `main`
  - `doc`
  - `release`
    - `feature/<feature-name>`
    - `feature/<feature-name>`
      - `feature/<feature-name>-<developer-name>`
    - `feature/<feature-name>`

Example Structure:
- `main`
  - `doc` Dedicated to documentation-related updates and changes. No source code or executable files should be modified or added in this branch, ensuring it remains purely for documentation purposes.
  - `release`
    - `feature/init`
      - `feature/init-lwz` Developer lwz working on the init feature.
      - `feature/init-lc` Developer lc working on the init feature.
    - `feature/login` A branch dedicated to the login feature.
    - `feature/tutorial-mode` A branch focused on the tutorial mode feature.

> You can read the detailed information here 👉 [branch management](./docs/BRANCH_MANAGEMENT.md)