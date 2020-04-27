var gulp        = require('gulp')
var browserSync = require('browser-sync')
var sass        = require('gulp-sass')
var cssnano     = require('gulp-cssnano')
var prefix      = require('gulp-autoprefixer')
var concat      = require('gulp-concat')
var uglify      = require('gulp-uglify')
var cp          = require('child_process')

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future Jekyll builds)
 */
function styles() {
  browserSync.notify('Compiling Sass…')
  return gulp.src(['_sass/pages.scss', '_sass/posts.scss'])
    .pipe(sass({
      includePaths: ['scss'],
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 3 versions', '> 1%', 'ie 8'], { cascade: true }))
    .pipe(gulp.dest('public/assets/css/'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('static/assets/css/'))
}

function stylesProd() {
  return gulp.src(['_sass/pages.scss', '_sass/posts.scss'])
    .pipe(sass({
      includePaths: ['scss'],
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 3 versions', '> 1%', 'ie 8'], { cascade: true }))
    .pipe(cssnano())
    .pipe(gulp.dest('public/assets/css/'))
    .pipe(gulp.dest('static/assets/css/'))
}

/**
 * Compile files from _js into both _site/js (for live injecting) and site (for future jekyll builds)
 */
function scripts() {
  browserSync.notify('Concatenating scripts…')
  return gulp.src(['_js/lib/*.js', '_js/custom.js'])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('static/assets/js'))
}

function scriptsProd() {
  return gulp.src(['_js/lib/*.js', '_js/custom.js'])
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'))
    .pipe(gulp.dest('static/assets/js'))
}

/**
 * Server functionality handled by BrowserSync
 */
function browserSyncServe(done) {
  browserSync.init({
    server: 'public',
    port: 4321
  })
  done()
}

function browserSyncReload(done) {
  browserSync.reload()
  done()
}

/**
 * Build Hugo site
 */
function hugoDev(done) {
  browserSync.notify('Rebuilding Hugo…')
  var args = ['-e', 'development']
  return cp.spawn('hugo', args, {stdio: 'inherit'}).on('close', done)
}

function hugoProd(done) {
  browserSync.notify('Rebuilding Hugo…')
  var args = ['-e', 'production']
  return cp.spawn('hugo', args, {stdio: 'inherit'}).on('close', done)
}

/**
 * Watch source files for changes & recompile
 * Watch html/md files, run Jekyll & reload BrowserSync
 */
function watchMarkup() {
  gulp.watch(['layouts/**/*.html', 'content/**/*.{md,html}'], gulp.series(hugoDev, browserSyncReload))
}

function watchScripts() {
  gulp.watch(['_js/**/*.js'], scripts)
}

function watchStyles() { 
  gulp.watch(['_sass/**/*.scss','_sass/*.scss'], styles)
}

var compile = gulp.parallel(styles, scripts)
var compileProd = gulp.parallel(stylesProd, scriptsProd)

var serve = gulp.series(compile, hugoDev, browserSyncServe)
var watch = gulp.parallel(watchMarkup, watchScripts, watchStyles)

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the Jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', gulp.parallel(serve, watch))
gulp.task('build', gulp.series(compileProd, hugoProd))
