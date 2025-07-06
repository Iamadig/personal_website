const { Client } = require("@notionhq/client");

// Initialize Notion client
const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_SECRET,
});

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
 * Convert Notion blocks to markdown
 */
async function blocksToMarkdown(blockId) {
    try {
        const blocks = await notion.blocks.children.list({
            block_id: blockId,
        });

        let markdown = "";

        for (const block of blocks.results) {
            markdown += await blockToMarkdown(block);
            
            // Handle nested children for blocks that can have them
            if (block.has_children && ['callout', 'toggle', 'bulleted_list_item', 'numbered_list_item'].includes(block.type)) {
                const childrenMarkdown = await blocksToMarkdown(block.id);
                if (childrenMarkdown) {
                    if (block.type === 'toggle') {
                        markdown += childrenMarkdown + "\n</details>\n\n";
                    } else {
                        markdown += childrenMarkdown;
                    }
                }
            }
        }

        return markdown;
    } catch (error) {
        console.error("Error converting blocks to markdown:", error);
        return "";
    }
}

/**
 * Convert a single Notion block to markdown
 */
async function blockToMarkdown(block) {
    switch (block.type) {
        case "paragraph":
            return richTextToMarkdown(block.paragraph.rich_text) + "\n\n";
        
        case "heading_1":
            return "# " + richTextToMarkdown(block.heading_1.rich_text) + "\n\n";
        
        case "heading_2":
            return "## " + richTextToMarkdown(block.heading_2.rich_text) + "\n\n";
        
        case "heading_3":
            return "### " + richTextToMarkdown(block.heading_3.rich_text) + "\n\n";
        
        case "bulleted_list_item":
            return "- " + richTextToMarkdown(block.bulleted_list_item.rich_text) + "\n";
        
        case "numbered_list_item":
            return "1. " + richTextToMarkdown(block.numbered_list_item.rich_text) + "\n";
        
        case "quote":
            return "> " + richTextToMarkdown(block.quote.rich_text) + "\n\n";
        
        case "code":
            const language = block.code.language || "";
            const code = richTextToMarkdown(block.code.rich_text);
            return "```" + language + "\n" + code + "\n```\n\n";
        
        case "callout":
            const calloutText = richTextToMarkdown(block.callout.rich_text);
            const emoji = block.callout.icon?.emoji || "💡";
            return `> ${emoji} **${calloutText}**\n\n`;
        
        case "image":
            const imageUrl = block.image.external?.url || block.image.file?.url;
            const caption = block.image.caption ? richTextToMarkdown(block.image.caption) : "";
            if (imageUrl) {
                return `![${caption}](${imageUrl})\n\n`;
            }
            return "";
        
        case "divider":
            return "---\n\n";
        
        case "toggle":
            const toggleTitle = richTextToMarkdown(block.toggle.rich_text);
            return `<details>\n<summary>${toggleTitle}</summary>\n\n`;
        
        case "to_do":
            const checked = block.to_do.checked ? "x" : " ";
            const todoText = richTextToMarkdown(block.to_do.rich_text);
            return `- [${checked}] ${todoText}\n`;
        
        default:
            console.log(`Unsupported block type: ${block.type}`);
            return "";
    }
}

/**
 * Convert Notion rich text to markdown
 */
function richTextToMarkdown(richText) {
    return richText.map(text => {
        let result = text.plain_text;
        
        if (text.annotations.bold) {
            result = "**" + result + "**";
        }
        
        if (text.annotations.italic) {
            result = "*" + result + "*";
        }
        
        if (text.annotations.strikethrough) {
            result = "~~" + result + "~~";
        }
        
        if (text.annotations.underline) {
            result = "<u>" + result + "</u>";
        }
        
        if (text.annotations.code) {
            result = "`" + result + "`";
        }
        
        if (text.href) {
            result = "[" + result + "](" + text.href + ")";
        }
        
        return result;
    }).join("");
}

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