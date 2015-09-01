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
            all: ['test/*.html']
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
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default tasks to run
    grunt.registerTask('default', ['jshint', 'qunit', 'uglify']);
};