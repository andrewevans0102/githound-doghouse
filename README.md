# GitHound Doghouse 🐾 🏠

> An example repository demonstrating [GitHound](https://github.com/andrewevans0102/githound) — a Git-driven Human-in-the-Loop (HITL) safety harness for AI coding agents.

```text
                  ( )  ( )
                   ( )  )
                    )  (
                   ||--||
                  /======\
                 /        \
                /  /\  /\  \
               /  /__\/__\  \
              /              \
             /    DOGHOUSE    \
            /__________________\
            |   ____________   |
            |  |  HARVEY'S  |  |
            |  |____🐾______|  |
            |                  |
            |      .----.      |
            |     /      \     |
            |    |   🐾   |    |
            |    |        |    |
            |____|________|____|
          ========================
```

---

## 📖 About This Example

This repository serves as a minimal, live reference project demonstrating how to integrate and use **[GitHound](https://github.com/andrewevans0102/githound)** in your own GitHub repositories.

The project itself is deliberately simple: an **ASCII art doghouse** in `src/index.js`, accompanied by a deterministic test suite in `test/doghouse.test.js`.

By keeping the application logic lightweight and self-contained, this repo lets you explore how GitHound orchestrates autonomous AI coding tasks, enforces local test gates before opening Pull Requests, and enables interactive PR steering using `/hound` comments—without being bogged down by complex dependencies.

---

## 🐕 How GitHound Works Here

When configured in this repository, GitHound acts as a watchdog:

1. **Blast-Radius Isolation**: Tasks triggered from labeled GitHub issues run strictly on isolated branches (`githound/issue-<number>`). `main` remains untouched.
2. **Deterministic Verification Gate**: Before opening a PR or pushing revisions, GitHound executes:
   - `npm run typecheck` (`node --check src/index.js test/doghouse.test.js`)
   - `npm test` (`node --test`)  
   If tests fail, GitHound feeds terminal errors back into Gemini for self-correction (up to 3 retries).
3. **Interactive PR Steering**: Reviewers can leave comments starting with `/hound` on PR lines. GitHound extracts the diff, prompts the model, reapplies code changes, re-verifies tests, and pushes a new commit to the branch.
4. **Owner Protection**: Workflow-level pre-filters and the `issue-guard` action protect against unauthorized triggers and API key abuse from non-owners.

---

## ⚙️ Required GitHub Settings

To enable GitHound in your repository, you must configure the following GitHub settings:

### 1. Gemini API Key Secret
GitHound uses Google Gemini to generate and revise code.
1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Secrets and variables** > **Actions**.
3. Under **Repository secrets**, click **New repository secret**.
4. Name: `GEMINI_API_KEY`
5. Value: Your Google Gemini API key (obtainable from [Google AI Studio](https://aistudio.google.com/)).
6. Click **Add secret**.

### 2. GitHub Actions Workflow Permissions
GitHound needs permissions to create branches, push commits, and open pull requests:
1. Navigate to **Settings** > **Actions** > **General**.
2. Scroll to **Workflow permissions**.
3. Select **Read and write permissions**.
4. Check the box for **Allow GitHub Actions to create and approve pull requests**.
5. Click **Save**.

### 3. Create the `githound` Label
GitHound triggers on issues labeled `githound`:
1. Navigate to the **Issues** tab in your repository.
2. Click **Labels** (next to Milestones) or navigate to `/labels`.
3. Click **New label**.
4. Label name: `githound`
5. Description: `Trigger GitHound autonomous coding agent`
6. Click **Create label**.

---

## 🤖 GitHub Actions Workflow Setup

This repository includes `.github/workflows/githound.yml` configured to use the official GitHound action:

```yaml
name: GitHound HITL Loop

on:
  issues:
    types: [opened, labeled]
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  # Optional: Guard repository against unauthorized issues opened by non-owners
  issue-guard:
    if: github.event_name == 'issues' && github.event.action == 'opened' && github.actor != github.repository_owner && github.event.issue.author_association != 'OWNER'
    permissions:
      issues: write
    runs-on: ubuntu-latest
    steps:
      - name: Guard Non-Owner Issue
        uses: andrewevans0102/githound/issue-guard@main

  # Main GitHound Human-in-the-Loop agent workflow
  hound:
    if: >
      (github.actor == github.repository_owner || github.event.sender.author_association == 'OWNER') && (
        (github.event_name == 'issues' && github.event.label.name == 'githound' && (github.event.issue.user.login == github.repository_owner || github.event.issue.author_association == 'OWNER')) ||
        (github.event_name == 'issue_comment' && startsWith(github.event.comment.body, '/hound')) ||
        (github.event_name == 'pull_request_review_comment' && startsWith(github.event.comment.body, '/hound'))
      )
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Run GitHound
        uses: andrewevans0102/githound@main
        with:
          gemini-api-key: ${{ secrets.GEMINI_API_KEY }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          test-cmd: "npm test"
          typecheck-cmd: "npm run typecheck"
          max-retries: "3"
          base-branch: "main"
```

---

## 🧪 Steps to Test GitHound

Follow these steps to test the local gate and live GitHub automation:

### Step 1: Local Verification
Run the project locally to see the doghouse ASCII art and ensure local verification passes:

```bash
# Print the ASCII doghouse
npm start

# Run unit tests
npm test

# Run syntax/typecheck validation
npm run typecheck
```

### Step 2: Test Issue Intake & Automated PR Creation
1. Ensure the repo is pushed to GitHub and the settings above are configured.
2. Open a new issue in your repository:
   - **Title**: `Add a weather vane to the doghouse roof`
   - **Body**: `Please update src/index.js to add a weather vane (or spinning rooster arrow) on top of the doghouse roof, and make sure npm test passes.`
3. Apply the **`githound`** label to the issue.
4. Go to the **Actions** tab on GitHub:
   - Observe the `GitHound HITL Loop` workflow executing.
   - GitHound creates branch `githound/issue-<number>`, generates the requested code changes, runs `npm test`, and opens a new Pull Request.

### Step 3: Test Interactive PR Steering via `/hound`
1. Navigate to the Pull Request opened by GitHound.
2. Click the **Files changed** tab.
3. Hover over a line in `src/index.js` and click the blue `+` button to leave a review comment.
4. Type a command starting with `/hound`, for example:
   ```text
   /hound please add a dog bone sign above the entrance door
   ```
5. Click **Add single comment**.
6. GitHound will:
   - React with `👀` to acknowledge the instruction.
   - Extract the local diff and comment context.
   - Modify the file and execute `npm test` locally.
   - Push a new commit directly to the PR branch.

### Step 4: Test Non-Owner Guardrails (Optional)
1. Have a collaborator or secondary non-owner GitHub account attempt to open an issue or leave a `/hound` comment.
2. Notice that:
   - If an issue is opened by a non-owner, `issue-guard` automatically comments, closes the issue as `not_planned`, and locks the conversation.
   - Workflow pre-filters skip the `hound` runner completely, protecting your API keys and runner minutes.

---

## 📂 Project Structure

```text
githound-doghouse/
├── .github/
│   └── workflows/
│       └── githound.yml       # GitHound HITL GitHub Actions workflow
├── src/
│   └── index.js               # ASCII art doghouse and printer function
├── test/
│   └── doghouse.test.js       # Unit tests executed by GitHound verification gate
├── .gitignore
├── package.json
└── README.md
```
