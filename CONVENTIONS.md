# SellerSmart Coding Conventions

## General Principles

1. **Consistency**: Follow existing patterns in the codebase
2. **Readability**: Code should be self-documenting
3. **Simplicity**: Prefer simple solutions over complex ones
4. **Testability**: Write code that's easy to test

## Naming Conventions

### JavaScript/TypeScript
- Classes: `PascalCase` (e.g., `UserController`)
- Functions/Methods: `camelCase` (e.g., `calculateTotal`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- Files: `kebab-case` (e.g., `user-controller.js`)

### API Endpoints
- RESTful conventions
- Plural nouns for resources
- Kebab-case for multi-word resources

## Code Style

- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multi-line objects/arrays

## Testing

- Test files alongside source files
- Name pattern: `*.test.js` or `*.spec.js`
- Minimum 80% code coverage

## Git Workflow

### Branch Names
- `feature/PRD_ID_description`
- `bugfix/issue-description`
- `hotfix/critical-issue`

### Commit Messages
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance
