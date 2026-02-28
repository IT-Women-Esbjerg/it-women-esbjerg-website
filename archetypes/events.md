+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
event_start = '{{ .Date }}' # don't forget to adjust
event_end = '{{ .Date }}' # don't forget to adjust
location = '' # add location
summary = '' # Short 1-2 sentence summary/sentiment about the event (optional)

# Takeaways/memories from the event (optional, only shown if event is in the past)
takeaways = []

# Plans/agenda for the event (optional, only shown if event is in the future)
plans = []

[[images]]
url = "https://media.licdn.com/dms/image/v2/..."
alt = "Event photo 1"
+++

## Description

[Write event description here...]
