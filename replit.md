# Adi's Personal Website

## Overview

This is a personal website built with Eleventy (11ty), a static site generator. The site serves as a personal blog and portfolio where Adi shares thoughts on entrepreneurship, startup ecosystems, and business insights. The site features a minimalist design with a focus on content readability and clean typography.

## System Architecture

### Static Site Generation
- **Technology**: Eleventy (11ty) v3.0.0
- **Build Process**: Markdown files are processed through Nunjucks templates to generate static HTML
- **Output Directory**: `docs/` (configured for GitHub Pages compatibility)
- **Template Engine**: Nunjucks for HTML, Markdown, and data processing

### Content Management System
- **Primary CMS**: Notion integration for content creation and management
- **Content Sync**: Automated GitHub Actions workflow syncs content from Notion to static files
- **Blog Posts**: Notion "Thoughts" database → Individual markdown files in `thoughts/` directory
- **Quotes**: Notion "Quotes" database → JSON data file at `_data/quotes.json`
- **Fallback**: Manual markdown file editing still supported
- **Assets**: CSS and other static files copied to output directory

## Key Components

### Frontend Architecture
- **Styling**: Custom CSS with CSS variables for theming
- **Typography**: Roboto font family from Google Fonts
- **Theme System**: Light/dark mode toggle functionality
- **Responsive Design**: Mobile-first approach with flexible layouts

### Content Types
1. **Home Page**: Personal introduction and bio
2. **Thoughts**: Blog posts about entrepreneurship and business insights
3. **Quotes**: Curated collection of meaningful quotes
4. **Resources**: Planned section for useful links and resources (currently WIP)

### Template System
- **Base Template**: `base.njk` for common layout elements
- **Blog Template**: `blog-post.njk` for individual blog posts
- **Navigation**: Consistent navigation across all pages
- **Date Formatting**: Custom filter for date display

## Data Flow

1. **Content Creation**: Markdown files with frontmatter metadata
2. **Template Processing**: Eleventy processes MD files through Nunjucks templates
3. **Static Generation**: HTML files generated in `docs/` directory
4. **Asset Copying**: CSS and other static assets copied to output
5. **Deployment**: Static files can be served from any web server

## External Dependencies

### Build Dependencies
- **@11ty/eleventy**: Core static site generator
- **@notionhq/client**: Official Notion API client for content sync
- **Node.js**: Runtime environment for build process

### Content Management Dependencies
- **Notion API**: Content management and storage
- **GitHub Actions**: Automated content synchronization
- **Notion Integration**: Custom integration for API access

### Frontend Dependencies
- **Google Fonts**: Roboto font family
- **Custom CSS**: No external CSS frameworks

### Content Dependencies
- **Markdown**: Content authoring format (generated from Notion)
- **Frontmatter**: YAML metadata for posts and pages
- **JSON Data**: Structured data for quotes and other content

## Deployment Strategy

### Static Hosting
- **Output Directory**: `docs/` configured for GitHub Pages
- **Build Process**: Local development with `eleventy --serve`
- **Production**: Static files can be deployed to any static hosting service

### Development Workflow
1. Edit Markdown content files
2. Run Eleventy build process
3. Preview changes locally
4. Deploy static files to hosting service

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
- July 05, 2025. Added Notion CMS integration with automated content sync
  - Created Notion API client and sync scripts
  - Set up GitHub Actions workflow for daily automated syncing
  - Updated quotes page to use dynamic data from Notion
  - Added support for rich text formatting in blog posts
  - Implemented slug generation and frontmatter handling
- July 06, 2025. Migrated from Replit Agent to Replit environment
  - Fixed Eleventy server configuration for proper port binding
  - Merged GitHub Actions workflows for streamlined deployment
  - Single workflow now handles Notion sync + deployment in one process
  - Optimized for seamless content updates from Notion to live website
  - Fixed critical Notion sync bug preventing module loading
  - Updated quotes and thoughts pages to use dynamic Notion data instead of hardcoded content
  - Added thoughts collection to Eleventy config for proper blog post listing
  - Removed duplicate static content files to make Notion the single source of truth
  - Enhanced GitHub Actions with clean builds and cache-busting for reliable deployments
  - Fixed unpublished thoughts issue - now properly removes unpublished content from website
  - Replaced custom markdown converter with professional notion-to-md library
  - Now supports all Notion formatting perfectly with pixel-perfect conversion:
    - Callouts with proper styling and emojis
    - Images with captions (uploaded and external)
    - Rich text formatting (bold, italic, strikethrough, underline, code)
    - Code blocks with syntax highlighting
    - Tables, databases, and complex layouts
    - Nested content and block relationships
    - Toggle sections, todo lists, and dividers
    - Mentions, links, and embedded content
  - Fixed "[object Object]" issue in blog posts by correcting notion-to-md library usage
  - Blog posts now display proper content instead of object references
- July 06, 2025. Major code refactoring and architecture improvements
  - Consolidated CSS files: removed duplicate style.css, renamed style-enhanced.css to style.css
  - Removed conflicting font imports (Roboto) keeping only Inter + Crimson Text pairing
  - Extracted theme toggle JavaScript to separate file (js/theme-toggle.js) for better organization
  - Improved CSS architecture with clear sectional organization and professional commenting
  - Enhanced code maintainability with logical grouping:
    * CSS Custom Properties (Variables)
    * Reset & Base Styles 
    * Typography
    * Layout & Structure
    * Header & Navigation
    * Thoughts & Quotes Components
    * Footer & Social Links
    * Responsive Design
    * Print Styles
  - Added comprehensive code documentation for future maintenance
  - Created reusable list item component template for DRY principle
  - Optimized font loading with proper display=swap for performance
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```