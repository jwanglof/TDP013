Node.js 
======
	OLD! Reqs:
		swig
		express
		mongodb
		consolidate

	Good to have:
		supervisor (-g and sudo needed!)

	Reqs:
		mongodb
		mocha
		should
		superagent

Supervisor
======
	To start:
		supervisor -w lib,views,js,css -e 'js|html|css' lib/app.js

Connect (comes with express)
======
	http://www.senchalabs.org/connect/

MongoDB
======
	Flush a collection (in the terminal):
		db.<collection>.remove({})

	Remove a certain value:
		db.<collection>.remove({a: 1})
	
	Drop a DB from command line:
		mongo <dbname> --eval "db.dropDatabase()"

	Backup a DB:
		mongodump -d <dbname> -o <to-folder-(default:dump)>

	Restore from mongodump:
		mongorestore -db <dbname> <folder-with-bson-files>

JSCoverage
======
jscoverage --no-highlight lib/ lib-coverage/

Mocha Test
======
Output in console:
./node_modules/.bin/mocha -R list

JSCoverage:
./node_modules/.bin/mocha -R html-cov > coverage.html

Selenium Test
======
python <selenium_test_file>.py