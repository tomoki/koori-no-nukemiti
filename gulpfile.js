const gulp       = require("gulp");
const browserify = require("browserify");
const source     = require("vinyl-source-stream");

gulp.task("build", () => {
    browserify({
        entries: ["src/index.js"],
        debug: true
    })
    .bundle()
    .pipe(source("build.js"))
    .pipe(gulp.dest("build/"));
});
