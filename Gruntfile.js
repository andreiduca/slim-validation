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

        blanket_qunit: {
            all: {
                options: {
                    urls: [
                        'test/validation-rules.html?coverage=true&lcovReport'
                    ],
                    threshold: 50
                }
            }
        },

        coveralls: {
            all: {
                src: '.coverage-results/slim-validation.lcov'
            }
        },

        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['jshint', 'blanket_qunit'],
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
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-blanket-qunit');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // write lcov file on qunit end
    grunt.event.on('qunit.report', function(data) {
        grunt.file.write('.coverage-results/slim-validation.lcov', data);
    });

    // Default tasks to run
    grunt.registerTask('default', ['jshint', 'blanket_qunit', 'uglify']);
};