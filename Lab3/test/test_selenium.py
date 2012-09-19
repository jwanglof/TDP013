from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
import time

# Create a new instance of the Firefox driver
driver = webdriver.Firefox()

# Go to the website
#driver.get("http://127.0.0.1/~johan/TDP013/Lab1/index.html")
driver.get("http://www-und.ida.liu.se/~johwa457/TDP013/Lab1/index.html")

# Find the element with ID = tweet_textarea which is where the user writes the tweet
inputElement = driver.find_element_by_id("tweet_textarea");

# The first tweet that will be shown
inputElement.send_keys("Cheese!")

# Sleep for a while so it's possible to see what's happening.
# Will be more sleeps further that wont have any comments.
time.sleep(0.5)

# Submit the form
# Same as sleep, will have more of these that wont have any comments
inputElement.submit()

# The second tweet which have more then 140 chars
inputElement.send_keys("This is a very long message with a lot of characters etc etc. This is a very long message with a lot of characters etc etc. This is a very long message with a lot of characters etc etc. This is a very long message with a lot of characters etc etc. This is a very long message with a lot of characters etc etc. This is a very long message with a lot of characters etc etc...")

time.sleep(1)
inputElement.submit()

# Send an empty tweet which gives an error
# + Check to see that the error appears!
inputElement.send_keys("")

time.sleep(0.5)
inputElement.submit()

time.sleep(1)

# Find a tweet and mark it as seen by clicking on it
# + Check to see that it actually clicks
readElement = driver.find_element_by_class_name("tweet_msgs")
readElement.click()

time.sleep(2)

# Refresh the site to show that all the tweets disappear
driver.refresh()

time.sleep(2)

driver.quit()
