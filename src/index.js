const user = require("./utils/user");

// 导入css文件
import "./css/index.css"
// 导入less文件
require("./css/main.less");

document.getElementById("root").innerHTML = `我的名字是${user.say()}`;

if(module.hot){
    module.hot.accept();
}