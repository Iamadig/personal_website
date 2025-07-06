const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

// Initialize Notion client
const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_SECRET,
});

// Initialize NotionToMarkdown converter
const n2m = new NotionToMarkdown({ notionClient: notion });

// Extract the page ID from the Notion page URL
function extractPageIdFromUrl(pageUrl) {
    const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
    if (match && match[1]) {
        return match[1];
    }
    throw new Error("Failed to extract page ID from URL");
}

// Extract page ID only when needed to avoid module loading errors
function getNotionPageId() {
    if (!process.env.NOTION_PAGE_URL) {
        throw new Error("NOTION_PAGE_URL environment variable is not set");
    }
    return extractPageIdFromUrl(process.env.NOTION_PAGE_URL);
}

/**
 * Lists all child databases contained within NOTION_PAGE_ID
 */
async function getNotionDatabases() {
    const childDatabases = [];

    try {
        let hasMore = true;
        let startCursor = undefined;

        while (hasMore) {
            const response = await notion.blocks.children.list({
                block_id: getNotionPageId(),
                start_cursor: startCursor,
            });

            for (const block of response.results) {
                if (block.type === "child_database") {
                    const databaseId = block.id;

                    try {
                        const databaseInfo = await notion.databases.retrieve({
                            database_id: databaseId,
                        });

                        childDatabases.push(databaseInfo);
                    } catch (error) {
                        console.error(`Error retrieving database ${databaseId}:`, error);
                    }
                }
            }

            hasMore = response.has_more;
            startCursor = response.next_cursor || undefined;
        }

        return childDatabases;
    } catch (error) {
        console.error("Error listing child databases:", error);
        throw error;
    }
}

/**
 * Find a Notion database with the matching title
 */
async function findDatabaseByTitle(title) {
    const databases = await getNotionDatabases();

    for (const db of databases) {
        if (db.title && Array.isArray(db.title) && db.title.length > 0) {
            const dbTitle = db.title[0]?.plain_text?.toLowerCase() || "";
            if (dbTitle === title.toLowerCase()) {
                return db;
            }
        }
    }

    return null;
}

/**
 * Query a database and return all published entries
 */
async function queryDatabase(databaseId) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: "Published",
                checkbox: {
                    equals: true
                }
            }
        });

        return response.results;
    } catch (error) {
        console.error("Error querying database:", error);
        throw error;
    }
}

/**
 * Convert Notion blocks to markdown using the notion-to-md library
 */
async function blocksToMarkdown(pageId) {
    try {
        const mdblocks = await n2m.pageToMarkdown(pageId);
        const mdString = n2m.toMarkdownString(mdblocks);
        // toMarkdownString returns an object with a 'parent' property containing the markdown
        return mdString.parent || mdString || "";
    } catch (error) {
        console.error("Error converting blocks to markdown:", error);
        return "";
    }
}

// Custom conversion functions removed - now using notion-to-md library

/**
 * Create a URL-friendly slug from a title
 */
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

module.exports = {
    notion,
    getNotionPageId,
    getNotionDatabases,
    findDatabaseByTitle,
    queryDatabase,
    blocksToMarkdown,
    createSlug
};