# Sass学习笔记

#### 单文件转换命令:
> sass style.scss style.css

#### 单文件监听命令:
> sass --watch style.scss:style.css

#### 文件夹监听命令:
> sass --watch sass:css

#### SASS提供四个编译风格的选项:
> nested：嵌套缩进的css代码，它是默认值。
> expanded：没有缩进的、扩展的css代码。
> compact：简洁格式的css代码。
> compressed：压缩后的css代码。

生产环境当中，一般使用最后一个选项:
> sass --style compressed Mei.scss Mei.css

注意事项：
1 当编译出现乱码时，在.scss文件顶部添加 @charset "UTF-8";

> 更多学习：http://www.ruanyifeng.com/blog/2012/06/sass.html