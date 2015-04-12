module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      js: {
        files: ['query.js'],
        tasks: ['jshint', 'simplemocha']
      },
      test: {
        files: ['tests/spec.js'],
        tasks: ['simplemocha']
      }
    },

    uglify: {
      build: {
        src: 'query.js',
        dest: 'query.min.js'
      }
    },

    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: {
        src: [
          'tests/setup.js',
          'tests/spec.js'
        ]
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish'),
        verbose: true
      },
      files: ['query.js']
    }

  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['jshint', 'simplemocha', 'watch']);
}