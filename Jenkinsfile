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
	withEnv(['AWS_ACCESS_KEY_ID=AKIAJIM6NF2RUXXGDYYA',
		 'AWS_SECRET_ACCESS_KEY=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',
		 'AWS_DEFAULT_REGION=eu-west-2']) {
	    dir('./provisioning')
            {
                sh "./provision-new-environment.sh"
            }
	}
    }
}
