Node.js 
======
	Reqs:
		swig
		express
		mongodb
		consolidate

	Good to have:
		supervisor (-g and sudo needed!)

Supervisor
======
	To start:
		supervisor -w lib,views,js,css -e 'js|html|css' lib/app.js

Connect (comes with express)
======
	http://www.senchalabs.org/connect/

MongoDB
======
	To flush a collection (in the terminal):
		db.<collection>.remove({})

	To remove a certain value:
		db.<collection>.remove({a: 1})
