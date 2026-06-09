// 初始化环境
let setProxyArr = function (proxyObjArr) {
    for (let i = 0; i < proxyObjArr.length; i++) {
        const handler = `{
        get:function(target,property,receiver){
           if(property === 'crypto'){return target[property];}
          console.log("方法:","get","对象","${proxyObjArr[i]}","属性:",
      property,"属性类型:",typeof property,"属性值:",target[property],"属性值类型:",typeof target[property]);
      return Reflect.get(...arguments)
          },
        set:function(target,property,value,receiver){
          console.log("方法:","set","对象:","${proxyObjArr[i]}","属性:",
      property,"属性类型:",typeof property,"属性值:",value,"属性值类型:",typeof target[property]);
          return Reflect.set(...arguments);
          }
      }`;
        eval(`try{
          ${proxyObjArr[i]};
          ${proxyObjArr[i]} = new Proxy(${proxyObjArr[i]},${handler});
          } catch (e){
           ${proxyObjArr[i]} = {};
           ${proxyObjArr[i]} = new Proxy(${proxyObjArr[i]},${handler});
           }`);
    }
};
function watch(object, name) {
    const handler = {
        get: function (target, property, receiver) {
            if (
                property !== "isNaN" &&
                property !== "encodeURI" &&
                property !== "Uint8Array" &&
                property !== "undefined" &&
                property !== "JSON"
            ) {
                console.log(
                    "方法:",
                    "get",
                    "对象",
                    name,
                    "属性:",
                    property,
                    "属性类型:",
                    typeof property,
                    "属性值:",
                    target[property],
                    "属性值类型:",
                    typeof target[property]
                );
            }
            return Reflect.get(...arguments);
        },
        set: function (target, property, value, receiver) {
            console.log(
                "方法:",
                "set",
                "对象:",
                name,
                "属性:",
                property,
                "属性类型:",
                typeof property,
                "属性值:",
                value,
                "属性值类型:",
                typeof target[property]
            );
            return Reflect.set(...arguments);
        },
    };
    return new Proxy(object, handler);
}
const safeFunction = function safeFunction(func) {
    //处理安全函数
    Function.prototype.$call = Function.prototype.call;
    const $toString = Function.toString;
    const myFunction_toString_symbol = Symbol("(".concat("", ")"));

    const myToString = function myToString() {
        return (
            (typeof this === "function" && this[myFunction_toString_symbol]) ||
            $toString.$call(this)
        );
    };

    const set_native = function set_native(func, key, value) {
        Object.defineProperty(func, key, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value,
        });
    };

    delete Function.prototype["toString"];
    set_native(Function.prototype, "toString", myToString);
    set_native(
        Function.prototype.toString,
        myFunction_toString_symbol,
        "function toString() { [native code] }"
    );

    const safe_Function = function safe_Function(func) {
        set_native(
            func,
            myFunction_toString_symbol,
            "function" +
                (func.name ? " " + func.name : "") +
                "() { [native code] }"
        );
    };

    return safe_Function(func);
};
console.log = function(){}
// 基础类
function EventTarget(){}
safeFunction(EventTarget)
EventTarget.prototype.addEventListener = function addEventListener(){}
safeFunction(EventTarget.prototype.addEventListener)
function WindowProperties(){}
safeFunction(WindowProperties)
Object.setPrototypeOf(WindowProperties.prototype, EventTarget.prototype)
function Window(){}
safeFunction(Window)
Object.setPrototypeOf(Window.prototype, WindowProperties.prototype) // 设置原型, 

// 补window
window = globalThis
window.window = window.self = window.top = window
Object.setPrototypeOf(window, Window.prototype) // 设置对象
window.Screen = function Screen(){}
safeFunction(window.Screen)
window.MouseEvent = function MouseEvent(){}
safeFunction(window.MouseEvent)
window.DeviceMotionEvent = function DeviceMotionEvent(){}
safeFunction(window.DeviceMotionEvent)
window.DeviceOrientationEvent = function DeviceOrientationEvent(){}
safeFunction(window.DeviceOrientationEvent)
window.HTMLElement = function HTMLElement(){}
safeFunction(window.HTMLElement)
window.chrome = {}

// 补document
function Node(){}
safeFunction(Node)
Object.setPrototypeOf(Node.prototype, EventTarget.prototype)
function Document(){}
safeFunction(Document)
Object.setPrototypeOf(Document.prototype, Node.prototype)
documentElement = watch({
    getAttribute(attr){
        console.log(`document.documentElement.getAttribute(${attr})`)
    }
}, `document.documentElement`)
safeFunction(documentElement.getAttribute)
Document.prototype.documentElement = documentElement
all = watch([], `document.all`)
Document.prototype.all = all
body = watch({
    removeChild(){}
}, `document.body`)
Document.prototype.body = body
// 替换成你自己的小红书Cookie（浏览器F12 → Application → Cookies）
Document.prototype.cookie = 'abRequestId=7dd349b3-5b6a-5851-8797-efa9d1850117; webBuild=5.7.0; xsecappid=xhs-pc-web; a1=19bcba43567youn99z172t9qots5w2jpr2a1w4q8s50000304177; webId=30d4888d1c9ebf217f0cb6f809059b7b; gid=yjDSD044qSFJyjDSD04q2J4AKWvl7IjjuyWJ0YM9jAl9My282EJVUE888q84yWW8W4fD2YYW; loadts=1768649731923; websectiga=2a3d3ea002e7d92b5c9743590ebd24010cf3710ff3af8029153751e41a6af4a3; sec_poison_id=4f9d1a7b-6b66-458a-b316-0217df97453f; unread={%22ub%22:%2269661d96000000002200bfed%22%2C%22ue%22:%22694feaf2000000001f00cbe9%22%2C%22uc%22:28}'
Document.prototype.getElementsByTagName = function getElementsByTagName(tagName){
    if(tagName === "*"){
        return watch([], `document.getElementsByTagName('${tagName}')`)
    }
    console.log(`document.getElementsByTagName(${tagName})`)
}
safeFunction(Document.prototype.getElementsByTagName)
function HTMLDocument(){}
safeFunction(HTMLDocument)
Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype)

document = {}
Object.setPrototypeOf(document, HTMLDocument.prototype)

// Navigator
try{ delete navigator } catch(e){}
function Navigator(){}
Navigator.prototype.webdriver = false 
Navigator.prototype.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
Navigator.prototype.permissions = {}
safeFunction(Navigator)
navigator = {}
Object.setPrototypeOf(navigator, Navigator.prototype)

location = {
    "ancestorOrigins": {},
    "href": "https://www.xiaohongshu.com/explore",
    "origin": "https://www.xiaohongshu.com",
    "protocol": "https:",
    "host": "www.xiaohongshu.com",
    "hostname": "www.xiaohongshu.com",
    "port": "",
    "pathname": "/explore",
    "search": "",
    "hash": ""
}
// setProxyArr([
//     "window",
//     "globalThis",
//     "global",
//     "document",
//     "location",
//     "history",
//     "screen",
//     "navigator",
//     "localStorage",
//     "sessionStorage",
// ]);