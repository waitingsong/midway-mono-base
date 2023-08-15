# GitLab CI/CD 配置

## 环境变量列表

### 全局

| 变量名                | 必须  | 保护  | 掩码  | 示例                                      | 备注                                                      |
| --------------------- | :---: | :---: | :---: | ----------------------------------------- | --------------------------------------------------------- |
| CI_API_V4_URL         |   🗸   |       |       | https://git.foo.com/api/v4                |
| CA_PUB                |   🗸   |       |       |                                           | base64                                                    |
| CI_READ_PRIVATE_KEY   |   🗸   |       |       |                                           | bsae64                                                    |
| DOCKER_REG_SERVER     |   🗸   |       |       | registry.docker.com                       |                                                           |
| DOCKER_REG_SERVER_EXT |       |       |       | registry.cn-hangzhou.aliyuncs.com         |                                                           |
| DOCKER_REG_USER       |   🗸   |   🗸   |       | ci                                        |                                                           |
| GL_TOKEN              |   🗸   |   🗸   |   🗸   |                                           |                                                           |
| NODE_BASE_IMAGE       |   🗸   |       |       | registry.docker.com/node:alpine           |                                                           |
| NODE_CI_IMAGE         |   🗸   |       |       | registry.docker.com/node:ci               |                                                           |
| NODE_DOCKER_IMAGE     |   🗸   |       |       | registry.docker.com/docker-node           |                                                           |
| NPM_REGISTRY          |   🗸   |       |       | https://nexus.com/repository/npm-central/ | NPM代理                                                   |
| NPM_VERSION_REGISTRY  |   🗸   |       |       | https://nexus.com/repository/mynpm/       | NPM私服                                                   |
| NPM_VERSION_TOKEN     |   🗸   |   🗸   |   🗸   |                                           | NPM_VERSION_REGISTRY 私服发布令牌 (`NpmToken.000`) base64 |

### 项目、组

| 变量名        | 必须  | 保护  | 掩码  | 备注                                            |
| ------------- | :---: | :---: | :---: | ----------------------------------------------- |
| PUBLISH_TOKEN |   🗸   |   🗸   |   🗸   | acess_toekn: api, write_repository, role: maint |
| SEMVER        |       |       |       | major \| minor \| patch                         |

## 仓库设置

### 保护分支
- main
- release
- versioning_*

### 保护TAG
- v*

