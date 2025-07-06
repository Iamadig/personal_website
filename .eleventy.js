module.exports = function(eleventyConfig) {
  // Copy CSS and JS directories to output
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");

  // Add date filter for blog posts and footer
  eleventyConfig.addFilter("dateFormat", function(date) {
    if (date === "now") {
      date = new Date();
    }
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Add limit filter for blog posts
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });

  // Add thoughts collection
  eleventyConfig.addCollection("thoughts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("thoughts/*.md");
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "docs"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};