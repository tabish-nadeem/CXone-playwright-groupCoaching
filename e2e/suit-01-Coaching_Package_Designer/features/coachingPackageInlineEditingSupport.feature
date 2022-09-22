Feature: Test to support inline editing & verify Test Package modal functionality at coaching package designer     

   Scenario: 1.Tests for basic coaching package scenarios
      Given Should verify popover message that active coaching packages can not be deleted
      When Should verify deactivating a coaching package
      Then Should verify coaching package in test package modal

   Scenario: 2.Tests for bulk activate, deactivate and delete
      When Should able to bulk activate coaching packages
      Then Should able to bulk deactivate coaching packages
      Then Should able to bulk delete coaching packages

   Scenario: 3.Tests to verify inline editing for all coaching package elements
      When Should verify inline formatting on attachment element
      Then Should verify inline formatting on section element
      Then Should verify inline formatting on label element
      Then Should verify inline formatting on interaction element
      Then Should verify inline formatting on hyperlink element
      Then Should verify inline formatting on a saved form
      Then Should verify inline formatting on a duplicated form