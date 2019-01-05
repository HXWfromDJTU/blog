# git_flow


#### 单机常用命令
```bat
$ git clone
### some changed  ###
$ git add .
$ git commit -m "cahnge log"
$ git push origin master
```

#### 多人协作 

```bat
# fork分支，起名叫 my-dev-branch
$ git checkout -b my-dev-branch 
# 查看分支情况
$ git branch  

#### some changed ####

# 提交到本地暂存区
$ git add . 
# 提交到本地
$ git commit -m"changed log"
# 提交到自己的开发分支
$ git push origin my-dev-branch  

#### test pass ####

# 当前分支切换到master分支
$ git checkout master 
# 在本地合并自己的修改和master分支
$ git merge my-dev-branch  
# 推送master到远端 
$ git push origin master

```


#### 其他知识

>git add -A和 git add .   git add -u在功能上看似很相近，但还是存在一点差别

`git add .`    
他会监控工作区的状态树，使用它会把工作时的所有变化提交到暂存区，包括文件内容修改(modified)以及新文件(new)，但不包括被删除的文件。

`git add -u`   
他仅监控已经被add的文件（即tracked file），他会将被修改的文件提交到暂存区。add -u 不会提交新文件（untracked file）。（git add --update的缩写）

`git add -A`   
是上面两个功能的合集（git add --all的缩写）
