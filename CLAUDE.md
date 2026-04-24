# Saulto Static

Static site built with [Bridgetown](https://www.bridgetownrb.com/) v2.1.

## Project Stack

- **Framework**: Bridgetown 2.1 (Ruby-based static site generator)
- **CSS**: PostCSS (with postcss-import, postcss-preset-env, flexbugs-fixes)
- **JS**: esbuild (ESM, minified for production)
- **Server**: Puma (development)

## Commands

```bash
bin/bridgetown start        # Dev server (site + esbuild watcher)
bin/bridgetown build        # Production build
bin/bridgetown console      # IRB with site context
```

## Structure

```
src/                  # Source content
  _components/        # Reusable components
  _data/              # Site data files
  _layouts/           # Page layouts
  _partials/          # Partial templates
  _posts/             # Blog posts
frontend/             # JS/CSS entry points
plugins/              # Bridgetown plugins
config/               # Site configuration
```

## Global Instructions

All general workflow, coding standards, and tooling conventions are defined in `~/.claude/CLAUDE.md`. This file only contains project-specific context.
