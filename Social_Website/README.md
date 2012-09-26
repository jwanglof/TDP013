Node.js 
======
	Reqs:
		swig
		express
		mongodb

	Good to have:
		supervisor (-g and sudo needed!)

Supervisor
======
	To start:
		supervisor -w lib,views,js,css -e 'js|html|css' lib/app.js
