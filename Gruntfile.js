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
            all: ['src/*.js', 'test/*.js']
        },

        qunit: {
            all: ['test/**/*.html'],
            options: {
                //'--web-security': 'no',
                coverage: {
                    disposeCollector: true,
                    src: ['src/**/*.js'],
                    instrumentedFiles: 'temp/',
                    lcovReport: 'report/',
                    jsonReport: 'report/',
                    linesThresholdPct: 95
                }
            }
        },

        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['jshint', 'qunit'],
                options: {
                    spawn: true
                }
            }
        },

        uglify: {
            options: {
                banner: '/** <%= pkg.name %> v<%= pkg.version %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.jquery.js',
                dest: 'build/<%= pkg.name %>.jquery.min.js'
            },
            build_with_extras: {
                src: ['src/<%= pkg.name %>.jquery.js', 'src/<%= pkg.name %>.extras.js'],
                dest: 'build/<%= pkg.name %>.full.jquery.min.js'
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-qunit-istanbul');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default tasks to run
    grunt.registerTask('default', ['jshint', 'qunit', 'uglify']);
};