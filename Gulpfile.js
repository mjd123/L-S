var fs = require('fs');

var json = JSON.parse(fs.readFileSync('./package.json'));

//paths
var theme = './';

// Load plugins
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const cp = require('child_process');
//const eslint = require("gulp-eslint");
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const gulp = require('gulp');
const babel = require('gulp-babel');
//const uglify = require('gulp-uglify-es').default;
const bro = require('gulp-bro');

// const BABEL_POLYFILL = './node_modules/@babel/polyfill/browser.js';

const { series, parallel, src, dest } = require('gulp');

// // Options
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
};

var autoPrefixerOptions = {
    // browsers: ['last 10 versions', '> 5%', 'Firefox ESR'],
    remove: false,
    cascade: false,
};

const srcs = {
    css: {
        in: [theme + 'scss/**/*.scss'],
        out: theme + 'build/css/',
    },
    js: {
        inUgly: [theme + 'js/**.js'],
        //inSame: [`${theme}assets/libs/*.js`],
        out: theme + 'build/js/',
    },
};

function browserSync() {
    return browsersync.init({
        server: {
            baseDir: './',
        },
    });
}

function browserSyncReload(done) {
    browsersync.reload();
    // done();
}

function exceptionLog(error) {
    console.log(error.toString());
    this.emit('end');
}

// CSS task
function css() {
    return src(srcs.css.in)
        .pipe(plumber())
        .pipe(sass(sassOptions))
        .on(
            'error',
            notify.onError(function (error) {
                return 'Problem file -> ' + error.message;
            })
        )
        .pipe(postcss([autoprefixer(autoPrefixerOptions)]))
        .pipe(dest(srcs.css.out))
        .pipe(browsersync.stream())
        .on('error', exceptionLog);
}

function js() {
    return (
        src(srcs.js.inUgly)
            .pipe(bro())
            //.pipe(uglify())
            .pipe(
                babel({
                    presets: [['@babel/env', { loose: true, modules: false }]],
                })
            )
            .pipe(dest(srcs.js.out))
            .pipe(browsersync.stream())
    );
}

// Watch files
function watchFiles(done) {
    gulp.watch(srcs.css.in, css);
    gulp.watch(srcs.js.inUgly, js);
    gulp.watch(theme + '**/*').on('change', browserSyncReload);
}

// define complex tasks
const build = gulp.parallel(css, js);
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.css = css;
exports.js = js;
exports.build = build;
exports.dev = watch;
exports.default = build;
exports.browsersync = browserSync;
