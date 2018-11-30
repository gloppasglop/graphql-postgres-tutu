openshift.withCluster() {
    // Retrieve NAMESPACE
    env.NAMESPACE = openshift.project()
    // get the APP name from current namespace
    // the build will run in <project-base>-build
    env.APP_NAME="${env.NAMESPACE}".replaceAll(/-build/, '')
    // Each stage project name is <APP_NAME>-<stage_name>
    env.BUILD = "${env.NAMESPACE}"
    env.DEV = "${APP_NAME}-dev"
    env.STAGE = "${APP_NAME}-stage"
    env.PROD = "${APP_NAME}-prod"
}

pipeline {
    agent {
      kubernetes {
        label 'mypod'
        defaultContainer 'jnlp'
        // serviceAccount needed so that slave runs with jenkins right
        serviceAccount 'jenkins'
        cloud 'openshift'
        yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: some-label-value
spec:
  containers:
  - name: jnlp
    image:  openshift/pmi-jenkins-slave-base-centos7:latest
"""
      }
    }

    stages {

        stage('SCM Checkout') {
            steps {
                //TODO: Remove. only for DEBUG
                sh "echo $PWD"
                git url: "${APPLICATION_SOURCE_REPO}", branch: "${APPLICATION_SOURCE_REF}"
            }
        }

        stage('Build') {
            steps {        
                // GE
                sh "env"
                sh "oc whoami"
                script {
                    try {
                        openshift.withCluster() {
                            openshift.withProject("${BUILD}") {
                                // Use the build config to build the image
                                openshift.selector("bc", "${APP_NAME}").startBuild("--from-dir=./${BUILD_CONTEXT_DIR}").logs("-f")
                            }
                        }
                    } catch (exc) {
                        echo exc.toString()
                        currentBuild.result='UNSTABLE'
                        error("Building failed!")
                    }
                }
            }
        }

        stage ('Verify Deployment to Build') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject("${BUILD}") {
                            def dcObj = openshift.selector('dc', env.APP_NAME).object()
                            def podSelector = openshift.selector('pod', [deployment: "${APP_NAME}-${dcObj.status.latestVersion}"])
                            podSelector.untilEach {
                                echo "pod: ${it.name()}"
                                return it.object().status.containerStatuses[0].ready
                            }
                        }
                    }
                }
            }
        }

        stage('Promote from Build to Dev') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.tag("${env.BUILD}/${env.APP_NAME}:latest", "${env.DEV}/${env.APP_NAME}:latest")
                    }
                }
            }
        }

        stage ('Verify Deployment to Dev') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject("${STAGE1}") {
                            def dcObj = openshift.selector('dc', env.APP_NAME).object()
                            def podSelector = openshift.selector('pod', [deployment: "${APP_NAME}-${dcObj.status.latestVersion}"])
                            podSelector.untilEach {
                                echo "pod: ${it.name()}"
                                return it.object().status.containerStatuses[0].ready
                            }
                        }
                    }
                }
            }
        }

    } 
}