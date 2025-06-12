# PRD_20250612_1611_single_session_per_user

### Problem Statement
SellerSmart-Web currently allows multiple concurrent sessions per user, which presents security risks and potential account sharing violations. The platform needs to enforce a single session per user policy to enhance security, prevent unauthorized access, and ensure compliance with the subscription terms that prohibit account sharing outside of business organizations.

### User Needs
- **Security Enhancement**: Users need assurance that only one active session exists for their account at any time
- **Account Protection**: Automatic termination of previous sessions when logging in from a new device/location
- **Compliance**: Enforcement of subscription terms that prohibit account sharing
- **Session Management**: Clear visibility of active sessions and forced logout capabilities
- **Seamless Experience**: Smooth transition when switching devices without manual session management

### MCP Tools Used
- **WebSearch**: Researched better-auth multi-session plugin documentation and configuration options
- **WebFetch**: Analyzed detailed better-auth multi-session plugin implementation examples
- **Manual Analysis**: Reviewed SellerSmart-Web codebase structure and existing better-auth implementation

### Test Specifications (TDD)

#### Test Scenarios

1. **Single Session Enforcement on Login**
   - Given: User has an active session on Device A
   - When: User logs in from Device B with same credentials
   - Then: Device A session is automatically revoked and Device B becomes the active session

2. **Session Limit Validation**
   - Given: User attempts to create multiple sessions
   - When: Maximum session limit is reached (1)
   - Then: Oldest session is revoked and new session is created

3. **Current Session Protection**
   - Given: User is viewing active sessions in settings
   - When: User attempts to revoke their current session
   - Then: Current session cannot be revoked (button disabled/hidden)

4. **Session Revocation Notification**
   - Given: User's session is revoked due to new login
   - When: They attempt to access protected resources
   - Then: User is redirected to login with appropriate message

5. **Plugin Configuration Validation**
   - Given: Better-auth is configured with multiSession plugin
   - When: maximumSessions is set to 1
   - Then: Only one session per user is allowed in the database

#### Unit Tests Required
- [ ] Test multiSession plugin configuration with maximumSessions: 1
- [ ] Test auth configuration includes multiSession plugin correctly
- [ ] Test customSessionHandler maintains single session logic
- [ ] Test session validation middleware respects single session limit
- [ ] Test error handling when session limit exceeded
- [ ] Test edge case: concurrent login attempts from different devices
- [ ] Test edge case: session expiration with new login attempt

#### Integration Tests Required
- [ ] Test API endpoint: /api/auth/sessions - lists only current session
- [ ] Test API endpoint: /api/auth/session - validates single active session
- [ ] Test database operations: session creation with limit enforcement
- [ ] Test database operations: automatic session cleanup on new login
- [ ] Test service interaction: better-auth with MongoDB adapter for session management
- [ ] Test authentication flow: login/logout with session enforcement
- [ ] Test session middleware: request validation with single session

#### Component Tests Required (if UI)
- [ ] Test SessionsPanel component renders with single session limitation
- [ ] Test current session identification and protection in UI
- [ ] Test session revocation button disabled for current session
- [ ] Test loading states during session operations
- [ ] Test error notifications for session operations
- [ ] Test success notifications for session management
- [ ] Test user feedback when session is revoked by new login

#### E2E Tests Required
- [ ] Test critical user flow: Login from Device A, then Device B, verify Device A logged out
- [ ] Test critical user flow: Session settings page shows only current session
- [ ] Test critical user flow: User receives notification when session revoked
- [ ] Test critical user flow: Seamless device switching experience

#### Coverage Targets
- Unit Test Coverage: 100%
- Integration Test Coverage: 100%
- Overall Coverage: 100%
- Exclusions: 
  - Better-auth plugin internals (external library)
  - MongoDB adapter internals (external library)
  - Discord webhook notification code (notifications only)

### Codebase Analysis

#### Existing Better-Auth Implementation
**File**: `/Users/kal/GitHub/SellerSmart-Web/src/lib/auth.ts`
- Currently using better-auth v1.2.4 with plugins: stripe, organization, customSession
- MongoDB adapter configured with proper connection pooling
- Custom session handler already implemented for user data enhancement
- Organization plugin configured with membership limits
- **Missing**: multiSession plugin for session limiting

#### Existing Session Management UI
**File**: `/Users/kal/GitHub/SellerSmart-Web/src/components/settings/SessionsPanel.tsx`
- Already implements session listing and revocation UI
- Uses listSessions() and revokeSession() from auth-client
- Handles current session identification and protection
- Provides device detection and user-friendly session display
- **Compatible**: Works with multiSession plugin out of the box

#### Auth Client Configuration
**File**: `/Users/kal/GitHub/SellerSmart-Web/src/lib/auth-client.ts`
- Already exports revokeSession, revokeOtherSessions, listSessions functions
- Session refetch configuration already optimized
- **Compatible**: No changes needed for single session enforcement

#### Database Structure
- MongoDB collections: user, session, organisation, organisationMember, subscription
- Session documents contain: id, userId, token, userAgent, ipAddress, createdAt, updatedAt, expiresAt
- **Compatible**: Works with multiSession plugin session limits

### Technical Requirements

#### 1. Better-Auth Configuration Update
- Import multiSession plugin from "better-auth/plugins"
- Add multiSession plugin to auth configuration with maximumSessions: 1
- Ensure plugin is added before customSession to maintain proper order
- Maintain all existing plugin configurations (stripe, organization, customSession)

#### 2. Session Enforcement Logic
- Configure automatic session cleanup when limit exceeded
- Implement proper session token invalidation
- Ensure database consistency for single session per user
- Maintain existing session expiration and refresh logic

#### 3. UI Compatibility Verification
- Verify SessionsPanel continues to work with single session limit
- Ensure error handling for edge cases in session management
- Maintain existing user experience for session operations

#### 4. Testing Framework Integration
- Use Jest for unit tests with coverage reporting
- Use React Testing Library for component testing
- Use Playwright for E2E testing (existing in project)
- Integration tests using supertest for API endpoints

### Implementation Checklist (TDD Order)

#### Phase 1: Test Development
- [ ] Write unit tests for multiSession plugin configuration
- [ ] Write unit tests for auth configuration validation
- [ ] Write integration tests for session creation with limits
- [ ] Write integration tests for automatic session revocation
- [ ] Write component tests for SessionsPanel with single session
- [ ] Write E2E tests for device switching scenarios
- [ ] Verify all tests fail correctly (no implementation yet)
- [ ] Document test cases and expected behaviors

#### Phase 2: Implementation
- [ ] Import multiSession plugin in auth.ts
- [ ] Add multiSession plugin to authOptions with maximumSessions: 1
- [ ] Verify plugin order: multiSession before customSession
- [ ] Test auth configuration loads without errors
- [ ] Verify session enforcement works in development
- [ ] Test automatic session revocation functionality
- [ ] Refactor code while keeping tests green

#### Phase 3: Quality Assurance
- [ ] Run test coverage report: `npm run test:coverage`
- [ ] Achieve 100% coverage for new session limiting logic
- [ ] Pass all linting checks: `npm run lint`
- [ ] Pass all type checks: `npm run type-check`
- [ ] Verify existing session management UI still functions
- [ ] Test edge cases and error scenarios
- [ ] Update JSDoc comments for new functionality

#### Phase 4: Completion
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All component tests passing
- [ ] All E2E tests passing
- [ ] Coverage target met (100% for new code)
- [ ] No regression in existing functionality
- [ ] Manual testing complete
- [ ] Code reviewed
- [ ] PRD moved to completed

### Success Criteria
- [ ] Only one session per user is allowed system-wide
- [ ] New logins automatically revoke previous sessions
- [ ] SessionsPanel UI works correctly with single session limitation
- [ ] Current session cannot be revoked through UI
- [ ] Automatic session cleanup maintains database consistency
- [ ] 100% test coverage for session limiting functionality
- [ ] No regression in existing authentication features
- [ ] Performance benchmarks maintained (session operations < 200ms)
- [ ] Error handling provides clear user feedback
- [ ] Documentation updated with single session behavior

### Implementation Notes
- **Backwards Compatibility**: Existing sessions will be gradually cleaned up as users log in
- **Security**: Single session enforcement prevents account sharing and improves security
- **User Experience**: Seamless device switching without manual session management
- **Database Impact**: Minimal - leverages existing session table structure
- **Performance**: No significant impact - session queries remain efficient

### Risk Mitigation
- **Migration Risk**: Test thoroughly in development before production deployment
- **User Disruption**: Communicate session changes in release notes
- **Edge Cases**: Handle concurrent login attempts gracefully
- **Rollback Plan**: Can disable multiSession plugin if issues arise