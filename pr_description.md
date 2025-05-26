# Categorized Model View Implementation

This PR implements the categorized view for model pages with two main sections:
1. "Common Models" section at the top - displaying hardcoded common model categories (checkpoints, loras, controlnet)
2. "All Models" section below - showing the complete folder hierarchy

## Changes
- Added "Common Models" section with hardcoded categories
- Maintained existing folder hierarchy in "All Models" section
- Ensured search functionality works across both sections
- Preserved existing filter tabs (Private/Public/All) functionality
- Maintained consistent styling between sections

## Testing
- Verified UI changes locally
- Confirmed filtering and search work for both sections
- Checked visual consistency with existing design

Resolves COM-1384

Link to Devin run: https://app.devin.ai/sessions/720cef7f754b4143803c57acef85e504
