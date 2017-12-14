Link to jenkins instance: http://ec2-35-177-64-115.eu-west-2.compute.amazonaws.com:8080/

Build and push updated docker image: https://github.com/danielm15/week2/blob/master/dockerbuild.sh

Script to provision new instance or update a previous one with docker and jenkins: https://github.com/danielm15/week2/blob/master/provisioning/provision-new-environment.sh

    - The provision script calls upon create-aws-docker-host-instance.sh that creates a new instance if it doesn't exist
      already. It also creates a security group and a key-pair if they don't exist.
      
    - The other script the provision script calls upon is update-env.sh that installs all dependencies including jenkins with docker-instance-init.sh and installs and runs docker-compose

To use the Github plug-in with Jenkins:

    - cd ~/provisioning
    - ssh -i "./ec2_instance/hgop-${USERNAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME}
    - sudo su -s /bin/bash jenkins
    - cd /var/lib/jenkins/
    - ssh-keygen
    - cat .ssh/id_rsa.pub
    
Then copy the public key that was concatenated onto the screen, and add it to your Github ssh keys.

