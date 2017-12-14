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
	withEnv(['AWS_ACCESS_KEY_ID=AKIAJ4G76Q7E4J6MEH5A',
		 'AWS_SECRET_ACCESS_KEY=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',
		 'AWS_DEFAULT_REGION=eu-west-2']) {
	    dir('./provisioning')
            {
                sh "./provision-new-environment.sh"
            }
	}
    }
}
