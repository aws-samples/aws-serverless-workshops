/**
 * All of the functions in login.js are found in the amazon.Login namespace. These functions allow you to
 * identify your client application, request an access token, and exchange an access token for customer profile
 * information.
 */
declare namespace amazon.Login {
  export type Callback = string | ((response: AuthorizeRequest) => void);

  /**
   * The AuthorizeRequest class is used in response to an authorize call. AuthorizeRequest allows callers
   * to register a callback function or redirect URL to use when the login request is complete. It also allows callers
   * to get the current status of the request. When the request is complete, AuthorizeRequest adds new
   * properties based on the type of authorization request. If the request fails, error properties provide information
   * on the failure.
   *
   * The following table details which properties are added for each response type:
   *  Response Type              Properties
   *  Authorization Response     code and state.
   *  Access Token Response      access_token, token_type, expires_in, and scope.
   *  Error Response             error, error_description, and error_uri.
   */
  export interface AuthorizeRequest {
    /**
     * Registers a callback function or sets a redirect URI to call when the authorization request is complete. If this
     * function is called after the request is complete, the function or redirect will happen immediately. If a callback
     * function is used, the AuthorizeRequest will be the first parameter. If a redirect URI is used, the browser
     * will redirect to that URI with the OAuth 2 response parameters included in the query string.
     * If multiple redirect URLs are set, AuthorizeRequest uses the most recent one.
     */
    onComplete(next: Callback): void;

    /**
     * The access token issued by the authorization server.
     */
    access_token?: string;

    /**
     * An authorization code that can be exchanged for an access token.
     */
    code?: string;

    /**
     * A short error code indicating why the authorization failed. It can be one of the following:
     *  access_denied
     *    The customer or authorization server denied the request.
     *  invalid_grant
     *    The authorization server denied the request due to inability to use a cached token.
     *  invalid_request
     *    The request is missing a required parameter, has an invalid value, or is otherwise malformed.
     *  invalid_scope
     *    One or more of the requested scopes are invalid.
     *  server_error
     *    The authorization server encountered an unexpected error. This is analogous to a 500 HTTP status code.
     *  temporarily_unavailable
     *    The authorization server is current unavailable due to a temporary condition. This is analogous to a 503
     *    HTTP status code.
     *  unauthorized_client
     *    The client is not authorized to perform this request.
     */
    error?: "access_denied" | "invalid_grant" | "invalid_request" | "invalid_scope" | "server_error"
      | "temporarily_unavailable" | "unauthorized_client";

    /**
     * A human-readable description of the error.
     */
    error_description?: string;

    /**
     * A URI for a web page with more information on the error
     */
    error_uri?: string;

    /**
     * The number of seconds until the access token expires.
     */
    expires_in?: Number;

    /**
     * The scope granted by the authorization server for the access token. Must be profile,
     profile:user_id, postal_code, or some combination.
     */
    scope?: string;

    /**
     * The state value provided to authorize using the options object.
     */
    state?: string;

    /**
     * The current status of the request. One of queued, in progress, or complete
     */
    status?: "queued" | "in progress" | "complete";

    /**
     * The type of token issued. Must be bearer.
     */
    token_type?: "bearer";
  }

  export interface Profile {
    /**
     * An identifier that uniquely identifies the logged-in user for this caller. Only present if the profile or
     * profile:user_id scopes are requested and granted.
     */
    CustomerId?: string,

    /**
     * The customer's name. Only present if the profile scope is requested and granted.
     */
    Name?: string,

    /**
     * The postal code of the customer's primary address.
     * Only present if the postal_code scope is requested and granted.
     */
    PostalCode?: string,

    /**
     * The primary email address for the customer. Only present if the profile scope is requested and granted.
     */
    PrimaryEmail?: string
  }

  /**
   * Contains profile data or error string
   */
  export interface RetrieveProfileResponse {
    /**
     * Parameter indicating whether the request was successful.
     * If the request is not successful, success will be false
     * and the response object will include an error (String)
     * property describing the error.
     * If the request is successful, success will be true and
     * the response object will include a profile (Object) parameter
     */
    success: boolean;

    /**
     * Describes the error
     */
    error?: string;

    /**
     * Profile data
     */
    profile?: Profile;
  }

  /**
   * Requests authorization according to options then redirects or calls next. Depending on the options set, a
   * popup window will open to allow the user to login, or the window will redirect to the login page. You must call
   * setClientId prior to calling authorize. You must call authorize prior to calling retrieveProfile.
   * This method returns an AuthorizeRequest object. Call onComplete on that object to register a callback
   * function or redirect URI, similar to the next parameter. Once the request is complete, the object will contain
   * properties detailing the response (such as an access token or authorization code).
   * @param options - Determines whether users authenticate via popup window or are
   * redirected to a separate login screen (required).
   * @param next - A URI to redirect the browser response, or a JavaScript function to call
   * with the authorization response.
   *
   * @return An AuthorizeRequest object. AuthorizeRequest allows callers to register a callback function or redirect URL
   * to use when the login request is complete. It also allows callers to get the current status of the request. When
   * the request is complete, new properties are added to AuthorizeRequest based on the type of authorization
   * request. If the request fails, error properties are added to the object.
   */
  export function authorize(options: {
    /**
     * Specifies when to show a login screen to
     * the user. auto will attempt to use a cached token. If the cached
     * token fails or does not exist, the user will be presented with a login
     * screen. always does not use the cached token and always presents
     * a login screen. never will used the cached token; if the token does
     * not work, authorize will return invalid_grant. Defaults to auto.
     */
    interactive?: "auto" | "always" | "never",

    /**
     * true to use a popup window for login, false
     * to redirect the current browser window to the authorization dialog.
     * Defaults to true. If false, the next parameter MUST be a
     * redirect URL.
     */
    popup?: boolean,

    /**
     * The grant type requested. Specify
     * token to request an Implicit grant or code to request an
     * Authorization Code grant. Defaults to token.
     */
    response_type?: "token" | "code",

    /**
     * The accesss cope requested. Must be profile, profile:user_id,
     * postal_code, or some combination.
     */
    scope: string | string[]
  }, next?: Callback): AuthorizeRequest;

  /**
   * Gets the client identifier that will be used to request authorization. You must call setClientId before calling
   * this function.
   *
   * @return The client ID assigned to your application.
   */
  export function getClientId(): string;

  /**
   * Logs out the current user after a call to authorize.
   */
  export function logout(): void;

  /**
   * Retrieves the customer profile and passes it to a callback function. Uses an access token provided by
   * authorize.
   *
   * @param accessToken - An access token. If this parameter is omitted,
   * retrieveProfile will call authorize, requesting the
   * profile scope.
   * @param callback - Called with the profile data or an error string.
   * This function returns a response (Object), with a
   * success (Boolean) parameter indicating whether the
   * request was successful.
   * If the request is not successful, success will be false
   * and the response object will include an error (String)
   * property describing the error.
   */
  export function retrieveProfile(accessToken?: string, callback?: (response: RetrieveProfileResponse) => void): void;

  /**
   * Sets the client identifier that will be used to request authorization. You must call this function before calling
   * authorize.
   *
   * @param clientId - The client ID assigned to your application.
   */
  export function setClientId(clientId: string): void;

  /**
   * Determines whether or not Login with Amazon should use the Amazon Payments sandbox for requests. To
   * use the Amazon Payments sandbox, call setSandboxMode(true)before calling authorize.
   *
   * @param sandboxMode -  true to use the Amazon payments sandbox to process
   * requests, otherwise false.
   */
  export function setSandboxMode(sandboxMode: boolean): void;

  /**
   * Sets the domain to use for saving cookies.The domain must match the origin of the current page. Defaults to
   * the full domain for the current page.
   *
   * For example, if you have two pages using the Login with Amazon SDK for JavaScript, site1.example.com
   * and site2.example.com, you would set the site domain to example.com in the header of each site. This
   * will ensure that the cookies on both sites have access to the same cached tokens.
   *
   * @param siteDomain - The site to store Login with Amazon cookies. Must share the
   * origin of the current page.
   */
  export function setSiteDomain(siteDomain: string): void;

  /**
   * Determines whether or not Login with Amazon should use access tokens written to the
   * amazon_Login_accessToken cookie. You can use this value to share an access token with another
   * page. Access tokens will still only grant access to the registered account for whom they were created.
   *
   * When true, the Login with Amazon SDK for JavaScript will check this cookie for cached tokens, and store
   * newly granted tokens in that cookie.
   *
   * @param useCookie - true to store the access token from authorizing a cookie,
   * otherwise false.
   */
  export function setUseCookie(useCookie: boolean): void;
}
