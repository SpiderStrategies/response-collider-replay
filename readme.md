Send a json text stream and this will emit each line based on the timestamp so you can replay log files.

Send this output stream to the response-collider

e.g. Replay logs

```
$ awk '{print "{\"timestamp\": \""substr($4,2)"\", \"resouce\": \""$7"\", \"code\": "$9", \"body_bytes_sent\": "$10", \"request_time\": "$11"}"}' log.txt | node index.js
```

e.g. Replay logs and send to response collider
```
$ awk '{print "{\"timestamp\": \""substr($4,2)"\", \"resouce\": \""$7"\", \"code\": "$9", \"body_bytes_sent\": "$10", \"request_time\": "$11"}"}' log.txt | node index.js | node ../response-collider/server.js
```

For Jason:
```
[koopa@dash-dev response-collider-replay (master)]$ tr -d $'\r' < localhost_access_log.2014-08-05.txt | awk  -F'["| ]' '{print "{\"timestamp\": \""substr($4,2)"\", \"resouce\": \""$8"\", \"code\": "$11", \"body_bytes_sent\": \""$12"\", \"request_time\": "$13"}"}'  | node index.js | node ../response-collider/server.js
```
