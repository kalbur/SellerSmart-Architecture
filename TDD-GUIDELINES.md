# Test-Driven Development (TDD) Guidelines for SellerSmart

## Overview

SellerSmart follows a strict Test-Driven Development (TDD) workflow to ensure code quality, maintainability, and 100% test coverage.

## TDD Workflow

### 1. Red Phase - Write Failing Tests
- Write tests BEFORE any implementation code
- Tests should fail because the functionality doesn't exist yet
- This confirms tests are testing the right behavior

### 2. Green Phase - Make Tests Pass
- Write the MINIMUM code necessary to make tests pass
- Don't add extra functionality
- Focus only on passing the current test

### 3. Refactor Phase - Improve Code Quality
- Refactor code while keeping tests green
- Improve structure, remove duplication
- Run tests after each change to ensure nothing breaks

### 4. Repeat
- Continue the cycle for each new piece of functionality
- Small incremental steps lead to robust code

## Test Coverage Requirements

### Target: 100% Coverage
All new code must have 100% test coverage. Exceptions must be documented.

### Coverage by Service Type

#### Python Services (Backend)
```bash
# Run tests with coverage
pytest --cov=. --cov-report=html --cov-report=term

# View coverage report
coverage report -m

# Generate HTML report
coverage html
```

#### Node.js Services (API/Web)
```bash
# Run tests with coverage
npm run test:coverage

# View coverage report
npm run coverage:report

# Watch mode for development
npm run test:watch
```

#### React Components
```bash
# Run component tests
npm test

# With coverage
npm run test:coverage

# Update snapshots
npm test -- -u
```

## Test Types

### 1. Unit Tests
- Test individual functions/methods in isolation
- Mock external dependencies
- Fast execution
- Located in `__tests__` or `*.test.*` files

### 2. Integration Tests
- Test interaction between components
- Test API endpoints with real database
- Test service interactions
- Located in `tests/integration` or `*.integration.test.*`

### 3. Component Tests (React)
- Test React components in isolation
- Use React Testing Library
- Test user interactions
- Test component states and props

### 4. End-to-End Tests
- Test complete user workflows
- Use Playwright or Cypress
- Test critical paths only (slower execution)
- Located in `e2e` or `cypress` directories

## Best Practices

### Test Naming
```python
# Python example
def test_should_calculate_total_with_tax_when_items_present():
    # Test implementation
```

```javascript
// JavaScript example
describe('OrderService', () => {
  describe('calculateTotal', () => {
    it('should include tax when items are present', () => {
      // Test implementation
    });
  });
});
```

### Test Structure (AAA Pattern)
```python
def test_example():
    # Arrange - Set up test data
    user = create_test_user()
    product = create_test_product(price=100)
    
    # Act - Execute the function
    result = calculate_discount(user, product)
    
    # Assert - Verify the result
    assert result == 90  # 10% discount applied
```

### Mocking Guidelines
- Mock external services (APIs, databases in unit tests)
- Use real implementations in integration tests
- Keep mocks simple and focused

### Test Data
- Use factories or builders for test data
- Avoid hardcoded values
- Keep test data realistic
- Clean up after tests

## PRD Integration

Every PRD must include:
1. **Test Specifications Section**
   - Define test scenarios before implementation
   - Include edge cases and error scenarios
   - Specify expected behavior

2. **Coverage Targets**
   - Minimum 100% for new code
   - Document any exclusions with justification

3. **Test Examples**
   - Include specific test cases
   - Show input/output examples
   - Reference similar tests in codebase

## Common Testing Patterns

### API Endpoint Testing (Python/FastAPI)
```python
def test_create_order_success(client, db_session):
    # Arrange
    payload = {"items": [{"id": 1, "quantity": 2}]}
    
    # Act
    response = client.post("/orders", json=payload)
    
    # Assert
    assert response.status_code == 201
    assert response.json()["status"] == "pending"
```

### React Component Testing
```javascript
test('renders product card with price', () => {
  // Arrange
  const product = { name: 'Test Product', price: 99.99 };
  
  // Act
  render(<ProductCard product={product} />);
  
  // Assert
  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('$99.99')).toBeInTheDocument();
});
```

### Service Testing (Node.js)
```javascript
describe('InventoryService', () => {
  describe('checkStock', () => {
    it('should return true when stock is available', async () => {
      // Arrange
      const mockRepo = { findById: jest.fn().mockResolvedValue({ stock: 10 }) };
      const service = new InventoryService(mockRepo);
      
      // Act
      const result = await service.checkStock('product-1', 5);
      
      // Assert
      expect(result).toBe(true);
      expect(mockRepo.findById).toHaveBeenCalledWith('product-1');
    });
  });
});
```

## Continuous Integration

All PRs must:
- Pass all tests
- Meet coverage requirements
- Pass linting and type checking
- Include test documentation

## Resources

- [Testing Python Code](https://docs.pytest.org/en/stable/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [TDD Best Practices](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

## Getting Help

- Review existing tests in the codebase for patterns
- Ask in team discussions for complex testing scenarios
- Use AI assistants for test generation ideas
- Pair program for difficult test cases
