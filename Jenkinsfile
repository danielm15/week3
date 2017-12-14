#!/usr/bin/env groovy

node {    
    checkout scm
    stage('Clean') {
        // Clean files from last build.
        sh 'git clean -dfxq'
    }
    stage('Setup') {
        // Prefer yarn over npm.
        sh 'yarn install || npm install'
        dir('client')
        {
            sh 'yarn install || npm install'
        }
    }
    stage('Test') {
        sh 'npm run test:nowatch'
    }
    stage('Deploy') {
        sh './dockerbuild.sh'
        dir('./provisioning')
        {
	    sh "export AWS_ACCESS_KEY_ID=AKIAJ624P4SDIHE265ZA"
	    sh "export AWS_SECRET_ACCESS_KEY=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"
	    sh "export AWS_DEFAULT_REGION=eu-west-2"
            sh "./provision-new-environment.sh"
        }
    }
}
