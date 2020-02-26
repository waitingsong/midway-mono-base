
##### 回滚影响范围： 
<!-- [x]选择或者提交后点击勾选 -->
- [ ] 前端交互
- [ ] 前端样式
- [ ] 后端接口
- [ ] 数据库

##### 回滚版本 TAG ：   
<!-- 格式为 X.Y.Z，比如 2.3.4 -->


##### 回滚原因：   



<!-- 以下为运维管理人员操作 -->
----
##### 回滚操作流程：   

> 勾选下列步骤确认进度

1. [ ] 审核通过启动部署流程，回复
    > /unlabel ~"workflow::need-confirm"   
    > /label ~"workflow::going"    

2. [ ] 在 `CI/CD->pipeline` 中找到部署版本 TAG 对应的条目，启动 `restart_svcs_ga` job 进行远程服务版本回滚并重启
    若因回滚版本失败可重新执行 `deploy_ga` 任务后再次执行本步骤
3. [ ] 确认回滚远程服务成功
4. [ ] 回滚远程服务失败
8. [ ] 回滚完成回复 /label ~"workflow::done"


/label ~deploy ~revert ~"workflow::need-confirm"
<!-- /assign @admin -->
<!-- /cc @foo @bar -->
