var gulp = require('gulp');
var livereload = require('livereload');

gulp.task('test', function() {
    var server = livereload.createServer().listen(3000);
    console.log(server);
    server.watch('**/*.*');
});

gulp.task('default',['test']);
