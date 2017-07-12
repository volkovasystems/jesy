/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "jesy",
			"path": "jesy/jesy.js",
			"file": "jesy.js",
			"module": "jesy",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/jesy.git",
			"test": "jesy-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Apply calcify on JSON file.
	@end-module-documentation

	@include:
		{
			"depher": "depher",
			"falzy": "falzy",
			"jersy": "jersy",
			"persy": "persy",
			"shft": "shft",
			"zelf": "zelf"
		}
	@end-include
*/

const depher = require( "depher" );
const falzy = require( "falzy" );
const jersy = require( "jersy" );
const persy = require( "persy" );
const shft = require( "shft" );
const zelf = require( "zelf" );

const JSON_FILE_PATTERN = /\.json$/;

const jesy = function jesy( path, rename, synchronous ){
	/*;
		@meta-configuration:
			{
				"path:required": "string",
				"rename": "string",
				"synchronous": "boolean"
			}
		@end-meta-configuration
	*/

	if( falzy( path ) || typeof path != "string" ){
		throw new Error( "invalid path" );
	}

	if( !JSON_FILE_PATTERN.test( path ) ){
		path = `${ path }.json`;
	}

	let parameter = shft( arguments );

	rename = depher( parameter, STRING, path );

	if( !JSON_FILE_PATTERN.test( rename ) ){
		rename = `${ rename }.json`;
	}

	synchronous = depher( parameter, BOOLEAN, false );

	if( synchronous ){
		let file = { };

		try{
			file = jersy( path, true );

		}catch( error ){
			throw new Error( `cannot read json file, ${ error.stack }` );
		}

		try{
			return persy( rename, file, true );

		}catch( error ){
			throw new Error( `cannot persist json file, ${ error.stack }` );
		}

	}else{
		let catcher = jersy.bind( zelf( this ) )( path )
			.then( function done( error, file ){
				if( error instanceof Error ){
					return catcher.pass( new Error( `cannot read json file, ${ error.stack }` ), false );
				}

				return persy( rename, file )( function done( error, result ){
					if( error instanceof Error ){
						return catcher.pass( new Error( `cannot persist json file, ${ error.stack }` ), false );
					}

					return catcher.pass( null, result );
				} );
			} );

		return catcher;
	}
};

module.exports = jesy;
