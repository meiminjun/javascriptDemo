# ruby 以及sass 的安装

进入http://rubyinstaller.org/downloads/ 下载最新版本，进行安装

安装完成后，cmd命令行测试`ruby -v`
> 成功会出现 ruby 2.0.0p353 (2013-11-22) [x64-mingw32]

由于国内网络原因（你懂的），是无法下载sass的

所以需要通过淘宝镜像来添加,如下：
``` bash
C:\Users\Administrator>gem sources --add https://ruby.taobao.org/
https://ruby.taobao.org/ added to sources

C:\Users\Administrator>gem sources -l
*** CURRENT SOURCES ***

https://ruby.taobao.org/

C:\Users\Administrator>gem install sass
Fetching: sass-3.4.22.gem (100%)
Successfully installed sass-3.4.22
Parsing documentation for sass-3.4.22
Installing ri documentation for sass-3.4.22
Done installing documentation for sass after 17 seconds
1 gem installed
```

有的时候会因为"Windows 下证书无法验证问题(certificate verify failed)",
> ruby 没有包含 SSL 证书，所以 https 的链接被服务器拒绝。
> 解决方法很简单，首先在这里下载证书 http://curl.haxx.se/ca/cacert.pem, 然后再环境变量里设置 SSL_CERT_FILE 这个环境变量，并指向 cacert.pem 的文件路径。


摘录：https://github.com/ruby-china/rubygems-mirror/wiki
