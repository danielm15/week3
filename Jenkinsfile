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
	environment {
    		AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
    		AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
		AWS_DEFAULT_REGION = config('AWS_DEFAULT_REGION')
	}
	sh './dockerbuild.sh'
	dir('./provisioning')
	{
		sh "./provision-new-environment.sh"
	}
    }
}
