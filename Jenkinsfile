pipeline {
        options {
                disableConcurrentBuilds()
                buildDiscarder(logRotator(numToKeepStr: '5'))
        }
        agent { label 'build-agent-npm' }
        stages {
            stage('Prepare') {
                steps {
                    deleteDir()
                    checkout scm
                    sh "git rev-parse --short HEAD > .git/commit-id"

                    // grab info from pom file
                    script {
                        def props = readProperties file: 'sonar-project.properties'
                        def json = readJSON(file: 'package.json')
                        env.namespace = "dataengr"
                        env.registryNamespace = "dataengr"

                        def cypressJson = readJSON(file: 'cypress.json')
                        boolean hasCypressProjectId = cypressJson.projectId != null
                        env.recordCypress = env.BRANCH_NAME == 'master' && hasCypressProjectId == true ? "--key 3f664420-4972-4bc8-997d-928091706ecc --record" : ""
                        env.hasCypressProjectId = hasCypressProjectId

                        env.serviceNameWithDashes = props['sonar.projectName']
                        env.serviceName = "mls_data_platform_web_ui"
                        env.dockerPath = "zaplabs/${env.registryNamespace}/${env.serviceName}"
                        env.commit_id = readFile('.git/commit-id')
                        env.build_changelog = getChangeString()
                        env.imageTag = "rev-" + cleanBranchName(env.BRANCH_NAME) + "-${env.commit_id}"
                        currentBuild.description = env.imageTag
                        echo env.build_changelog
                        sh "mkdir -p test-reports"
                    }
                }
            }
            stage('NPM Install') {
                steps {
                    sh "npm install"
                }
            }
            stage('ESLint') {
                steps {
                    step([$class                     : 'CheckStylePublisher',
                          pattern                    : '**/test-reports/eslint.xml',
                          unstableTotalAll           : '0',
                          usePreviousBuildAsReference: true])

                }
            }
            stage('Sonarqube') {
                steps {
                    withSonarQubeEnv('Kubernetes Sonarqube') {
                        sh "/usr/share/sonar-runner/bin/sonar-runner -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.branch=${env.BRANCH_NAME}"
                    }
                }
            }
            stage('QA: Build') {
                when {
                    anyOf {
                        branch "development"
                        branch "devops"
                    }
                }
                steps {

                    sh "echo file exists"
                    sh "ls -l src/constants/qa-global.js"
                    sh "cp src/constants/qa-global.js src/constants/global.js"
                    sh "npm run build"

                }
            }
            stage('STG: Build') {
                when {
                    anyOf {
                        branch "stage"
                    }
                }
                steps {

                    sh "echo file exists"
                    sh "ls -l src/constants/stg-global.js"
                    sh "cp src/constants/stg-global.js src/constants/global.js"
                    sh "npm run build"

                }
            }
            stage('PROD: Build') {
                when {
                    anyOf {
                        branch "master"
                    }
                }
                steps {

                    sh "echo file exists"
                    sh "ls -l src/constants/stg-global.js"
                    sh "cp src/constants/prod-global.js src/constants/global.js"
                    sh "npm run build"

                }
            }
            stage('Test') {
                steps {
                    sh "cypress run ${env.recordCypress} --reporter junit --reporter-options mochaFile=./test-reports/report.xml,toConsole=true || true"
                }
            }
            stage('Non Prod: Build Container') {
                when {
                    anyOf {
                        branch "development"
                        branch "devops"
                        branch "stage"
                    }
                }
                steps {
                    sh "docker build --build-arg NPM_TOKEN_ARG=1389c765-573a-4f76-ac8a-493852ec24b1 -t ${env.serviceName}-development \\."
                }
            }
            stage('Prod: Build Container') {
                when {
                    anyOf {
                        branch "master"
                    }
                }
                steps {
                    sh "docker build --build-arg NPM_TOKEN_ARG=1389c765-573a-4f76-ac8a-493852ec24b1 -t ${env.serviceName}-release \\."
                }
            }
            stage('NonProd: Push To Legacy Registry') {
                when {
                    anyOf {
                        branch "development"
                        branch "devops"
                        branch "stage"
                    }
                }
                steps {
                    tagAndPushDockerContainerLegacy("${env.serviceName}-development", "${env.dockerPath}", env.imageTag)
                }
            }
            stage('Prod: Push To Legacy Registry') {
                when {
                    anyOf {
                        branch "master"
                    }
                }
                steps {
                    tagAndPushDockerContainerLegacy("${env.serviceName}-release", "${env.dockerPath}", env.imageTag)
                }
            }
            stage('QA: Deploy to Kubernetes') {
                when {
                    anyOf {
                        branch "development"
                        branch "devops"
                    }
                }
                steps {
                    withCredentials([usernamePassword(credentialsId: 'k8s_cluster_pwd_qa', passwordVariable: 'k8s_pwd', usernameVariable: 'k8s_user')]) {
                        sh "kubectl set image deployment/${env.serviceNameWithDashes} --namespace=${env.namespace} --server='https://qak8s-master1.aur.test.ziprealty.com' --username=${k8s_user} --password=${k8s_pwd} --insecure-skip-tls-verify=true ${env.serviceNameWithDashes}=dcr.ziprealty.com/${env.dockerPath}:${env.imageTag} "
                    }

                    script {
                        def slackMessage = "${env.serviceNameWithDashes} (${env.BRANCH_NAME}, ${env.commit_id}) to QA\n\n" + getChangeString() + " \n${env.BUILD_URL}"
                        slackSend channel: '#node-releases', color: 'good', message: "Deployed $slackMessage"
                    }
                }
            }
            stage('STG: Deploy to Kubernetes') {
                when {
                    anyOf {
                        branch "stage"
                    }
                }
                steps {
                    withCredentials([usernamePassword(credentialsId: 'k8s_cluster_pwd_prod', passwordVariable: 'k8s_pwd', usernameVariable: 'k8s_user')]) {
                        sh "kubectl set image deployment/${env.serviceNameWithDashes} --namespace=stg-dataengr --server='https://k8s-master1.aws.ziprealty.com' --username=${k8s_user} --password=${k8s_pwd} --insecure-skip-tls-verify=true ${env.serviceNameWithDashes}=dcr.ziprealty.com/${env.dockerPath}:${env.imageTag} "
                    }

                    script {
                        def slackMessage = "${env.serviceNameWithDashes} (${env.BRANCH_NAME}, ${env.commit_id}) to Stage\n\n" + getChangeString() + " \n${env.BUILD_URL}"
                        slackSend channel: '#node-releases', color: 'good', message: "Deployed $slackMessage"
                    }
                }
            }
           stage('PROD: Deploy to Kubernetes') {
               when {
                   anyOf {
                       branch "master"
                   }
               }
               steps {
                   withCredentials([usernamePassword(credentialsId: 'k8s_cluster_pwd_prod', passwordVariable: 'k8s_pwd', usernameVariable: 'k8s_user')]) {
                       sh "kubectl set image deployment/${env.serviceNameWithDashes} --namespace=${env.namespace} --server='https://k8s-master1.aws.ziprealty.com' --username=${k8s_user} --password=${k8s_pwd} --insecure-skip-tls-verify=true ${env.serviceNameWithDashes}=dcr.ziprealty.com/${env.dockerPath}:${env.imageTag} "
                   }

                   script {
                       def slackMessage = "${env.serviceNameWithDashes} (${env.BRANCH_NAME}, ${env.commit_id}) to Prod\n\n" + getChangeString() + " \n${env.BUILD_URL}"
                       slackSend channel: '#node-releases', color: 'good', message: "Deployed $slackMessage"
                   }
               }
           }
        }
    }



@NonCPS
def static cleanBranchName(String branchName) {
    return branchName.replaceAll("/", "-")
}

@NonCPS
def getChangeString() {
    MAX_MSG_LEN = 100
    def changeString = ""

    echo "Gathering SCM changes"
    def changeLogSets = currentBuild.changeSets
    for (int i = 0; i < changeLogSets.size(); i++) {
        def entries = changeLogSets[i].items
        for (int j = 0; j < entries.length; j++) {
            def entry = entries[j]
            truncated_msg = entry.msg.take(MAX_MSG_LEN)
            changeString += " - ${truncated_msg} [${entry.author}]\n"
        }
    }

    if (!changeString) {
        changeString = " - No new changes"
    }
    return changeString
}