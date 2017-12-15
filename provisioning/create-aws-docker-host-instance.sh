#!/bin/bash

set -e

echo "Check for instance information..."
INSTANCE_DIR=~/aws

export AMI_IMAGE_ID="ami-1a962263"

echo No instance information present, continuing.
[ -d ${INSTANCE_DIR} ] || mkdir ${INSTANCE_DIR}

ACCESS_KEY_ID=$(curl http://169.254.169.254/latest/meta-data/iam/security-credentials/cicd 2>&1 | grep AccessKeyId | sed -n 's/.*"AccessKeyId" : "\(.*\)",/\1/p' > ${INSTANCE_DIR}/access-key.txt)

SECRET_ACCESS_KEY=$(curl http://169.254.169.254/latest/meta-data/iam/security-credentials/cicd 2>&1 | grep SecretAccessKey | sed -n 's/.*"SecretAccessKey" : "\(.*\)",/\1/p' > ${INSTANCE_DIR}/secret-access-key.txt)

ACCESS_TOKEN=$(curl http://169.254.169.254/latest/meta-data/iam/security-credentials/cicd 2>&1 | grep Token | sed -n 's/.*"Token" : "\(.*\)",/\1/p' > ${INSTANCE_DIR}/access-token.txt)

#curl http://169.254.169.254/latest/meta-data/instance-id > ${INSTANCE_DIR}/instance-id.txt

#CURRENT_INSTANCE_ID=$(cat ${INSTANCE_DIR}/current-instance-id.txt)
#echo ${CURRENT_INSTANCE_ID}

#aws ec2 associate-iam-instance-profile --instance-id ${INSTANCE_ID} --iam-instance-profile Name=CICDServer-Instance-Profile

aws configure set aws_access_key_id $(cat ${INSTANCE_DIR}/access-key.txt) --profile default
aws configure set aws_secret_access_key $(cat ${INSTANCE_DIR}/secret-access-key.txt) --profile default
aws configure set aws_session_token $(cat ${INSTANCE_DIR}/access-token.txt) --profile default
aws configure set region eu-west-1 --profile default

#USERNAME=$(aws iam get-user --query 'User.UserName' --output text)

USERNAME='danielm15@ru.is'

SECURITY_GROUP_NAME=docker-${USERNAME}
#SECURITY_GROUP_NAME=hgop-Administrator

echo "Using security group name ${SECURITY_GROUP_NAME}"

if [ ! -e ~/aws/security-group-name.txt ]; then
    echo ${SECURITY_GROUP_NAME} > ~/aws/security-group-name.txt
fi

if [ ! -e ${INSTANCE_DIR}/${SECURITY_GROUP_NAME}.pem ]; then
    aws ec2 create-key-pair --key-name ${SECURITY_GROUP_NAME} --query 'KeyMaterial' --output text > ${INSTANCE_DIR}/${SECURITY_GROUP_NAME}.pem
    chmod 400 ${INSTANCE_DIR}/${SECURITY_GROUP_NAME}.pem
fi

if [ ! -e ~/aws/security-group-id.txt ]; then
    SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name ${SECURITY_GROUP_NAME} --description "security group for dev environment in EC2" --query "GroupId"  --output=text)
    echo ${SECURITY_GROUP_ID} > ~/aws/security-group-id.txt
    echo Created security group ${SECURITY_GROUP_NAME} with ID ${SECURITY_GROUP_ID}
else
    SECURITY_GROUP_ID=$(cat ~/aws/security-group-id.txt)
fi

MY_PUBLIC_IP=$(curl http://checkip.amazonaws.com)
if [ ! -e ~/aws/instance-id.txt ]; then
    echo Create ec2 instance on security group ${SECURITY_GROUP_ID} ${AMI_IMAGE_ID}
    INSTANCE_INIT_SCRIPT=docker-instance-init.sh
    INSTANCE_ID=$(aws ec2 run-instances  --user-data file://${INSTANCE_INIT_SCRIPT} --image-id ${AMI_IMAGE_ID} --security-group-ids ${SECURITY_GROUP_ID} --count 1 --instance-type t2.micro --key-name ${SECURITY_GROUP_NAME} --query 'Instances[0].InstanceId'  --output=text)
    echo ${INSTANCE_ID} > ~/aws/instance-id.txt

    echo Waiting for instance to be running
    echo aws ec2 wait --region eu-west-1 instance-running --instance-ids ${INSTANCE_ID}
    aws ec2 wait --region eu-west-1	 instance-running --instance-ids ${INSTANCE_ID}
    echo EC2 instance ${INSTANCE_ID} ready and available on ${INSTANCE_PUBLIC_NAME}
fi

if [ ! -e ~/aws/instance-public-name.txt ]; then
    export INSTANCE_PUBLIC_NAME=$(aws ec2 describe-instances --instance-ids ${INSTANCE_ID} --query "Reservations[*].Instances[*].PublicDnsName" --output=text)
    echo ${INSTANCE_PUBLIC_NAME} > ~/aws/instance-public-name.txt
fi


MY_CIDR=${MY_PUBLIC_IP}/32
MY_PRIVATE_IP=$(hostname -I | cut -d' ' -f1)

echo Using CIDR ${MY_CIDR} for access restrictions.

set +e
aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 22 --cidr ${MY_PRIVATE_IP}
aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 22 --cidr ${MY_CIDR}
aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 80 --cidr ${MY_CIDR}
aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 8080 --cidr 0.0.0.0/0

aws ec2 associate-iam-instance-profile --instance-id $(cat ~/aws/instance-id.txt) --iam-instance-profile Name=CICDServer-Instance-Profile

