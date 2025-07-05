const { sync } = require('./sync-notion');
const fs = require('fs');
const path = require('path');

console.log("🧪 Running Complete Notion CMS Test\n");

async function runTests() {
    try {
        // Test 1: Verify connection to Notion
        console.log("1. Testing Notion connection...");
        const { getNotionDatabases } = require('./notion-client');
        const databases = await getNotionDatabases();
        
        if (databases.length === 0) {
            throw new Error("No databases found - check your Notion integration");
        }
        
        const thoughtsDb = databases.find(db => 
            db.title[0]?.plain_text?.toLowerCase() === 'thoughts'
        );
        const quotesDb = databases.find(db => 
            db.title[0]?.plain_text?.toLowerCase() === 'quotes'
        );
        
        if (!thoughtsDb) {
            throw new Error("Thoughts database not found");
        }
        if (!quotesDb) {
            throw new Error("Quotes database not found");
        }
        
        console.log("✅ Found both Thoughts and Quotes databases");
        
        // Test 2: Run sync
        console.log("\n2. Testing sync functionality...");
        await sync();
        console.log("✅ Sync completed without errors");
        
        // Test 3: Verify file structure
        console.log("\n3. Verifying file structure...");
        
        // Check _data/quotes.json exists
        const quotesFile = path.join(__dirname, '..', '_data', 'quotes.json');
        if (!fs.existsSync(quotesFile)) {
            throw new Error("Quotes data file not created");
        }
        
        const quotesData = JSON.parse(fs.readFileSync(quotesFile, 'utf8'));
        console.log(`✅ Quotes file exists with ${quotesData.length} quotes`);
        
        // Test 4: Verify thoughts directory
        const thoughtsDir = path.join(__dirname, '..', 'thoughts');
        if (!fs.existsSync(thoughtsDir)) {
            throw new Error("Thoughts directory not found");
        }
        
        const thoughtFiles = fs.readdirSync(thoughtsDir).filter(f => f.endsWith('.md'));
        console.log(`✅ Thoughts directory exists with ${thoughtFiles.length} published posts`);
        
        // Test 5: Check GitHub Actions workflow
        console.log("\n4. Checking GitHub Actions workflow...");
        const workflowFile = path.join(__dirname, '..', '.github', 'workflows', 'sync-notion.yml');
        if (!fs.existsSync(workflowFile)) {
            throw new Error("GitHub Actions workflow file not found");
        }
        console.log("✅ GitHub Actions workflow file exists");
        
        // Test 6: Verify environment variables
        console.log("\n5. Testing environment variables...");
        if (!process.env.NOTION_INTEGRATION_SECRET) {
            throw new Error("NOTION_INTEGRATION_SECRET not set");
        }
        if (!process.env.NOTION_PAGE_URL) {
            throw new Error("NOTION_PAGE_URL not set");
        }
        console.log("✅ All environment variables are set");
        
        // Test 7: Test markdown generation
        console.log("\n6. Testing markdown generation...");
        if (thoughtFiles.length > 0) {
            const sampleFile = path.join(thoughtsDir, thoughtFiles[0]);
            const content = fs.readFileSync(sampleFile, 'utf8');
            
            if (!content.includes('---')) {
                throw new Error("Frontmatter not found in generated markdown");
            }
            if (!content.includes('layout: blog-post.njk')) {
                throw new Error("Layout not set correctly in frontmatter");
            }
            console.log("✅ Markdown files have correct format");
        } else {
            console.log("⚠️ No published thoughts to test markdown generation");
        }
        
        console.log("\n🎉 All tests passed! Your Notion CMS is ready for production.");
        console.log("\nNext steps:");
        console.log("1. Push code to GitHub");
        console.log("2. Add secrets to GitHub repository");
        console.log("3. Enable GitHub Actions");
        console.log("4. Start creating content in Notion!");
        
    } catch (error) {
        console.error("\n❌ Test failed:", error.message);
        console.error("\nPlease fix the issue before pushing to production.");
        process.exit(1);
    }
}

runTests();