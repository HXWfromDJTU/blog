# git常见问题

>refusing to merge unrelated histories
* 原因：先pull，因为两个仓库不同，发现refusing to merge unrelated histories，无法pull因为他们是两个不同的项目，
* 解决方案：git需要添加一句代码，在git pull，这句代码是在git 2.9.2版本发生的，最新的版本需要添加`--allow-unrelated-histories`
```linux
git pull origin master --allow-unrelated-histories
```


Slow network is detected