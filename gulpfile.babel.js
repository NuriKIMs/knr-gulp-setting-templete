import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";

const routes = {
  pug: {
    src:"src/*.pug",
    dest: "build",
},
};

export const pug = () => gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build"]);

const prepare = gulp.series([clean]);

const assets = gulp.series([pug]);

export const dev = gulp.series([prepare, assets]);

//gulp.src() : gulp 작업 타겟들의 경로 및 형식을 지정!
// gulp.pipe() : pipe를 통과시키면서 추가 작업을 함!
// gulp.series() : 여러 task 를 전달받아 직렬 실행해주는 메소드
// gulp.dest("폴더명") : 여기에 결과물을 생성!