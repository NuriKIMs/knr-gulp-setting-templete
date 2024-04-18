//1. import 부터 만들기
import gulp from "gulp";
import gpug from "gulp-pug";
import htmlmin from "gulp-htmlmin";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
//To use gulp-sass in an ECMAScript module
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import autoprefixer from "gulp-autoprefixer"; //구형에서 호환할 수 있도록 지원
import miniCSS from "gulp-csso"; //css파일 최소화
import bro from "gulp-bro";
import babelify from "babelify";
import fileinclude from "gulp-file-include";
// import browserSync from "browser-sync";

// const bs = browserSync.create();

//2. route 추가
const routes = {
  html: {
    watch: "src/**/*.html",
    src: "src/*.html",
    dest: "src/dist",
  },
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "dist",
  },
  img: {
    watch: "src/img/*",
    src: "src/img/*",
    dest: "dist/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "dist/css",
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "dist/js",
  },
};

//3. 변수추가 (공식문서 확인) 소스 찾아서~연결하고~빌드까지
const html = () =>
  gulp
    .src(routes.html.src)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "/knr-gulp-setting-templete/src",
      }),
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(routes.html.dest));
// .pipe(bs.stream());

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

//작업 후 삭제
const clean = () => del(["dist/"]);

const webserver = () =>
  gulp.src("dist").pipe(
    ws({
      livereload: true,
      // directoryListing: true,
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
  gulp.watch(routes.html.watch, html);
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([html, pug, styles, js]);

// BrowserSync를 시작하는 task 추가
const live = gulp.series([
  webserver,
  watch,
  // function () {
  //   bs.init({
  //     server: "./dist",
  //   });
  // },
]);

//gulp series를 실행할 때 마다 prepare, assets, postDev를 실행한다.
export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);

// gulp.src() : gulp 작업 타겟들의 경로 및 형식을 지정!
// gulp.pipe() : pipe를 통과시키면서 추가 작업을 함!
// gulp.series() : 여러 task 를 전달받아 직렬 실행해주는 메소드
// gulp.dest("폴더명") : 여기에 결과물을 생성!
// export는 package.json에서 쓸 command만 해주면 됨.
// 만약 clean을 export 하지 않는다면, console 이나 package.json에서 사용하지 못함.
