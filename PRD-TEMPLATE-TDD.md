# PRD Template with TDD

## PRD_YYYYMMDD_HHMM_feature_name

### Problem Statement
[Describe the problem this feature/fix addresses]

### User Needs
[List specific user needs and requirements]

### MCP Tools Used
- **Tool Name**: [What was found/analyzed]

### Test Specifications (TDD)

#### Test Scenarios
1. **Scenario Name**
   - Given: [Initial state]
   - When: [Action taken]
   - Then: [Expected result]

#### Unit Tests Required
- [ ] Test [function/method] with valid input
- [ ] Test [function/method] with invalid input
- [ ] Test error handling for [scenario]
- [ ] Test edge case: [description]

#### Integration Tests Required
- [ ] Test API endpoint: [endpoint]
- [ ] Test database operations: [operation]
- [ ] Test service interaction: [services]

#### Component Tests Required (if UI)
- [ ] Test component renders correctly
- [ ] Test user interactions
- [ ] Test state changes
- [ ] Test props validation

#### E2E Tests Required
- [ ] Test critical user flow: [description]

#### Coverage Targets
- Unit Test Coverage: 100%
- Integration Test Coverage: 100%
- Overall Coverage: 100%
- Exclusions: [List any files/lines excluded with justification]

### Codebase Analysis
[Results from analyzing existing code]

### Technical Requirements
[Detailed technical implementation requirements]

### Implementation Checklist (TDD Order)

#### Phase 1: Test Development
- [ ] Write unit tests for [component]
- [ ] Write integration tests for [feature]
- [ ] Write component tests for [UI element]
- [ ] Verify all tests fail correctly
- [ ] Document test cases in code

#### Phase 2: Implementation
- [ ] Implement [feature] to pass unit tests
- [ ] Implement [API] to pass integration tests
- [ ] Implement [UI] to pass component tests
- [ ] Refactor code while keeping tests green

#### Phase 3: Quality Assurance
- [ ] Run test coverage report
- [ ] Achieve 100% coverage (or document exclusions)
- [ ] Pass all linting checks
- [ ] Pass all type checks
- [ ] Update documentation

#### Phase 4: Completion
- [ ] All tests passing
- [ ] Coverage target met
- [ ] Code reviewed
- [ ] PRD moved to completed

### Success Criteria
- [ ] All test scenarios pass
- [ ] 100% test coverage achieved
- [ ] No regression in existing tests
- [ ] Performance benchmarks met
- [ ] Documentation updated
