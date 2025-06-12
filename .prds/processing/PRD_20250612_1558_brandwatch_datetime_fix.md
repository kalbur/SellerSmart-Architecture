# PRD_20250612_1558_brandwatch_datetime_fix

## Problem Statement

The BrandWatch processing system is experiencing critical failures due to datetime handling inconsistencies, causing brands to get stuck in processing states and preventing completion of brand analysis tasks. The root cause is mixing timezone-aware and timezone-naive datetime objects in calculations, leading to "can't subtract offset-naive and offset-aware datetimes" errors.

## User Needs

- **Brand Analysis Continuity**: Users need reliable brand watch processing without manual intervention
- **Real-time Processing**: Brand scans should complete automatically within expected timeframes
- **Error Recovery**: System should handle datetime conflicts gracefully without requiring manual database fixes
- **Processing Visibility**: Users need clear status updates when brands are being processed vs stuck
- **Data Consistency**: All datetime operations should use consistent timezone handling

## MCP Tools Used

- **Repomix**: Comprehensive analysis of SellerSmart-Backend.BrandScan codebase structure, identifying datetime usage patterns across 7 core modules and 8 utility modules
- **MongoDB Atlas**: Analysis of brands collection schema, current processing states, and identification of stuck brand (Nespresso) with datetime calculation errors

## Test Specifications (TDD)

### Test Scenarios

1. **Datetime Calculation with Mixed Timezone Types**
   - Given: A brand with next_update as timezone-aware datetime and current time as timezone-naive
   - When: System attempts to calculate time difference for scheduling
   - Then: Should handle both types consistently without raising exceptions

2. **Progress Update with Consistent Timestamps**
   - Given: A brand in processing state requiring progress updates
   - When: System updates progress with timestamps
   - Then: All timestamps should be timezone-aware and consistent

3. **Brand Processing Recovery**
   - Given: A brand stuck in "refreshing" state due to datetime errors
   - When: System detects and recovers stuck brand processing
   - Then: Brand should be reset to "pending" state and processing resumed

4. **Cross-timezone Brand Scheduling**
   - Given: Multiple brands with different timezone contexts
   - When: System schedules next processing times
   - Then: All scheduling calculations should use UTC consistently

### Unit Tests Required

- [ ] Test `calculate_time_difference()` with timezone-aware datetimes
- [ ] Test `calculate_time_difference()` with timezone-naive datetimes  
- [ ] Test `calculate_time_difference()` with mixed timezone types
- [ ] Test `update_brand_progress()` timestamp consistency
- [ ] Test `get_next_due_brand()` with various timezone scenarios
- [ ] Test `estimate_completion_time()` calculations
- [ ] Test error handling for invalid datetime formats
- [ ] Test edge case: brands created in different timezones
- [ ] Test edge case: daylight saving time transitions
- [ ] Test datetime serialization/deserialization consistency

### Integration Tests Required

- [ ] Test API endpoint: Brand processing workflow end-to-end
- [ ] Test database operations: Brand status updates with timestamps
- [ ] Test service interaction: MongoDB change stream processing
- [ ] Test scheduled brand processing with mixed datetime types
- [ ] Test progress tracking across full processing cycle
- [ ] Test webhook notifications with consistent timestamps
- [ ] Test concurrent brand processing with datetime calculations
- [ ] Test brand recovery mechanism for stuck processing states

### Component Tests Required (N/A - Backend Service)

### E2E Tests Required

- [ ] Test critical user flow: Complete brand watch processing cycle from pending to completed
- [ ] Test brand recovery flow: Auto-recovery of stuck brands
- [ ] Test concurrent processing: Multiple brands processing simultaneously without datetime conflicts

### Coverage Targets

- Unit Test Coverage: 100%
- Integration Test Coverage: 100%
- Overall Coverage: 100%
- Exclusions: None - all datetime handling code must be thoroughly tested

## Codebase Analysis

### Current Datetime Usage Patterns (from Repomix analysis)

**Problematic Patterns Found:**
```python
# core/brand_manager.py line ~180
sleep_seconds = (next_due_brand["next_update"] - now).total_seconds()
# Issue: next_update from DB may be timezone-aware, now may be timezone-naive
```

**Files with Datetime Operations:**
- `core/brand_manager.py`: Main scheduling and time calculations
- `core/task_manager.py`: Task timing and progress updates  
- `utils/estimation.py`: Completion time calculations
- `utils/logging.py`: Timestamp formatting in logs
- `main.py`: Process coordination timing

**Existing Patterns to Maintain:**
- JSON logging with ISO timestamp format
- MongoDB datetime field storage as UTC
- Progress percentage calculations with time estimates
- Webhook timestamp consistency

**Database Schema (from MongoDB Atlas analysis):**
```javascript
// brands collection structure
{
  _id: ObjectId,
  brand: String,
  status: String, // "pending", "refreshing", "completed", "failed"
  next_update: Date, // UTC timestamp - TIMEZONE-AWARE
  created_at: Date, // UTC timestamp - TIMEZONE-AWARE
  updated_at: Date, // UTC timestamp - TIMEZONE-AWARE
  progress: {
    percentage: Number,
    stage: String,
    message: String,
    updated_at: Date // UTC timestamp - TIMEZONE-AWARE
  }
}
```

**Current Error State Fixed:**
- Nespresso brand was stuck with datetime calculation error
- Reset to pending status via MongoDB Atlas tools
- Ready for processing once fix is implemented

### Similar Implementations for Reference

**Existing Timezone Handling in Other Services:**
- SellerSmart-API uses `datetime.now(timezone.utc)` consistently
- Other backend services use UTC standardization
- Frontend displays times in user's local timezone

## Technical Requirements

### Datetime Standardization

1. **Replace all `datetime.utcnow()` with `datetime.now(timezone.utc)`**
   - Ensures all datetime objects are timezone-aware
   - Consistent with MongoDB's timezone-aware storage
   - Compatible with ISO 8601 serialization

2. **Implement Timezone Utility Functions**
   ```python
   def get_utc_now() -> datetime:
       """Get current UTC time as timezone-aware datetime"""
       return datetime.now(timezone.utc)
   
   def ensure_utc(dt: datetime) -> datetime:
       """Convert datetime to UTC timezone-aware"""
       if dt.tzinfo is None:
           return dt.replace(tzinfo=timezone.utc)
       return dt.astimezone(timezone.utc)
   ```

3. **Safe Datetime Calculations**
   ```python
   def safe_time_difference(future_time: datetime, current_time: datetime = None) -> timedelta:
       """Calculate time difference with timezone safety"""
       if current_time is None:
           current_time = get_utc_now()
       
       future_utc = ensure_utc(future_time)
       current_utc = ensure_utc(current_time)
       
       return future_utc - current_utc
   ```

### Error Recovery Mechanism

1. **Stuck Brand Detection**
   - Identify brands in "refreshing" status for > 2 hours
   - Check for datetime-related errors in logs
   - Auto-reset to "pending" status

2. **Processing Health Checks**
   - Monitor for datetime calculation exceptions  
   - Track processing completion rates
   - Alert on anomalous processing times

### MongoDB Operations

1. **Consistent Timestamp Updates**
   - All database writes use timezone-aware datetimes
   - Update queries include proper timezone handling
   - Bulk operations maintain timestamp consistency

2. **Index Optimization**
   - Maintain existing indexes: `{status: 1, next_update: 1}`
   - Ensure query performance with datetime filters

## Implementation Checklist (TDD Order)

### Phase 1: Test Development

- [ ] Write unit tests for `get_utc_now()` utility function
- [ ] Write unit tests for `ensure_utc()` timezone conversion
- [ ] Write unit tests for `safe_time_difference()` calculations
- [ ] Write unit tests for existing datetime functions with new handling
- [ ] Write integration tests for brand processing workflow
- [ ] Write integration tests for MongoDB datetime operations
- [ ] Write integration tests for progress update consistency
- [ ] Write integration tests for stuck brand recovery
- [ ] Verify all tests fail correctly (since functions don't exist yet)
- [ ] Document test cases and expected behaviors

### Phase 2: Implementation

- [ ] Create `utils/datetime_utils.py` with timezone utility functions
- [ ] Update `core/brand_manager.py` to use timezone-aware calculations
- [ ] Update `core/task_manager.py` progress timestamp handling
- [ ] Update `utils/estimation.py` completion time calculations
- [ ] Update `utils/logging.py` timestamp formatting consistency
- [ ] Update `main.py` process timing operations
- [ ] Implement stuck brand recovery mechanism
- [ ] Refactor existing datetime operations while keeping tests green

### Phase 3: Quality Assurance

- [ ] Run test coverage report for datetime operations
- [ ] Achieve 100% coverage on all datetime handling code
- [ ] Pass all existing tests (no regressions)
- [ ] Pass Python linting checks (flake8, black)
- [ ] Pass type checking (mypy) for datetime annotations
- [ ] Update docstrings and code documentation
- [ ] Test with actual MongoDB data (dev environment)

### Phase 4: Completion

- [ ] All datetime-related tests passing
- [ ] 100% coverage target met
- [ ] No stuck brands in production database
- [ ] Processing times within expected ranges
- [ ] Monitoring alerts configured
- [ ] Code reviewed and approved
- [ ] PRD moved to completed folder

## Success Criteria

- [ ] Zero datetime calculation exceptions in logs
- [ ] All brand processing completes within expected timeframes
- [ ] No brands stuck in "refreshing" status > 30 minutes
- [ ] Consistent timezone handling across all datetime operations  
- [ ] 100% test coverage for datetime handling code
- [ ] Processing performance maintains current benchmarks
- [ ] Error recovery automatically handles stuck brands
- [ ] Documentation updated with timezone handling standards

## Risk Mitigation

- **Deployment Strategy**: Blue-green deployment to test datetime fixes without disrupting active processing
- **Rollback Plan**: Database backup before deployment, ability to revert code changes
- **Monitoring**: Enhanced logging for datetime operations during initial deployment period
- **Testing**: Comprehensive testing in staging environment with production data patterns