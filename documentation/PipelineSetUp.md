# A more detailed guide on setting up the pipeline

### Assumptions

You already have some sort of application ready. We will be using a NodeJS Express + MongoDB app, but the steps will apply to other apps supported by OpenShift.

Also, we assume that you already have a Github Account set up and some containerized application in a repo that you are willing to create the pipeline in. 

If you do not have these, you can search online for a suitable tutorial and first follow it before proceeding with this guide.

### Idea behind pipelines

We have a build and push image stage followed by deployment stage to Openshift Cluster. We also do automated testing with Postman and various static analysis stages.

In our implementation, we used quay.io as the container registry, however with little modifications you can use other popular container registries. To do this, you would have to search for workflows that push images to the respective registry and use them as examples. Click on create new workflow and look at the templates available.

### Setting up accounts

Firstly, we need to create an account and a repo on [quay.io](https://quay.io/). The registration is straight forward. Now create a robot account. Robot accounts are the way you can allow applications to do things on your behalf on the quay.io container registry. 

Robot account can be created by going into account settings and clicking on the robot icon, then click on "Create robot account". Make note of the robot account name and the robot account token. These will be required at the next step. 

Now create a repository on quay.io, select the empty repository template if prompted. Go back to the robot accounts tab and make sure to add the admin permission for the repository you just created to the robot account.

The basic set up on quay.io is done.

The next step is creating an OpenShift Cluster. The simpliest way is to access OpenShift through Developer Sandbox. Here is the [link](https://developers.redhat.com/developer-sandbox/get-started). Just follow the set up steps, they are straight forward. Once you have finished the set up steps you should have access to developer sandbox, which may look something like that (except you will not have any deployments, which are depicted as circles in the workspace): 

![developer-sandbox](pictures/developer_sandbox.png)

Now you will have to create a service account for OpenShift. The idea is exactly the same as with robot accounts on quay.io. Please follow these links to learn how to create the service account [RedHat Docs on creating Service Accounts](https://docs.openshift.com/container-platform/4.6/authentication/understanding-and-creating-service-accounts.html#service-accounts-granting-roles_understanding-service-accounts) and [Github Actions OpenShift Login Docs](https://github.com/redhat-actions/oc-login/wiki/Using-a-Service-Account-for-GitHub-Actions#creating-the-service-account).

Once you created the account, make note of the OpenShift Server for the cluster (the address of the cluster) and OpenShift token for the service account you created.

### Setting up repository secrets

Secrets are values that you do not want to expose to the outside world. You can set secrets for the github repo and then use them in the workflows. This way you can abstract sensitive data out of the workflows.

We will need to create several Github Secrets. Please google how to create Github Secrets, if you are unsure how to do it. It can be done using GUI and is quite straight forward.

* ROBOT_ACCOUNT_NAME - robot account name from quay.io
* QUAY_IO_TOKEN - robot account token from quay.io
* OPENSHIFT_SERVER - server address from developer sandbox
* OPENSHIFT_TOKEN - token for the service account created in developer sandbox
* OPENSHIFT_PROJECT - optional, specifies the namespace where deployment will be created. If you look at the picture above, that would be petrukhp-dev. By default, you would have it as yourusername-dev. You can, however, create your own project and use it using the web UI in developer sandbox.

These are the base secrets that you will need. You may also want to set up two pipelines as we did in our project. One for testing and one for production. In this case, you may want to have the deployments in separate workspaces, so you can create OPENSHIFT_PROJECT_DEV and OPENSHIFT_PROJECT_PROD. 

The next secrets are application specific. 

For a typical NodeJS + MongoDB application we can set up PORT, MONGODB_PORT and MONGODB_URL. You can set PORT according to your needs now, but wait with MONGODB_PORT and MONGODB_URL, these will be set up at later stage. You may also want to create 2 versions of these secrets for testing and production, for example PORT_DEV and PORT_PROD. 


### Setting up MongoDB in OpenShift Cluster

Search in the services catalog for MongoDB application and deploy it following the web UI in the developer sandbox. You may want to change the name of the database and your deployment or leave them as default. Here is an example of what you will see when creating a MongoDB deployment:

![mongodb-1](pictures/mongodb_1.png)
![mongodb-2](pictures/mongodb_2.png)

Once you have created a MongoDB deployment you will see a new circle that appeared in your topology tab. 

Now, you will have to find the local service address which is accessible only inside the cluster in the deployment config. You can do so by clicking on the circle and exploring the configs. You will also need the port, which is normally 27017 for MongoDB. Next, go into secrets tab and find the secrets file corresponding to the name of your MongoDB server. Once located, open it and you will have 4 secrets, which are database name, admin password, database password and database user. 

You will need to form the following string 'mongodb://username:password@host:port/database, where username is the database user, password is the database password, host is the service address, port is the port for that service and database is the database secret. Once formed add this string as secret to the github repo as MONGODB_URL. In your NodeJS Express application, you will be reference it as usually using process.env.MONGODB_URL, because this secret will be added to the application in deployment stage. 

Similarly you can set the port for MongoDB as MONGODB_PORT. Again, you may want to have 2 pipelines, one for testing and the other for production, in this case you can create 2 databases and extend secrets' names to reflect that, for example MONGODB_URL_DEV and MONGODB_URL_PROD. 

### Explanation of the pipeline code

We will cover the production pipeline, the test pipeline is the same as production with the exception of secret values.

Build stage:

```
name: "Publish to Quay.io"

# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
# documentation.

on:
  push:
    branches: [ main ]
    tags: [ 'v*.*.*' ]

env:
  REGISTRY: quay.io
  IMAGE_NAME: sweng312022/kanban_board_backend
  IMAGE_TAGS: ""
  
jobs:
  build_and_publish:
  
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
        
      - name: Determine image tags
        if: env.IMAGE_TAGS == ''
        run: |
          echo "IMAGE_TAGS=latest ${GITHUB_SHA::12}" | tee -a $GITHUB_ENV

      - name: Build from Dockerfile
        id: build-image
        uses: redhat-actions/buildah-build@v2
        with:
          image: ${{ env.IMAGE_NAME }}
          tags: ${{ env.IMAGE_TAGS }}
          build-args:
            PORT=${{ secrets.PORT }}
          dockerfiles: |
            ./Dockerfile
            
      - name: Push to registry
        id: push-image
        uses: redhat-actions/push-to-registry@v2
        with:
          image: ${{ steps.build-image.outputs.image }}
          tags: ${{ steps.build-image.outputs.tags }}
          registry: ${{ env.REGISTRY }}
          username: ${{ secrets.ROBOT_ACCOUNT_NAME }}
          password: ${{ secrets.QUAY_IO_TOKEN }}

      - name: Wait for the image changes to propagate on quay.io
        run: |
          sleep 10
```

We define the pipeline to be triggered on every push to main. Next we, in the environment section, we specify the hostname of the registry, image name and image tags, which are empty in our case.

The next part is defining jobs. We are going to have just on job build and publish which runs on ubuntu and has multiple steps.

The first step is checking out the repository. After that we need to determine image tags. Essentially, if tags are not set, then we set them to latest and GITHUB_SHA. 

Next, we build the image using buildah. We also make sure to supply any build arguments we have and specify the correct context (path) for the Dockerfile.

After the image is built, we push it to container registry. We also wait for 10 seconds at the end to ensure that the changes are propagated on the quay.io website. We need this as successful completion of build and push stage triggers a deployment.

Deployment stage:

```

name: OpenShiftDeployment

env:
  OPENSHIFT_SERVER: ${{ secrets.OPENSHIFT_SERVER }}
  OPENSHIFT_TOKEN: ${{ secrets.OPENSHIFT_TOKEN }}
  # 🖊️ EDIT to set the kube context's namespace after login. Leave blank to use your user's default namespace.
  OPENSHIFT_NAMESPACE: ${{ secrets.OPENSHIFT_PROJECT }}
  # 🖊️ EDIT to set a name for your OpenShift app, or a default one will be generated below.
  APP_NAME: "kanbanbackend"
  APP_PORT: ${{ secrets.PORT }}
  
on:
  workflow_run:
    workflows: ["Publish to Quay.io"]
    types:
      - completed
jobs:   
  openshift-deploy:
      name: Deploy to OpenShift
      # ubuntu-20.04 can also be used.
      runs-on: ubuntu-18.04

      outputs:
        ROUTE: ${{ steps.deploy-and-expose.outputs.route }}
        SELECTOR: ${{ steps.deploy-and-expose.outputs.selector }}
 
      steps:
      - name: Install oc
        uses: redhat-actions/openshift-tools-installer@v1
        with:
          oc: 4
 
      # https://github.com/redhat-actions/oc-login#readme
      - name: Log in to OpenShift
        uses: redhat-actions/oc-login@v1
        with:
          openshift_server_url: ${{ env.OPENSHIFT_SERVER }}
          openshift_token: ${{ env.OPENSHIFT_TOKEN }}
          insecure_skip_tls_verify: true
          namespace: ${{ env.OPENSHIFT_NAMESPACE }}

      - name: Create and expose app
        id: deploy-and-expose
        uses: redhat-actions/oc-new-app@v1
        with:
          app_name: ${{ env.APP_NAME }}
          image: quay.io/sweng312022/kanban_board_backend
          namespace: ${{ env.OPENSHIFT_NAMESPACE }}
          port: ${{ env.APP_PORT }}
          
      - name: Set environment
        run: |
          oc set env deployment.apps/kanbanbackend MONGODB_URL=${{ secrets.MONGODB_URL }} PORT=${{ secrets.PORT }} MONGODB_PORT=${{ secrets.MONGODB_PORT }}
      
      - name: Obtain a self signed certificate
        run: |
          openssl genrsa -out key-prod.key
          openssl req -new -key key-prod.key -out csr-prod.csr -subj "/CN=${{ secrets.DOMAIN_WILDCARD }}"
          openssl x509 -req -in csr-prod.csr -signkey key-prod.key -out crt-prod.crt
          
      - name: Delete Default Unsecure Route
        run: |
          oc delete route kanbanbackend
          
      - name: Create new edge route using self-signed certificate
        run: |
          oc create route edge --service kanbanbackend --hostname ${{ secrets.HOSTNAME }} --key key-prod.key --cert crt-prod.crt

      - name: Print application URL
        env:
          ROUTE: ${{ steps.deploy-and-expose.outputs.route }}
          SELECTOR: ${{ steps.deploy-and-expose.outputs.selector }}
        run: |
          [[ -n ${{ env.ROUTE }} ]] || (echo "Determining application route failed in previous step"; exit 1)
          echo
          echo "======================== Your application is available at: ========================"
          echo ${{ env.ROUTE }}
          echo "==================================================================================="
          echo
          echo "Your app can be taken down with: \"oc delete all --selector='${{ env.SELECTOR }}'\""
```

As previously, we need to specify a number of environment variables at first. 

Next we say that the deployment gets triggered on completion of build and push stage.

After that, we specify the jobs. Openshift-deploy job is going to output route(url to the application) and selector.

The first step is installing openshift, which is followed by logging into our cluster using the credentials we created in one of the previous steps.

After that we use the oc-new-app action to create and expose new app. We also make sure to pass the necessary environment variables by executing oc set env.

The next step is optional and is required for setting up a self-signed ssl certificate using openssl. 

You could use a provider signed certificate here instead, as long as you can set it up on your cluster, either by passing it into through the action or putting it directly into the openshift cluster.

Typically, the deployment will create a non-secure http route, so we delete it first and then create a new edge route using the certificate we just signed. Edge route means that we have https connection from user to route and http connection from route to service, because it is internal to the cluster and does not have to be encrypted. You can set up other route types such as re-encrypt or passthrough, please read openshift docs for that.

Here we are using 2 secrets: DOMAIN_WILDCARD and HOSTNAME. They are required to obtain a relevant ssl certificate. DOMAIN_WILDCARD would normally be something like `*.apps.sandbox-*.openshiftapps.com`, if you are using developer sandbox. HOSTNAME could be something like `my-app-my-project.apps.sandbox-*.openshiftapps.com`.  

After that we print the results.

### Postman automated testing

We are using postman to test our api on each push and pull request. The workflow that does it is rather simple: 

```
name: Run Postman Integration Tests
on: [push, pull_request] 

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x]
        mongodb-version: [5.0]
        
    steps:
      - name: Check out Git repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
          registry-url: https://registry.npmjs.org/

      - name: Start MongoDB ${{ matrix.mongodb-version }}
        uses: supercharge/mongodb-github-action@1.3.0
        with:
          mongodb-version: ${{ matrix.mongodb-version }}

      - name: Install dependencies
        run: npm install

      - name: Install newman
        run: npm install -g newman

      - name: Create test env file
        run: |
          touch .env
          echo MONGODB_URL=mongodb://127.0.0.1:27017/test-db >> .env
          echo PORT=9000 >> .env
          echo MONGODB_PORT=27017 >> .env
          ls

      - name: Run the API and Postmans tests
        run: | 
          node app.js &
          sleep 5
          newman run "kanbanboardstatuscheck.postman_collection.json"
        env:
          MONGO_URI: "mongodb://127.0.0.1:27017/test-db"
          PORT: "9000"
          STAGE: "local"
          NODE_ENV: "develop"

```

In this workflow, we checkout the repo, set up local MongoDB service, install node dependecies and run our application. After that, we use newman to run the collection of tests that is specified in the root of our repo. When creating the collection please ensure that you set the application url to localhost.

### Static analysis

We started with using js-hint as a simple static analysis tool, but then we decided to switch to ...


### Security scans

TODO

### Automated issue assignment

Using a simple workflow, we automatically assign every issue created in the repo to a relevant project:

```
name: Issues Auto Assign

on:
  issues:
    types: [opened]
jobs:
  createCard:
    runs-on: ubuntu-latest
    steps:
      - name: Create or Update Project Card
        uses: peter-evans/create-or-update-project-card@v1
        with:
          token: ${{secrets.PAT}} 
          project-location: tcd-ibm
          project-number: 2
          column-name: To do

```

Here PAT is the personal access token, which you can easily obtain through github web UI. 


