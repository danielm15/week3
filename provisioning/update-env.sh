#!/bin/bash
set -e

if [ -z "$GIT_COMMIT" ];
then
    export GIT_COMMIT=$(git rev-parse HEAD)
fi

INSTANCE_ID=$(cat ~/aws/instance-id.txt)
INSTANCE_PUBLIC_NAME=$(cat ~/aws/instance-public-name.txt)
SECURITY_GROUP_NAME=$(cat ~/aws/security-group-name.txt)

echo Deploy revision ${GIT_COMMIT} to http://${INSTANCE_PUBLIC_NAME}

echo SCP

#status='unknown'
#while [ ! "${status}" == "ok" ]
#do
#   echo Checking status of host, currently ${status}
#   status=$(sudo ssh -i "~/aws/${SECURITY_GROUP_NAME}.pem"  -o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectTimeout=5 ec2-user@${INSTANCE_PUBLIC_NAME} echo ok 2>&1)
#   sleep 2
#done

#echo Status ${status}

scp -o StrictHostKeyChecking=no -i "~/aws/${SECURITY_GROUP_NAME}.pem" ./ec2-instance-check.sh ec2-user@${INSTANCE_PUBLIC_NAME}:~/ec2-instance-check.sh
scp -o StrictHostKeyChecking=no -i "~/aws/${SECURITY_GROUP_NAME}.pem" ./docker-compose.yaml ec2-user@${INSTANCE_PUBLIC_NAME}:~/docker-compose.yaml
scp -o StrictHostKeyChecking=no -i "~/aws/${SECURITY_GROUP_NAME}.pem" ./docker-compose-and-run.sh ec2-user@${INSTANCE_PUBLIC_NAME}:~/docker-compose-and-run.sh

echo Wait for instance to be ready
ssh -o StrictHostKeyChecking=no -i "~/aws/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "cat ~/ec2-instance-check.sh"

echo Instance ready...going to run this:
ssh -o StrictHostKeyChecking=no -i "~/aws/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "cat ~/docker-compose-and-run.sh"

echo Running script
ssh -o StrictHostKeyChecking=no -i "~/aws/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "~/docker-compose-and-run.sh ${GIT_COMMIT}"

echo Done updating environment
