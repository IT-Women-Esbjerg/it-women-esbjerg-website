+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
time = '16:30-18:00'
location = ''
description = ''
+++

# {{ replace .File.ContentBaseName "-" " " | title }}

## Event Details

**Date:** {{ dateFormat "Monday, January 2, 2006" .Date }}  
**Time:** 16:30-18:00
**Location:** EASV

## Description

Write event description here...
