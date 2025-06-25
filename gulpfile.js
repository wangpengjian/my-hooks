const gulp = require('gulp')
const babel = require('gulp-babel')
const ts = require('gulp-typescript')
const del = require('del')

gulp.task('clean build', async () => {
  await del('dist')
  await del('lib')
  await del('es')
})

// 实现esm ts -> js
gulp.task('esm', () => {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    module: 'ESNext',
  })

  return tsProject.src()
    .pipe(tsProject())
    .pipe(babel())
    .pipe(gulp.dest('es/'))
})

// 实现commonjs esm -> cjs
gulp.task('cjs', () => {
  return gulp.src(['./es/**/*.js'])
    .pipe(babel({
      configFile: '../../.babelrc'
    }))
    .pipe(gulp.dest('lib/'))
})

// 实现 d.ts 类型声明
gulp.task('declaration', () => {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    declaration: true,
    emitDeclarationOnly: true
  })

  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest('es/'))
    .pipe(gulp.dest('lib/'))
})

// copy README.md
gulp.task('copyReadme', () => {
  return gulp.src('../../README.md')
    .pipe(gulp.dest('../../packages/hooks/'))
})

exports.default = gulp.series('clean build', 'esm', 'cjs', 'declaration', 'copyReadme')