UGLIFYJS=$(BASE)node_modules/.bin/uglifyjs
LINT=$(BASE)node_modules/.bin/jshint

SRC = depin.js
MIN = depin.min.js

build:
	$(LINT) $(SRC) 
	$(UGLIFYJS) $(SRC) -o $(MIN)