Feature: Coaching Response Tracking & Send Notification Feature Tests

    Scenario: 1. Agent & Evaluator Submit Coaching
        Given STEP-1: Should verify that the agent submit the coaching
        When STEP-2: Should verify that the evaluator submit the coaching

   Scenario: 2.Coaching Response Tracking Scenarios
      When STEP-3: Should not display Send Reminder button if new future dated coaching plan is created
      Then STEP-4: Should display Send Reminder button for an Activated plan
      Then STEP-5: Should display Send Reminder button tool-tip
      Then STEP-6: Should verify notification if send reminder button is clicked
      Then STEP-7: Should verify that send reminder button is disabled & will be enabled after refresh
      Then STEP-8: Should verify completion status
      Then STEP-9: Should verify not completion status
      Then STEP-10: Should verify status of all completed coachings
      Then STEP-11: Should verify that agents who has completed coaching earlier Should not receive new notification
      Then STEP-12: Should check the title and the content of the last arrived notification and mark as read
      Then STEP-13: Should search 1 user who has completed coaching