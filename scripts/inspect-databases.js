const { getNotionDatabases } = require('./notion-client');

async function inspectDatabases() {
    try {
        console.log("Inspecting your Notion databases...\n");
        
        const databases = await getNotionDatabases();
        
        if (databases.length === 0) {
            console.log("No databases found in your Notion page.");
            return;
        }
        
        for (const db of databases) {
            const title = db.title[0]?.plain_text || "Untitled";
            console.log(`Database: ${title}`);
            console.log(`ID: ${db.id}`);
            console.log("Properties:");
            
            for (const [propName, propConfig] of Object.entries(db.properties)) {
                console.log(`  - ${propName}: ${propConfig.type}`);
                
                // Show options for select/multi-select
                if (propConfig.type === 'select' && propConfig.select.options) {
                    console.log(`    Options: ${propConfig.select.options.map(o => o.name).join(', ')}`);
                }
                if (propConfig.type === 'multi_select' && propConfig.multi_select.options) {
                    console.log(`    Options: ${propConfig.multi_select.options.map(o => o.name).join(', ')}`);
                }
            }
            console.log("---\n");
        }
    } catch (error) {
        console.error("Error inspecting databases:", error);
    }
}

inspectDatabases();