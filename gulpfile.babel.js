//1. import 부터 만들기
import gulp from "gulp";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ejs from "gulp-ejs";
import inlineSource from "gulp-inline-source-html";

const sass = gulpSass(dartSass);
//2. route 추가
const routes = {
  html: {
    src: "src/**/*.html",
    dest: "build/",
  },
  img: {
    watch: "src/img/*",
    src: "src/img/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css",
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js",
  },
};

const html = () =>
  gulp
    .src(routes.html.src)
    .pipe(ejs())
    .pipe(inlineSource({ compress: false }))
    .pipe(gulp.dest(routes.html.dest));

const clean = () => del(["build/"]);

const webserver = () =>
  gulp.src("build").pipe(
    ws({
      livereload: true,
      open: true,
    }),
  );

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

//"error",sass.logError : 터미널에 스타일 오류 확인 가능
const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      }),
    )
    .pipe(gulp.dest(routes.js.dest));

const watch = () => {
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([html, styles, js]);

//두가지 task를 병행하게 함.
const live = gulp.parallel([webserver, watch]);

//gulp series를 실행할 때 마다 prepare, assets, postDev를 실행한다.
export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);

// gulp.src() : gulp 작업 타겟들의 경로 및 형식을 지정!
// gulp.pipe() : pipe를 통과시키면서 추가 작업을 함!
// gulp.series() : 여러 task 를 전달받아 직렬 실행해주는 메소드
// gulp.dest("폴더명") : 여기에 결과물을 생성!
// export는 package.json에서 쓸 command만 해주면 됨.
// 만약 clean을 export 하지 않는다면, console 이나 package.json에서 사용하지 못함.
