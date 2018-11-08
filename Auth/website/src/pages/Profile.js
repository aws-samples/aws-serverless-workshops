/*
 *   Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 *  Licensed under the Apache License, Version 2.0 (the "License").
 *  You may not use this file except in compliance with the License.
 *  A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the "license" file accompanying this file. This file is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *  express or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 */
import React from 'react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import { Auth } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react';
import '../css/main.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                attributes: {
                    email: 'me@example.com',
                    phone_number: '+1123456789'
                }
            }
        }
    }
    componentDidMount() {
        Auth.currentAuthenticatedUser().then(user => {
            console.log('Cognito User', user);
            this.setState({user, image_key: 'profile-' + user.attributes.sub + '.jpg'});
        });;
    }

    async onImageLoad(url) {
        console.error('onImageLoad is not yet implemented');
    }

    render() {
      return (<div className="page-unicorns">
        <header className="site-header">
          <div>
          {/* <S3Image imgKey={this.state.image_key} onLoad={(url) => this.onImageLoad(url)} picker/> */}
    		<table align="center">
    		<tbody>
             <tr>
             <td>E-mail:</td>
             <td>{this.state.user.attributes.email}</td>
             </tr>
              <tr>
             <td>Phone:</td>
             <td>{this.state.user.attributes.phone_number}</td>
             </tr>
             </tbody>
            </table>
    	</div>
          <SiteNav/>
        </header>
        <SiteFooter/>
      </div>
    );
  }
}

export default Profile;
