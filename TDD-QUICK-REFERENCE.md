# TDD Quick Reference - SellerSmart

## Python Services (pytest)
```bash
# Run tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html --cov-report=term

# Run specific test
pytest tests/test_module.py::test_function

# Run with verbose output
pytest -v

# Run and stop on first failure
pytest -x

# Run only marked tests
pytest -m "unit"
```

## Node.js Services (Jest)
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- OrderService.test.js

# Update snapshots
npm test -- -u

# Run with verbose output
npm test -- --verbose
```

## React Components
```bash
# Run component tests
npm test

# Run with coverage
npm run test:coverage

# Run specific component test
npm test -- ProductCard.test.tsx

# Debug mode
npm test -- --no-coverage --watch
```

## Coverage Commands

### Python
```bash
# Generate HTML report
coverage html
# Open: htmlcov/index.html

# Terminal report
coverage report -m

# XML for CI
coverage xml
```

### JavaScript/TypeScript
```bash
# View coverage in terminal
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html

# Coverage with specific threshold
npm test -- --coverage --coverageThreshold='{"global":{"lines":100}}'
```

## TDD Cycle Commands

### 1. Write Test (Red)
```bash
# Create test file
touch tests/test_new_feature.py  # Python
touch src/__tests__/NewFeature.test.js  # JavaScript

# Run to see it fail
pytest tests/test_new_feature.py  # Python
npm test -- NewFeature.test.js  # JavaScript
```

### 2. Make it Pass (Green)
```bash
# Run tests continuously while coding
pytest-watch  # Python (install: pip install pytest-watch)
npm run test:watch  # JavaScript
```

### 3. Refactor (Refactor)
```bash
# Keep running tests to ensure nothing breaks
# Same commands as above
```

## Common Test Patterns

### Mock External Services
```python
# Python
@patch('module.external_service')
def test_with_mock(mock_service):
    mock_service.return_value = {'status': 'ok'}
```

```javascript
// JavaScript
jest.mock('./externalService');
externalService.getData.mockResolvedValue({ status: 'ok' });
```

### Test Database Transactions
```python
# Python - Rollback after test
@pytest.mark.django_db(transaction=True)
def test_with_db(db):
    # Test code
```

```javascript
// JavaScript - Clean up
afterEach(async () => {
  await db.cleanup();
});
```

## Debugging Tests

### Python
```bash
# Drop into debugger
pytest --pdb

# Show print statements
pytest -s

# Verbose output
pytest -vv
```

### JavaScript
```bash
# Debug in Chrome
node --inspect-brk node_modules/.bin/jest --runInBand

# Console.log output
npm test -- --verbose=false

# Step through code
debugger; // Add in code
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run tests with coverage
  run: |
    pytest --cov=. --cov-report=xml
    npm run test:coverage
    
- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Tips
- Write test names that describe behavior, not implementation
- Keep tests independent - no shared state
- Use descriptive assertions
- Test one thing per test
- Fast tests = happy developers
