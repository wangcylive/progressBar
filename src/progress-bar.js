/**
 * Created by wangchunyang on 16/4/6.
 */
;(function(factory) {
    if("function" === typeof define && define.amd) {
        define(factory);
    } else if("object" === typeof exports) {
        module.exports = factory();
    } else {
        window.progressBar = factory();
    }
}(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.clearTimeout;

    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;

    function styleHyphenFormat(propertyName) {
        function format(match) {
            return "-" + match.toLowerCase();
        }

        if (propertyName.indexOf("-") !== -1) {
            return propertyName.toLowerCase();
        } else {
            return propertyName.replace(/^[A-Z]/, function (match) {
                return match.toLowerCase();
            }).replace(/^(webkit|moz|ms|o)/i, function (match) {
                return "-" + match;
            }).replace(/[A-Z]/g, format);
        }
    }

    function styleUpperFormat(propertyName) {
        function format(match) {
            return match.charAt(1).toUpperCase();
        }

        return propertyName.replace(/^-/, "").replace(/-[a-zA-Z]/g, format);
    }

    var getCssPrefix = (function () {
        var prx = ["", "-webkit-", "-moz-", "-ms-", "-o-"],
            div = document.createElement("div"),
            style = div.style,
            value;

        return function (property) {
            property = styleHyphenFormat(property);

            for (var i = 0, length = prx.length; i < length; i++) {
                value = "";

                if (!prx[i]) {
                    value = property;
                } else {
                    value = prx[i] + property;
                }

                if (value in style) {
                    return value;
                }
            }
            div = null;
        }
    }());

    function getTransitionEndEvent() {
        if (typeof TransitionEvent !== "undefined") {
            return "transitionend";
        } else if (typeof WebKitTransitionEvent !== "undefined") {
            return "webkitTransitionEnd";
        }
    }

    // 是否支持Touch事件
    var isSupportedTouch = (function () {
        var is = false;
        try {
            var type = document.createEvent("TouchEvent");
            type.initEvent("touchstart");
            is = true;
        } catch (e) {
        }
        return is;
    }());

    var isSupportedAnimationEvent = (function () {
        return !!(typeof AnimationEvent !== "undefined" || typeof WebKitAnimationEvent !== "undefined");
    }());

    // 是否支持Transition事件
    var isSupportedTranstionEvent = (function () {
        return !!(typeof TransitionEvent !== "undefined" || typeof WebKitTransitionEvent !== "undefined");
    }());

    function progressBar() {
        var progressValue = 95;

        var transform = getCssPrefix("transform"),
            transition = getCssPrefix("transition"),
            transitionEnd = getTransitionEndEvent();

        var elem = document.getElementById("progressBar");

        if (elem == null) {
            elem = document.createElement("div");
            elem.id = "progressBar";
            document.body.appendChild(elem);
        }

        var progressStatus = "FINISHED";  // 状态

        elem.addEventListener(transitionEnd, function() {
            if(progressStatus === "TRANSFORM_END") {
                elem.style.opacity = 0;
                elem.style[transition] = "opacity .5s ease-in";

                progressStatus = "FINISHING";
            } else if(progressStatus === "FINISHING") {
                elem.removeAttribute("style");
                elem.style.display = "none";

                progressValue = 95;

                progressStatus = "FINISHED";
            }
        }, false);


        var requestID;  // requestAnimationFrame 返回值, cancelAnimationFrame 使用

        function requestFrame() {
            requestID = requestAnimationFrame(function () {
                if(progressValue > 6) {
                    progressValue -= Math.random();

                    elem.style[transform] = "translateX(" + -progressValue + "%)";
                    elem.style[transition] = "none";

                    requestID = requestAnimationFrame(requestFrame);
                }
            });
        }

        function cancelFrame() {
            cancelAnimationFrame(requestID);
            elem.style.removeProperty(transition);

            progressStatus = "TRANSFORM_STOP";
        }

        function start() {
            elem.style.display = "block";
            cancelFrame();

            if("TRANSFORM_STOP" !== progressStatus) {

                progressValue = 95;
            }

            progressStatus = "TRANSFORMING";


            elem.style[transform] = "translateX(" + -progressValue + "%)";

            requestAnimationFrame(function() {
                elem.style.opacity = 1;
                elem.style[transition] = "opacity .2s ease-out";

                requestFrame();
            });
        }

        function set(number) {
            if (typeof number === "number" && number > 0 && number < 1) {
                elem.style.display = "block";
                elem.style.opacity = 1;
                elem.style[transform] = "translateX(" + -progressValue + "%)";
                elem.style[transition] = "all .2s ease-out";

                progressStatus = "TRANSFORM_SET";

                setTimeout(function() {
                    progressValue = 100 * (1 - number);

                    elem.style[transform] = "translateX(" + -progressValue + "%)";
                }, 20);
            } else {
                console.error("set arguments value muse be between 0 to 1");
            }
        }

        function done() {
            if("FINISHED" !== progressStatus && "TRANSFORM_END" !== progressStatus) {
                cancelFrame();
                progressValue = 0;

                progressStatus = "TRANSFORM_END";

                if(transition) {
                    requestAnimationFrame(function () {
                        setTimeout(function() {
                            elem.style[transform] = "translateX(" + 0.01 * Math.random() + "px)";
                            elem.style[transition] = "all .3s ease-out";
                        }, 20);
                    });
                } else {  // IE9 兼容处理
                    elem.style[transform] = "translateX(0)";

                    setTimeout(function() {
                        elem.removeAttribute("style");
                        elem.style.display = "none";

                        progressValue = 95;

                        progressStatus = "FINISHED";
                    }, 200);
                }
            }
        }

        function status() {
            return progressStatus;
        }

        return {
            start: start,
            stop: cancelFrame,
            set: set,
            done: done,
            status: status
        }
    }

    return progressBar;
}));