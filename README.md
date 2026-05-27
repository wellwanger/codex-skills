# Codex Skills

Personal Codex skills installable directly from GitHub with `npx`.

## Usage

List available skills:

```powershell
npx github:wellwanger/codex-skills list
```

Install a skill globally:

```powershell
npx github:wellwanger/codex-skills install brainstorm
npx github:wellwanger/codex-skills install brainstorm --global
```

Global installs are copied to `$CODEX_HOME/skills`. When `CODEX_HOME` is not set,
the installer uses `~/.codex/skills`.

Install a skill in the current project:

```powershell
npx github:wellwanger/codex-skills install brainstorm --local
```

Local installs are copied to `./.codex/skills`.

Install every skill:

```powershell
npx github:wellwanger/codex-skills install --all --global
npx github:wellwanger/codex-skills install --all --local
```

## Install With Skillfix Manager

If you prefer to use a skill manager instead of this repository's installer, use
the Skills CLI (`npx skills`) with this GitHub repository as the source.

List the skills available in this repository:

```powershell
npx skills add wellwanger/codex-skills --list
```

Install `brainstorm` for Codex in the current project:

```powershell
npx skills add wellwanger/codex-skills --skill brainstorm --agent codex --yes
```

For Codex, the local install is copied into the project's `.agents/skills`
directory.

Install `brainstorm` for Codex globally:

```powershell
npx skills add wellwanger/codex-skills --skill brainstorm --agent codex --global --yes
```

The manager copies the skill files into the target agent directory and preserves
supporting files such as `agents/openai.yaml`.

Use this option when you want the manager to own installation. Use this
repository's built-in installer when you specifically want Codex-style local
paths under `.codex/skills`.

## Local Development

Run the installer directly from this repository:

```powershell
node bin/install.js list
node bin/install.js install brainstorm --local
node bin/install.js install brainstorm --global
```

## Skills

- `brainstorm`: critical ideation mode before implementation.

The `brainstorm` skill was copied from the user's global Codex skill directory.
Its behavior was originally inspired by this public command:
https://github.com/veronez-io/claude-code-devops/blob/main/.claude/commands/brainstorm.md

## License

MIT. See [LICENSE](./LICENSE).
