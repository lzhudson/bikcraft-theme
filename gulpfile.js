// Adicionando dependências
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Função paraa compilar o SASS e adicionar os prefixos
function compilaSass(){
  return gulp.src('css/scss/**/*.scss')
         .pipe(sass({
           outputStyle: 'expanded'
          }))
         .pipe(autoprefixer({
           overrideBrowserslist: ['last 2 versions'],
           cascade: false
         }))
         .pipe(gulp.dest('css/'))
         .pipe(browsersync.stream());
}

// Tarefa de gulp para a função de sass
gulp.task('sass', compilaSass);

// Função para concatencar os arquivos js
function gulpJS() {
  return gulp.src('./js/main/*.js')
         .pipe(concat('main.js'))
         .pipe(babel({
            presets:['@babel/preset-env']
          }))
         .pipe(uglify())
         .pipe(gulp.dest('./js/'))
         .pipe(browsersync.stream())
}

gulp.task('mainjs', gulpJS);

function pluginJS(){
  return gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/moment/min/moment.min.js',
    './js/plugins/*.js'
  ])
  //.pipe(uglify())
  .pipe(concat('plugins.js'))
  .pipe(gulp.dest('./js/'))
  .pipe(browsersync.stream())
}
gulp.task('pluginjs', pluginJS);

// Função para iniciar o browser.
function browser() {
  browsersync.init({
    server: {
      baseDir: "./"
    }
  })
}

// Tarefa para inicar o browser-synnc
gulp.task('browser-sync', browser);

// Função de Watch do gulp
function watch() {
  gulp.watch('css/scss/**/*.scss', compilaSass);
  gulp.watch('js/main/*.js', gulpJS);
  gulp.watch('js/plugins/*.js', pluginJS)
  gulp.watch(['*.html', '*.php']).on('change', browsersync.reload);
}

// Inicia a tarefa de watch
gulp.task('watch', watch);

// Tarefa padrão do gulp, que inicia o watch e o browser sync
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass','mainjs', 'pluginjs'));