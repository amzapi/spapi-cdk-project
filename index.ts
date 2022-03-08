import { App, Stack, StackProps, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import * as events from 'aws-cdk-lib/aws-events'
import * as targets from 'aws-cdk-lib/aws-events-targets'

export class SpapiCdkProjectStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const spapi_user = new iam.User(this, 'spapi-user', {
            userName: "spapi-user"
        });

        const spapi_role = new iam.Role(this, 'spapi-role', {
            assumedBy: new iam.ArnPrincipal(spapi_user.userArn),
            roleName: "spapi-role"
        });

        spapi_role.addToPolicy(new iam.PolicyStatement({
            resources: ['arn:aws:execute-api:*:*:*'],
            actions: ['execute-api:Invoke'],
        }));

        spapi_user.addToPolicy(new iam.PolicyStatement({
            resources: [spapi_role.roleArn],
            actions: ['sts:AssumeRole'],
        }));

        const accessKey = new iam.CfnAccessKey(this, 'AccessKey', {
            userName: spapi_user.userName,
        });

        // Subscribe the event
        const spapiEventQueue = new sqs.Queue(this, "spapi-event-queue", {
            visibilityTimeout: Duration.seconds(900),
            queueName: "spapi-event-queue"
        });

        // The principal is defined by SP API - it will put event to the queue.
        // * This will grant the following permissions:
        // *
        // *  - sqs:SendMessage
        // *  - sqs:GetQueueAttributes
        // *  - sqs:GetQueueUrl
        spapiEventQueue.grantSendMessages(new iam.AccountPrincipal('437568002678'));

    //    const eventBusName = "";

    //     // Create EventBridge
    //     const eventBus = new events.EventBus(this, "sp-api", { eventBusName: eventBusName });

    //     // EventBridge rule to sqs
    //     const eventBusRule = new events.Rule(this, 'Rule', {
    //         ruleName: "spapi-event-rule",
    //         enabled: true,
    //         eventBus: eventBus,
    //         eventPattern: {
    //             source: ["sellpartnerapi.amazon.com"],
    //         }
    //     });

    //     eventBusRule.addTarget(new targets.SqsQueue(spapiEventQueue));

        new CfnOutput(this, "RoleArn", { exportName: "RoleArn", value: spapi_role.roleArn });
        new CfnOutput(this, "AccessKeyID", { exportName: "AccessKeyID", value: accessKey.ref });
        new CfnOutput(this, "SecretAccessKey", { exportName: "SecretAccessKey", value: accessKey.attrSecretAccessKey });
        new CfnOutput(this, "SqsQueueName", { exportName: "SqsQueueName", value: spapiEventQueue.queueName });
        new CfnOutput(this, "SqsQueueArn", { exportName: "SqSqsQueueArnsArn", value: spapiEventQueue.queueArn });
    }
}

const app = new App();
new SpapiCdkProjectStack(app, 'SpapiCdkProjectStack');
app.synth();