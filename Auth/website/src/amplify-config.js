// This file is used for manual configuration of the Amplify library.
// When Amplify is used in conjunction with the Amplify CLI toolchain or AWS Mobile Hub to manage backend resources,
// an aws-exports.js file is auto-generated and can be used instead of the below to automatically configure the Amplify library.
// In this workshop, we are using the Amplify client libraries without the CLI toolchain so you should edit this file manually.

const awsConfig = {
    Auth: {
        identityPoolId: '', // 'us-east-1:5109bd6b-38ab-4429-89f8-e74d93656224'
        region: '', // 'us-east-1'
        userPoolId: '', // 'us-east-1_bgZVERFot'
        userPoolWebClientId: '', // '4lu058ri9ntkfrv99aa2taeu01'
    },
    API: {
        endpoints: [
            {
                name: 'WildRydesAPI',
                endpoint: '' // https://tnp677qpl3.execute-api.us-east-1.amazonaws.com/prod
            }
        ]
    }
}

export default awsConfig;