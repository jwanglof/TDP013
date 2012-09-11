from selenium import selenium
# This is the driver's import.  You'll use this class for instantiating a
# browser and making it do what you need.

import unittest, time, re
# This are the basic imports added by Selenium-IDE by default.
# You can remove the modules if they are not used in your script.

class NewTest(unittest.TestCase):
# We create our unittest test case

    def setUp(self):
        self.verificationErrors = []
        # This is an empty array where we will store any verification errors
        # we find in our tests

        self.selenium = selenium("localhost", 80, "*firefox",
                "http://www.google.com/")
        self.selenium.start()
        # We instantiate and start the browser

    def test_new(self):
        # This is the test code.  Here you should put the actions you need
        # the browser to do during your test.

        sel = self.selenium
        # We assign the browser to the variable "sel" (just to save us from
        # typing "self.selenium" each time we want to call the browser).

        sel.open("/")
        sel.type("q", "selenium rc")
        sel.click("btnG")
        sel.wait_for_page_to_load("30000")
        self.failUnless(sel.is_text_present("Results * for selenium rc"))
        # These are the real test steps

    def tearDown(self):
        self.selenium.stop()
        # we close the browser (I'd recommend you to comment this line while
        # you are creating and debugging your tests)

        self.assertEqual([], self.verificationErrors)
        # And make the test fail if we found that any verification errors
        # were found
