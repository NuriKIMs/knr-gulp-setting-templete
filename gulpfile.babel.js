import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src:"src/*.pug",
    dest: "build",
},
};

 const pug = () => gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build/"]);

const webserver = () => gulp.src("build").pipe(ws({
  livereload: true, open: true
}));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
}

const prepare = gulp.series([clean]);

const assets = gulp.series([pug]);

//두가지 task를 병행하게 함.
const postDev = gulp.parallel([webserver, watch]);

//gulp series를 실행할 때 마다 prepare, assets, postDev를 실행한다.
export const dev = gulp.series([prepare, assets, postDev]);

// gulp.src() : gulp 작업 타겟들의 경로 및 형식을 지정!
// gulp.pipe() : pipe를 통과시키면서 추가 작업을 함!
// gulp.series() : 여러 task 를 전달받아 직렬 실행해주는 메소드
// gulp.dest("폴더명") : 여기에 결과물을 생성!
// export는 package.json에서 쓸 command만 해주면 됨. 
// 만약 clean을 export 하지 않는다면, console 이나 package.json에서 사용하지 못함.