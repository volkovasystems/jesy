
const assert = require( "assert" );
const fs = require( "fs" );
const jesy = require( "./jesy.js" );

assert.equal( jesy( "./sample.json", "./test.json", true ), true, "should be equal" );

fs.unlinkSync( "./test.json" );

jesy( "./sample.json", "./test.json" )( function done( error, result ){
	assert.equal( result, true, "should be equal" );

	fs.unlinkSync( "./test.json" );

	console.log( "ok" );
} );
