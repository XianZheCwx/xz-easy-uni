const { src, dest, series, task } = require("gulp");
const { build } = require("vite");

async function defaultTask(cb: any) {
  // place code for your default task here
  console.log("任务一在此", build);
  const files = src("./test");
  console.log("能拿到files吗", !!files);
  console.log("那到底是什么", files);
  console.log("那么返回的内容是什么", files.content);
  console.log("那么返回的内容是什么", files.base);


  await build({
    root: "../xeuni",
    build: {
      outDir: "./dist",
      lib: {

      }
    }
  })
  cb();
}

function task1(cb: any) {
  console.log("任务二在此");
  cb();
}


task("default", series(defaultTask, task1));
