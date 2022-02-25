
pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {
        
    stage('Git') {
      steps {
        git 'https://github.com/tcd-ibm/sweng.kanban.backend'
      }
    }
     
    stage('Build') {
      steps {
        sh 'npm install'
         sh 'docker-compose build'
      }
    }  
    
            
    stage('Test') {
      steps {
        sh 'node test'
      }
    }
  }
}
