/**
 * Created by wangchunyang on 16/4/15.
 */
require(["./src/progress-bar"], function (progress) {
    var progressMethod = progress();

    var doc = document;

    var btnStart = doc.getElementById("start"),
        btnStop = doc.getElementById("stop"),
        btnSet = doc.getElementById("set"),
        btnDone = doc.getElementById("done");

    btnStart.addEventListener("click", function () {
        progressMethod.start();
    }, false);

    btnStop.addEventListener("click", function () {
        progressMethod.stop();
    }, false);

    btnSet.addEventListener("click", function () {
        progressMethod.set(0.5);
    }, false);

    btnDone.addEventListener("click", function () {
        progressMethod.done();
    }, false);
});