## CI
|  |  |
|--|--|
| **Subject Area:** | CI/CD Pipeline|
| **Topic** | Building the image an storing it|
| **Architectural Decision:** | Using Github actions to push image to QuayIO |
| **Issue or Problem Statement:** | Need for automatic code testing and building the image to then be stored in the container registry |
| **Assumptions:** | Compatibility with NodeJS |
| **Motivation:** | Good software development process, Increased integration speed |
| **Alternatives:** | Jenkins, CircleCI, Travis CI, IBM Cloud CI, AWS CodePipeline |
| **Justifications:** | ***We chose GitHub Actions because*** - well documented, easy-of-use, readily available examples and templates, Already using GitHub Actions for assigning issues to projects automatically, NodeJS build and test workflow available, OpenShift deployment available 
| |***Jenkins*** - Quite old, poor support for some plug-ins, extra set-up, despite being available on OpenShift Developer Sandbox there is no possibility for configuring plug-ins manually which makes this entirely not feasible |
||***Circle CI*** - Isn't fully Open Source |
||***Travis CI*** - Many compatible features but doesn't have as many templates available as GitHub Actions |
||***IBM Cloud CI*** - Requires the use of IBM CD, quite advanced set-up and features available which put it beyond the scope of our project |
|| ***AWS CodePipeline*** - Hard to set-up, requires other AWS products, e.g., network set-up. Available documentation is hard to navigate |
| **Implications:** | Ties us to GitHub Actions more, making using third-party tools more difficult to integrate into the pipeline |
| **Derived requirements:** | Use a CI template to build and push the container registry |
| **Related Decisions:** | Using GitHub Actions for OpenShift deployments (template available) |
| **References:** | **[https://katalon.com/resources-center/blog/ci-cd-tools](https://katalon.com/resources-center/blog/ci-cd-tools)** |
||**[https://harness.io/blog/devops/ci-cd-tools/](https://harness.io/blog/devops/ci-cd-tools/)**|
||**[https://circleci.com/](https://circleci.com/)**|
||**[https://circleci.com/pricing/](https://circleci.com/pricing/)**|
||**[https://argoproj.github.io/](https://argoproj.github.io/)**|
||**[https://argo-cd.readthedocs.io/en/stable/](https://argo-cd.readthedocs.io/en/stable/)**|
||**[https://github.com/features/actions](https://github.com/features/actions)**|
||**[https://resources.github.com/devops/tools/automation/actions](https://resources.github.com/devops/tools/automation/actions)**|
||**[https://access.redhat.com/documentation/en-us/openshift_container_platform/4.8/html/building_applications/working-with-helm-charts](https://access.redhat.com/documentation/en-us/openshift_container_platform/4.8/html/building_applications/working-with-helm-charts)**|
||**[https://docs.openshift.com/container-platform/3.11/dev_guide/deployments/how_deployments_work.html](https://docs.openshift.com/container-platform/3.11/dev_guide/deployments/how_deployments_work.html)**|
||**[https://github.blog/2022-02-02-build-ci-cd-pipeline-github-actions-four-steps/](https://github.blog/2022-02-02-build-ci-cd-pipeline-github-actions-four-steps/)**|
||https://www.trustradius.com/products/travis-ci/reviews?qs=pros-and-cons#product-details|

## CD

|  |  |
|--|--|
| **Subject Area:** | CI/CD Pipeline |
| **Topic** | Pulling and deploying image from registry |
| **Architectural Decision:** | Using Github actions to deploy the image |
| **Issue or Problem Statement:** | After the image is built it must be shipped to the customers, and so another stage is required to deploy it |
| **Assumptions:** | Compatibility with QuayIO |
| **Motivation:** | Good software development process, Increased delivery speed |
| **Alternatives:** | ArgoCD, IBM CD, AWS CodeDeploy, Helm Charts (Openshift container platform) |
| **Justifications:** | ***We chose GitHub Actions because*** - well documented, easy-of-use, readily available examples and templates, Already using GitHub Actions for assigning issues to projects automatically, NodeJS build and test workflow available, OpenShift deployment available 
| |***ArgoCD*** - steep learning curve, kubernetes focused, difficult set-up |
||***IBM CD*** - dependent on use of IBM CI workflow |
|| ***AWS CodeDepoly*** - dependent on use of AWS CodePipeline |
||***Helm Charts*** - Steep learning curve, available in the OpenShift Container platform however, sandbox version may have limitations, kubernetes focused |
| **Implications:** | Ties us to GitHub Actions more, making using third-party tools more difficult to integrate into the pipeline |
| **Derived requirements:** | Use a CD template to perform  deployment to OpenShift |
| **Related Decisions:** | Using GitHub Actions for building and storing the image |
| **References:** | **[https://katalon.com/resources-center/blog/ci-cd-tools](https://katalon.com/resources-center/blog/ci-cd-tools)** |
||**[https://harness.io/blog/devops/ci-cd-tools/](https://harness.io/blog/devops/ci-cd-tools/)**|
||**[https://circleci.com/](https://circleci.com/)**|
||**[https://circleci.com/pricing/](https://circleci.com/pricing/)**|
||**[https://argoproj.github.io/](https://argoproj.github.io/)**|
||**[https://argo-cd.readthedocs.io/en/stable/](https://argo-cd.readthedocs.io/en/stable/)**|
||**[https://github.com/features/actions](https://github.com/features/actions)**|
||**[https://resources.github.com/devops/tools/automation/actions](https://resources.github.com/devops/tools/automation/actions)**|
||**[https://access.redhat.com/documentation/en-us/openshift_container_platform/4.8/html/building_applications/working-with-helm-charts](https://access.redhat.com/documentation/en-us/openshift_container_platform/4.8/html/building_applications/working-with-helm-charts)**|
||**[https://docs.openshift.com/container-platform/3.11/dev_guide/deployments/how_deployments_work.html](https://docs.openshift.com/container-platform/3.11/dev_guide/deployments/how_deployments_work.html)**|
||**[https://github.blog/2022-02-02-build-ci-cd-pipeline-github-actions-four-steps/](https://github.blog/2022-02-02-build-ci-cd-pipeline-github-actions-four-steps/)**|
||https://www.trustradius.com/products/travis-ci/reviews?qs=pros-and-cons#product-details|
