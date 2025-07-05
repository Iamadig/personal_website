#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const owner = 'Iamadig';
const repo = 'personal_website';
const branch = 'main';
const token = process.env.GITHUB_TOKEN;

if (!token) {
    console.error('GITHUB_TOKEN environment variable is required');
    process.exit(1);
}

// Files to push
const filesToPush = [
    'scripts/sync-notion.js',
    'scripts/notion-client.js',
    'scripts/test-sync.js',
    'scripts/test-complete-workflow.js',
    'scripts/inspect-databases.js',
    'scripts/README.md',
    '.github/workflows/sync-notion.yml',
    'thoughts/why-global-founders-cannot-afford-to-ignore-saudi-arabia.md',
    '_data/quotes.json',
    'replit.md',
    'package.json',
    'package-lock.json'
];

async function pushToGitHub() {
    console.log('Starting GitHub push...');
    
    try {
        // Get current commit SHA
        const currentSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
        console.log('Current SHA:', currentSha);
        
        // Create a new commit with updated files
        const commitMessage = 'Add Notion CMS integration and sync latest content';
        
        // Use GitHub API to create commit
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
        
        console.log('Files ready for upload:');
        filesToPush.forEach(file => {
            if (fs.existsSync(file)) {
                console.log(`✓ ${file}`);
            } else {
                console.log(`✗ ${file} (not found)`);
            }
        });
        
        console.log('\nUse git push with the updated token:');
        console.log(`git remote set-url origin https://oauth2:${token}@github.com/${owner}/${repo}.git`);
        console.log('git push origin main');
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

pushToGitHub();