### Build and train a model

**Time to complete:** 30-45 minutes.

![Architecture diagram](../assets/WildRydesML_3.png)

The role of a data scientist involves pulling data from various sources. We will use a SageMaker notebook to walk through additional data preparation and model training. Below are directions to access the notebook. Within the notebook you'll find another set of detailed directions.

New to Amazon SageMaker? Never used a SageMaker Notebook? [Check out this quick start guide for a crash course](sagemaker-intro.md)

**:metal: Figure It Out**

1. Create an Amazon SageMaker notebook
1. Download the linear learner notebook provided in this workshop
1. Execute the instructions in the notebook

<details>
<summary><strong>:white_check_mark: Hold My Hand (expand for details)</strong></summary><p>

1. Navigate to [Amazon SageMaker](https://console.aws.amazon.com/sagemaker/home?region=us-east-1#/notebook-instances) in AWS Console
1. Open the notebook instance named `WildRydesNotebook-***`
1. Click the **Open Jupyter** link under Actions
1. When redirected to the notebook instance, click **New** (upper right), then select **Terminal** from list.
1. A new tab will open. When in the terminal, run the following command:
    ```
    curl https://raw.githubusercontent.com/jmcwhirter/aws-serverless-workshops/master/MachineLearning/0_ExternalData/notebooks/linear_learner.ipynb -o SageMaker/linear_learner.ipynb && exit
    ```
1. Exit the terminal tab/window
1. Open the **linear_learner.ipynb** notebook and follow the instructions.

</p></details>

**:see_no_evil: Do it For Me (not available)**

At this point, you should have a trained model in S3. You may have set up the optional endpoint to test your work. Instead of using an endpoint with an always on server, let's explore using Lambda to make inferences against our model.
