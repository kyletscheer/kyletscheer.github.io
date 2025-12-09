#!/bin/bash

# --- Video Compression Script for Web Portfolio ---
# Requires FFmpeg to be installed (e.g., via Homebrew)

# Set max width for all videos (1200px is sufficient for most web displays)
MAX_WIDTH="1200"

# Compression settings: CRF 28 provides a good balance for screen recordings.
CRF_VALUE="28"

echo "Starting video compression for files in the current directory..."
echo "Target settings: Max Width = ${MAX_WIDTH}px, No Duration Limit, CRF = ${CRF_VALUE}"

# Loop through all files ending in .mp4 in the current directory
for file in *.mp4; do
    # Check if the file actually exists (prevents error if no mp4 files are present)
    if [ -f "$file" ]; then
        # Define the output file name
        output_file="${file%.mp4}_new.mp4"
        
        echo "--- Processing: $file -> $output_file ---"

        # FFmpeg command:
        # NOTE: The '-t' (trim duration) flag has been removed.
        
        ffmpeg -i "$file" \
               -vf "scale=${MAX_WIDTH}:-2" \
               -vcodec libx264 \
               -crf "$CRF_VALUE" \
               -pix_fmt yuv420p \
               -preset slow \
               -tune animation \
               -an \
               "$output_file"
        
        if [ $? -eq 0 ]; then
            echo "Successfully compressed $file. New file size:"
            du -h "$output_file"
        else
            echo "FFmpeg ERROR occurred while processing $file."
        fi
    fi
done

echo "--- All files processed. Check for *_new.mp4 files. ---"