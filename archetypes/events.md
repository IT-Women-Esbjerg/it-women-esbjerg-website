+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
time = '16:30-18:00'
location = ''
description = ''

[[images]]
url = "https://media.licdn.com/dms/image/v2/..."
alt = "Event photo 1"

[[images]]
url = "https://media.licdn.com/dms/image/v2/..."
alt = "Event photo 2"
+++

# {{ replace .File.ContentBaseName "-" " " | title }}

## Event Details

**Date:** {{ dateFormat "Monday, January 2, 2006" .Date }}  
**Time:** [TIME]  
**Location:** [LOCATION]

## Description

[Write event description here]

## Photos

Write event recap here...
