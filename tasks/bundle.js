/*
Build a bundled app.js file using browserify
*/
module.exports = function(grunt) {

  var async = require("async");
  var babel = require("babelify");
  var browserify = require("browserify");
  var exorcist = require("exorcist");
  var fs = require("fs");

  var rollup = require("rollup").rollup;
  var rollupNodeResolve = require("rollup-plugin-node-resolve");
  var rollupCommonJS = require("rollup-plugin-commonjs");
  var rollupBabel = require("rollup-plugin-babel");

  // var babel = require("@babel/core");

  grunt.registerTask("bundle", "Build app.js using browserify", async function(mode) {
    //run in dev mode unless otherwise specified
    mode = mode || "dev";
    var done = this.async();

    //specify starter files here - if you need additionally built JS, just add it.
    var config = grunt.file.readJSON("project.json");
    var seeds = config.scripts;

    for (var input in seeds) {
      var result = await rollup({
        input,
        plugins: [
          rollupNodeResolve(),
          rollupCommonJS(),
          rollupBabel({
            presets: [
              ["@babel/preset-env", {
                targets: { browsers: ["edge 14", "safari >= 10"] },
                loose: true
              }]
            ]
          })
        ]
      });
      await result.write({
        file: seeds[input],
        format: "iife",
        sourcemap: true
      });
    }

    done();

  });

};
