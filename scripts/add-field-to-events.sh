#!/usr/bin/env bash
# Usage: ./add-field-to-events.sh field_name 'default_value'
# Example: ./add-field-to-events.sh plans '[]'

set -e

if [ $# -ne 2 ]; then
  echo "Usage: $0 field_name 'default_value'"
  exit 1
fi

FIELD="$1"
VALUE="$2"
EVENT_DIR="content/events"


for file in "$EVENT_DIR"/*.md; do
  # Check if the field already exists
  if grep -q "^$FIELD =" "$file"; then
    echo "$FIELD already exists in $file, skipping."
    continue
  fi

  # Find the line number of the second +++ (end of TOML front matter)
  end_line=$(grep -n '^\+\+\+$' "$file" | sed -n '2p' | cut -d: -f1)
  if [ -z "$end_line" ]; then
    echo "No TOML front matter end (second '+++') found in $file, skipping."
    continue
  fi

  # Insert before the first [[...]] array-of-tables block (if any), otherwise before closing +++
  # This avoids TOML parsing fields as part of the array table instead of top-level params
  insert_line=$(awk -v end="$end_line" 'NR > 1 && NR < end && /^\[\[/{print NR; exit}' "$file")
  if [ -z "$insert_line" ]; then
    insert_line="$end_line"
  fi

  # Insert the new field just before the target line
  awk -v n="$insert_line" -v f="$FIELD" -v v="$VALUE" 'NR==n{print f " = " v; print} NR!=n' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  echo "Added $FIELD to $file"
done

echo "Done."
