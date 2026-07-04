# readme-gen

A small CLI tool that auto-generates a `README.md` by inspecting a codebase's
structure — project type, dependencies, scripts, directory tree, and license —
instead of you writing it from scratch every time.

## Features

- Detects project type from marker files: `package.json` (Node), `pyproject.toml` /
  `requirements.txt` (Python), `Cargo.toml` (Rust), `go.mod` (Go)
- Pulls real metadata where available: name, description, dependencies, npm scripts
- Builds a clean directory tree, respecting `.gitignore` and common ignore patterns
  (`node_modules`, `.git`, `__pycache__`, `venv`, `dist`, `build`, etc.)
- Detects license type from a `LICENSE` file
- Zero dependencies — pure Python standard library

## Installation

```bash
git clone <repo-url>
cd readme-gen
# no dependencies to install — just needs Python 3.8+
```

## Usage

```bash
python generate_readme.py                     # generate for current directory
python generate_readme.py /path/to/project     # generate for another project
python generate_readme.py . --output DRAFT.md  # write to a different file
python generate_readme.py . --depth 2          # shallower directory tree
python generate_readme.py . --force            # overwrite without asking
```

If a `README.md` already exists in the target directory, the script asks for
confirmation before overwriting (unless `--force` is passed).

## Running tests

```bash
pip install pytest --break-system-packages
pytest test_generate_readme.py -v
```

## How it works

1. Loads `.gitignore` patterns and merges them with a default ignore list
2. Walks the directory tree, skipping ignored paths, truncating very large directories
3. Looks for known project marker files and extracts what it can (name, description,
   dependencies, run scripts)
4. Checks for a `LICENSE` file and does a light-touch match against MIT / Apache / GPL
5. Renders everything into a Markdown template

## Ideas for extending this (good next steps in Claude Code)

- Parse Python docstrings (via `ast`) to auto-populate a "Modules" section
- Support monorepos (multiple `package.json` files)
- Detect CI config (`.github/workflows`) and add a badges section
- Add a `--dry-run` flag that prints to stdout instead of writing a file
- Publish it as a pip-installable package with a `readme-gen` entry point

## License

MIT (feel free to adjust for your own repo)
