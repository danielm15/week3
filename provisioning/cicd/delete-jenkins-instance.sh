#!/usr/bin/env bash

INSTANCE_ID=$(cat ~/aws/instance-id.txt)
SECURITY_GROUP_ID=$(cat ~/aws/security-group-id.txt)
SECURITY_GROUP_NAME=$(cat ~/aws/security-group-name.txt)

aws ec2 terminate-instances --instance-ids ${INSTANCE_ID}

echo Waiting for instance to terminate....
aws ec2 wait --region eu-west-2 instance-terminated --instance-ids ${INSTANCE_ID}
echo Instance ${INSTANCE_ID} terminated

rm ~/aws/instance-id.txt
rm ~/aws/instance-public-name.txt

#aws ec2 delete-security-group --group-id ${SECURITY_GROUP_ID}
#
#aws ec2 delete-key-pair --key-name ${SECURITY_GROUP_NAME}
#
#rm  -rf ec2_instance
