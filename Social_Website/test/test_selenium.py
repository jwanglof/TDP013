from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
import time
import os

# Setup driver for Firefox
driver = webdriver.Firefox()
#driver.get("file:///home/andy/git/TDP013/Social_Website/TDP013/index.html")
driver.get("file:///home/johan/Git/TDP013/Social_Website/TDP013/index.html")

# Register Kurt
regFirstName = driver.find_element_by_id("regFirstname")
regFirstName.send_keys("Kurt")
regSurName = driver.find_element_by_id("regSurname")
regSurName.send_keys("Wallander")
regEmail = driver.find_element_by_id("regEmail")
regEmail.send_keys("kurt@wallander.se")
regPassword = driver.find_element_by_id("regPassword")
regPassword.send_keys("kurt123")
regPasswordRep = driver.find_element_by_id("regPasswordRep")
regPasswordRep.send_keys("kurt123")
submitForm = driver.find_element_by_name("regBtn")
submitForm.click()

time.sleep(1)

# Register Arne
regFirstName = driver.find_element_by_id("regFirstname")
regFirstName.send_keys("Arne")
regSurName = driver.find_element_by_id("regSurname")
regSurName.send_keys("Banan")
regEmail = driver.find_element_by_id("regEmail")
regEmail.send_keys("ArneBanan@snyggakillen.se")
regPassword = driver.find_element_by_id("regPassword")
regPassword.send_keys("bananer")
regPasswordRep = driver.find_element_by_id("regPasswordRep")
regPasswordRep.send_keys("bananer")
submitForm = driver.find_element_by_name("regBtn")
submitForm.click()

time.sleep(1)

# Fillout email for login
inputMail = driver.find_element_by_name("liEmail")
inputMail.send_keys("kurt@wallander.se")

time.sleep(1)

# Fillout password for login and submit.
inputPass = driver.find_element_by_name("liPassword")
inputPass.send_keys("kurt123")
inputPass.submit()

time.sleep(1)

# Fillout search form and click search button.
searchFriend = driver.find_element_by_name("searchString")
searchFriend.send_keys("ArneBanan@snyggakillen.se")
searchButton = driver.find_element_by_id("searchButton")
searchButton.click()

time.sleep(1)

# Find link to friend among your frineds and click it.
findFriend = driver.find_element_by_class_name("friend")
findFriend.click()

time.sleep(1)

# Click be friend link
beFriend = driver.find_element_by_class_name("beFriend")
beFriend.click()

time.sleep(1)

# Write something on the wall
writeWall = driver.find_element_by_id("wallTextarea")
writeWall.send_keys("Tjena Arne Banan! Hur mar du?")
wallBtn = driver.find_element_by_id("wallBtn")
wallBtn.click()

time.sleep(1)

# Click Friends in the menu
friendsMenu = driver.find_element_by_id("linkFriends")
friendsMenu.click()

time.sleep(1)

# Click on your friend
clickFriend = driver.find_element_by_class_name("friend")
clickFriend.click()

time.sleep(1)

# Click on Profile in the menu
clickProfile = driver.find_element_by_id("linkProfile")
clickProfile.click()

time.sleep(1)

# Click logout in the menu
clickLogout = driver.find_element_by_id("linkLogout")
clickLogout.click()

time.sleep(1)

driver.quit()
