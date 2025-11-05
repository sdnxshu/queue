pipeline {
    agent any

    environment {
        // Docker Hub info
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_REPO = 'sdnxshu/queue'
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh """
                        docker build -t ${DOCKERHUB_REPO}:${IMAGE_TAG} .
                    """
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    echo "Logging in to Docker Hub..."
                    sh """
                        echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo "Pushing Docker image to Docker Hub..."
                    sh """
                        docker push ${DOCKERHUB_REPO}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Logout from Docker Hub') {
            steps {
                sh 'docker logout'
            }
        }
    }

    post {
        always {
            echo "Cleaning up workspace..."
            sh 'docker image prune -f'
        }
    }
}
