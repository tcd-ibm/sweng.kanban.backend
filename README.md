# Backend of Team 31 project (Kanban board as an example project for CI/CD pipeline)

### Short description of the application

We built a NodeJS Express API paired with a 
MongoDB database that provides different operations for a Kanban board application. 

### Two pipelines were defined for the project, development and production.

The first step in the pipeline is building an image using buildah and pushing it to container 
registry repository. The repositories are separate for production and development. We use
GithubActions for this step of the pipeline and quay.io as container registry.

The next step is pulling the image and deploying it to openshift. We supply the url of the 
container registry repository and an openshift deployment is performed by an official 
RedHat Github Actions workflow. 

So as to facilitate both steps of the pipeline we need to create a number of github secrets,
which ensure that we do not expose access tokens to our openshift cluster or quay.io robot account.

We also do integration tests using postman, integration tests are triggered on every push or pull 
request to the repo. We define tests using a postman collection.

Another side part of the pipeline is static analysis, which is done using JS Hint, which ensures that
our code is clean. 

Finally, we use issues auto assignment automation to assign issues to our project automatically upon
creation. 

Please have a look in the documentation folder to learn more about how the pipeline was built, step by step.
