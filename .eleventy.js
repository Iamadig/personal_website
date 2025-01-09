module.exports = function(eleventyConfig) {
  // Copy CSS directory to output
  eleventyConfig.addPassthroughCopy("css");

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