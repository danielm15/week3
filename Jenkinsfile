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
	// sh 'npm run startpostgres'
	// sh 'npm run startserver:ci && npm run apitest:nowatch && npm run sleep 10 && kill $!'
	dir('client')
	{
	    sh 'npm run test:nowatch'
	}
	
	junit '**/docs/*.xml'
    }
    stage('Deploy') {
        sh './dockerbuild.sh'
	dir('./provisioning')
        {
            sh "./provision-new-environment.sh"
        }
    }
}
