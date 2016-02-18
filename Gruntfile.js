module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                curly: true,
                eqeqeq: false,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            all: ['src/**/*.js', 'test/*.js']
        },

        qunit: {
            all: ['test/**/*.html'],
            options: {
                //'--web-security': 'no',
                coverage: {
                    disposeCollector: true,
                    src: ['build/**/*.js'],
                    instrumentedFiles: 'temp/',
                    lcovReport: 'report/',
                    jsonReport: 'report/',
                    linesThresholdPct: 95
                }
            }
        },

        browserify: {
            scripts: {
                files: {
                    'build/slim-validation.jquery.js': ['src/*.js']
                }
            }
        },

        uglify: {
            options: {
                banner: '/** <%= pkg.name %> v<%= pkg.version %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.jquery.js',
                dest: 'build/<%= pkg.name %>.jquery.min.js'
            }
        },

        watch: {
            scripts: {
                files: ['src/**/*.js', 'test/**/*.js'],
                tasks: ['jshint', 'build', 'test'],
                options: {
                    spawn: true
                }
            }
        }

    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-qunit-istanbul');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');

    // Default tasks to run
    grunt.registerTask('build', ['browserify', 'uglify']);
    grunt.registerTask('test', ['qunit']);
};