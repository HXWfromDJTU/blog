## 爬虫架构
* 爬虫调度端口
  重要节点：URL管理器 网页下载器 网页解析器 价值数据
  ![avatar](/blog_assets/framework.png)
* 爬虫工作流程
  ![avatar](/blog_assets/timeline.png)

* URL管理器
  * 防止重复抓取、循环抓取
  * 将一个新的URL添加到带爬取集合中
  * 获取带爬取URL
  * 管理器的实现
  存储方式：使用Python内存、使用关系型数据库、使用缓存数据库
* 网页下载器
   原理：访问URL，下载HTML文件
   常用python工具包
    * urllib2工具包
    * requests工具包
    简单模式：
    ```python
  import urllib2
  # 直接发起请求
  response = urllib2.rul.urlopen('....xxx.com')
  # 获取状态码
  print response.getcode()
  # 读取下载内容
  const = response.read()
    ```
    增强模式:
  ```python
  import urllib2
  # 创建Request对象
  request = rullib2.Request(url)
  #添加数据包
  resquest.add_data("a",1)
  # 添加http的header
  request.add_header('User-Agent','Mozilla/5.0')
  # 将上面封装好的请求头信息，统一使用urllib2打开
  response = urllib2.urlopen(request)
   ```
   特殊模式(含有登录要求的网站)：
   ```python
   # 找到需要的情景处理器,，这些场景处理器都称为不同的handler
  # httpcookieprocessor \ ProxyHandler \ HTTPSHandler \ HTTPReadirectHandler
  #生成opener对象
  opener = urllib2.build_opener(handler)
  # 安装opener对象
  urllib2.install_opener(opener)
  # 使用符合添加了要求hndler的opener去执行下载网页操作
  urllib2.urlopen(url)
  urllib2urlopen(request)
   ```

* 网页解析器
结构化DOM 树
![DOMTree](/blog_assets/DOMtree.png)
推荐使用`BeautifulSoup`插件进行网页解析
```bash
# python3环境下使用
$ pip3 install beautifulsoup4
```

## 使用beautifulsoup 解析节点
```python
from bs4 import BeautifulSoup

# 1、根据HTML网页字符串创建 BeautifulSoup对象
soup = BeautifulSopu(
  html_doc,   #HTML文档字符串
  'html.parser',  #HTML解析器
  from_encoding = 'uft-8'   # HTML文档的编码
)
# 2、搜索节点
# 查找所有标签为a的节点
soup.find_all('a')
# 查找标签为 a，链接复合/view/123.html的节点
soup.find_all('a',href,fref='/view/123.html'
soup.find_all('a',href=re.compile(r'/view/view/\d+\.htm'))
# 查找所有标签为div，class名为abc，文字内容为Python的节点
soup.find_all('div',class_'abc',string='Python') # 注意class为python关键字，在bs4中使用，加下划线

# 访问节点信息
# 获取查找到的节点名称
node.name
# 获取查找到的节点a的href属性 
node['href']
# 获取查找到的 a 节点的链接文字
node.get_text()
```

五个重要的
spider_main   调度程序
url_manager url管理器
url_downloader   html下载器
html_parser  html解析器
html_outputer  html输出器
