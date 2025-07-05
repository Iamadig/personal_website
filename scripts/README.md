# Notion CMS Integration

This directory contains scripts for syncing content from Notion to your static website.

## Files

- `notion-client.js` - Core Notion API client and utilities
- `sync-notion.js` - Main sync script that pulls content from Notion
- `inspect-databases.js` - Utility to inspect your Notion database structure

## How It Works

### Databases Structure

**Thoughts Database:**
- Title (title) - Blog post title
- Published (checkbox) - Controls visibility on website
- Date (date) - Publication date
- Slug (rich_text) - URL-friendly version (optional, auto-generated from title)
- Tags (multi_select) - Categories for organizing posts
- Description (rich_text) - Brief summary for meta tags
- **Page Body** - Write your full blog post content directly in the page (below properties)

**Quotes Database:**
- Quote (title) - The actual quote text
- Author (rich_text) - Who said it
- Source (rich_text) - Book, speech, etc. (optional)
- Date (date) - When you added it
- Published (checkbox) - Controls visibility on website

### Sync Process

1. **Thoughts**: Creates individual markdown files in `thoughts/` folder with proper frontmatter
2. **Quotes**: Creates a JSON data file at `_data/quotes.json` that the quotes page uses

## Usage

### Manual Sync
```bash
node scripts/sync-notion.js
```

### Automatic Sync
- GitHub Actions runs daily at 9 AM UTC
- Can be triggered manually from GitHub Actions tab
- Runs when sync script is updated

## Setting Up New Content

### Adding a New Blog Post
1. Open your Notion "Thoughts" database
2. Click "New" to create a new page
3. Set the title, date, description, and tags in the properties
4. Write your blog post content directly in the page body (below the properties)
5. Check the "Published" checkbox when ready to publish
6. Wait for next sync or trigger manually

### Adding a New Quote
1. Open your Notion "Quotes" database  
2. Add the quote text in the "Quote" field
3. Fill in the author and source (optional)
4. Check the "Published" checkbox
5. Wait for next sync or trigger manually

## Troubleshooting

If sync fails:
1. Check that your Notion integration has access to the page
2. Verify that NOTION_INTEGRATION_SECRET and NOTION_PAGE_URL are set correctly
3. Make sure the "Published" checkbox is checked for content you want to sync
4. Check the GitHub Actions logs for detailed error messages

## Content Guidelines

- Use Notion's rich text formatting (bold, italic, code, etc.)
- For thoughts: Content can include headings, lists, quotes, and code blocks
- For quotes: Keep quotes concise and meaningful
- Always fill in required fields (Title, Quote, Author)
- Use the Published checkbox to control what appears on your website