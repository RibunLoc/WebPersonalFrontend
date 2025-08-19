pipeline {
    agent none // sử dụng agent build riêng

    parameters {
        string(name: 'nameImageBuild', defaultValue: 'web_frontend', description: 'Name of the Docker image to build')
        string(name: 'urlDomainHarbor', defaultValue: 'harbor.netsena.io.vn', description: "Domain of the Harbor registry so that you want to push the image")
        string(name: 'nameProject', defaultValue: 'personal_frontend', description: 'The project name on Harbor registry')
        string(name: 'Tag', defaultValue: 'v1.0.0', description: 'Tag for the Docker image')
        string(name: 'APP_ENV', defaultValue: 'production', description: 'Environment for the application (e.g., production, staging)')
        string(name: 'VITE_API_BASE', defaultValue: 'https://api.holoc.id.vn', description: 'Base URL for the API')
        string(name: 'VITE_TURNSTILE_SITEKEY', defaultValue: '0x4AAAAAABsArAAHb5Qp1ZGS', description: 'Turnstile site key for the application')
        string(name: 'SENTRY_DSN', defaultValue: '', description: 'Sentry DSN for error tracking')
    }
    environment {
        GIT_REPO = 'https://github.com/RibunLoc/personal-website-frontend.git'
        GIT_BRANCH = 'develop'
    }
    stages {
        stage('Checkout') {
            agent { label 'master' }
            steps {
                git(
                    credentialsId: 'github-token',
                    branch: "${env.GIT_BRANCH}",
                    url: "${env.GIT_REPO}"
                )
                script {
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    currentBuild.description = "Commit: ${env.GIT_COMMIT.take(7)} | Branch: ${env.GIT_BRANCH}"
                }
            }
        }
        stage('Build') {
            agent { label 'master' }
            steps {
                script {
                    sh '''
                    echo "Installing dependencies..."
                    npm install
                    echo "Building the project..."
                    npm run build
                    '''
                }
            }
        }
        stage('Docker Build') {
            agent { label 'master' }
            steps {
                script {
                    sh """
                        echo "Building Docker image..."
                        docker build -t ${params.nameImageBuild}:${params.Tag} .
                    """
                }
            }
        }
        stage('Docker Push') {
            agent { label 'master' }
            steps {
                script {
                    def nameImagePush = params.urlDomainHarbor + '/' + params.nameProject + '/' + params.nameImageBuild + ':' + params.Tag
                    docker.withRegistry("https://${params.urlDomainHarbor}", 'harbor') {
                        sh """
                            echo "Pushing Docker image to registry harbor harbor.netsena.io.vn..."
                            docker tag ${params.nameImageBuild}:${params.Tag} ${nameImagePush}
                            docker push ${nameImagePush}
                        """
                    }
                }
            }
        }
        stage('Approve Delivery') {
            agent { label 'master' }
            steps {
                script {
                    // def userInput = input(
                    //     message: "Approve deploy container ${env.JOB_NAME} to server",
                    //     ok: "Approve",
                    //     submitter: "thanhloc"
                    // )
                    def CONTAINERID = sh(script: "docker ps -aq --filter name=${params.nameImageBuild}", returnStdout: true).trim()
                    def nameImagePush = params.urlDomainHarbor + '/' + params.nameProject + '/' + params.nameImageBuild + ':' + params.Tag
                    // echo "Xác nhận triển khai ${userInput}"
                    docker.withRegistry("https://${params.urlDomainHarbor}", 'harbor') {
                      withCredentials([
                      string(credentialsId: 'frontend-api-url', variable: 'FRONTEND_API_URL'),
                      string(credentialsId: 'turnstile-sitekey', variable: 'TURNSTILE_SITEKEY')
                    ]) {
                        sh """
                        set -euo pipefail
                        cat > .runtime.env <<EOF
                        VITE_API_BASE=${params.FRONTEND_API_URL}
                        VITE_TURNSTILE_SITEKEY=${params.TURNSTILE_SITEKEY}
                        SENTRY_DSN=${params.SENTRY_DSN}
                        APP_ENV=${params.APP_ENV}
                        EOF

                        if [ -n "${CONTAINERID}" ]; then
                            docker stop ${CONTAINERID}
                            docker rm ${CONTAINERID}
                        fi

                        docker pull ${nameImagePush} || true
                        docker rmi ${params.nameImageBuild}:${params.Tag} -f || true
                        docker run -d --name ${params.nameImageBuild} -p 9090:80 --env-file .runtime.env ${nameImagePush}
                        """
                      }
                    }
                }
            }
        }
        stage('Cleanup') {
            agent { label 'master' }
            steps {
                script {
                    def idImageClenup = sh(script: "docker images -q ${params.nameImageBuild}", returnStdout: true).trim()
                    sh """
                        echo "ID image cleanup: ${idImageClenup}"
                        docker rmi ${idImageClenup} -f || true
                    """
                }
            }
        }
    }
    post {
        always {
            script {
                emailext(
                subject: "[${currentBuild.currentResult}] ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """\
<html>
<style>
    .ok { color: green; font-weight: bold; }
    .fail { color: red, font-weight: bold; }
    .unstable { color: orange, font-weight: bold; }
    .info { color: #0074d9; }
    body { font-family: Arial; }
</style>
<body>
<h2>Build <span class="${currentBuild.currentResult == 'SUCCESS' ? 'ok' : currentBuild.currentResult == 'FAILURE' ? 'fail' : 'unstable'}">${currentBuild.currentResult}</span>: <b>${env.JOB_NAME} #${env.BUILD_NUMBER}</b></h2>
<ul>
    <li class="info"><b>Project:</b> ${env.JOB_NAME}</li>
    <li class="info"><b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></li>
    <li><b>Git branch:</b> ${env.GIT_BRANCH ?: "N/A"}</li>
    <li><b>Git commit:</b> ${env.GIT_COMMIT ?: "N/A"}</li>
    <li><b>Triggered by:</b> ${currentBuild.getBuildCauses()?.shortDescription ?: "Unknown"}</li>
    <li><b>Duration:</b> ${currentBuild.durationString}</li>
  </ul>
  <h3>Summary:</h3>
  <pre>${currentBuild.description ?: "No build summary set."}</pre>
</body>
</html>
""",
                    to: "hothanhloc12345@gmail.com",
                    mimeType: 'text/html'
               )
            }
        }
    }
}