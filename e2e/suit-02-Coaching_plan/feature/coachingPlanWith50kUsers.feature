Feature: Coaching Plans Tests with 50k UserSupport

   Scenario: 1.Coaching Plan Tests with 50k-UserSupport
      Given 50k UserSupport: should verify mandatory Fields and default date selection
      When 50k UserSupport: should verify enhancedAddUsersModal is opened to add users
      Then 50k UserSupport: should verify SelectAll checkbox on addEmployeeModal adds users to selected section
      Then 50k UserSupport: should verify all Users are displayed On CoachingPlanDetailsPage
      Then 50k UserSupport: should verify that single user can be removed from the plan
      Then 50k UserSupport: should verify that remove users button on CoachingPlanDetailsPage is deleting the selected users
      Then 50k UserSupport: should verify that Teams and Groups filters are working properly
      Then 50k UserSupport: should verify that user is able to schedule the plan with selected information
      Then 50k UserSupport: should verify that a lock icon is shown for the user (when we change the \'can be coached'\ attribute to false after scheduling the plan)
      Then 50k UserSupport: should verify that user is able to activate coaching plan successfully
      Then 50k UserSupport: should verify that an employee is not available to add to a new coaching plan (Can Be Coached Attribute = false)

   Scenario: 2.Coaching Plan Tests with Scheduling Options with 50k UserSupport
      When 50k UserSupport: should verify scheduling options is disabled for older plans
      Then 50k UserSupport: should enable scheduling options
      Then 50k UserSupport: should validate modal