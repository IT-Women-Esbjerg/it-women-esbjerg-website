+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
event_start = '{{ .Date }}' # don't forget to adjust
event_end = '{{ .Date }}' # don't forget to adjust
location = '' # add location

[[images]]
url = "https://media.licdn.com/dms/image/v2/..."
alt = "Event photo 1"

[[images]]
url = "https://media.licdn.com/dms/image/v2/..."
alt = "Event photo 2"
+++

## Description

[Write event description here...]
