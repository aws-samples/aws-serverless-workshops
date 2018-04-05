/*!
 * Copyright 2016 Amazon.com,
 * Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the
 * License. A copy of the License is located at
 * 
 *     http://aws.amazon.com/asl/
 * 
 * or in the "license" file accompanying this file. This file is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, express or implied. See the License
 * for the specific language governing permissions and
 * limitations under the License. 
 */


(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("aws-sdk/global"), require("aws-sdk/clients/cognitoidentityserviceprovider"));
	else if(typeof define === 'function' && define.amd)
		define(["aws-sdk/global", "aws-sdk/clients/cognitoidentityserviceprovider"], factory);
	else if(typeof exports === 'object')
		exports["AmazonCognitoIdentity"] = factory(require("aws-sdk/global"), require("aws-sdk/clients/cognitoidentityserviceprovider"));
	else
		root["AmazonCognitoIdentity"] = factory(root["AWSCognito"], root["AWSCognito"]["CognitoIdentityServiceProvider"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_12__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _src = __webpack_require__(15);

	Object.keys(_src).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _src[key];
	    }
	  });
	});

	var _cognitoidentityserviceprovider = __webpack_require__(12);

	var _cognitoidentityserviceprovider2 = _interopRequireDefault(_cognitoidentityserviceprovider);

	var enhancements = _interopRequireWildcard(_src);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	Object.keys(enhancements).forEach(function (key) {
	  _cognitoidentityserviceprovider2.default[key] = enhancements[key];
	});

	// The version of crypto-browserify included by aws-sdk only
	// checks for window.crypto, not window.msCrypto as used by
	// IE 11 – so we set it explicitly here
	if (typeof window !== 'undefined' && !window.crypto && window.msCrypto) {
	  window.crypto = window.msCrypto;
	}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _global = __webpack_require__(1);

	var _BigInteger = __webpack_require__(3);

	var _BigInteger2 = _interopRequireDefault(_BigInteger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*!
	                                                                                                                                                           * Copyright 2016 Amazon.com,
	                                                                                                                                                           * Inc. or its affiliates. All Rights Reserved.
	                                                                                                                                                           *
	                                                                                                                                                           * Licensed under the Amazon Software License (the "License").
	                                                                                                                                                           * You may not use this file except in compliance with the
	                                                                                                                                                           * License. A copy of the License is located at
	                                                                                                                                                           *
	                                                                                                                                                           *     http://aws.amazon.com/asl/
	                                                                                                                                                           *
	                                                                                                                                                           * or in the "license" file accompanying this file. This file is
	                                                                                                                                                           * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	                                                                                                                                                           * CONDITIONS OF ANY KIND, express or implied. See the License
	                                                                                                                                                           * for the specific language governing permissions and
	                                                                                                                                                           * limitations under the License.
	                                                                                                                                                           */

	var initN = 'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD1' + '29024E088A67CC74020BBEA63B139B22514A08798E3404DD' + 'EF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245' + 'E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7ED' + 'EE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3D' + 'C2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F' + '83655D23DCA3AD961C62F356208552BB9ED529077096966D' + '670C354E4ABC9804F1746C08CA18217C32905E462E36CE3B' + 'E39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9' + 'DE2BCBF6955817183995497CEA956AE515D2261898FA0510' + '15728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64' + 'ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7' + 'ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6B' + 'F12FFA06D98A0864D87602733EC86A64521F2B18177B200C' + 'BBE117577A615D6C770988C0BAD946E208E24FA074E5AB31' + '43DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF';

	var newPasswordRequiredChallengeUserAttributePrefix = 'userAttributes.';

	/** @class */

	var AuthenticationHelper = function () {
	  /**
	   * Constructs a new AuthenticationHelper object
	   * @param {string} PoolName Cognito user pool name.
	   */
	  function AuthenticationHelper(PoolName) {
	    _classCallCheck(this, AuthenticationHelper);

	    this.N = new _BigInteger2.default(initN, 16);
	    this.g = new _BigInteger2.default('2', 16);
	    this.k = new _BigInteger2.default(this.hexHash('00' + this.N.toString(16) + '0' + this.g.toString(16)), 16);

	    this.smallAValue = this.generateRandomSmallA();
	    this.largeAValue = this.calculateA(this.smallAValue);

	    this.infoBits = new _global.util.Buffer('Caldera Derived Key', 'utf8');

	    this.poolName = PoolName;
	  }

	  /**
	   * @returns {BigInteger} small A, a random number
	   */


	  AuthenticationHelper.prototype.getSmallAValue = function getSmallAValue() {
	    return this.smallAValue;
	  };

	  /**
	   * @returns {BigInteger} large A, a value generated from small A
	   */


	  AuthenticationHelper.prototype.getLargeAValue = function getLargeAValue() {
	    return this.largeAValue;
	  };

	  /**
	   * helper function to generate a random big integer
	   * @returns {BigInteger} a random value.
	   * @private
	   */


	  AuthenticationHelper.prototype.generateRandomSmallA = function generateRandomSmallA() {
	    var hexRandom = _global.util.crypto.lib.randomBytes(128).toString('hex');

	    var randomBigInt = new _BigInteger2.default(hexRandom, 16);
	    var smallABigInt = randomBigInt.mod(this.N);

	    return smallABigInt;
	  };

	  /**
	   * helper function to generate a random string
	   * @returns {string} a random value.
	   * @private
	   */


	  AuthenticationHelper.prototype.generateRandomString = function generateRandomString() {
	    return _global.util.crypto.lib.randomBytes(40).toString('base64');
	  };

	  /**
	   * @returns {string} Generated random value included in password hash.
	   */


	  AuthenticationHelper.prototype.getRandomPassword = function getRandomPassword() {
	    return this.randomPassword;
	  };

	  /**
	   * @returns {string} Generated random value included in devices hash.
	   */


	  AuthenticationHelper.prototype.getSaltDevices = function getSaltDevices() {
	    return this.SaltToHashDevices;
	  };

	  /**
	   * @returns {string} Value used to verify devices.
	   */


	  AuthenticationHelper.prototype.getVerifierDevices = function getVerifierDevices() {
	    return this.verifierDevices;
	  };

	  /**
	   * Generate salts and compute verifier.
	   * @param {string} deviceGroupKey Devices to generate verifier for.
	   * @param {string} username User to generate verifier for.
	   * @returns {void}
	   */


	  AuthenticationHelper.prototype.generateHashDevice = function generateHashDevice(deviceGroupKey, username) {
	    this.randomPassword = this.generateRandomString();
	    var combinedString = '' + deviceGroupKey + username + ':' + this.randomPassword;
	    var hashedString = this.hash(combinedString);

	    var hexRandom = _global.util.crypto.lib.randomBytes(16).toString('hex');
	    this.SaltToHashDevices = this.padHex(new _BigInteger2.default(hexRandom, 16));

	    var verifierDevicesNotPadded = this.g.modPow(new _BigInteger2.default(this.hexHash(this.SaltToHashDevices + hashedString), 16), this.N);

	    this.verifierDevices = this.padHex(verifierDevicesNotPadded);
	  };

	  /**
	   * Calculate the client's public value A = g^a%N
	   * with the generated random number a
	   * @param {BigInteger} a Randomly generated small A.
	   * @returns {BigInteger} Computed large A.
	   * @private
	   */


	  AuthenticationHelper.prototype.calculateA = function calculateA(a) {
	    var A = this.g.modPow(a, this.N);

	    if (A.mod(this.N).equals(_BigInteger2.default.ZERO)) {
	      throw new Error('Illegal paramater. A mod N cannot be 0.');
	    }
	    return A;
	  };

	  /**
	   * Calculate the client's value U which is the hash of A and B
	   * @param {BigInteger} A Large A value.
	   * @param {BigInteger} B Server B value.
	   * @returns {BigInteger} Computed U value.
	   * @private
	   */


	  AuthenticationHelper.prototype.calculateU = function calculateU(A, B) {
	    this.UHexHash = this.hexHash(this.padHex(A) + this.padHex(B));
	    var finalU = new _BigInteger2.default(this.UHexHash, 16);

	    return finalU;
	  };

	  /**
	   * Calculate a hash from a bitArray
	   * @param {Buffer} buf Value to hash.
	   * @returns {String} Hex-encoded hash.
	   * @private
	   */


	  AuthenticationHelper.prototype.hash = function hash(buf) {
	    var hashHex = _global.util.crypto.sha256(buf, 'hex');
	    return new Array(64 - hashHex.length).join('0') + hashHex;
	  };

	  /**
	   * Calculate a hash from a hex string
	   * @param {String} hexStr Value to hash.
	   * @returns {String} Hex-encoded hash.
	   * @private
	   */


	  AuthenticationHelper.prototype.hexHash = function hexHash(hexStr) {
	    return this.hash(new _global.util.Buffer(hexStr, 'hex'));
	  };

	  /**
	   * Standard hkdf algorithm
	   * @param {Buffer} ikm Input key material.
	   * @param {Buffer} salt Salt value.
	   * @returns {Buffer} Strong key material.
	   * @private
	   */


	  AuthenticationHelper.prototype.computehkdf = function computehkdf(ikm, salt) {
	    var prk = _global.util.crypto.hmac(salt, ikm, 'buffer', 'sha256');
	    var infoBitsUpdate = _global.util.buffer.concat([this.infoBits, new _global.util.Buffer(String.fromCharCode(1), 'utf8')]);
	    var hmac = _global.util.crypto.hmac(prk, infoBitsUpdate, 'buffer', 'sha256');
	    return hmac.slice(0, 16);
	  };

	  /**
	   * Calculates the final hkdf based on computed S value, and computed U value and the key
	   * @param {String} username Username.
	   * @param {String} password Password.
	   * @param {BigInteger} serverBValue Server B value.
	   * @param {BigInteger} salt Generated salt.
	   * @returns {Buffer} Computed HKDF value.
	   */


	  AuthenticationHelper.prototype.getPasswordAuthenticationKey = function getPasswordAuthenticationKey(username, password, serverBValue, salt) {
	    if (serverBValue.mod(this.N).equals(_BigInteger2.default.ZERO)) {
	      throw new Error('B cannot be zero.');
	    }

	    this.UValue = this.calculateU(this.largeAValue, serverBValue);

	    if (this.UValue.equals(_BigInteger2.default.ZERO)) {
	      throw new Error('U cannot be zero.');
	    }

	    var usernamePassword = '' + this.poolName + username + ':' + password;
	    var usernamePasswordHash = this.hash(usernamePassword);

	    var xValue = new _BigInteger2.default(this.hexHash(this.padHex(salt) + usernamePasswordHash), 16);

	    var gModPowXN = this.g.modPow(xValue, this.N);
	    var intValue2 = serverBValue.subtract(this.k.multiply(gModPowXN));
	    var sValue = intValue2.modPow(this.smallAValue.add(this.UValue.multiply(xValue)), this.N).mod(this.N);

	    var hkdf = this.computehkdf(new _global.util.Buffer(this.padHex(sValue), 'hex'), new _global.util.Buffer(this.padHex(this.UValue.toString(16)), 'hex'));

	    return hkdf;
	  };

	  /**
	  * Return constant newPasswordRequiredChallengeUserAttributePrefix
	  * @return {newPasswordRequiredChallengeUserAttributePrefix} constant prefix value
	  */


	  AuthenticationHelper.prototype.getNewPasswordRequiredChallengeUserAttributePrefix = function getNewPasswordRequiredChallengeUserAttributePrefix() {
	    return newPasswordRequiredChallengeUserAttributePrefix;
	  };

	  /**
	   * Converts a BigInteger (or hex string) to hex format padded with zeroes for hashing
	   * @param {BigInteger|String} bigInt Number or string to pad.
	   * @returns {String} Padded hex string.
	   */


	  AuthenticationHelper.prototype.padHex = function padHex(bigInt) {
	    var hashStr = bigInt.toString(16);
	    if (hashStr.length % 2 === 1) {
	      hashStr = '0' + hashStr;
	    } else if ('89ABCDEFabcdef'.indexOf(hashStr[0]) !== -1) {
	      hashStr = '00' + hashStr;
	    }
	    return hashStr;
	  };

	  return AuthenticationHelper;
	}();

	exports.default = AuthenticationHelper;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;
	// A small implementation of BigInteger based on http://www-cs-students.stanford.edu/~tjw/jsbn/
	//
	// All public methods have been removed except the following:
	//   new BigInteger(a, b) (only radix 2, 4, 8, 16 and 32 supported)
	//   toString (only radix 2, 4, 8, 16 and 32 supported)
	//   negate
	//   abs
	//   compareTo
	//   bitLength
	//   mod
	//   equals
	//   add
	//   subtract
	//   multiply
	//   divide
	//   modPow

	exports.default = BigInteger;

	/*
	 * Copyright (c) 2003-2005  Tom Wu
	 * All Rights Reserved.
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining
	 * a copy of this software and associated documentation files (the
	 * "Software"), to deal in the Software without restriction, including
	 * without limitation the rights to use, copy, modify, merge, publish,
	 * distribute, sublicense, and/or sell copies of the Software, and to
	 * permit persons to whom the Software is furnished to do so, subject to
	 * the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY
	 * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
	 *
	 * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
	 * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
	 * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
	 * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
	 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
	 *
	 * In addition, the following condition applies:
	 *
	 * All redistributions must retain an intact copy of this copyright notice
	 * and disclaimer.
	 */

	// (public) Constructor

	function BigInteger(a, b) {
	  if (a != null) this.fromString(a, b);
	}

	// return new, unset BigInteger
	function nbi() {
	  return new BigInteger(null);
	}

	// Bits per digit
	var dbits;

	// JavaScript engine analysis
	var canary = 0xdeadbeefcafe;
	var j_lm = (canary & 0xffffff) == 0xefcafe;

	// am: Compute w_j += (x*this_i), propagate carries,
	// c is initial carry, returns final carry.
	// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
	// We need to select the fastest one that works in this environment.

	// am1: use a single mult and divide to get the high bits,
	// max digit bits should be 26 because
	// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
	function am1(i, x, w, j, c, n) {
	  while (--n >= 0) {
	    var v = x * this[i++] + w[j] + c;
	    c = Math.floor(v / 0x4000000);
	    w[j++] = v & 0x3ffffff;
	  }
	  return c;
	}
	// am2 avoids a big mult-and-extract completely.
	// Max digit bits should be <= 30 because we do bitwise ops
	// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
	function am2(i, x, w, j, c, n) {
	  var xl = x & 0x7fff,
	      xh = x >> 15;
	  while (--n >= 0) {
	    var l = this[i] & 0x7fff;
	    var h = this[i++] >> 15;
	    var m = xh * l + h * xl;
	    l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
	    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
	    w[j++] = l & 0x3fffffff;
	  }
	  return c;
	}
	// Alternately, set max digit bits to 28 since some
	// browsers slow down when dealing with 32-bit numbers.
	function am3(i, x, w, j, c, n) {
	  var xl = x & 0x3fff,
	      xh = x >> 14;
	  while (--n >= 0) {
	    var l = this[i] & 0x3fff;
	    var h = this[i++] >> 14;
	    var m = xh * l + h * xl;
	    l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
	    c = (l >> 28) + (m >> 14) + xh * h;
	    w[j++] = l & 0xfffffff;
	  }
	  return c;
	}
	var inBrowser = typeof navigator !== "undefined";
	if (inBrowser && j_lm && navigator.appName == "Microsoft Internet Explorer") {
	  BigInteger.prototype.am = am2;
	  dbits = 30;
	} else if (inBrowser && j_lm && navigator.appName != "Netscape") {
	  BigInteger.prototype.am = am1;
	  dbits = 26;
	} else {
	  // Mozilla/Netscape seems to prefer am3
	  BigInteger.prototype.am = am3;
	  dbits = 28;
	}

	BigInteger.prototype.DB = dbits;
	BigInteger.prototype.DM = (1 << dbits) - 1;
	BigInteger.prototype.DV = 1 << dbits;

	var BI_FP = 52;
	BigInteger.prototype.FV = Math.pow(2, BI_FP);
	BigInteger.prototype.F1 = BI_FP - dbits;
	BigInteger.prototype.F2 = 2 * dbits - BI_FP;

	// Digit conversions
	var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
	var BI_RC = new Array();
	var rr, vv;
	rr = "0".charCodeAt(0);
	for (vv = 0; vv <= 9; ++vv) {
	  BI_RC[rr++] = vv;
	}rr = "a".charCodeAt(0);
	for (vv = 10; vv < 36; ++vv) {
	  BI_RC[rr++] = vv;
	}rr = "A".charCodeAt(0);
	for (vv = 10; vv < 36; ++vv) {
	  BI_RC[rr++] = vv;
	}function int2char(n) {
	  return BI_RM.charAt(n);
	}
	function intAt(s, i) {
	  var c = BI_RC[s.charCodeAt(i)];
	  return c == null ? -1 : c;
	}

	// (protected) copy this to r
	function bnpCopyTo(r) {
	  for (var i = this.t - 1; i >= 0; --i) {
	    r[i] = this[i];
	  }r.t = this.t;
	  r.s = this.s;
	}

	// (protected) set from integer value x, -DV <= x < DV
	function bnpFromInt(x) {
	  this.t = 1;
	  this.s = x < 0 ? -1 : 0;
	  if (x > 0) this[0] = x;else if (x < -1) this[0] = x + this.DV;else this.t = 0;
	}

	// return bigint initialized to value
	function nbv(i) {
	  var r = nbi();

	  r.fromInt(i);

	  return r;
	}

	// (protected) set from string and radix
	function bnpFromString(s, b) {
	  var k;
	  if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else throw new Error("Only radix 2, 4, 8, 16, 32 are supported");
	  this.t = 0;
	  this.s = 0;
	  var i = s.length,
	      mi = false,
	      sh = 0;
	  while (--i >= 0) {
	    var x = intAt(s, i);
	    if (x < 0) {
	      if (s.charAt(i) == "-") mi = true;
	      continue;
	    }
	    mi = false;
	    if (sh == 0) this[this.t++] = x;else if (sh + k > this.DB) {
	      this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
	      this[this.t++] = x >> this.DB - sh;
	    } else this[this.t - 1] |= x << sh;
	    sh += k;
	    if (sh >= this.DB) sh -= this.DB;
	  }
	  this.clamp();
	  if (mi) BigInteger.ZERO.subTo(this, this);
	}

	// (protected) clamp off excess high words
	function bnpClamp() {
	  var c = this.s & this.DM;
	  while (this.t > 0 && this[this.t - 1] == c) {
	    --this.t;
	  }
	}

	// (public) return string representation in given radix
	function bnToString(b) {
	  if (this.s < 0) return "-" + this.negate().toString();
	  var k;
	  if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else throw new Error("Only radix 2, 4, 8, 16, 32 are supported");
	  var km = (1 << k) - 1,
	      d,
	      m = false,
	      r = "",
	      i = this.t;
	  var p = this.DB - i * this.DB % k;
	  if (i-- > 0) {
	    if (p < this.DB && (d = this[i] >> p) > 0) {
	      m = true;
	      r = int2char(d);
	    }
	    while (i >= 0) {
	      if (p < k) {
	        d = (this[i] & (1 << p) - 1) << k - p;
	        d |= this[--i] >> (p += this.DB - k);
	      } else {
	        d = this[i] >> (p -= k) & km;
	        if (p <= 0) {
	          p += this.DB;
	          --i;
	        }
	      }
	      if (d > 0) m = true;
	      if (m) r += int2char(d);
	    }
	  }
	  return m ? r : "0";
	}

	// (public) -this
	function bnNegate() {
	  var r = nbi();

	  BigInteger.ZERO.subTo(this, r);

	  return r;
	}

	// (public) |this|
	function bnAbs() {
	  return this.s < 0 ? this.negate() : this;
	}

	// (public) return + if this > a, - if this < a, 0 if equal
	function bnCompareTo(a) {
	  var r = this.s - a.s;
	  if (r != 0) return r;
	  var i = this.t;
	  r = i - a.t;
	  if (r != 0) return this.s < 0 ? -r : r;
	  while (--i >= 0) {
	    if ((r = this[i] - a[i]) != 0) return r;
	  }return 0;
	}

	// returns bit length of the integer x
	function nbits(x) {
	  var r = 1,
	      t;
	  if ((t = x >>> 16) != 0) {
	    x = t;
	    r += 16;
	  }
	  if ((t = x >> 8) != 0) {
	    x = t;
	    r += 8;
	  }
	  if ((t = x >> 4) != 0) {
	    x = t;
	    r += 4;
	  }
	  if ((t = x >> 2) != 0) {
	    x = t;
	    r += 2;
	  }
	  if ((t = x >> 1) != 0) {
	    x = t;
	    r += 1;
	  }
	  return r;
	}

	// (public) return the number of bits in "this"
	function bnBitLength() {
	  if (this.t <= 0) return 0;
	  return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
	}

	// (protected) r = this << n*DB
	function bnpDLShiftTo(n, r) {
	  var i;
	  for (i = this.t - 1; i >= 0; --i) {
	    r[i + n] = this[i];
	  }for (i = n - 1; i >= 0; --i) {
	    r[i] = 0;
	  }r.t = this.t + n;
	  r.s = this.s;
	}

	// (protected) r = this >> n*DB
	function bnpDRShiftTo(n, r) {
	  for (var i = n; i < this.t; ++i) {
	    r[i - n] = this[i];
	  }r.t = Math.max(this.t - n, 0);
	  r.s = this.s;
	}

	// (protected) r = this << n
	function bnpLShiftTo(n, r) {
	  var bs = n % this.DB;
	  var cbs = this.DB - bs;
	  var bm = (1 << cbs) - 1;
	  var ds = Math.floor(n / this.DB),
	      c = this.s << bs & this.DM,
	      i;
	  for (i = this.t - 1; i >= 0; --i) {
	    r[i + ds + 1] = this[i] >> cbs | c;
	    c = (this[i] & bm) << bs;
	  }
	  for (i = ds - 1; i >= 0; --i) {
	    r[i] = 0;
	  }r[ds] = c;
	  r.t = this.t + ds + 1;
	  r.s = this.s;
	  r.clamp();
	}

	// (protected) r = this >> n
	function bnpRShiftTo(n, r) {
	  r.s = this.s;
	  var ds = Math.floor(n / this.DB);
	  if (ds >= this.t) {
	    r.t = 0;
	    return;
	  }
	  var bs = n % this.DB;
	  var cbs = this.DB - bs;
	  var bm = (1 << bs) - 1;
	  r[0] = this[ds] >> bs;
	  for (var i = ds + 1; i < this.t; ++i) {
	    r[i - ds - 1] |= (this[i] & bm) << cbs;
	    r[i - ds] = this[i] >> bs;
	  }
	  if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
	  r.t = this.t - ds;
	  r.clamp();
	}

	// (protected) r = this - a
	function bnpSubTo(a, r) {
	  var i = 0,
	      c = 0,
	      m = Math.min(a.t, this.t);
	  while (i < m) {
	    c += this[i] - a[i];
	    r[i++] = c & this.DM;
	    c >>= this.DB;
	  }
	  if (a.t < this.t) {
	    c -= a.s;
	    while (i < this.t) {
	      c += this[i];
	      r[i++] = c & this.DM;
	      c >>= this.DB;
	    }
	    c += this.s;
	  } else {
	    c += this.s;
	    while (i < a.t) {
	      c -= a[i];
	      r[i++] = c & this.DM;
	      c >>= this.DB;
	    }
	    c -= a.s;
	  }
	  r.s = c < 0 ? -1 : 0;
	  if (c < -1) r[i++] = this.DV + c;else if (c > 0) r[i++] = c;
	  r.t = i;
	  r.clamp();
	}

	// (protected) r = this * a, r != this,a (HAC 14.12)
	// "this" should be the larger one if appropriate.
	function bnpMultiplyTo(a, r) {
	  var x = this.abs(),
	      y = a.abs();
	  var i = x.t;
	  r.t = i + y.t;
	  while (--i >= 0) {
	    r[i] = 0;
	  }for (i = 0; i < y.t; ++i) {
	    r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
	  }r.s = 0;
	  r.clamp();
	  if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
	}

	// (protected) r = this^2, r != this (HAC 14.16)
	function bnpSquareTo(r) {
	  var x = this.abs();
	  var i = r.t = 2 * x.t;
	  while (--i >= 0) {
	    r[i] = 0;
	  }for (i = 0; i < x.t - 1; ++i) {
	    var c = x.am(i, x[i], r, 2 * i, 0, 1);
	    if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
	      r[i + x.t] -= x.DV;
	      r[i + x.t + 1] = 1;
	    }
	  }
	  if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
	  r.s = 0;
	  r.clamp();
	}

	// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
	// r != q, this != m.  q or r may be null.
	function bnpDivRemTo(m, q, r) {
	  var pm = m.abs();
	  if (pm.t <= 0) return;
	  var pt = this.abs();
	  if (pt.t < pm.t) {
	    if (q != null) q.fromInt(0);
	    if (r != null) this.copyTo(r);
	    return;
	  }
	  if (r == null) r = nbi();
	  var y = nbi(),
	      ts = this.s,
	      ms = m.s;
	  var nsh = this.DB - nbits(pm[pm.t - 1]);
	  // normalize modulus
	  if (nsh > 0) {
	    pm.lShiftTo(nsh, y);
	    pt.lShiftTo(nsh, r);
	  } else {
	    pm.copyTo(y);
	    pt.copyTo(r);
	  }
	  var ys = y.t;
	  var y0 = y[ys - 1];
	  if (y0 == 0) return;
	  var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
	  var d1 = this.FV / yt,
	      d2 = (1 << this.F1) / yt,
	      e = 1 << this.F2;
	  var i = r.t,
	      j = i - ys,
	      t = q == null ? nbi() : q;
	  y.dlShiftTo(j, t);
	  if (r.compareTo(t) >= 0) {
	    r[r.t++] = 1;
	    r.subTo(t, r);
	  }
	  BigInteger.ONE.dlShiftTo(ys, t);
	  t.subTo(y, y);
	  // "negative" y so we can replace sub with am later
	  while (y.t < ys) {
	    y[y.t++] = 0;
	  }while (--j >= 0) {
	    // Estimate quotient digit
	    var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
	    if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
	      // Try it out
	      y.dlShiftTo(j, t);
	      r.subTo(t, r);
	      while (r[i] < --qd) {
	        r.subTo(t, r);
	      }
	    }
	  }
	  if (q != null) {
	    r.drShiftTo(ys, q);
	    if (ts != ms) BigInteger.ZERO.subTo(q, q);
	  }
	  r.t = ys;
	  r.clamp();
	  if (nsh > 0) r.rShiftTo(nsh, r);
	  // Denormalize remainder
	  if (ts < 0) BigInteger.ZERO.subTo(r, r);
	}

	// (public) this mod a
	function bnMod(a) {
	  var r = nbi();
	  this.abs().divRemTo(a, null, r);
	  if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
	  return r;
	}

	// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
	// justification:
	//         xy == 1 (mod m)
	//         xy =  1+km
	//   xy(2-xy) = (1+km)(1-km)
	// x[y(2-xy)] = 1-k^2m^2
	// x[y(2-xy)] == 1 (mod m^2)
	// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
	// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
	// JS multiply "overflows" differently from C/C++, so care is needed here.
	function bnpInvDigit() {
	  if (this.t < 1) return 0;
	  var x = this[0];
	  if ((x & 1) == 0) return 0;
	  var y = x & 3;
	  // y == 1/x mod 2^2
	  y = y * (2 - (x & 0xf) * y) & 0xf;
	  // y == 1/x mod 2^4
	  y = y * (2 - (x & 0xff) * y) & 0xff;
	  // y == 1/x mod 2^8
	  y = y * (2 - ((x & 0xffff) * y & 0xffff)) & 0xffff;
	  // y == 1/x mod 2^16
	  // last step - calculate inverse mod DV directly;
	  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
	  y = y * (2 - x * y % this.DV) % this.DV;
	  // y == 1/x mod 2^dbits
	  // we really want the negative inverse, and -DV < y < DV
	  return y > 0 ? this.DV - y : -y;
	}

	function bnEquals(a) {
	  return this.compareTo(a) == 0;
	}

	// (protected) r = this + a
	function bnpAddTo(a, r) {
	  var i = 0,
	      c = 0,
	      m = Math.min(a.t, this.t);
	  while (i < m) {
	    c += this[i] + a[i];
	    r[i++] = c & this.DM;
	    c >>= this.DB;
	  }
	  if (a.t < this.t) {
	    c += a.s;
	    while (i < this.t) {
	      c += this[i];
	      r[i++] = c & this.DM;
	      c >>= this.DB;
	    }
	    c += this.s;
	  } else {
	    c += this.s;
	    while (i < a.t) {
	      c += a[i];
	      r[i++] = c & this.DM;
	      c >>= this.DB;
	    }
	    c += a.s;
	  }
	  r.s = c < 0 ? -1 : 0;
	  if (c > 0) r[i++] = c;else if (c < -1) r[i++] = this.DV + c;
	  r.t = i;
	  r.clamp();
	}

	// (public) this + a
	function bnAdd(a) {
	  var r = nbi();

	  this.addTo(a, r);

	  return r;
	}

	// (public) this - a
	function bnSubtract(a) {
	  var r = nbi();

	  this.subTo(a, r);

	  return r;
	}

	// (public) this * a
	function bnMultiply(a) {
	  var r = nbi();

	  this.multiplyTo(a, r);

	  return r;
	}

	// (public) this / a
	function bnDivide(a) {
	  var r = nbi();

	  this.divRemTo(a, r, null);

	  return r;
	}

	// Montgomery reduction
	function Montgomery(m) {
	  this.m = m;
	  this.mp = m.invDigit();
	  this.mpl = this.mp & 0x7fff;
	  this.mph = this.mp >> 15;
	  this.um = (1 << m.DB - 15) - 1;
	  this.mt2 = 2 * m.t;
	}

	// xR mod m
	function montConvert(x) {
	  var r = nbi();
	  x.abs().dlShiftTo(this.m.t, r);
	  r.divRemTo(this.m, null, r);
	  if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
	  return r;
	}

	// x/R mod m
	function montRevert(x) {
	  var r = nbi();
	  x.copyTo(r);
	  this.reduce(r);
	  return r;
	}

	// x = x/R mod m (HAC 14.32)
	function montReduce(x) {
	  while (x.t <= this.mt2) {
	    // pad x so am has enough room later
	    x[x.t++] = 0;
	  }for (var i = 0; i < this.m.t; ++i) {
	    // faster way of calculating u0 = x[i]*mp mod DV
	    var j = x[i] & 0x7fff;
	    var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
	    // use am to combine the multiply-shift-add into one call
	    j = i + this.m.t;
	    x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
	    // propagate carry
	    while (x[j] >= x.DV) {
	      x[j] -= x.DV;
	      x[++j]++;
	    }
	  }
	  x.clamp();
	  x.drShiftTo(this.m.t, x);
	  if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
	}

	// r = "x^2/R mod m"; x != r
	function montSqrTo(x, r) {
	  x.squareTo(r);

	  this.reduce(r);
	}

	// r = "xy/R mod m"; x,y != r
	function montMulTo(x, y, r) {
	  x.multiplyTo(y, r);

	  this.reduce(r);
	}

	Montgomery.prototype.convert = montConvert;
	Montgomery.prototype.revert = montRevert;
	Montgomery.prototype.reduce = montReduce;
	Montgomery.prototype.mulTo = montMulTo;
	Montgomery.prototype.sqrTo = montSqrTo;

	// (public) this^e % m (HAC 14.85)
	function bnModPow(e, m) {
	  var i = e.bitLength(),
	      k,
	      r = nbv(1),
	      z = new Montgomery(m);
	  if (i <= 0) return r;else if (i < 18) k = 1;else if (i < 48) k = 3;else if (i < 144) k = 4;else if (i < 768) k = 5;else k = 6;

	  // precomputation
	  var g = new Array(),
	      n = 3,
	      k1 = k - 1,
	      km = (1 << k) - 1;
	  g[1] = z.convert(this);
	  if (k > 1) {
	    var g2 = nbi();
	    z.sqrTo(g[1], g2);
	    while (n <= km) {
	      g[n] = nbi();
	      z.mulTo(g2, g[n - 2], g[n]);
	      n += 2;
	    }
	  }

	  var j = e.t - 1,
	      w,
	      is1 = true,
	      r2 = nbi(),
	      t;
	  i = nbits(e[j]) - 1;
	  while (j >= 0) {
	    if (i >= k1) w = e[j] >> i - k1 & km;else {
	      w = (e[j] & (1 << i + 1) - 1) << k1 - i;
	      if (j > 0) w |= e[j - 1] >> this.DB + i - k1;
	    }

	    n = k;
	    while ((w & 1) == 0) {
	      w >>= 1;
	      --n;
	    }
	    if ((i -= n) < 0) {
	      i += this.DB;
	      --j;
	    }
	    if (is1) {
	      // ret == 1, don't bother squaring or multiplying it
	      g[w].copyTo(r);
	      is1 = false;
	    } else {
	      while (n > 1) {
	        z.sqrTo(r, r2);
	        z.sqrTo(r2, r);
	        n -= 2;
	      }
	      if (n > 0) z.sqrTo(r, r2);else {
	        t = r;
	        r = r2;
	        r2 = t;
	      }
	      z.mulTo(r2, g[w], r);
	    }

	    while (j >= 0 && (e[j] & 1 << i) == 0) {
	      z.sqrTo(r, r2);
	      t = r;
	      r = r2;
	      r2 = t;
	      if (--i < 0) {
	        i = this.DB - 1;
	        --j;
	      }
	    }
	  }
	  return z.revert(r);
	}

	// protected
	BigInteger.prototype.copyTo = bnpCopyTo;
	BigInteger.prototype.fromInt = bnpFromInt;
	BigInteger.prototype.fromString = bnpFromString;
	BigInteger.prototype.clamp = bnpClamp;
	BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
	BigInteger.prototype.drShiftTo = bnpDRShiftTo;
	BigInteger.prototype.lShiftTo = bnpLShiftTo;
	BigInteger.prototype.rShiftTo = bnpRShiftTo;
	BigInteger.prototype.subTo = bnpSubTo;
	BigInteger.prototype.multiplyTo = bnpMultiplyTo;
	BigInteger.prototype.squareTo = bnpSquareTo;
	BigInteger.prototype.divRemTo = bnpDivRemTo;
	BigInteger.prototype.invDigit = bnpInvDigit;
	BigInteger.prototype.addTo = bnpAddTo;

	// public
	BigInteger.prototype.toString = bnToString;
	BigInteger.prototype.negate = bnNegate;
	BigInteger.prototype.abs = bnAbs;
	BigInteger.prototype.compareTo = bnCompareTo;
	BigInteger.prototype.bitLength = bnBitLength;
	BigInteger.prototype.mod = bnMod;
	BigInteger.prototype.equals = bnEquals;
	BigInteger.prototype.add = bnAdd;
	BigInteger.prototype.subtract = bnSubtract;
	BigInteger.prototype.multiply = bnMultiply;
	BigInteger.prototype.divide = bnDivide;
	BigInteger.prototype.modPow = bnModPow;

	// "constants"
	BigInteger.ZERO = nbv(0);
	BigInteger.ONE = nbv(1);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _global = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*
	                                                                                                                                                           * Copyright 2016 Amazon.com,
	                                                                                                                                                           * Inc. or its affiliates. All Rights Reserved.
	                                                                                                                                                           *
	                                                                                                                                                           * Licensed under the Amazon Software License (the "License").
	                                                                                                                                                           * You may not use this file except in compliance with the
	                                                                                                                                                           * License. A copy of the License is located at
	                                                                                                                                                           *
	                                                                                                                                                           *     http://aws.amazon.com/asl/
	                                                                                                                                                           *
	                                                                                                                                                           * or in the "license" file accompanying this file. This file is
	                                                                                                                                                           * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	                                                                                                                                                           * CONDITIONS OF ANY KIND, express or implied. See the License
	                                                                                                                                                           * for the specific language governing permissions and
	                                                                                                                                                           * limitations under the License.
	                                                                                                                                                           */

	/** @class */
	var CognitoAccessToken = function () {
	  /**
	   * Constructs a new CognitoAccessToken object
	   * @param {string=} AccessToken The JWT access token.
	   */
	  function CognitoAccessToken() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        AccessToken = _ref.AccessToken;

	    _classCallCheck(this, CognitoAccessToken);

	    // Assign object
	    this.jwtToken = AccessToken || '';
	  }

	  /**
	   * @returns {string} the record's token.
	   */


	  CognitoAccessToken.prototype.getJwtToken = function getJwtToken() {
	    return this.jwtToken;
	  };

	  /**
	   * @returns {int} the token's expiration (exp member).
	   */


	  CognitoAccessToken.prototype.getExpiration = function getExpiration() {
	    var payload = this.jwtToken.split('.')[1];
	    var expiration = JSON.parse(_global.util.base64.decode(payload).toString('utf8'));
	    return expiration.exp;
	  };

	  return CognitoAccessToken;
	}();

	exports.default = CognitoAccessToken;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _global = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*!
	                                                                                                                                                           * Copyright 2016 Amazon.com,
	                                                                                                                                                           * Inc. or its affiliates. All Rights Reserved.
	                                                                                                                                                           *
	                                                                                                                                                           * Licensed under the Amazon Software License (the "License").
	                                                                                                                                                           * You may not use this file except in compliance with the
	                                                                                                                                                           * License. A copy of the License is located at
	                                                                                                                                                           *
	                                                                                                                                                           *     http://aws.amazon.com/asl/
	                                                                                                                                                           *
	                                                                                                                                                           * or in the "license" file accompanying this file. This file is
	                                                                                                                                                           * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	                                                                                                                                                           * CONDITIONS OF ANY KIND, express or implied. See the License
	                                                                                                                                                           * for the specific language governing permissions and
	                                                                                                                                                           * limitations under the License.
	                                                                                                                                                           */

	/** @class */
	var CognitoIdToken = function () {
	  /**
	   * Constructs a new CognitoIdToken object
	   * @param {string=} IdToken The JWT Id token
	   */
	  function CognitoIdToken() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        IdToken = _ref.IdToken;

	    _classCallCheck(this, CognitoIdToken);

	    // Assign object
	    this.jwtToken = IdToken || '';
	  }

	  /**
	   * @returns {string} the record's token.
	   */


	  CognitoIdToken.prototype.getJwtToken = function getJwtToken() {
	    return this.jwtToken;
	  };

	  /**
	   * @returns {int} the token's expiration (exp member).
	   */


	  CognitoIdToken.prototype.getExpiration = function getExpiration() {
	    var payload = this.jwtToken.split('.')[1];
	    var expiration = JSON.parse(_global.util.base64.decode(payload).toString('utf8'));
	    return expiration.exp;
	  };

	  return CognitoIdToken;
	}();

	exports.default = CognitoIdToken;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */

	/** @class */
	var CognitoRefreshToken = function () {
	  /**
	   * Constructs a new CognitoRefreshToken object
	   * @param {string=} RefreshToken The JWT refresh token.
	   */
	  function CognitoRefreshToken() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        RefreshToken = _ref.RefreshToken;

	    _classCallCheck(this, CognitoRefreshToken);

	    // Assign object
	    this.token = RefreshToken || '';
	  }

	  /**
	   * @returns {string} the record's token.
	   */


	  CognitoRefreshToken.prototype.getToken = function getToken() {
	    return this.token;
	  };

	  return CognitoRefreshToken;
	}();

	exports.default = CognitoRefreshToken;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _global = __webpack_require__(1);

	var _BigInteger = __webpack_require__(3);

	var _BigInteger2 = _interopRequireDefault(_BigInteger);

	var _AuthenticationHelper = __webpack_require__(2);

	var _AuthenticationHelper2 = _interopRequireDefault(_AuthenticationHelper);

	var _CognitoAccessToken = __webpack_require__(4);

	var _CognitoAccessToken2 = _interopRequireDefault(_CognitoAccessToken);

	var _CognitoIdToken = __webpack_require__(5);

	var _CognitoIdToken2 = _interopRequireDefault(_CognitoIdToken);

	var _CognitoRefreshToken = __webpack_require__(6);

	var _CognitoRefreshToken2 = _interopRequireDefault(_CognitoRefreshToken);

	var _CognitoUserSession = __webpack_require__(9);

	var _CognitoUserSession2 = _interopRequireDefault(_CognitoUserSession);

	var _DateHelper = __webpack_require__(10);

	var _DateHelper2 = _interopRequireDefault(_DateHelper);

	var _CognitoUserAttribute = __webpack_require__(8);

	var _CognitoUserAttribute2 = _interopRequireDefault(_CognitoUserAttribute);

	var _StorageHelper = __webpack_require__(11);

	var _StorageHelper2 = _interopRequireDefault(_StorageHelper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*!
	                                                                                                                                                           * Copyright 2016 Amazon.com,
	                                                                                                                                                           * Inc. or its affiliates. All Rights Reserved.
	                                                                                                                                                           *
	                                                                                                                                                           * Licensed under the Amazon Software License (the "License").
	                                                                                                                                                           * You may not use this file except in compliance with the
	                                                                                                                                                           * License. A copy of the License is located at
	                                                                                                                                                           *
	                                                                                                                                                           *     http://aws.amazon.com/asl/
	                                                                                                                                                           *
	                                                                                                                                                           * or in the "license" file accompanying this file. This file is
	                                                                                                                                                           * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	                                                                                                                                                           * CONDITIONS OF ANY KIND, express or implied. See the License
	                                                                                                                                                           * for the specific language governing permissions and
	                                                                                                                                                           * limitations under the License.
	                                                                                                                                                           */

	/**
	 * @callback nodeCallback
	 * @template T result
	 * @param {*} err The operation failure reason, or null.
	 * @param {T} result The operation result.
	 */

	/**
	 * @callback onFailure
	 * @param {*} err Failure reason.
	 */

	/**
	 * @callback onSuccess
	 * @template T result
	 * @param {T} result The operation result.
	 */

	/**
	 * @callback mfaRequired
	 * @param {*} details MFA challenge details.
	 */

	/**
	 * @callback customChallenge
	 * @param {*} details Custom challenge details.
	 */

	/**
	 * @callback inputVerificationCode
	 * @param {*} data Server response.
	 */

	/**
	 * @callback authSuccess
	 * @param {CognitoUserSession} session The new session.
	 * @param {bool=} userConfirmationNecessary User must be confirmed.
	 */

	/** @class */
	var CognitoUser = function () {
	  /**
	   * Constructs a new CognitoUser object
	   * @param {object} data Creation options
	   * @param {string} data.Username The user's username.
	   * @param {CognitoUserPool} data.Pool Pool containing the user.
	   * @param {object} data.Storage Optional storage object.
	   */
	  function CognitoUser(data) {
	    _classCallCheck(this, CognitoUser);

	    if (data == null || data.Username == null || data.Pool == null) {
	      throw new Error('Username and pool information are required.');
	    }

	    this.username = data.Username || '';
	    this.pool = data.Pool;
	    this.Session = null;

	    this.client = data.Pool.client;

	    this.signInUserSession = null;
	    this.authenticationFlowType = 'USER_SRP_AUTH';

	    this.storage = data.Storage || new _StorageHelper2.default().getStorage();
	  }

	  /**
	   * @returns {CognitoUserSession} the current session for this user
	   */


	  CognitoUser.prototype.getSignInUserSession = function getSignInUserSession() {
	    return this.signInUserSession;
	  };

	  /**
	   * @returns {string} the user's username
	   */


	  CognitoUser.prototype.getUsername = function getUsername() {
	    return this.username;
	  };

	  /**
	   * @returns {String} the authentication flow type
	   */


	  CognitoUser.prototype.getAuthenticationFlowType = function getAuthenticationFlowType() {
	    return this.authenticationFlowType;
	  };

	  /**
	   * sets authentication flow type
	   * @param {string} authenticationFlowType New value.
	   * @returns {void}
	   */


	  CognitoUser.prototype.setAuthenticationFlowType = function setAuthenticationFlowType(authenticationFlowType) {
	    this.authenticationFlowType = authenticationFlowType;
	  };

	  /**
	   * This is used for authenticating the user through the custom authentication flow.
	   * @param {AuthenticationDetails} authDetails Contains the authentication data
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {customChallenge} callback.customChallenge Custom challenge
	   *        response required to continue.
	   * @param {authSuccess} callback.onSuccess Called on success with the new session.
	   * @returns {void}
	   */


	  CognitoUser.prototype.initiateAuth = function initiateAuth(authDetails, callback) {
	    var _this = this;

	    var authParameters = authDetails.getAuthParameters();
	    authParameters.USERNAME = this.username;

	    this.client.makeUnauthenticatedRequest('initiateAuth', {
	      AuthFlow: 'CUSTOM_AUTH',
	      ClientId: this.pool.getClientId(),
	      AuthParameters: authParameters,
	      ClientMetadata: authDetails.getValidationData()
	    }, function (err, data) {
	      if (err) {
	        return callback.onFailure(err);
	      }
	      var challengeName = data.ChallengeName;
	      var challengeParameters = data.ChallengeParameters;

	      if (challengeName === 'CUSTOM_CHALLENGE') {
	        _this.Session = data.Session;
	        return callback.customChallenge(challengeParameters);
	      }
	      _this.signInUserSession = _this.getCognitoUserSession(data.AuthenticationResult);
	      _this.cacheTokens();
	      return callback.onSuccess(_this.signInUserSession);
	    });
	  };

	  /**
	   * This is used for authenticating the user. it calls the AuthenticationHelper for SRP related
	   * stuff
	   * @param {AuthenticationDetails} authDetails Contains the authentication data
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {newPasswordRequired} callback.newPasswordRequired new
	   *        password and any required attributes are required to continue
	   * @param {mfaRequired} callback.mfaRequired MFA code
	   *        required to continue.
	   * @param {customChallenge} callback.customChallenge Custom challenge
	   *        response required to continue.
	   * @param {authSuccess} callback.onSuccess Called on success with the new session.
	   * @returns {void}
	   */


	  CognitoUser.prototype.authenticateUser = function authenticateUser(authDetails, callback) {
	    var _this2 = this;

	    var authenticationHelper = new _AuthenticationHelper2.default(this.pool.getUserPoolId().split('_')[1]);
	    var dateHelper = new _DateHelper2.default();

	    var serverBValue = void 0;
	    var salt = void 0;
	    var authParameters = {};

	    if (this.deviceKey != null) {
	      authParameters.DEVICE_KEY = this.deviceKey;
	    }

	    authParameters.USERNAME = this.username;
	    authParameters.SRP_A = authenticationHelper.getLargeAValue().toString(16);

	    if (this.authenticationFlowType === 'CUSTOM_AUTH') {
	      authParameters.CHALLENGE_NAME = 'SRP_A';
	    }

	    this.client.makeUnauthenticatedRequest('initiateAuth', {
	      AuthFlow: this.authenticationFlowType,
	      ClientId: this.pool.getClientId(),
	      AuthParameters: authParameters,
	      ClientMetadata: authDetails.getValidationData()
	    }, function (err, data) {
	      if (err) {
	        return callback.onFailure(err);
	      }

	      var challengeParameters = data.ChallengeParameters;

	      _this2.username = challengeParameters.USER_ID_FOR_SRP;
	      serverBValue = new _BigInteger2.default(challengeParameters.SRP_B, 16);
	      salt = new _BigInteger2.default(challengeParameters.SALT, 16);
	      _this2.getCachedDeviceKeyAndPassword();

	      var hkdf = authenticationHelper.getPasswordAuthenticationKey(_this2.username, authDetails.getPassword(), serverBValue, salt);

	      var dateNow = dateHelper.getNowString();

	      var signatureString = _global.util.crypto.hmac(hkdf, _global.util.buffer.concat([new _global.util.Buffer(_this2.pool.getUserPoolId().split('_')[1], 'utf8'), new _global.util.Buffer(_this2.username, 'utf8'), new _global.util.Buffer(challengeParameters.SECRET_BLOCK, 'base64'), new _global.util.Buffer(dateNow, 'utf8')]), 'base64', 'sha256');

	      var challengeResponses = {};

	      challengeResponses.USERNAME = _this2.username;
	      challengeResponses.PASSWORD_CLAIM_SECRET_BLOCK = challengeParameters.SECRET_BLOCK;
	      challengeResponses.TIMESTAMP = dateNow;
	      challengeResponses.PASSWORD_CLAIM_SIGNATURE = signatureString;

	      if (_this2.deviceKey != null) {
	        challengeResponses.DEVICE_KEY = _this2.deviceKey;
	      }

	      var respondToAuthChallenge = function respondToAuthChallenge(challenge, challengeCallback) {
	        return _this2.client.makeUnauthenticatedRequest('respondToAuthChallenge', challenge, function (errChallenge, dataChallenge) {
	          if (errChallenge && errChallenge.code === 'ResourceNotFoundException' && errChallenge.message.toLowerCase().indexOf('device') !== -1) {
	            challengeResponses.DEVICE_KEY = null;
	            _this2.deviceKey = null;
	            _this2.randomPassword = null;
	            _this2.deviceGroupKey = null;
	            _this2.clearCachedDeviceKeyAndPassword();
	            return respondToAuthChallenge(challenge, challengeCallback);
	          }
	          return challengeCallback(errChallenge, dataChallenge);
	        });
	      };

	      respondToAuthChallenge({
	        ChallengeName: 'PASSWORD_VERIFIER',
	        ClientId: _this2.pool.getClientId(),
	        ChallengeResponses: challengeResponses,
	        Session: data.Session
	      }, function (errAuthenticate, dataAuthenticate) {
	        if (errAuthenticate) {
	          return callback.onFailure(errAuthenticate);
	        }

	        var challengeName = dataAuthenticate.ChallengeName;
	        if (challengeName === 'NEW_PASSWORD_REQUIRED') {
	          _this2.Session = dataAuthenticate.Session;
	          var userAttributes = null;
	          var rawRequiredAttributes = null;
	          var requiredAttributes = [];
	          var userAttributesPrefix = authenticationHelper.getNewPasswordRequiredChallengeUserAttributePrefix();

	          if (dataAuthenticate.ChallengeParameters) {
	            userAttributes = JSON.parse(dataAuthenticate.ChallengeParameters.userAttributes);
	            rawRequiredAttributes = JSON.parse(dataAuthenticate.ChallengeParameters.requiredAttributes);
	          }

	          if (rawRequiredAttributes) {
	            for (var i = 0; i < rawRequiredAttributes.length; i++) {
	              requiredAttributes[i] = rawRequiredAttributes[i].substr(userAttributesPrefix.length);
	            }
	          }
	          return callback.newPasswordRequired(userAttributes, requiredAttributes);
	        }
	        return _this2.authenticateUserInternal(dataAuthenticate, authenticationHelper, callback);
	      });
	      return undefined;
	    });
	  };

	  /**
	  * PRIVATE ONLY: This is an internal only method and should not
	  * be directly called by the consumers.
	  * @param {object} dataAuthenticate authentication data
	  * @param {object} authenticationHelper helper created
	  * @param {callback} callback passed on from caller
	  * @returns {void}
	  */


	  CognitoUser.prototype.authenticateUserInternal = function authenticateUserInternal(dataAuthenticate, authenticationHelper, callback) {
	    var _this3 = this;

	    var challengeName = dataAuthenticate.ChallengeName;
	    var challengeParameters = dataAuthenticate.ChallengeParameters;

	    if (challengeName === 'SMS_MFA') {
	      this.Session = dataAuthenticate.Session;
	      return callback.mfaRequired(challengeName, challengeParameters);
	    }

	    if (challengeName === 'CUSTOM_CHALLENGE') {
	      this.Session = dataAuthenticate.Session;
	      return callback.customChallenge(challengeParameters);
	    }

	    if (challengeName === 'DEVICE_SRP_AUTH') {
	      this.getDeviceResponse(callback);
	      return undefined;
	    }

	    this.signInUserSession = this.getCognitoUserSession(dataAuthenticate.AuthenticationResult);
	    this.cacheTokens();

	    var newDeviceMetadata = dataAuthenticate.AuthenticationResult.NewDeviceMetadata;
	    if (newDeviceMetadata == null) {
	      return callback.onSuccess(this.signInUserSession);
	    }

	    authenticationHelper.generateHashDevice(dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceGroupKey, dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceKey);

	    var deviceSecretVerifierConfig = {
	      Salt: new _global.util.Buffer(authenticationHelper.getSaltDevices(), 'hex').toString('base64'),
	      PasswordVerifier: new _global.util.Buffer(authenticationHelper.getVerifierDevices(), 'hex').toString('base64')
	    };

	    this.verifierDevices = deviceSecretVerifierConfig.PasswordVerifier;
	    this.deviceGroupKey = newDeviceMetadata.DeviceGroupKey;
	    this.randomPassword = authenticationHelper.getRandomPassword();

	    this.client.makeUnauthenticatedRequest('confirmDevice', {
	      DeviceKey: newDeviceMetadata.DeviceKey,
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
	      DeviceSecretVerifierConfig: deviceSecretVerifierConfig,
	      DeviceName: navigator.userAgent
	    }, function (errConfirm, dataConfirm) {
	      if (errConfirm) {
	        return callback.onFailure(errConfirm);
	      }

	      _this3.deviceKey = dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceKey;
	      _this3.cacheDeviceKeyAndPassword();
	      if (dataConfirm.UserConfirmationNecessary === true) {
	        return callback.onSuccess(_this3.signInUserSession, dataConfirm.UserConfirmationNecessary);
	      }
	      return callback.onSuccess(_this3.signInUserSession);
	    });
	    return undefined;
	  };

	  /**
	  * This method is user to complete the NEW_PASSWORD_REQUIRED challenge.
	  * Pass the new password with any new user attributes to be updated.
	  * User attribute keys must be of format userAttributes.<attribute_name>.
	  * @param {string} newPassword new password for this user
	  * @param {object} requiredAttributeData map with values for all required attributes
	  * @param {object} callback Result callback map.
	  * @param {onFailure} callback.onFailure Called on any error.
	  * @param {mfaRequired} callback.mfaRequired MFA code required to continue.
	  * @param {customChallenge} callback.customChallenge Custom challenge
	  *         response required to continue.
	  * @param {authSuccess} callback.onSuccess Called on success with the new session.
	  * @returns {void}
	  */


	  CognitoUser.prototype.completeNewPasswordChallenge = function completeNewPasswordChallenge(newPassword, requiredAttributeData, callback) {
	    var _this4 = this;

	    if (!newPassword) {
	      return callback.onFailure(new Error('New password is required.'));
	    }
	    var authenticationHelper = new _AuthenticationHelper2.default(this.pool.getUserPoolId().split('_')[1]);
	    var userAttributesPrefix = authenticationHelper.getNewPasswordRequiredChallengeUserAttributePrefix();

	    var finalUserAttributes = {};
	    if (requiredAttributeData) {
	      Object.keys(requiredAttributeData).forEach(function (key) {
	        finalUserAttributes[userAttributesPrefix + key] = requiredAttributeData[key];
	      });
	    }

	    finalUserAttributes.NEW_PASSWORD = newPassword;
	    finalUserAttributes.USERNAME = this.username;
	    this.client.makeUnauthenticatedRequest('respondToAuthChallenge', {
	      ChallengeName: 'NEW_PASSWORD_REQUIRED',
	      ClientId: this.pool.getClientId(),
	      ChallengeResponses: finalUserAttributes,
	      Session: this.Session
	    }, function (errAuthenticate, dataAuthenticate) {
	      if (errAuthenticate) {
	        return callback.onFailure(errAuthenticate);
	      }
	      return _this4.authenticateUserInternal(dataAuthenticate, authenticationHelper, callback);
	    });
	    return undefined;
	  };

	  /**
	   * This is used to get a session using device authentication. It is called at the end of user
	   * authentication
	   *
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {authSuccess} callback.onSuccess Called on success with the new session.
	   * @returns {void}
	   * @private
	   */


	  CognitoUser.prototype.getDeviceResponse = function getDeviceResponse(callback) {
	    var _this5 = this;

	    var authenticationHelper = new _AuthenticationHelper2.default(this.deviceGroupKey);
	    var dateHelper = new _DateHelper2.default();

	    var authParameters = {};

	    authParameters.USERNAME = this.username;
	    authParameters.DEVICE_KEY = this.deviceKey;
	    authParameters.SRP_A = authenticationHelper.getLargeAValue().toString(16);

	    this.client.makeUnauthenticatedRequest('respondToAuthChallenge', {
	      ChallengeName: 'DEVICE_SRP_AUTH',
	      ClientId: this.pool.getClientId(),
	      ChallengeResponses: authParameters
	    }, function (err, data) {
	      if (err) {
	        return callback.onFailure(err);
	      }

	      var challengeParameters = data.ChallengeParameters;

	      var serverBValue = new _BigInteger2.default(challengeParameters.SRP_B, 16);
	      var salt = new _BigInteger2.default(challengeParameters.SALT, 16);

	      var hkdf = authenticationHelper.getPasswordAuthenticationKey(_this5.deviceKey, _this5.randomPassword, serverBValue, salt);

	      var dateNow = dateHelper.getNowString();

	      var signatureString = _global.util.crypto.hmac(hkdf, _global.util.buffer.concat([new _global.util.Buffer(_this5.deviceGroupKey, 'utf8'), new _global.util.Buffer(_this5.deviceKey, 'utf8'), new _global.util.Buffer(challengeParameters.SECRET_BLOCK, 'base64'), new _global.util.Buffer(dateNow, 'utf8')]), 'base64', 'sha256');

	      var challengeResponses = {};

	      challengeResponses.USERNAME = _this5.username;
	      challengeResponses.PASSWORD_CLAIM_SECRET_BLOCK = challengeParameters.SECRET_BLOCK;
	      challengeResponses.TIMESTAMP = dateNow;
	      challengeResponses.PASSWORD_CLAIM_SIGNATURE = signatureString;
	      challengeResponses.DEVICE_KEY = _this5.deviceKey;

	      _this5.client.makeUnauthenticatedRequest('respondToAuthChallenge', {
	        ChallengeName: 'DEVICE_PASSWORD_VERIFIER',
	        ClientId: _this5.pool.getClientId(),
	        ChallengeResponses: challengeResponses,
	        Session: data.Session
	      }, function (errAuthenticate, dataAuthenticate) {
	        if (errAuthenticate) {
	          return callback.onFailure(errAuthenticate);
	        }

	        _this5.signInUserSession = _this5.getCognitoUserSession(dataAuthenticate.AuthenticationResult);
	        _this5.cacheTokens();

	        return callback.onSuccess(_this5.signInUserSession);
	      });
	      return undefined;
	    });
	  };

	  /**
	   * This is used for a certain user to confirm the registration by using a confirmation code
	   * @param {string} confirmationCode Code entered by user.
	   * @param {bool} forceAliasCreation Allow migrating from an existing email / phone number.
	   * @param {nodeCallback<string>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.confirmRegistration = function confirmRegistration(confirmationCode, forceAliasCreation, callback) {
	    this.client.makeUnauthenticatedRequest('confirmSignUp', {
	      ClientId: this.pool.getClientId(),
	      ConfirmationCode: confirmationCode,
	      Username: this.username,
	      ForceAliasCreation: forceAliasCreation
	    }, function (err) {
	      if (err) {
	        return callback(err, null);
	      }
	      return callback(null, 'SUCCESS');
	    });
	  };

	  /**
	   * This is used by the user once he has the responses to a custom challenge
	   * @param {string} answerChallenge The custom challange answer.
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {customChallenge} callback.customChallenge
	   *    Custom challenge response required to continue.
	   * @param {authSuccess} callback.onSuccess Called on success with the new session.
	   * @returns {void}
	   */


	  CognitoUser.prototype.sendCustomChallengeAnswer = function sendCustomChallengeAnswer(answerChallenge, callback) {
	    var _this6 = this;

	    var challengeResponses = {};
	    challengeResponses.USERNAME = this.username;
	    challengeResponses.ANSWER = answerChallenge;

	    this.client.makeUnauthenticatedRequest('respondToAuthChallenge', {
	      ChallengeName: 'CUSTOM_CHALLENGE',
	      ChallengeResponses: challengeResponses,
	      ClientId: this.pool.getClientId(),
	      Session: this.Session
	    }, function (err, data) {
	      if (err) {
	        return callback.onFailure(err);
	      }

	      var challengeName = data.ChallengeName;

	      if (challengeName === 'CUSTOM_CHALLENGE') {
	        _this6.Session = data.Session;
	        return callback.customChallenge(data.ChallengeParameters);
	      }

	      _this6.signInUserSession = _this6.getCognitoUserSession(data.AuthenticationResult);
	      _this6.cacheTokens();
	      return callback.onSuccess(_this6.signInUserSession);
	    });
	  };

	  /**
	   * This is used by the user once he has an MFA code
	   * @param {string} confirmationCode The MFA code entered by the user.
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {authSuccess} callback.onSuccess Called on success with the new session.
	   * @returns {void}
	   */


	  CognitoUser.prototype.sendMFACode = function sendMFACode(confirmationCode, callback) {
	    var _this7 = this;

	    var challengeResponses = {};
	    challengeResponses.USERNAME = this.username;
	    challengeResponses.SMS_MFA_CODE = confirmationCode;

	    if (this.deviceKey != null) {
	      challengeResponses.DEVICE_KEY = this.deviceKey;
	    }

	    this.client.makeUnauthenticatedRequest('respondToAuthChallenge', {
	      ChallengeName: 'SMS_MFA',
	      ChallengeResponses: challengeResponses,
	      ClientId: this.pool.getClientId(),
	      Session: this.Session
	    }, function (err, dataAuthenticate) {
	      if (err) {
	        return callback.onFailure(err);
	      }

	      var challengeName = dataAuthenticate.ChallengeName;

	      if (challengeName === 'DEVICE_SRP_AUTH') {
	        _this7.getDeviceResponse(callback);
	        return undefined;
	      }

	      _this7.signInUserSession = _this7.getCognitoUserSession(dataAuthenticate.AuthenticationResult);
	      _this7.cacheTokens();

	      if (dataAuthenticate.AuthenticationResult.NewDeviceMetadata == null) {
	        return callback.onSuccess(_this7.signInUserSession);
	      }

	      var authenticationHelper = new _AuthenticationHelper2.default(_this7.pool.getUserPoolId().split('_')[1]);
	      authenticationHelper.generateHashDevice(dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceGroupKey, dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceKey);

	      var deviceSecretVerifierConfig = {
	        Salt: new _global.util.Buffer(authenticationHelper.getSaltDevices(), 'hex').toString('base64'),
	        PasswordVerifier: new _global.util.Buffer(authenticationHelper.getVerifierDevices(), 'hex').toString('base64')
	      };

	      _this7.verifierDevices = deviceSecretVerifierConfig.PasswordVerifier;
	      _this7.deviceGroupKey = dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceGroupKey;
	      _this7.randomPassword = authenticationHelper.getRandomPassword();

	      _this7.client.makeUnauthenticatedRequest('confirmDevice', {
	        DeviceKey: dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceKey,
	        AccessToken: _this7.signInUserSession.getAccessToken().getJwtToken(),
	        DeviceSecretVerifierConfig: deviceSecretVerifierConfig,
	        DeviceName: navigator.userAgent
	      }, function (errConfirm, dataConfirm) {
	        if (errConfirm) {
	          return callback.onFailure(errConfirm);
	        }

	        _this7.deviceKey = dataAuthenticate.AuthenticationResult.NewDeviceMetadata.DeviceKey;
	        _this7.cacheDeviceKeyAndPassword();
	        if (dataConfirm.UserConfirmationNecessary === true) {
	          return callback.onSuccess(_this7.signInUserSession, dataConfirm.UserConfirmationNecessary);
	        }
	        return callback.onSuccess(_this7.signInUserSession);
	      });
	      return undefined;
	    });
	  };

	  /**
	   * This is used by an authenticated user to change the current password
	   * @param {string} oldUserPassword The current password.
	   * @param {string} newUserPassword The requested new password.
	   * @param {nodeCallback<string>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.changePassword = function changePassword(oldUserPassword, newUserPassword, callback) {
	    if (!(this.signInUserSession != null && this.signInUserSession.isValid())) {
	      return callback(new Error('User is not authenticated'), null);
	    }

	    this.client.makeUnauthenticatedRequest('changePassword', {
	      PreviousPassword: oldUserPassword,
	      ProposedPassword: newUserPassword,
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
	    }, function (err) {
	      if (err) {
	        return callback(err, null);
	      }
	      return callback(null, 'SUCCESS');
	    });
	    return undefined;
	  };

	  /**
	   * This is used by an authenticated user to enable MFA for himself
	   * @param {nodeCallback<string>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.enableMFA = function enableMFA(callback) {
	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback(new Error('User is not authenticated'), null);
	    }

	    var mfaOptions = [];
	    var mfaEnabled = {
	      DeliveryMedium: 'SMS',
	      AttributeName: 'phone_number'
	    };
	    mfaOptions.push(mfaEnabled);

	    this.client.makeUnauthenticatedRequest('setUserSettings', {
	      MFAOptions: mfaOptions,
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
	    }, function (err) {
	      if (err) {
	        return callback(err, null);
	      }
	      return callback(null, 'SUCCESS');
	    });
	    return undefined;
	  };

	  /**
	   * This is used by an authenticated user to disable MFA for himself
	   * @param {nodeCallback<string>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.disableMFA = function disableMFA(callback) {
	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback(new Error('User is not authenticated'), null);
	    }

	    var mfaOptions = [];

	    this.client.makeUnauthenticatedRequest('setUserSettings', {
	      MFAOptions: mfaOptions,
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
	    }, function (err) {
	      if (err) {
	        return callback(err, null);
	      }
	      return callback(null, 'SUCCESS');
	    });
	    return undefined;
	  };

	  /**
	   * This is used by an authenticated user to delete himself
	   * @param {nodeCallback<string>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.deleteUser = function deleteUser(callback) {
	    var _this8 = this;

	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback(new Error('User is not authenticated'), null);
	    }

	    this.client.makeUnauthenticatedRequest('deleteUser', {
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
	    }, function (err) {
	      if (err) {
	        return callback(err, null);
	      }
	      _this8.clearCachedTokens();
	      return callback(null, 'SUCCESS');
	    });
	    return undefined;
	  };

	  /**
	   * @typedef {CognitoUserAttribute | { Name:string, Value:string }} AttributeArg
	   */
	  /**
	   * This is used by an authenticated user to change a list of attributes
	   * @param {AttributeArg[]} attributes A list of the new user attributes.
	   * @param {nodeCallback<string>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.updateAttributes = function updateAttributes(attributes, callback) {
	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback(new Error('User is not authenticated'), null);
	    }

	    this.client.makeUnauthenticatedRequest('updateUserAttributes', {
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
	      UserAttributes: attributes
	    }, function (err) {
	      if (err) {
	        return callback(err, null);
	      }
	      return callback(null, 'SUCCESS');
	    });
	    return undefined;
	  };

	  /**
	   * This is used by an authenticated user to get a list of attributes
	   * @param {nodeCallback<CognitoUserAttribute[]>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.getUserAttributes = function getUserAttributes(callback) {
	    if (!(this.signInUserSession != null && this.signInUserSession.isValid())) {
	      return callback(new Error('User is not authenticated'), null);
	    }

	    this.client.makeUnauthenticatedRequest('getUser', {
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
	    }, function (err, userData) {
	      if (err) {
	        return callback(err, null);
	      }

	      var attributeList = [];

	      for (var i = 0; i < userData.UserAttributes.length; i++) {
	        var attribute = {
	          Name: userData.UserAttributes[i].Name,
	          Value: userData.UserAttributes[i].Value
	        };
	        var userAttribute = new _CognitoUserAttribute2.default(attribute);
	        attributeList.push(userAttribute);
	      }

	      return callback(null, attributeList);
	    });
	    return undefined;
	  };

	  /**
	   * This is used by an authenticated user to get the MFAOptions
	   * @param {nodeCallback<MFAOptions>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.getMFAOptions = function getMFAOptions(callback) {
	    if (!(this.signInUserSession != null && this.signInUserSession.isValid())) {
	      return callback(new Error('User is not authenticated'), null);
	    }

	    this.client.makeUnauthenticatedRequest('getUser', {
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
	    }, function (err, userData) {
	      if (err) {
	        return callback(err, null);
	      }

	      return callback(null, userData.MFAOptions);
	    });
	    return undefined;
	  };

	  /**
	   * This is used by an authenticated user to delete a list of attributes
	   * @param {string[]} attributeList Names of the attributes to delete.
	   * @param {nodeCallback<string>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.deleteAttributes = function deleteAttributes(attributeList, callback) {
	    if (!(this.signInUserSession != null && this.signInUserSession.isValid())) {
	      return callback(new Error('User is not authenticated'), null);
	    }

	    this.client.makeUnauthenticatedRequest('deleteUserAttributes', {
	      UserAttributeNames: attributeList,
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
	    }, function (err) {
	      if (err) {
	        return callback(err, null);
	      }
	      return callback(null, 'SUCCESS');
	    });
	    return undefined;
	  };

	  /**
	   * This is used by a user to resend a confirmation code
	   * @param {nodeCallback<string>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.resendConfirmationCode = function resendConfirmationCode(callback) {
	    this.client.makeUnauthenticatedRequest('resendConfirmationCode', {
	      ClientId: this.pool.getClientId(),
	      Username: this.username
	    }, function (err, result) {
	      if (err) {
	        return callback(err, null);
	      }
	      return callback(null, result);
	    });
	  };

	  /**
	   * This is used to get a session, either from the session object
	   * or from  the local storage, or by using a refresh token
	   *
	   * @param {nodeCallback<CognitoUserSession>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.getSession = function getSession(callback) {
	    if (this.username == null) {
	      return callback(new Error('Username is null. Cannot retrieve a new session'), null);
	    }

	    if (this.signInUserSession != null && this.signInUserSession.isValid()) {
	      return callback(null, this.signInUserSession);
	    }

	    var keyPrefix = 'CognitoIdentityServiceProvider.' + this.pool.getClientId() + '.' + this.username;
	    var idTokenKey = keyPrefix + '.idToken';
	    var accessTokenKey = keyPrefix + '.accessToken';
	    var refreshTokenKey = keyPrefix + '.refreshToken';

	    if (this.storage.getItem(idTokenKey)) {
	      var idToken = new _CognitoIdToken2.default({
	        IdToken: this.storage.getItem(idTokenKey)
	      });
	      var accessToken = new _CognitoAccessToken2.default({
	        AccessToken: this.storage.getItem(accessTokenKey)
	      });
	      var refreshToken = new _CognitoRefreshToken2.default({
	        RefreshToken: this.storage.getItem(refreshTokenKey)
	      });

	      var sessionData = {
	        IdToken: idToken,
	        AccessToken: accessToken,
	        RefreshToken: refreshToken
	      };
	      var cachedSession = new _CognitoUserSession2.default(sessionData);
	      if (cachedSession.isValid()) {
	        this.signInUserSession = cachedSession;
	        return callback(null, this.signInUserSession);
	      }

	      if (refreshToken.getToken() == null) {
	        return callback(new Error('Cannot retrieve a new session. Please authenticate.'), null);
	      }

	      this.refreshSession(refreshToken, callback);
	    } else {
	      callback(new Error('Local storage is missing an ID Token, Please authenticate'), null);
	    }

	    return undefined;
	  };

	  /**
	   * This uses the refreshToken to retrieve a new session
	   * @param {CognitoRefreshToken} refreshToken A previous session's refresh token.
	   * @param {nodeCallback<CognitoUserSession>} callback Called on success or error.
	   * @returns {void}
	   */


	  CognitoUser.prototype.refreshSession = function refreshSession(refreshToken, callback) {
	    var _this9 = this;

	    var authParameters = {};
	    authParameters.REFRESH_TOKEN = refreshToken.getToken();
	    var keyPrefix = 'CognitoIdentityServiceProvider.' + this.pool.getClientId();
	    var lastUserKey = keyPrefix + '.LastAuthUser';

	    if (this.storage.getItem(lastUserKey)) {
	      this.username = this.storage.getItem(lastUserKey);
	      var deviceKeyKey = keyPrefix + '.' + this.username + '.deviceKey';
	      this.deviceKey = this.storage.getItem(deviceKeyKey);
	      authParameters.DEVICE_KEY = this.deviceKey;
	    }

	    this.client.makeUnauthenticatedRequest('initiateAuth', {
	      ClientId: this.pool.getClientId(),
	      AuthFlow: 'REFRESH_TOKEN_AUTH',
	      AuthParameters: authParameters
	    }, function (err, authResult) {
	      if (err) {
	        if (err.code === 'NotAuthorizedException') {
	          _this9.clearCachedTokens();
	        }
	        return callback(err, null);
	      }
	      if (authResult) {
	        var authenticationResult = authResult.AuthenticationResult;
	        if (!Object.prototype.hasOwnProperty.call(authenticationResult, 'RefreshToken')) {
	          authenticationResult.RefreshToken = refreshToken.getToken();
	        }
	        _this9.signInUserSession = _this9.getCognitoUserSession(authenticationResult);
	        _this9.cacheTokens();
	        return callback(null, _this9.signInUserSession);
	      }
	      return undefined;
	    });
	  };

	  /**
	   * This is used to save the session tokens to local storage
	   * @returns {void}
	   */


	  CognitoUser.prototype.cacheTokens = function cacheTokens() {
	    var keyPrefix = 'CognitoIdentityServiceProvider.' + this.pool.getClientId();
	    var idTokenKey = keyPrefix + '.' + this.username + '.idToken';
	    var accessTokenKey = keyPrefix + '.' + this.username + '.accessToken';
	    var refreshTokenKey = keyPrefix + '.' + this.username + '.refreshToken';
	    var lastUserKey = keyPrefix + '.LastAuthUser';

	    this.storage.setItem(idTokenKey, this.signInUserSession.getIdToken().getJwtToken());
	    this.storage.setItem(accessTokenKey, this.signInUserSession.getAccessToken().getJwtToken());
	    this.storage.setItem(refreshTokenKey, this.signInUserSession.getRefreshToken().getToken());
	    this.storage.setItem(lastUserKey, this.username);
	  };

	  /**
	   * This is used to cache the device key and device group and device password
	   * @returns {void}
	   */


	  CognitoUser.prototype.cacheDeviceKeyAndPassword = function cacheDeviceKeyAndPassword() {
	    var keyPrefix = 'CognitoIdentityServiceProvider.' + this.pool.getClientId() + '.' + this.username;
	    var deviceKeyKey = keyPrefix + '.deviceKey';
	    var randomPasswordKey = keyPrefix + '.randomPasswordKey';
	    var deviceGroupKeyKey = keyPrefix + '.deviceGroupKey';

	    this.storage.setItem(deviceKeyKey, this.deviceKey);
	    this.storage.setItem(randomPasswordKey, this.randomPassword);
	    this.storage.setItem(deviceGroupKeyKey, this.deviceGroupKey);
	  };

	  /**
	   * This is used to get current device key and device group and device password
	   * @returns {void}
	   */


	  CognitoUser.prototype.getCachedDeviceKeyAndPassword = function getCachedDeviceKeyAndPassword() {
	    var keyPrefix = 'CognitoIdentityServiceProvider.' + this.pool.getClientId() + '.' + this.username;
	    var deviceKeyKey = keyPrefix + '.deviceKey';
	    var randomPasswordKey = keyPrefix + '.randomPasswordKey';
	    var deviceGroupKeyKey = keyPrefix + '.deviceGroupKey';

	    if (this.storage.getItem(deviceKeyKey)) {
	      this.deviceKey = this.storage.getItem(deviceKeyKey);
	      this.randomPassword = this.storage.getItem(randomPasswordKey);
	      this.deviceGroupKey = this.storage.getItem(deviceGroupKeyKey);
	    }
	  };

	  /**
	   * This is used to clear the device key info from local storage
	   * @returns {void}
	   */


	  CognitoUser.prototype.clearCachedDeviceKeyAndPassword = function clearCachedDeviceKeyAndPassword() {
	    var keyPrefix = 'CognitoIdentityServiceProvider.' + this.pool.getClientId() + '.' + this.username;
	    var deviceKeyKey = keyPrefix + '.deviceKey';
	    var randomPasswordKey = keyPrefix + '.randomPasswordKey';
	    var deviceGroupKeyKey = keyPrefix + '.deviceGroupKey';

	    this.storage.removeItem(deviceKeyKey);
	    this.storage.removeItem(randomPasswordKey);
	    this.storage.removeItem(deviceGroupKeyKey);
	  };

	  /**
	   * This is used to clear the session tokens from local storage
	   * @returns {void}
	   */


	  CognitoUser.prototype.clearCachedTokens = function clearCachedTokens() {
	    var keyPrefix = 'CognitoIdentityServiceProvider.' + this.pool.getClientId();
	    var idTokenKey = keyPrefix + '.' + this.username + '.idToken';
	    var accessTokenKey = keyPrefix + '.' + this.username + '.accessToken';
	    var refreshTokenKey = keyPrefix + '.' + this.username + '.refreshToken';
	    var lastUserKey = keyPrefix + '.LastAuthUser';

	    this.storage.removeItem(idTokenKey);
	    this.storage.removeItem(accessTokenKey);
	    this.storage.removeItem(refreshTokenKey);
	    this.storage.removeItem(lastUserKey);
	  };

	  /**
	   * This is used to build a user session from tokens retrieved in the authentication result
	   * @param {object} authResult Successful auth response from server.
	   * @returns {CognitoUserSession} The new user session.
	   * @private
	   */


	  CognitoUser.prototype.getCognitoUserSession = function getCognitoUserSession(authResult) {
	    var idToken = new _CognitoIdToken2.default(authResult);
	    var accessToken = new _CognitoAccessToken2.default(authResult);
	    var refreshToken = new _CognitoRefreshToken2.default(authResult);

	    var sessionData = {
	      IdToken: idToken,
	      AccessToken: accessToken,
	      RefreshToken: refreshToken
	    };

	    return new _CognitoUserSession2.default(sessionData);
	  };

	  /**
	   * This is used to initiate a forgot password request
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {inputVerificationCode?} callback.inputVerificationCode
	   *    Optional callback raised instead of onSuccess with response data.
	   * @param {onSuccess} callback.onSuccess Called on success.
	   * @returns {void}
	   */


	  CognitoUser.prototype.forgotPassword = function forgotPassword(callback) {
	    this.client.makeUnauthenticatedRequest('forgotPassword', {
	      ClientId: this.pool.getClientId(),
	      Username: this.username
	    }, function (err, data) {
	      if (err) {
	        return callback.onFailure(err);
	      }
	      if (typeof callback.inputVerificationCode === 'function') {
	        return callback.inputVerificationCode(data);
	      }
	      return callback.onSuccess(data);
	    });
	  };

	  /**
	   * This is used to confirm a new password using a confirmationCode
	   * @param {string} confirmationCode Code entered by user.
	   * @param {string} newPassword Confirm new password.
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {onSuccess<void>} callback.onSuccess Called on success.
	   * @returns {void}
	   */


	  CognitoUser.prototype.confirmPassword = function confirmPassword(confirmationCode, newPassword, callback) {
	    this.client.makeUnauthenticatedRequest('confirmForgotPassword', {
	      ClientId: this.pool.getClientId(),
	      Username: this.username,
	      ConfirmationCode: confirmationCode,
	      Password: newPassword
	    }, function (err) {
	      if (err) {
	        return callback.onFailure(err);
	      }
	      return callback.onSuccess();
	    });
	  };

	  /**
	   * This is used to initiate an attribute confirmation request
	   * @param {string} attributeName User attribute that needs confirmation.
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {inputVerificationCode} callback.inputVerificationCode Called on success.
	   * @returns {void}
	   */


	  CognitoUser.prototype.getAttributeVerificationCode = function getAttributeVerificationCode(attributeName, callback) {
	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback.onFailure(new Error('User is not authenticated'));
	    }

	    this.client.makeUnauthenticatedRequest('getUserAttributeVerificationCode', {
	      AttributeName: attributeName,
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
	    }, function (err, data) {
	      if (err) {
	        return callback.onFailure(err);
	      }
	      if (typeof callback.inputVerificationCode === 'function') {
	        return callback.inputVerificationCode(data);
	      }
	      return callback.onSuccess();
	    });
	    return undefined;
	  };

	  /**
	   * This is used to confirm an attribute using a confirmation code
	   * @param {string} attributeName Attribute being confirmed.
	   * @param {string} confirmationCode Code entered by user.
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {onSuccess<string>} callback.onSuccess Called on success.
	   * @returns {void}
	   */


	  CognitoUser.prototype.verifyAttribute = function verifyAttribute(attributeName, confirmationCode, callback) {
	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback.onFailure(new Error('User is not authenticated'));
	    }

	    this.client.makeUnauthenticatedRequest('verifyUserAttribute', {
	      AttributeName: attributeName,
	      Code: confirmationCode,
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
	    }, function (err) {
	      if (err) {
	        return callback.onFailure(err);
	      }
	      return callback.onSuccess('SUCCESS');
	    });
	    return undefined;
	  };

	  /**
	   * This is used to get the device information using the current device key
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {onSuccess<*>} callback.onSuccess Called on success with device data.
	   * @returns {void}
	   */


	  CognitoUser.prototype.getDevice = function getDevice(callback) {
	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback.onFailure(new Error('User is not authenticated'));
	    }

	    this.client.makeUnauthenticatedRequest('getDevice', {
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
	      DeviceKey: this.deviceKey
	    }, function (err, data) {
	      if (err) {
	        return callback.onFailure(err);
	      }
	      return callback.onSuccess(data);
	    });
	    return undefined;
	  };

	  /**
	   * This is used to forget a specific device
	   * @param {string} deviceKey Device key.
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {onSuccess<string>} callback.onSuccess Called on success.
	   * @returns {void}
	   */


	  CognitoUser.prototype.forgetSpecificDevice = function forgetSpecificDevice(deviceKey, callback) {
	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback.onFailure(new Error('User is not authenticated'));
	    }

	    this.client.makeUnauthenticatedRequest('forgetDevice', {
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
	      DeviceKey: deviceKey
	    }, function (err) {
	      if (err) {
	        return callback.onFailure(err);
	      }
	      return callback.onSuccess('SUCCESS');
	    });
	    return undefined;
	  };

	  /**
	   * This is used to forget the current device
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {onSuccess<string>} callback.onSuccess Called on success.
	   * @returns {void}
	   */


	  CognitoUser.prototype.forgetDevice = function forgetDevice(callback) {
	    var _this10 = this;

	    this.forgetSpecificDevice(this.deviceKey, {
	      onFailure: callback.onFailure,
	      onSuccess: function onSuccess(result) {
	        _this10.deviceKey = null;
	        _this10.deviceGroupKey = null;
	        _this10.randomPassword = null;
	        _this10.clearCachedDeviceKeyAndPassword();
	        return callback.onSuccess(result);
	      }
	    });
	  };

	  /**
	   * This is used to set the device status as remembered
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {onSuccess<string>} callback.onSuccess Called on success.
	   * @returns {void}
	   */


	  CognitoUser.prototype.setDeviceStatusRemembered = function setDeviceStatusRemembered(callback) {
	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback.onFailure(new Error('User is not authenticated'));
	    }

	    this.client.makeUnauthenticatedRequest('updateDeviceStatus', {
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
	      DeviceKey: this.deviceKey,
	      DeviceRememberedStatus: 'remembered'
	    }, function (err) {
	      if (err) {
	        return callback.onFailure(err);
	      }
	      return callback.onSuccess('SUCCESS');
	    });
	    return undefined;
	  };

	  /**
	   * This is used to set the device status as not remembered
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {onSuccess<string>} callback.onSuccess Called on success.
	   * @returns {void}
	   */


	  CognitoUser.prototype.setDeviceStatusNotRemembered = function setDeviceStatusNotRemembered(callback) {
	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback.onFailure(new Error('User is not authenticated'));
	    }

	    this.client.makeUnauthenticatedRequest('updateDeviceStatus', {
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
	      DeviceKey: this.deviceKey,
	      DeviceRememberedStatus: 'not_remembered'
	    }, function (err) {
	      if (err) {
	        return callback.onFailure(err);
	      }
	      return callback.onSuccess('SUCCESS');
	    });
	    return undefined;
	  };

	  /**
	   * This is used to list all devices for a user
	   *
	   * @param {int} limit the number of devices returned in a call
	   * @param {string} paginationToken the pagination token in case any was returned before
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {onSuccess<*>} callback.onSuccess Called on success with device list.
	   * @returns {void}
	   */


	  CognitoUser.prototype.listDevices = function listDevices(limit, paginationToken, callback) {
	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback.onFailure(new Error('User is not authenticated'));
	    }

	    this.client.makeUnauthenticatedRequest('listDevices', {
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken(),
	      Limit: limit,
	      PaginationToken: paginationToken
	    }, function (err, data) {
	      if (err) {
	        return callback.onFailure(err);
	      }
	      return callback.onSuccess(data);
	    });
	    return undefined;
	  };

	  /**
	   * This is used to globally revoke all tokens issued to a user
	   * @param {object} callback Result callback map.
	   * @param {onFailure} callback.onFailure Called on any error.
	   * @param {onSuccess<string>} callback.onSuccess Called on success.
	   * @returns {void}
	   */


	  CognitoUser.prototype.globalSignOut = function globalSignOut(callback) {
	    var _this11 = this;

	    if (this.signInUserSession == null || !this.signInUserSession.isValid()) {
	      return callback.onFailure(new Error('User is not authenticated'));
	    }

	    this.client.makeUnauthenticatedRequest('globalSignOut', {
	      AccessToken: this.signInUserSession.getAccessToken().getJwtToken()
	    }, function (err) {
	      if (err) {
	        return callback.onFailure(err);
	      }
	      _this11.clearCachedTokens();
	      return callback.onSuccess('SUCCESS');
	    });
	    return undefined;
	  };

	  /**
	   * This is used for the user to signOut of the application and clear the cached tokens.
	   * @returns {void}
	   */


	  CognitoUser.prototype.signOut = function signOut() {
	    this.signInUserSession = null;
	    this.clearCachedTokens();
	  };

	  return CognitoUser;
	}();

	exports.default = CognitoUser;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */

	/** @class */
	var CognitoUserAttribute = function () {
	  /**
	   * Constructs a new CognitoUserAttribute object
	   * @param {string=} Name The record's name
	   * @param {string=} Value The record's value
	   */
	  function CognitoUserAttribute() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        Name = _ref.Name,
	        Value = _ref.Value;

	    _classCallCheck(this, CognitoUserAttribute);

	    this.Name = Name || '';
	    this.Value = Value || '';
	  }

	  /**
	   * @returns {string} the record's value.
	   */


	  CognitoUserAttribute.prototype.getValue = function getValue() {
	    return this.Value;
	  };

	  /**
	   * Sets the record's value.
	   * @param {string} value The new value.
	   * @returns {CognitoUserAttribute} The record for method chaining.
	   */


	  CognitoUserAttribute.prototype.setValue = function setValue(value) {
	    this.Value = value;
	    return this;
	  };

	  /**
	   * @returns {string} the record's name.
	   */


	  CognitoUserAttribute.prototype.getName = function getName() {
	    return this.Name;
	  };

	  /**
	   * Sets the record's name
	   * @param {string} name The new name.
	   * @returns {CognitoUserAttribute} The record for method chaining.
	   */


	  CognitoUserAttribute.prototype.setName = function setName(name) {
	    this.Name = name;
	    return this;
	  };

	  /**
	   * @returns {string} a string representation of the record.
	   */


	  CognitoUserAttribute.prototype.toString = function toString() {
	    return JSON.stringify(this);
	  };

	  /**
	   * @returns {object} a flat object representing the record.
	   */


	  CognitoUserAttribute.prototype.toJSON = function toJSON() {
	    return {
	      Name: this.Name,
	      Value: this.Value
	    };
	  };

	  return CognitoUserAttribute;
	}();

	exports.default = CognitoUserAttribute;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */

	/** @class */
	var CognitoUserSession = function () {
	  /**
	   * Constructs a new CognitoUserSession object
	   * @param {string} IdToken The session's Id token.
	   * @param {string=} RefreshToken The session's refresh token.
	   * @param {string} AccessToken The session's access token.
	   */
	  function CognitoUserSession() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        IdToken = _ref.IdToken,
	        RefreshToken = _ref.RefreshToken,
	        AccessToken = _ref.AccessToken;

	    _classCallCheck(this, CognitoUserSession);

	    if (AccessToken == null || IdToken == null) {
	      throw new Error('Id token and Access Token must be present.');
	    }

	    this.idToken = IdToken;
	    this.refreshToken = RefreshToken;
	    this.accessToken = AccessToken;
	  }

	  /**
	   * @returns {CognitoIdToken} the session's Id token
	   */


	  CognitoUserSession.prototype.getIdToken = function getIdToken() {
	    return this.idToken;
	  };

	  /**
	   * @returns {CognitoRefreshToken} the session's refresh token
	   */


	  CognitoUserSession.prototype.getRefreshToken = function getRefreshToken() {
	    return this.refreshToken;
	  };

	  /**
	   * @returns {CognitoAccessToken} the session's access token
	   */


	  CognitoUserSession.prototype.getAccessToken = function getAccessToken() {
	    return this.accessToken;
	  };

	  /**
	   * Checks to see if the session is still valid based on session expiry information found
	   * in tokens and the current time
	   * @returns {boolean} if the session is still valid
	   */


	  CognitoUserSession.prototype.isValid = function isValid() {
	    var now = Math.floor(new Date() / 1000);

	    return now < this.accessToken.getExpiration() && now < this.idToken.getExpiration();
	  };

	  return CognitoUserSession;
	}();

	exports.default = CognitoUserSession;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */

	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	/** @class */

	var DateHelper = function () {
	  function DateHelper() {
	    _classCallCheck(this, DateHelper);
	  }

	  /**
	   * @returns {string} The current time in "ddd MMM D HH:mm:ss UTC YYYY" format.
	   */
	  DateHelper.prototype.getNowString = function getNowString() {
	    var now = new Date();

	    var weekDay = weekNames[now.getUTCDay()];
	    var month = monthNames[now.getUTCMonth()];
	    var day = now.getUTCDate();

	    var hours = now.getUTCHours();
	    if (hours < 10) {
	      hours = '0' + hours;
	    }

	    var minutes = now.getUTCMinutes();
	    if (minutes < 10) {
	      minutes = '0' + minutes;
	    }

	    var seconds = now.getUTCSeconds();
	    if (seconds < 10) {
	      seconds = '0' + seconds;
	    }

	    var year = now.getUTCFullYear();

	    // ddd MMM D HH:mm:ss UTC YYYY
	    var dateNow = weekDay + ' ' + month + ' ' + day + ' ' + hours + ':' + minutes + ':' + seconds + ' UTC ' + year;

	    return dateNow;
	  };

	  return DateHelper;
	}();

	exports.default = DateHelper;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */

	var dataMemory = {};

	/** @class */

	var MemoryStorage = function () {
	  function MemoryStorage() {
	    _classCallCheck(this, MemoryStorage);
	  }

	  /**
	   * This is used to set a specific item in storage
	   * @param {string} key - the key for the item
	   * @param {object} value - the value
	   * @returns {string} value that was set
	   */
	  MemoryStorage.setItem = function setItem(key, value) {
	    dataMemory[key] = value;
	    return dataMemory[key];
	  };

	  /**
	   * This is used to get a specific key from storage
	   * @param {string} key - the key for the item
	   * This is used to clear the storage
	   * @returns {string} the data item
	   */


	  MemoryStorage.getItem = function getItem(key) {
	    return Object.prototype.hasOwnProperty.call(dataMemory, key) ? dataMemory[key] : undefined;
	  };

	  /**
	   * This is used to remove an item from storage
	   * @param {string} key - the key being set
	   * @returns {string} value - value that was deleted
	   */


	  MemoryStorage.removeItem = function removeItem(key) {
	    return delete dataMemory[key];
	  };

	  /**
	   * This is used to clear the storage
	   * @returns {string} nothing
	   */


	  MemoryStorage.clear = function clear() {
	    dataMemory = {};
	    return dataMemory;
	  };

	  return MemoryStorage;
	}();

	/** @class */


	var StorageHelper = function () {

	  /**
	   * This is used to get a storage object
	   * @returns {object} the storage
	   */
	  function StorageHelper() {
	    _classCallCheck(this, StorageHelper);

	    try {
	      this.storageWindow = window.localStorage;
	      this.storageWindow.setItem('aws.cognito.test-ls', 1);
	      this.storageWindow.removeItem('aws.cognito.test-ls');
	    } catch (exception) {
	      this.storageWindow = MemoryStorage;
	    }
	  }

	  /**
	   * This is used to return the storage
	   * @returns {object} the storage
	   */


	  StorageHelper.prototype.getStorage = function getStorage() {
	    return this.storageWindow;
	  };

	  return StorageHelper;
	}();

	exports.default = StorageHelper;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*!
	 * Copyright 2016 Amazon.com,
	 * Inc. or its affiliates. All Rights Reserved.
	 *
	 * Licensed under the Amazon Software License (the "License").
	 * You may not use this file except in compliance with the
	 * License. A copy of the License is located at
	 *
	 *     http://aws.amazon.com/asl/
	 *
	 * or in the "license" file accompanying this file. This file is
	 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	 * CONDITIONS OF ANY KIND, express or implied. See the License
	 * for the specific language governing permissions and
	 * limitations under the License.
	 */

	/** @class */
	var AuthenticationDetails = function () {
	  /**
	   * Constructs a new AuthenticationDetails object
	   * @param {object=} data Creation options.
	   * @param {string} data.Username User being authenticated.
	   * @param {string} data.Password Plain-text password to authenticate with.
	   * @param {(AttributeArg[])?} data.ValidationData Application extra metadata.
	   * @param {(AttributeArg[])?} data.AuthParamaters Authentication paramaters for custom auth.
	   */
	  function AuthenticationDetails(data) {
	    _classCallCheck(this, AuthenticationDetails);

	    var _ref = data || {},
	        ValidationData = _ref.ValidationData,
	        Username = _ref.Username,
	        Password = _ref.Password,
	        AuthParameters = _ref.AuthParameters;

	    this.validationData = ValidationData || [];
	    this.authParameters = AuthParameters || [];
	    this.username = Username;
	    this.password = Password;
	  }

	  /**
	   * @returns {string} the record's username
	   */


	  AuthenticationDetails.prototype.getUsername = function getUsername() {
	    return this.username;
	  };

	  /**
	   * @returns {string} the record's password
	   */


	  AuthenticationDetails.prototype.getPassword = function getPassword() {
	    return this.password;
	  };

	  /**
	   * @returns {Array} the record's validationData
	   */


	  AuthenticationDetails.prototype.getValidationData = function getValidationData() {
	    return this.validationData;
	  };

	  /**
	   * @returns {Array} the record's authParameters
	   */


	  AuthenticationDetails.prototype.getAuthParameters = function getAuthParameters() {
	    return this.authParameters;
	  };

	  return AuthenticationDetails;
	}();

	exports.default = AuthenticationDetails;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _cognitoidentityserviceprovider = __webpack_require__(12);

	var _cognitoidentityserviceprovider2 = _interopRequireDefault(_cognitoidentityserviceprovider);

	var _CognitoUser = __webpack_require__(7);

	var _CognitoUser2 = _interopRequireDefault(_CognitoUser);

	var _StorageHelper = __webpack_require__(11);

	var _StorageHelper2 = _interopRequireDefault(_StorageHelper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*!
	                                                                                                                                                           * Copyright 2016 Amazon.com,
	                                                                                                                                                           * Inc. or its affiliates. All Rights Reserved.
	                                                                                                                                                           *
	                                                                                                                                                           * Licensed under the Amazon Software License (the "License").
	                                                                                                                                                           * You may not use this file except in compliance with the
	                                                                                                                                                           * License. A copy of the License is located at
	                                                                                                                                                           *
	                                                                                                                                                           *     http://aws.amazon.com/asl/
	                                                                                                                                                           *
	                                                                                                                                                           * or in the "license" file accompanying this file. This file is
	                                                                                                                                                           * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
	                                                                                                                                                           * CONDITIONS OF ANY KIND, express or implied. See the License
	                                                                                                                                                           * for the specific language governing permissions and
	                                                                                                                                                           * limitations under the License.
	                                                                                                                                                           */

	/** @class */
	var CognitoUserPool = function () {
	  /**
	   * Constructs a new CognitoUserPool object
	   * @param {object} data Creation options.
	   * @param {string} data.UserPoolId Cognito user pool id.
	   * @param {string} data.ClientId User pool application client id.
	   * @param {object} data.Storage Optional storage object.
	   */
	  function CognitoUserPool(data) {
	    _classCallCheck(this, CognitoUserPool);

	    var _ref = data || {},
	        UserPoolId = _ref.UserPoolId,
	        ClientId = _ref.ClientId,
	        endpoint = _ref.endpoint;

	    if (!UserPoolId || !ClientId) {
	      throw new Error('Both UserPoolId and ClientId are required.');
	    }
	    if (!/^[\w-]+_.+$/.test(UserPoolId)) {
	      throw new Error('Invalid UserPoolId format.');
	    }
	    var region = UserPoolId.split('_')[0];

	    this.userPoolId = UserPoolId;
	    this.clientId = ClientId;

	    this.client = new _cognitoidentityserviceprovider2.default({ apiVersion: '2016-04-19', region: region, endpoint: endpoint });

	    this.storage = data.Storage || new _StorageHelper2.default().getStorage();
	  }

	  /**
	   * @returns {string} the user pool id
	   */


	  CognitoUserPool.prototype.getUserPoolId = function getUserPoolId() {
	    return this.userPoolId;
	  };

	  /**
	   * @returns {string} the client id
	   */


	  CognitoUserPool.prototype.getClientId = function getClientId() {
	    return this.clientId;
	  };

	  /**
	   * @typedef {object} SignUpResult
	   * @property {CognitoUser} user New user.
	   * @property {bool} userConfirmed If the user is already confirmed.
	   */
	  /**
	   * method for signing up a user
	   * @param {string} username User's username.
	   * @param {string} password Plain-text initial password entered by user.
	   * @param {(AttributeArg[])=} userAttributes New user attributes.
	   * @param {(AttributeArg[])=} validationData Application metadata.
	   * @param {nodeCallback<SignUpResult>} callback Called on error or with the new user.
	   * @returns {void}
	   */


	  CognitoUserPool.prototype.signUp = function signUp(username, password, userAttributes, validationData, callback) {
	    var _this = this;

	    this.client.makeUnauthenticatedRequest('signUp', {
	      ClientId: this.clientId,
	      Username: username,
	      Password: password,
	      UserAttributes: userAttributes,
	      ValidationData: validationData
	    }, function (err, data) {
	      if (err) {
	        return callback(err, null);
	      }

	      var cognitoUser = {
	        Username: username,
	        Pool: _this,
	        Storage: _this.storage
	      };

	      var returnData = {
	        user: new _CognitoUser2.default(cognitoUser),
	        userConfirmed: data.UserConfirmed,
	        userSub: data.UserSub
	      };

	      return callback(null, returnData);
	    });
	  };

	  /**
	   * method for getting the current user of the application from the local storage
	   *
	   * @returns {CognitoUser} the user retrieved from storage
	   */


	  CognitoUserPool.prototype.getCurrentUser = function getCurrentUser() {
	    var lastUserKey = 'CognitoIdentityServiceProvider.' + this.clientId + '.LastAuthUser';

	    var lastAuthUser = this.storage.getItem(lastUserKey);
	    if (lastAuthUser) {
	      var cognitoUser = {
	        Username: lastAuthUser,
	        Pool: this,
	        Storage: this.storage
	      };

	      return new _CognitoUser2.default(cognitoUser);
	    }

	    return null;
	  };

	  return CognitoUserPool;
	}();

	exports.default = CognitoUserPool;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _AuthenticationDetails = __webpack_require__(13);

	Object.defineProperty(exports, 'AuthenticationDetails', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_AuthenticationDetails).default;
	  }
	});

	var _AuthenticationHelper = __webpack_require__(2);

	Object.defineProperty(exports, 'AuthenticationHelper', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_AuthenticationHelper).default;
	  }
	});

	var _CognitoAccessToken = __webpack_require__(4);

	Object.defineProperty(exports, 'CognitoAccessToken', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CognitoAccessToken).default;
	  }
	});

	var _CognitoIdToken = __webpack_require__(5);

	Object.defineProperty(exports, 'CognitoIdToken', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CognitoIdToken).default;
	  }
	});

	var _CognitoRefreshToken = __webpack_require__(6);

	Object.defineProperty(exports, 'CognitoRefreshToken', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CognitoRefreshToken).default;
	  }
	});

	var _CognitoUser = __webpack_require__(7);

	Object.defineProperty(exports, 'CognitoUser', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CognitoUser).default;
	  }
	});

	var _CognitoUserAttribute = __webpack_require__(8);

	Object.defineProperty(exports, 'CognitoUserAttribute', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CognitoUserAttribute).default;
	  }
	});

	var _CognitoUserPool = __webpack_require__(14);

	Object.defineProperty(exports, 'CognitoUserPool', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CognitoUserPool).default;
	  }
	});

	var _CognitoUserSession = __webpack_require__(9);

	Object.defineProperty(exports, 'CognitoUserSession', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CognitoUserSession).default;
	  }
	});

	var _DateHelper = __webpack_require__(10);

	Object.defineProperty(exports, 'DateHelper', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_DateHelper).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ })
/******/ ])
});
;