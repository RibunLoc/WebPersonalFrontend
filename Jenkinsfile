pipeline {
    agent any

    parameters {
        string(name: 'nameImageBuild', defaultValue: 'web_frontend', description: 'Name of the Docker image to build')
        string(name: 'urlDomainHarbor', defaultValue: 'harbor.netsena.io.vn', description: "Domain of the Harbor registry so that you want to push the image")
        string(name: 'nameProject', defaultValue: 'personal_frontend', description: 'The project name on Harbor registry')
        string(name: 'Tag', defaultValue: 'v0.0.1', description: 'Tag for the Docker image')
    }
    stages {
        stage('Checkout') {
            steps {
                git(
                    credentialsId: 'github-token',
                    branch: 'develop',
                    url: 'https://github.com/RibunLoc/personal-website-frontend.git'
                )
            }
        }
        stage('Build') {
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
            steps {
                script {
                    def userInput = input(
                        message: "Approve deploy container ${env.JOB_NAME} to server",
                        ok: "Approve",
                        submitter: "thanhloc"
                    )
                    echo "Xác nhận triển khai ${userInput}"
                    sh """
                        docker stop \$(docker ps -q --filter "name=${params.nameImageBuild}") || true
                        docker rm \$(docker ps -aq --filter "name=${params.nameImageBuild}") || true
                        docker rmi \$(docker ps -aq --filter "name=${params.nameImageBuild}") -f || true
                        docker run -d --name ${params.nameImageBuild} -p 9090:80 ${params.nameImageBuild}:${params.Tag}
                    """
                }
            }
        }
        stage('Cleanup') {
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
                echo 'Cleaning up workspace...'
                cleanWs()
            }
        }
    }
}