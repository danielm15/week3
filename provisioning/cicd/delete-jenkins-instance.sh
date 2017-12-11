#!/usr/bin/env bash

THISDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

INSTANCE_ID=$(cat ./ec2_instance/instance-id.txt)
SECURITY_GROUP_ID=$(cat ./ec2_instance/security-group-id.txt)
USERNAME=$(aws iam get-user --query 'User.UserName' --output text)

. ${THISDIR}/../ec2/functions.sh

if [ -e "./ec2_instance/instance-id.txt" ]; then
    aws ec2 terminate-instances --instance-ids ${INSTANCE_ID}

    echo Waiting for instance to terminate....
    aws ec2 wait --region eu-west-2 instance-terminated --instance-ids ${INSTANCE_ID}
    echo Instance ${INSTANCE_ID} terminated

    rm ./ec2_instance/instance-id.txt
    rm ./ec2_instance/instance-public-name.txt
fi


PEM_NAME=hgop-${USERNAME}
JENKINS_SECURITY_GROUP=jenkins-${USERNAME}

if [ ! -e ./ec2_instance/security-group-id.txt ]; then
    SECURITY_GROUP_ID=$(cat ./ec2_instance/security-group-id.txt)
else
    delete-security-group ${JENKINS_SECURITY_GROUP}
    rm ./ec2_instance/security-group-id.txt
fi
