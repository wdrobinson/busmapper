// Include Gulp
var gulp = require('gulp');
var del = require('del');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

var dest = 'app/dist/';

gulp.task('css', function() {

    var cssFiles = ['app/app.css'];

    gulp.src(plugins.mainBowerFiles().concat(cssFiles))
        .pipe(plugins.filter('*.css'))
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.minify())
        .pipe(gulp.dest(dest + 'css'));
});

gulp.task('js', function() {

    var jsFiles = ['app/app.js', 'app/BusMapper/*.js', 'app/components/mapControls/*.js', 'app/components/mapControls/mapRefresh/*.js', 'app/components/mapControls/mapTitle/*.js', 'app/js/*.js'];

    gulp.src(plugins.mainBowerFiles().concat(jsFiles))
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest + 'js'));

});

gulp.task('default', ['css','js']);

