
.PHONY: run test doc


run:
	node src/main.js

test:
	npm test

doc:
	npx jsdoc src -r -c jsdoc.conf.json -d doc