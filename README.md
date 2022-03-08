# 自动配置 Selling Partner API 在 AWS 的开发环境

自动创建账号,角色,配置策略,创建sqs并授权 等等

#### 注意 EventBridge 需要手动配置

### 1、先安装 aws-cli 和 aws-cdk 命令行工具

1. 安装aws-cli https://github.com/aws/aws-cli
2. 安装aws-cdk
```shell
$ npm i -g aws-cdk
```
### 2、配置aws开发账号信息

1. 先去创建开发账号 https://us-east-1.console.aws.amazon.com/iam/home#/users$new?step=details
   ![](https://raw.githubusercontent.com/amzapi/spapi-cdk-project/main/doc/iShot2022-03-08%2021.41.31.png)
   ![](https://raw.githubusercontent.com/amzapi/spapi-cdk-project/main/doc/iShot2022-03-08 21.44.34.png)
2. 下一步下一步创建完成 保存密匙信息
   ![](https://raw.githubusercontent.com/amzapi/spapi-cdk-project/main/doc/iShot2022-03-08 21.46.38.png)
3. 配置本地aws配置信息
```shell
$ aws configure
AWS Access Key ID: MYACCESSKEY
AWS Secret Access Key: MYSECRETKEY
Default region name [us-west-2]: us-west-2
Default output format [None]: json
```
配置完可以测试一下
```
$ aws s3 ls
```

### 3、拉代码,开始部署,就完事啦
```shell
$ git clone https://github.com/amzapi/spapi-cdk-project.git
$ cd spapi-cdk-project && npm i
$ cdk bootstrap
$ cdk deploy
```

### 4、EventBridge 事件通知配置,直接看图吧
![](https://raw.githubusercontent.com/amzapi/spapi-cdk-project/main/doc/iShot2022-03-08 22.05.08.png)
![](https://raw.githubusercontent.com/amzapi/spapi-cdk-project/main/doc/iShot2022-03-08 22.11.49.png)
![](https://raw.githubusercontent.com/amzapi/spapi-cdk-project/main/doc/iShot2022-03-08 22.12.39.png)
![](https://raw.githubusercontent.com/amzapi/spapi-cdk-project/main/doc/iShot2022-03-08 22.17.22.png)
![](https://raw.githubusercontent.com/amzapi/spapi-cdk-project/main/doc/iShot2022-03-08 22.20.00.png)

# 剩下的就是api的事情啦,去疯狂的订阅吧! 所有的消息都会在sqs里面了,去拿就好啦!