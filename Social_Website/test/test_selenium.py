from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
import time

# Create a new instance of the Firefox driver
driver = webdriver.Firefox()

# Go to the website
driver.get("http://127.0.0.1:3000/login")
#driver.get("http://www-und.ida.liu.se/~johwa457/TDP013/Lab1/index.html")

# Find the element with ID = tweet_textarea which is where the user writes the tweet
inputElement = driver.find_element_by_name("email");

# The first tweet that will be shown
inputElement.send_keys("jwanglof@gmail.com")

# Sleep for a while so it's possible to see what's happening.
# Will be more sleeps further that wont have any comments.
#time.sleep(0.2)

inputElement = driver.find_element_by_name("password");
inputElement.send_keys("asdasd");

# Submit the form
# Same as sleep, will have more of these that wont have any comments
inputElement.submit()

driver.get("http://127.0.0.1:3000/profile?userId=50695df12de3c44404000001");

inputElement = driver.find_element_by_name("wallpost");
inputElement.send_keys("Hej du din fule!");
inputElement.submit()

"""
time.sleep(1)

time.sleep(2)

driver.quit()
"""
