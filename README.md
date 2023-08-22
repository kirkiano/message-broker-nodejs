
# Proxeneta eventualis (Node.js)

Proxeneta simplex eventualis in Node.js impleta.

## Executio

Parametra circumiectalia requisita sunt:
* `HOST`: (facultativum) inscriptio auscultantis machinae: aut `0.0.0.0` aut 
  `127.0.0.1`. Absens est `0.0.0.0`.
* `PORT`: (facultativum) numerus portalis in quo auscultare. Absens est `3000`.
* `LOG_LEVEL`: (facultativum) optiones sunt: `emerg`, `alert`, `crit`, `error`,
  `warning`, `notice`, `info`, `debug`. Absens est `info`.

## Probatio

### Automatica

`make test`

### Manualis

Haec age:
* In cortice 1: `make`
* In cortice 2: `gtelnet localhost 3000`
* In eodem cortice inde `{'tag': 'topic', 'name': 'banana'}` et verifica
  errorem accidisse.
* In eodem cortice inde `{"tag": "blah"}` et verifica errorem accidisse.
* In eodem cortice inde `{"tag": "topic"}` et verifica errorem accidisse.
* In eodem cortice inde `{"tag": "topic", "name": "banana"}` et verifica
  topicem creatum fuisse.
* In eodem cortice inde `{"tag": "sub", "topic": "banana"}`
* In cortice 3 inde `gtelnet localhost 3000`
* In cortice 2 inde `{"tag": "pub", "topic": "banana", "msg": "hello"}`. 
  Verifica nuntiatum "hello" ad ipso et non ad corticem 3 advenisse.
* In cortice 3 inde `{"tag": "sub", "topic": "banana"}`
* In cortice 2 inde `{"tag": "pub", "topic": "banana", "msg": "hello again"}`.
  Verficia nuntiatum "hello again" ad ambos cortices advenisse. 