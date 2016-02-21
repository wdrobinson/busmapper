// Include Gulp
var gulp = require('gulp');
var del = require('del');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

var dest = 'app/dist/';
var cssFiles = ['app/app.css'];
var jsFiles = ['app/app.js', 'app/BusMapper/*.js', 'app/shared/*.js', 'app/components/mapControls/*.js', 'app/components/mapControls/mapRefresh/*.js', 'app/components/mapControls/mapTitle/*.js', 'app/components/mapControls/mapInfo/*.js', 'app/js/*.js'];

gulp.task('css', function() {

    gulp.src(plugins.mainBowerFiles().concat(cssFiles))
        .pipe(plugins.filter('*.css'))
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(dest + 'css'));
});

gulp.task('js', function() {

    gulp.src(plugins.mainBowerFiles().concat(jsFiles))
        .pipe(plugins.filter('*.js'))
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest + 'js'));

});

gulp.task('default', ['css','js']);

gulp.task('watch', function() {
  gulp.watch(jsFiles,  ['js']);
  gulp.watch(cssFiles,  ['css']);
});