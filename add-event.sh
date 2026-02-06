#!/usr/bin/env bash

# User-friendly script to create a new Hugo event file with front matter

read -p "Event title: " title
default_location="Syddansk Erhvervsakademi (formerly Erhvervsakademi Sydvest), Spangsbjerg Kirkevej 103, Esbjerg, Syddanmark, DK, 6700"
read -e -i "$default_location" -p "Location: " location


# User-friendly date/time input
read -p "Event start (DD-MM-YYYY HH:MM): " event_start_human
read -p "Event end (DD-MM-YYYY HH:MM): " event_end_human

# Convert DD-MM-YYYY HH:MM to YYYY-MM-DD HH:MM for date -d
event_start_iso=$(echo "$event_start_human" | awk -F'[- :]' '{printf "%04d-%02d-%02d %02d:%02d", $3, $2, $1, $4, $5}')
event_end_iso=$(echo "$event_end_human" | awk -F'[- :]' '{printf "%04d-%02d-%02d %02d:%02d", $3, $2, $1, $4, $5}')


# Convert to ISO 8601 (YYYY-MM-DDTHH:MM:SS+01:00)
event_start=$(date -d "$event_start_iso" +"%Y-%m-%dT%H:%M:%S%z" | sed -E 's/([+-][0-9]{2})([0-9]{2})$/\1:\2/')
event_end=$(date -d "$event_end_iso" +"%Y-%m-%dT%H:%M:%S%z" | sed -E 's/([+-][0-9]{2})([0-9]{2})$/\1:\2/')


# Extract year, month, and day from event_start
event_date=$(date -d "$event_start" +"%Y-%m-%d")
filename="${event_date}.md"
hugo new "events/${filename}"
filepath="content/events/${filename}"

# Update front matter with user values
sed -i \
    -e "/^title =/c\\title = '$title'" \
    -e "/^location =/c\\location = '$location'" \
    -e "/^event_start =/c\\event_start = '$event_start'" \
    -e "/^event_end =/c\\event_end = '$event_end'" \
    "$filepath"

echo
echo "Now open $filepath and fill in the description, takeaways, and images as needed."
echo "Event created: $filepath"