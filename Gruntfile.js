module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // we could just concatenate everything, really
        // but we like to have it the complex way.
        // also, in this way we do not have to worry
        // about putting files in the correct order
        // (the dependency tree is walked by r.js)
        less: {
            dist: {
                options: {
                    paths: [],
                    strictMath: false,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '++theme++business_casual/less/business_casual-compiled.css.map',
                    sourceMapFilename: 'src/plonetheme/business_casual/theme/less/business_casual-compiled.css.map',
                    modifyVars: {
                        "isPlone": "false"
                    }
                },
                files: {
                    'src/plonetheme/business_casual/theme/styles/main.css': 'src/plonetheme/business_casual/theme/less/main.less'
                }
            }
        },

        watch: {
            scripts: {
                files: ['src/plonetheme/business_casual/theme/scripts/**/*.js'],
                tasks: ['jshint', 'uglify']
            },
            stylesheets: {
              files: ['src/plonetheme/business_casual/theme/**/*.css', 'src/plonetheme/business_casual/theme/**/*.less'],
              tasks: ['less']
            },
            // html:{
            //     files: ['src/plonetheme/business_casual/theme/index.html'],
            //     tasks: ['htmlmin']
            // },
        },
        browserSync: {
            html: {
                bsFiles: {
                    src : ['src/plonetheme/business_casual/theme/less/*.less']
                },
                options: {
                    watchTask: true,
                    debugInfo: true,
                    server: {
                        baseDir: "."
                    }
                }
            },
            plone: {
                bsFiles: {
                    src : ['src/plonetheme/business_casual/theme/less/*.less']
                },
                options: {
                    watchTask: true,
                    debugInfo: true,
                    proxy: "localhost:8080"
                }
            }
        },

        jshint: {
             options: {
                reporter: require('jshint-stylish'),
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
            },

             build: ['Gruntfile.js', 'src/plonetheme/business_casual/theme/scripts/**/*.js']
        },

        uglify: {
              options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
              },
              build: {
                files: {
                  'dist/scripts/main.js': 'src/plonetheme/business_casual/theme/scripts/**/*.js'
                }
            }
        },

        cssmin: {
              options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
              },
              build: {
                files: {
                  'dist/styles/main.css': 'src/plonetheme/business_casual/theme/styles/main.css'
                }
            }
        },

        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': 'src/plonetheme/business_casual/theme/index.html',     // 'destination': 'source'
                }
            },
        },

        copy: {
          dist: {
            files: [
              // includes files within path
              {expand: true, flatten: true, src: ['src/plonetheme/business_casual/theme/*'], dest: 'dist/', filter: 'isFile'},

              // includes files within path and its sub-directories
              {expand: true, cwd: 'src/plonetheme/business_casual/theme/', src: ['views/**', 'template-overrides/**'], dest: 'dist/'},

              // makes all src relative to cwd
              // {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

              // flattens results to a single level
              // {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
            ],
          },
        },

        // make a zipfile
        compress: {
          dist: {
            options: {
              archive: 'plonetheme.business_casual.zip'
            },
            files: [
              {src: ['dist/**'], dest: '', filter: 'isFile'}, // includes files in path
            ]
          }
        },

    });

    // grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('bsync', ["browserSync:html", "watch"]);
    grunt.registerTask('plone-bsync', ["browserSync:plone", "watch"]);
    grunt.registerTask('dist', ['copy', 'jshint', 'uglify', 'cssmin', 'less', 'compress']);
};
