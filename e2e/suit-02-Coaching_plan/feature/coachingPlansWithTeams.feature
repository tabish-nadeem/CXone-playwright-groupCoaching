Feature: Coaching plans tests with teams filters

   Scenario: 1.Coaching Plan Tests with team filters
      Given Should verify mandatory Fields and default date selection
      When Should verify Select All Link On Add Users Modal adds users to selected section
      Then Should verify all Users are displayed On CoachingPlanDetailsPage
      Then Should verify that single user can be removed from the plan
      Then Should verify that remove users button on CoachingPlanDetailsPage is deleting the selected users
      Then Should verify that Teams and Groups filters are working properly
      Then Should verify that Select all link select only filtered users under selected tab
      Then Should verify that remove all link removes all the users from selected tab and adds them to users grid
      Then Should verify that clear link removes all the filters and shows all the users in users grid
      Then Should verify that user is able to schedule the plan with selected information
      Then Should verify that a lock icon is shown for the user (when we change the \'can be coached'\ attribute to false after scheduling the plan)
      Then Should verify that user is able to activate coaching plan successfully
      Then Should verify that an employee is not available to add to a new coaching plan (Can Be Coached Attribute = false)

   Scenario: 2.Coaching Plan Tests with Scheduling Options
      When Should verify scheduling options is disabled for older plans
      Then Should enable scheduling options
      Then Should validate modal
      Then Should schedule coaching plan with scheduling options
      Then Should validate warning modal
      Then Should active coaching plan