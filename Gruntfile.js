/*jshint camelcase: false */
/*global module:false */
module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      spec: {
        files: ['spec/**/*.js', 'spec/**/*.coffee'],
        tasks: ['spec:generate:specs', 'spec:generate:runner'],
      },
    },
  });

  grunt.registerTask("default", ["watch"]);

  grunt.registerTask('spec:generate:runner', 'Builds spec require file.', function() {
    var specFiles = grunt.file.expand("spec/**/*_spec.js", "spec/**/*_spec.coffee");
    specFiles = specFiles
      .map(function(fileName) {
        return fileName.replace(/\.coffee/, "").replace(/\.js/, "");
      })
      .map(function(fileName) {
        return "require('" + fileName + "');";
      });
    grunt.file.write("spec/runner.js", specFiles.join("\n"));
  });

  grunt.registerTask("spec:generate:specs", "Generates missing specs files", function() {
    var jsFiles = grunt.file.expand("src/**/*.js", "src/**/*.coffee");

    jsFiles.forEach(function(fileName) {
      var specFileName = "spec/" + fileName.replace(/\.(coffee|js)$/, "_spec.coffee");
      var fileBase = fileName.split("/");
      fileBase = fileBase[fileBase.length - 1].replace(/\..+$/, "");

      var modelName = fileBase.replace(/(^\w|_\w)/g, function(match) {
          return match.replace("_", "").toUpperCase();
      });

      if (!grunt.file.exists(specFileName)) {
        var fileContents = "`import " + modelName + " from '" + fileName.replace(/^src/, "balanced").replace(/\..+$/, "") +  "'`\n\ndescribe '" + modelName + "', ->";
        grunt.file.write(specFileName, fileContents);
      }
    });
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

};
