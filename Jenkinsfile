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
	    sh "export AWS_ACCESS_KEY_ID=AKIAJUKYXDGI5TA5LUMA"
	    sh "export AWS_SECRET_ACCESS_KEY=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"
	    sh "export AWS_DEFAULT_REGION=eu-west-2"
            sh "./provision-new-environment.sh"
        }
    }
}
