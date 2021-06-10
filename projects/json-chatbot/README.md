# JsonChatbot

This library allow to display chat and interact with user with button or input text. All response can be sent to a service.


Data are loaded from json file. 

ex: 
`{"root": "root",
"children": [
{
"id": "root",
"text": "Bonjour ! je suis Sam, votre assistant :-) Je vais vous guider ","timer": 500,
"answers": [
{"text": "Ok","actions": [{"value": ".*","next": "step2"}],"answerType": "BUTTON"},
{"text": "Non","actions": [{"value": ".*","next": "step3"}],"answerType": "BUTTON"}
]},
{"id":"step2",
...}`

The JSON file contains an array named children of type `Step`. Each step contains an `id` (must be unique),
a `text` (display in bubble), a timer (duration of loader display) and an `answers` array. A step can also contains a `src` to retrieve data to display as list.

Each `answer` has a type (BUTTON, INPUT, SELECT, COMPONENT, CLOSE). 

TODO to complete

All types are described in [script.js](./src/lib/models/script.js).

The chat bubble can contain a loader svg.
