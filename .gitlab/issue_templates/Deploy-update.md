
##### 升级影响范围： 
<!-- [x]选择或者提交后点击勾选 -->
- [ ] 前端交互
- [ ] 前端样式
- [ ] 后端接口
- [ ] 数据库

##### 部署版本 SHA：   
<!-- 填写 master 分支上的 commit hash， 可以从 CI/CD->pipelines 列表中复制 -->


##### 备注：   



<!-- 以下为运维管理人员操作 -->
----
##### 升级操作流程：   

> 勾选下列步骤确认进度

1. [ ] 审核通过启动部署流程，回复
    > /unlabel ~"workflow::need-confirm"   
    > /label ~"workflow::going"    

2. [ ] 确认主库不存在 `release` 部署分支，执行结果为空
    ```sh
    git ls-remote --exit-code --heads origin release
    ```
3. [ ] 在 `CI/CD->pipeline` 中找到部署版本 SHA 对应的条目，启动 `pre_publish` job，等待自动创建 `release` 分支
4. [ ] 若 `release` 分支测试未通过，在此分支上进行修复工作直至测试通过
5. [ ] 在 `CI/CD->pipeline` 中找到新创建的 `vX.Y.z` Tag（比如 `v1.2.3`）启动 `restart_svcs_ga` job 执行远程服务重启
6. [ ] 确认重启远程服务成功
7. [ ] 重启远程服务失败
8. [ ] 部署完成回复 /label ~"workflow::done"


/label ~deploy ~update ~"workflow::need-confirm"
<!-- /assign @admin -->
<!-- /cc @foo @bar -->

