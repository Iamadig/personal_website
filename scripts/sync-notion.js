const fs = require('fs');
const path = require('path');
const { 
    findDatabaseByTitle, 
    queryDatabase, 
    blocksToMarkdown, 
    createSlug 
} = require('./notion-client');

/**
 * Extract text from rich text property
 */
function extractRichText(richTextProperty) {
    if (!richTextProperty || !richTextProperty.length) return "";
    return richTextProperty.map(text => text.plain_text).join("");
}

/**
 * Extract title from title property
 */
function extractTitle(titleProperty) {
    if (!titleProperty || !titleProperty.length) return "";
    return titleProperty.map(text => text.plain_text).join("");
}

/**
 * Extract date from date property
 */
function extractDate(dateProperty) {
    if (!dateProperty || !dateProperty.start) return null;
    return dateProperty.start;
}

/**
 * Extract multi-select values
 */
function extractMultiSelect(multiSelectProperty) {
    if (!multiSelectProperty || !multiSelectProperty.length) return [];
    return multiSelectProperty.map(option => option.name);
}

/**
 * Sync thoughts from Notion to markdown files
 */
async function syncThoughts() {
    try {
        console.log("Syncing thoughts from Notion...");
        
        const thoughtsDb = await findDatabaseByTitle("Thoughts");
        if (!thoughtsDb) {
            console.log("Thoughts database not found");
            return;
        }

        const thoughts = await queryDatabase(thoughtsDb.id);
        console.log(`Found ${thoughts.length} published thoughts`);

        // Ensure thoughts directory exists (always relative to project root)
        const projectRoot = path.resolve(__dirname, '..');
        const thoughtsDir = path.join(projectRoot, 'thoughts');
        if (!fs.existsSync(thoughtsDir)) {
            fs.mkdirSync(thoughtsDir, { recursive: true });
        }

        // Clean up existing thoughts files (remove unpublished ones)
        const existingFiles = fs.readdirSync(thoughtsDir).filter(file => file.endsWith('.md'));
        for (const file of existingFiles) {
            fs.unlinkSync(path.join(thoughtsDir, file));
        }
        console.log(`Cleaned up ${existingFiles.length} existing thought files`);

        for (const thought of thoughts) {
            const properties = thought.properties;
            
            // Extract data from properties
            const title = extractTitle(properties.Title?.title);
            const description = extractRichText(properties.Description?.rich_text);
            const date = extractDate(properties.Date?.date);
            const tags = extractMultiSelect(properties.Tags?.multi_select);
            let slug = extractRichText(properties.Slug?.rich_text);
            
            // Generate slug if not provided
            if (!slug) {
                slug = createSlug(title);
            }

            // Get content from the page body (not from Content property)
            const content = await blocksToMarkdown(thought.id);
            
            // Create frontmatter
            const frontmatter = [
                '---',
                'layout: blog-post.njk',
                `title: ${title}`,
                date ? `date: ${date}` : '',
                description ? `description: ${description}` : '',
                tags.length > 0 ? `tags: \n${tags.map(tag => `  - ${tag}`).join('\n')}` : '',
                '---'
            ].filter(line => line !== '').join('\n');

            // Create full markdown content
            const markdownContent = frontmatter + '\n\n' + content;

            // Write to file
            const filename = `${slug}.md`;
            const filepath = path.join(thoughtsDir, filename);
            
            fs.writeFileSync(filepath, markdownContent);
            console.log(`Created/updated: ${filename}`);
        }
        
        console.log("Thoughts sync complete!");
    } catch (error) {
        console.error("Error syncing thoughts:", error);
    }
}

/**
 * Sync quotes from Notion to JSON data file
 */
async function syncQuotes() {
    try {
        console.log("Syncing quotes from Notion...");
        
        const quotesDb = await findDatabaseByTitle("Quotes");
        if (!quotesDb) {
            console.log("Quotes database not found");
            return;
        }

        const quotes = await queryDatabase(quotesDb.id);
        console.log(`Found ${quotes.length} published quotes`);

        // Ensure _data directory exists (always relative to project root)
        const projectRoot = path.resolve(__dirname, '..');
        const dataDir = path.join(projectRoot, '_data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Process quotes
        const quotesData = [];
        for (const quote of quotes) {
            const properties = quote.properties;
            
            quotesData.push({
                quote: extractTitle(properties.Quote?.title),
                author: extractRichText(properties.Author?.rich_text),
                source: extractRichText(properties.Source?.rich_text),
                date: extractDate(properties.Date?.date)
            });
        }

        // Write to JSON file
        const quotesFile = path.join(dataDir, 'quotes.json');
        fs.writeFileSync(quotesFile, JSON.stringify(quotesData, null, 2));
        console.log(`Updated quotes data file with ${quotesData.length} quotes`);
        
        console.log("Quotes sync complete!");
    } catch (error) {
        console.error("Error syncing quotes:", error);
    }
}

/**
 * Main sync function
 */
async function sync() {
    console.log("Starting Notion sync...\n");
    
    // Check if environment variables are set
    if (!process.env.NOTION_INTEGRATION_SECRET) {
        console.log("❌ NOTION_INTEGRATION_SECRET environment variable not set");
        return;
    }
    
    if (!process.env.NOTION_PAGE_URL) {
        console.log("❌ NOTION_PAGE_URL environment variable not set");
        return;
    }
    
    console.log("✅ Environment variables are set");
    console.log("✅ Starting content sync...\n");
    
    try {
        await syncThoughts();
        console.log("");
        await syncQuotes();
        
        console.log("\n✅ Notion sync completed successfully!");
    } catch (error) {
        console.error("❌ Notion sync failed:", error.message);
        throw error;
    }
}

// Run sync if called directly
if (require.main === module) {
    sync().catch(console.error);
}

module.exports = { sync, syncThoughts, syncQuotes };