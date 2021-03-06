
//${CONFIG_BEGIN}
CFG_BINARY_FILES="*.bin|*.dat|*.ico";
CFG_BRL_DATABUFFER_IMPLEMENTED="1";
CFG_BRL_OS_IMPLEMENTED="1";
CFG_BRL_STREAM_IMPLEMENTED="1";
CFG_BRL_THREAD_IMPLEMENTED="1";
CFG_CD="";
CFG_CONFIG="release";
CFG_HOST="winnt";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_JSTOOL_STANDALONE="1";
CFG_LANG="js";
CFG_MODPATH="";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_SAFEMODE="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json|*.monkey|*.js|*.dir|*.html|*.MONKEY|*.TXT";
CFG_VIRTUALOS_CARE_ABOUT_SIZES="1";
CFG_VIRTUALOS_EXTENSION_DL="1";
CFG_VIRTUALOS_EXTENSION_NATIVE_RECURSION="1";
CFG_VIRTUALOS_EXTENSION_REMOTEPATH="1";
CFG_VIRTUALOS_EXTENSION_UNSAFE_LOADARRAY="1";
CFG_VIRTUALOS_EXTENSION_VFILE="1";
CFG_VIRTUALOS_FLAG_OS="1";
CFG_VIRTUALOS_IMPLEMENTED="1";
CFG_VIRTUALOS_JS_TARGET="1";
CFG_VIRTUALOS_MAP_ENV="1";
CFG_VIRTUALOS_STANDALONE="1";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[modules/mojo/data/mojo_font.png];type=image/png;width=864;height=13;\n";
//${METADATA_END}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

var dbg_index=0;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	if( !err_info.length ) return "";
	var str=err_info+"\n";
	for( var i=err_stack.length-1;i>0;--i ){
		str+=err_stack[i]+"\n";
	}
	return str;
}

function print( str ){
	var cons=document.getElementById( "GameConsole" );
	if( cons ){
		cons.value+=str+"\n";
		cons.scrollTop=cons.scrollHeight-cons.clientHeight;
	}else if( window.console!=undefined ){
		window.console.log( str );
	}
	return 0;
}

function alertError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	alert( "Monkey Runtime Error : "+err.toString()+"\n\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function debugLog( str ){
	if( window.console!=undefined ) window.console.log( str );
}

function debugStop(){
	debugger;	//	error( "STOP" );
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_charCodeAt( str,index ){
	if( index<0 || index>=str.length ) error( "Character index out of range" );
	return str.charCodeAt( index );
}

function dbg_array( arr,index ){
	if( index<0 || index>=arr.length ) error( "Array index out of range" );
	dbg_index=index;
	return arr;
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_startswith( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_endswith( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_tochars( str ){
	var arr=new Array( str.length );
	for( var i=0;i<str.length;++i ) arr[i]=str.charCodeAt(i);
	return arr;
}

function string_fromchars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

function ThrowableObject(){
}

ThrowableObject.prototype.toString=function(){ 
	return "Uncaught Monkey Exception"; 
}


// This is called initially by the default template html-file.
// Don't bother if you intend to pass arguments with JavaScript or Monkey code.
function __monkey_jstool_exec()
{
	if (typeof CFG_JSTOOL_STANDALONE == 'undefined' || !CFG_JSTOOL_STANDALONE)
	{
		executeMonkey(null);
	}
}

// The following variables are global, and could be misleading under certain bootstrapping conditions.

// Constant variable(s):

// This is used to check if a 'jstool' program has been loaded.
var __monkey_jstool = true;

// Global variable(s) (Read only):

// This describes if a compiled Monkey program has been run at least once (Safely).
var __monkey_jstool_has_run_once = false;

// Functions:

// This begins the compiled Monkey program, using the arguments specified (If any).
function executeMonkey(appArgs)
{
	if ((typeof CFG_VIRTUALOS_IMPLEMENTED !== 'undefined') && __os_appargs != null)
	{
		__os_appargs = appArgs;
	}
	
	if (typeof CFG_CONFIG !== 'undefined' && CFG_CONFIG === "debug")
	{
		try
		{
			__monkey_begin();
		}
		catch( ex )
		{
			if (ex != null)
			{
				alert("EXCEPTION CAUGHT: " + ex + " (" + ex.fileName + ":" + ex.lineNumber + ")");
				
				throw ex;
			}
			
			return;
		}
	}
	else
	{
		__monkey_begin();
	}
	
	__monkey_jstool_has_run_once = true;
	
	return;
}

// Please call 'executeMonkey' instead of this.
function __monkey_begin()
{
	bbInit();
	bbMain();
	
	return;
}


function BBThread(){
	this.result=null;
	this.running=false;
}

BBThread.prototype.Start=function(){
	this.result=null;
	this.running=true;
	this.Run__UNSAFE__();
}

BBThread.prototype.IsRunning=function(){
	return this.running;
}

BBThread.prototype.Result=function(){
	return this.result;
}

BBThread.prototype.Run__UNSAFE__=function(){
	this.running=false;
}


function BBDataBuffer(){
	this.arrayBuffer=null;
	this.length=0;
}

BBDataBuffer.tbuf=new ArrayBuffer(4);
BBDataBuffer.tbytes=new Int8Array( BBDataBuffer.tbuf );
BBDataBuffer.tshorts=new Int16Array( BBDataBuffer.tbuf );
BBDataBuffer.tints=new Int32Array( BBDataBuffer.tbuf );
BBDataBuffer.tfloats=new Float32Array( BBDataBuffer.tbuf );

BBDataBuffer.prototype._Init=function( buffer ){
	this.arrayBuffer=buffer;
	this.length=buffer.byteLength;
	this.bytes=new Int8Array( buffer );	
	this.shorts=new Int16Array( buffer,0,this.length/2 );	
	this.ints=new Int32Array( buffer,0,this.length/4 );	
	this.floats=new Float32Array( buffer,0,this.length/4 );
}

BBDataBuffer.prototype._New=function( length ){
	if( this.arrayBuffer ) return false;
	
	var buf=new ArrayBuffer( length );
	if( !buf ) return false;
	
	this._Init( buf );
	return true;
}

BBDataBuffer.prototype._Load=function( path ){
	if( this.arrayBuffer ) return false;
	
	var buf=BBGame.Game().LoadData( path );
	if( !buf ) return false;
	
	this._Init( buf );
	return true;
}

BBDataBuffer.prototype._LoadAsync=function( path,thread ){

	var buf=this;
	
	var xhr=new XMLHttpRequest();
	xhr.open( "GET",BBGame.Game().PathToUrl( path ),true );
	xhr.responseType="arraybuffer";
	
	xhr.onload=function(e){
		if( this.status==200 || this.status==0 ){
			buf._Init( xhr.response );
			thread.result=buf;
		}
		thread.running=false;
	}
	
	xhr.onerror=function(e){
		thread.running=false;
	}
	
	xhr.send();
}


BBDataBuffer.prototype.GetArrayBuffer=function(){
	return this.arrayBuffer;
}

BBDataBuffer.prototype.Length=function(){
	return this.length;
}

BBDataBuffer.prototype.Discard=function(){
	if( this.arrayBuffer ){
		this.arrayBuffer=null;
		this.length=0;
	}
}

BBDataBuffer.prototype.PokeByte=function( addr,value ){
	this.bytes[addr]=value;
}

BBDataBuffer.prototype.PokeShort=function( addr,value ){
	if( addr&1 ){
		BBDataBuffer.tshorts[0]=value;
		this.bytes[addr]=BBDataBuffer.tbytes[0];
		this.bytes[addr+1]=BBDataBuffer.tbytes[1];
		return;
	}
	this.shorts[addr>>1]=value;
}

BBDataBuffer.prototype.PokeInt=function( addr,value ){
	if( addr&3 ){
		BBDataBuffer.tints[0]=value;
		this.bytes[addr]=BBDataBuffer.tbytes[0];
		this.bytes[addr+1]=BBDataBuffer.tbytes[1];
		this.bytes[addr+2]=BBDataBuffer.tbytes[2];
		this.bytes[addr+3]=BBDataBuffer.tbytes[3];
		return;
	}
	this.ints[addr>>2]=value;
}

BBDataBuffer.prototype.PokeFloat=function( addr,value ){
	if( addr&3 ){
		BBDataBuffer.tfloats[0]=value;
		this.bytes[addr]=BBDataBuffer.tbytes[0];
		this.bytes[addr+1]=BBDataBuffer.tbytes[1];
		this.bytes[addr+2]=BBDataBuffer.tbytes[2];
		this.bytes[addr+3]=BBDataBuffer.tbytes[3];
		return;
	}
	this.floats[addr>>2]=value;
}

BBDataBuffer.prototype.PeekByte=function( addr ){
	return this.bytes[addr];
}

BBDataBuffer.prototype.PeekShort=function( addr ){
	if( addr&1 ){
		BBDataBuffer.tbytes[0]=this.bytes[addr];
		BBDataBuffer.tbytes[1]=this.bytes[addr+1];
		return BBDataBuffer.tshorts[0];
	}
	return this.shorts[addr>>1];
}

BBDataBuffer.prototype.PeekInt=function( addr ){
	if( addr&3 ){
		BBDataBuffer.tbytes[0]=this.bytes[addr];
		BBDataBuffer.tbytes[1]=this.bytes[addr+1];
		BBDataBuffer.tbytes[2]=this.bytes[addr+2];
		BBDataBuffer.tbytes[3]=this.bytes[addr+3];
		return BBDataBuffer.tints[0];
	}
	return this.ints[addr>>2];
}

BBDataBuffer.prototype.PeekFloat=function( addr ){
	if( addr&3 ){
		BBDataBuffer.tbytes[0]=this.bytes[addr];
		BBDataBuffer.tbytes[1]=this.bytes[addr+1];
		BBDataBuffer.tbytes[2]=this.bytes[addr+2];
		BBDataBuffer.tbytes[3]=this.bytes[addr+3];
		return BBDataBuffer.tfloats[0];
	}
	return this.floats[addr>>2];
}


function BBStream(){
}

BBStream.prototype.Eof=function(){
	return 0;
}

BBStream.prototype.Close=function(){
}

BBStream.prototype.Length=function(){
	return 0;
}

BBStream.prototype.Position=function(){
	return 0;
}

BBStream.prototype.Seek=function( position ){
	return 0;
}

BBStream.prototype.Read=function( buffer,offset,count ){
	return 0;
}

BBStream.prototype.Write=function( buffer,offset,count ){
	return 0;
}


/*
	META:
		Native 'Storage' format: String
		Native 'Storage' object: 'localStorage'
*/

// Constant variable(s):

// File-type macros:
var FILETYPE_NONE = 0;
var FILETYPE_FILE = 1;
var FILETYPE_DIR = 2;

// File-time macro(s):
var FILETIME_NONE = 0; // -1

// Internal:

// All symbols must start with this prefix.
var __os_symbol_prefix = "||";

// Accessor symbols:
var __os_version_symbol = "||__os_version||";

var __os_filesystem_type_symbol = "||__os_filesystem_type||";
var __os_filesystem_time_map_symbol = "||__os_filesystem_time_map||";
var __os_filesystem_time_map_toggle_symbol = "||__os_filesystem_time_map_toggle||"

// Content symbols:
var __os_directory_symbol = "||DIR||"; // "//"
var __os_emptyFile_symbol = "||EMPTY||"; // "/|E"

// File-system types:
var FILESYSTEM_ENCODING_STRING = 0;
var FILESYSTEM_ENCODING_BASE64 = 1;

/*
	Due to the limitations of 'Storage' objects, 'ArrayBuffer' objects
	may not be used with the file APIs. In other words, they can only
	be used with custom containers. Since this is the case, multi-session
	storage is unavailable for this representation.
*/

var FILESYSTEM_ENCODING_ARRAYBUFFER = 2;

// This acts as the default encoding scheme for file-systems.
var FILESYSTEM_ENCODING_DEFAULT = FILESYSTEM_ENCODING_STRING; // FILESYSTEM_ENCODING_ARRAYBUFFER // FILESYSTEM_ENCODING_BASE64;

// Global variable(s):

// This is used when '__os_getVersion' assigns the internal version. (When one isn't found)
var __os_default_version = 4;

// This is used to supply arguments to the application.
var __os_appargs = [];

// This is used to keep track of the current directory.
var __os_currentdir = "";

// This specifies the default storage.
var __os_storage = localStorage; // {}; // sessionStorage;

// This states if '__os_storage' is a known source (Global 'Storage' object).
var __os_storage_is_known_source = true; // false; // true;

// This states if all known sources should be checked when performing abstract file-operations.
// This should only be enabled when using a known source for storage.
var __os_storage_all_sources = false; // __os_storage_is_known_source; // true;

// This holds this document's loaded URIs. For details, see: '__os_allocateResource'.
var __os_resources = {};

// If enabled, this will keep track of invalid remote paths.
var __os_should_log_remote_file_responses = true;

// This stores remote file-responses if '__os_should_log_remote_file_responses' is enabled.
// This has no long-term storage guarantee.
var __os_remote_file_responses = {};

/*
	A path-map of known file-times.
	Ideally, this should be loaded before use.
	For details, see: '__os_load_filesystem_time_map'.
	
	When you want to store this map for
	storage-defined durations, use '__os_save_filesystem_time_map'.
*/

var __os_filesystem_time_map = {};

// This is used to force re-downloads of remote files.
var __os_badcache = false;

// This is used internally when an unsafe operation is applied.
// If this is 'false', fallback behavior may be used implicitly.
var __os_safe = true; // false;

// This is used to generate handles to resources.
var __os_resource_generator = window.URL || window.webkitURL;

// Functions:

// Meta:

// This retrieves the internal version of this module.
// If a version number wasn't supplied, one will be assigned.
// To disable such behavior, set 'force_stop_assignment' to 'true'.
function __os_getVersion(force_stop_assignment) //force_stop_assignment=false
{
	if (__os_storage.hasOwnProperty(__os_version_symbol))
	{
		return Number(__os_storage[__os_version_symbol]);
	}
	
	if (!force_stop_assignment)
	{
		__os_setVersion(__os_default_version, false);
		
		return __os_default_version;
	}
	
	return __os_default_version; // OS_VERSION_NOT_FOUND;
}

// Please do not call this function. It will be handled automatically by '__os_getVersion'.
// The return value of this function indicates the success of the operation.
function __os_setVersion(versionNumber, safety) //safety=false
{
	if (safety && __os_storage.hasOwnProperty(__os_version_symbol))
	{
		return false;
	}
	
	__os_storage[__os_version_symbol] = versionNumber;
	
	// Return the default response.
	return true;
}

// If '__os_should_log_remote_file_responses' is true,
// this will mark 'url' with 'value' using '__os_remote_file_responses'.
function __os_mark_remote_file(url, value)
{
	if (__os_should_log_remote_file_responses)
	{
		__os_remote_file_responses[url] = value;
		
		return true;
	}
	
	// Return the default response.
	return false;
}

// Conversion and storage semantics:

// Changing this on normal runtime will result in horribly undefined behavior, usually leading to corruption.
// If you wish to change the internal storage mechanism, do it before anything else.
// Transferral of containers is unsupported, and will need to be handled by the caller.
function __os_set_FileSystemContainer(container, disallowMultiSource)
{
	if (container == sessionStorage || container == localStorage)
	{
		__os_storage_is_known_source = true;
	}
	else
	{
		__os_storage_is_known_source = false;
	}
	
	if (disallowMultiSource)
	{
		__os_storage_all_sources = false;
	}
	else
	{
		__os_storage_all_sources = __os_storage_is_known_source;
	}
	
	__os_storage = container;
}

// This just returns '__os_storage'.
function __os_getFileSystemContainer()
{
	return __os_storage;
}

// This represents the native encoding scheme. (DO NOT MODIFY; see '__os_setFileSystemEncoding')
function __os_getFileSystemEncoding()
{
	if (__os_hasFileSystemEncoding())
	{
		// Unfortunately, everything is a string in 'Storage' objects.
		return Number(__os_storage[__os_filesystem_type_symbol]);
	}
	
	var type = FILESYSTEM_ENCODING_DEFAULT;
	
	__os_setFileSystemEncoding(type);
	
	return type;
}

// This checks if '__os_storage' contains '__os_filesystem_type_symbol'.
function __os_hasFileSystemEncoding()
{
	return __os_storage.hasOwnProperty(__os_filesystem_type_symbol);
}

// Changing this on normal runtime will result in horribly undefined behavior, usually leading to corruption.
// Similarly, do not change this if you're using persistent storage, like 'localStorage'.
// As a rule of thumb, if you're going to call this, do it before anything else.
// If this is not first called, it will be called internally using the default type.
function __os_setFileSystemEncoding(type)
{
	/*
		if (__os_hasFileSystemEncoding())
		{
			return false;
		}
	*/
	
	__os_storage[__os_filesystem_type_symbol] = type;
	
	// Return the default response.
	return true;
}

// This is used to toggle logging of tile-times.
//var __os_log_file_times = true

// This toggles file-time logging with the file-system.
// The return-value indicates if the value was changed or not.
function __os_set_should_log_filesystem_times(value)
{
	__os_storage[__os_filesystem_time_map_toggle_symbol] = Number(value);
	
	return value;
}

// This states if the file-system should log file-times.
function __os_get_should_log_filesystem_times()
{
	if (__os_storage.hasOwnProperty(__os_filesystem_time_map_toggle_symbol))
	{
		return Number(__os_storage[__os_filesystem_time_map_toggle_symbol]);
	}
	
	// Return the default response.
	return true;
}

// This loads the file-system's file-time data from '__os_storage', if available.
function __os_load_filesystem_time_map(keepOnFailure)
{
	var entry = __os_storage[__os_filesystem_time_map_symbol];
	
	if (entry != null)
	{
		__os_filesystem_time_map = JSON.parse(entry);
		__os_set_should_log_filesystem_times(true);
		
		return true;
	}
	
	if (!keepOnFailure)
	{
		__os_filesystem_time_map = {};
	}
	
	return false;
}

// This saves the file-system's file-time data to '__os_storage'.
function __os_save_filesystem_time_map(clearOnSave) // clearOnSave=false
{
	if (Object.keys(__os_filesystem_time_map).length > 0)
	{
		__os_storage[__os_filesystem_time_map_symbol] = JSON.stringify(__os_filesystem_time_map);
		
		if (clearOnSave)
		{
			__os_filesystem_time_map = {};
		}
		
		return true;
	}
	
	// Return the default response.
	return false;
}

function __os_enableResponseLogging(clear)
{
	__os_should_log_remote_file_responses = true;
	
	if (clear)
	{
		__os_clearLoggedResponses();
	}
}

function __os_disableResponseLogging(clear)
{
	__os_should_log_remote_file_responses = false;
	
	if (clear)
	{
		__os_clearLoggedResponses();
	}
}

function __os_clearLoggedResponses()
{
	__os_remote_file_responses = {};
}

// Implementation-level:
function __os_ArrayBuffer_To_String(rawData, chunk_size)
{
	if (rawData == null)
	{
		return null;
	}
	
	//return String.fromCharCode.apply(null, new Uint8Array(rawData));
	
	if (chunk_size == null)
	{
		chunk_size = 1024;
	}
	
	var content = ""; // new String();
	
	var bytesLeft = rawData.byteLength;
	var offset = 0;
	
	while (bytesLeft > 0)
	{
		var cycleSize = Math.min(bytesLeft, chunk_size);
		var dataView = new Uint8Array(rawData, offset, cycleSize);
		
		content += String.fromCharCode.apply(null, dataView);
		
		bytesLeft -= cycleSize;
		offset += cycleSize;
	}
	
	return content;
}

function __os_String_To_ArrayBuffer(str)
{
	if (str == null)
	{
		return null;
	}
	
	var buf = new ArrayBuffer(str.length);
	var bufView = new Uint8Array(buf);
	
	for (var i = 0, strLen = str.length; i < strLen; i++)
	{
		bufView[i] = (str.charCodeAt(i)); // [i] // & 0xFF;
	}
	
	return buf;
}

function __os_Base64_To_String(base64)
{
	if (base64 == null)
	{
		return null;
	}
	
	var x = atob(base64);
	var y = escape(x);
	
	try
	{
		return decodeURIComponent(y); // window.atob(..);
	}
	catch (ex)
	{
		return x; // y;
	}
}

function __os_String_To_Base64(str)
{
	if (str == null)
	{
		return null;
	}
	
	try
	{
		return btoa(str); // window.btoa(..);
	}
	catch (ex)
	{
		var a = encodeURIComponent(str);
		var b = unescape(a);
		
		return btoa(b); // window.btoa(..);
	}
}

// Redirection-level:
function __os_Base64_To_ArrayBuffer(base64)
{
	if (base64 == null)
	{
		return null;
	}
	
	return __os_String_To_ArrayBuffer(__os_Base64_To_String(base64)); // atob(base64);
}

function __os_ArrayBuffer_To_Base64(rawData)
{
	if (rawData == null)
	{
		return null;
	}
	
	return __os_String_To_Base64(__os_ArrayBuffer_To_String(rawData));
}

// Abstraction layer:
function __os_nativeSize(nativeData)
{
	switch (__os_getFileSystemEncoding())
	{
		case FILESYSTEM_ENCODING_STRING:
			return nativeData.length;
		case FILESYSTEM_ENCODING_ARRAYBUFFER:
			return nativeData.byteLength;
		case FILESYSTEM_ENCODING_BASE64:
			if (CFG_VIRTUALOS_CARE_ABOUT_SIZES !== undefined)
			{
				// This is horribly slow, but the only way to do this accurately.
				return __os_Native_To_String(nativeData).length;
			}
			
			return nativeData.length;
	}
}

function __os_nativeEmpty()
{
	switch (__os_getFileSystemEncoding())
	{
		case FILESYSTEM_ENCODING_ARRAYBUFFER:
			return null; // new ArrayBuffer();
		case FILESYSTEM_ENCODING_STRING:
		case FILESYSTEM_ENCODING_BASE64:
			return "";
	}
}

function __os_Native_To_String(nativeData)
{
	switch (__os_getFileSystemEncoding())
	{
		case FILESYSTEM_ENCODING_STRING:
			return nativeData;
		case FILESYSTEM_ENCODING_ARRAYBUFFER:
			return __os_ArrayBuffer_To_String(nativeData);
		case FILESYSTEM_ENCODING_BASE64:
			return __os_Base64_To_String(nativeData);
	}
}

function __os_Native_To_ArrayBuffer(nativeData)
{
	switch (__os_getFileSystemEncoding())
	{
		case FILESYSTEM_ENCODING_STRING:
			return __os_String_To_ArrayBuffer(nativeData);
		case FILESYSTEM_ENCODING_ARRAYBUFFER:
			return nativeData;
		case FILESYSTEM_ENCODING_BASE64:
			return __os_Base64_To_ArrayBuffer(nativeData);
	}
}

function __os_Native_To_Base64(nativeData)
{
	switch (__os_getFileSystemEncoding())
	{
		case FILESYSTEM_ENCODING_STRING:
			return __os_String_To_Base64(nativeData);
		case FILESYSTEM_ENCODING_ARRAYBUFFER:
			return __os_ArrayBuffer_To_Base64(nativeData);
		case FILESYSTEM_ENCODING_BASE64:
			return nativeData;
	}
}

function __os_String_To_Native(str)
{
	switch (__os_getFileSystemEncoding())
	{
		case FILESYSTEM_ENCODING_STRING:
			return str;
		case FILESYSTEM_ENCODING_ARRAYBUFFER:
			return __os_String_To_ArrayBuffer(str);
		case FILESYSTEM_ENCODING_BASE64:
			return __os_String_To_Base64(str);
	}
}

function __os_ArrayBuffer_To_Native(rawData)
{
	switch (__os_getFileSystemEncoding())
	{
		case FILESYSTEM_ENCODING_STRING:
			return __os_ArrayBuffer_To_String(rawData);
		case FILESYSTEM_ENCODING_ARRAYBUFFER:
			return rawData;
		case FILESYSTEM_ENCODING_BASE64:
			return __os_ArrayBuffer_To_Base64(rawData);
	}
}

function __os_Base64_To_Native(base64)
{
	// Make sure there's no URI header.
	base64 = __os_stripURIHeader(base64);
	
	switch (__os_getFileSystemEncoding())
	{
		case FILESYSTEM_ENCODING_STRING:
			return __os_Base64_To_String(base64);
		case FILESYSTEM_ENCODING_ARRAYBUFFER:
			return __os_Base64_To_ArrayBuffer(base64);
		case FILESYSTEM_ENCODING_BASE64:
			return base64;
	}
}

// This "strips" the URI header (If present) from 'base64'.
function __os_stripURIHeader(base64)
{
	//return base64;
	
	var clipPoint = base64.indexOf(",");
	
	if (clipPoint != -1)
	{
		return base64.substring(clipPoint+1); // ..
	}
	
	return base64;
}

// Extensions:

// This copies the global 'os' context of the 'parent' environment.
function __os_inheritParent()
{
	//__os_appargs = parent.__os_appargs.slice();
	__os_currentdir = parent.__os_currentdir;
	__os_storage = parent.__os_storage;
	
	__os_safe = parent.__os_safe;
	
	__os_storage_is_known_source = parent.__os_storage_is_known_source;
	__os_storage_all_sources = parent.__os_storage_all_sources;
	
	__os_should_log_remote_file_responses = parent.__os_should_log_remote_file_responses;
	__os_remote_file_responses = parent.__os_remote_file_responses;
	
	__os_filesystem_time_map = parent.__os_filesystem_time_map;
	
	//__os_resource_generator = parent.__os_resource_generator;
	//__os_badcache = parent.__os_badcache;
}

// Capitalized to ensure association ('AppArgs' command).
function __os_set_AppArgs(args)
{
	__os_appargs = args
}

// This gets the file-time of 'realPath'.
function __os_get_FileTime(realPath)
{
	if (__os_filesystem_time_map.hasOwnProperty(realPath))
	{
		return __os_filesystem_time_map[realPath];
	}
	
	// Return the default response.
	return FILETIME_NONE;
}

// This sets the file-time of 'realPath' using 'time'.
// If the operation could not be performed, and/or
// 'time' is 'FILETIME_NONE', this will return 'false'.
function __os_set_FileTime(realPath, time)
{
	if (time == FILETIME_NONE)
	{
		return false;
	}
	
	/*
		if (!fileTimesEnabled)
		{
			return false;
		}
	*/
	
	__os_filesystem_time_map[realPath] = time;
	
	// Return the default response.
	return true;
}

// This removes a time-data entry from the file-system. (Use at your own risk)
function __os_remove_FileTime(realPath)
{
	delete __os_filesystem_time_map[realPath];
}

// This function is highly unsafe, and should be avoided, unless you know exactly what you're doing.
function __os_clear_FileTimes()
{
	__os_filesystem_time_map = {}
}

// This DOES NOT call 'RealPath', please call that first.
// If 'RealPath' is not called first, please understand the effects (Invalid global directory).
function __os_toRemotePath(realPath)
{
	var url = window.location.href; // document.URL;
	
	var start = url.indexOf("//");
	
	if (start == -1)
	{
		start = 0;
	}
	else
	{
		start += 2;
	}
	
	var output = url.substring(0, url.indexOf("/", start));
	
	if (realPath.indexOf("/") != 0)
	{
		output += "/";
	}
	
	return (output + realPath);
}

// This downloads from 'url', and returns the file's data.
// If no file was found, the return-value is undefined.
function __os_download(url, lastTime, out_ext) // lastTime=null
{
	var rawData = __os_download_as_string(url, lastTime, out_ext); // __os_download_raw(url, lastTime);
	
	if (rawData == null)
	{
		return null;
	}
	
	return __os_String_To_Native(rawData);
}

function __os_download_as_string(url, lastTime, out_ext) // lastTime=null
{
	return __os_download_raw(url, lastTime, out_ext);
}

function __os_download_raw(url, lastTime, out_ext) // lastTime=null
{
	if (__os_should_log_remote_file_responses)
	{
		if (__os_remote_file_responses.hasOwnProperty(url))
		{
			if (__os_badcache)
			{
				delete __os_remote_file_responses[url]
			}
			else
			{
				if (!__os_remote_file_responses[url])
				{
					return null;
				}
			}
		}
	}
	
	var xhr = new XMLHttpRequest();
	
	try
	{
		xhr.open("GET", url, false); // "HEAD"
		
		//xhr.overrideMimeType('text/plain');
		//xhr.overrideMimeType("application/octet-stream");
		xhr.overrideMimeType("text/plain ; charset=x-user-defined");
		
		if (lastTime != null && lastTime != FILETIME_NONE)
		{
			if (isNaN())
			{
				xhr.setRequestHeader("If-None-Match", lastTime);
			}
			else
			{
				var date = new Date(lastTime * 1000); // <-- May or may not actually be needed.
				var converted_date = date.toString();
				
				xhr.setRequestHeader("If-Modified-Since", converted_date);
			}
		}
		else
		{
			xhr.setRequestHeader("Cache-Control", "no-cache");
			xhr.setRequestHeader("Pragma", "no-cache");
			xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
		}
		
		//xhr.setRequestHeader("Cache-Control", "must-revalidate");
		
		xhr.send(null);
		
		// Check if 'out_ext' was defined:
		if (out_ext !== undefined)
		{
			var lastModified = xhr.getResponseHeader("Last-Modified");
			
			if (lastModified)
			{
				out_ext[0] = Date.parse(lastModified); // out_ext.push(..);
			}
			else
			{
				var eTag = xhr.getResponseHeader("ETag");
				
				if (eTag)
				{
					var value = eTag.replace(/['"']+/g, "");
					
					if (isNaN(value))
					{
						out_ext[0] = value;
					}
					else
					{
						var ivalue = Number(value);
						
						out_ext[0] = (ivalue);
					}
				}
				else
				{
					out_ext[0] = FILETIME_NONE; // out_ext.push(..);
				}
			}
		}
		
		switch (xhr.status)
		{
			case 304:
				__os_mark_remote_file(url, true);
				
				return null;
			case 0:
			case 200:
				__os_mark_remote_file(url, true);
				
				return xhr.responseText; break; // xhr.response;
		}
	}
	catch (ex)
	{
		// Nothing so far.
	}
	
	if (!__os_badcache)
	{
		__os_mark_remote_file(url, false);
	}
}

// This downloads a file from 'url' and represents it with 'rep'.
function __os_downloadFileUsingRep(storage, url, rep, isEmpty) // isEmpty=false
{
	var repValue = storage[rep];
	
	if
	(
		(((isEmpty || repValue == __os_emptyFile_symbol) || repValue == null) && __os_should_log_remote_file_responses && !__os_remote_file_responses.hasOwnProperty(url))
		||
		(__os_badcache)
	)
	{
		var fileTimesEnabled = __os_get_should_log_filesystem_times();
		
		var data;
		
		if (fileTimesEnabled)
		{
			var out = [FILETIME_NONE]; // <-- Just to be safe.
			var currentFileTime = __os_get_FileTime(rep);
			
			data = __os_download(url, currentFileTime, out);
			
			if (data != null)
			{
				if (out.length > 0)
				{
					if (out[0] != FILETIME_NONE)
					{
						__os_set_FileTime(rep, out[0]);
					}
				}
			}
		}
		else
		{
			data = __os_download(url);
		}
		
		// Make sure we have data to work with:
		if (data != null)
		{
			// Build a file-entry for this element.
			if (__os_createFileEntryWith(storage, rep, data, true)) // false
			{
				// Return the raw data we loaded.
				return data;
			}
		}
	}
	
	return repValue;
}

// This converts 'realPath' into a url, and represents the enclosed data with 'realPath'. (Calls 'downloadFileFrom')
function __os_downloadFile(storage, realPath, isEmpty) // isEmpty=false
{
	return __os_downloadFileUsingRep(storage, __os_toRemotePath(realPath), realPath, isEmpty);
}

function __os_LoadNative(realPath)
{
	var out = __os_getFile(realPath);
	
	if (out == __os_directory_symbol)
	{
		return null;
	}
	
	return out;
}

// This provides an array of (Signed) 8-bit integers ('Int8Array').
function __os_LoadArray(realPath)
{
	var rawData = __os_Native_To_ArrayBuffer(__os_LoadNative(realPath));
	
	return new Int8Array(rawData);
}

// This specifies if this browser supports native file storage.
function __os_storageSupported()
{
	return (typeof(Storage) !== "undefined"); // true;
}

// This fixes uses of ".." in paths. (Partially unsafe)
function __os_fixDir(exactPath)
{
	var final = exactPath;
	
	while (true)
	{
		var index = final.indexOf("/..");
		
		if (index == -1)
		{
			break;
		}
		
		var x = final.substring(0, index);
		var y = final.substring(0, x.lastIndexOf("/", index));
		var z = y + final.substring(index+3)
		
		final = z;
	}
	
	return final;
}

function __os_globalDir()
{
	var page = window.location.pathname;
	
	var lastSlash = page.lastIndexOf("/");
	
	return page.substring(0, lastSlash); // "data"
}

// This checks if a file at 'realPath' could exist in the current virtual file-system.
function __os_fileCouldExist(realPath, checkType)
{
	// Since we don't have an entry, check this file's parent directory.
	// If it exists, then we know it could be a valid file.
	if (__os_storageLookup(realPath.substring(0, realPath.lastIndexOf("/"))) != null)
	{
		if (checkType)
		{
			if (!__os_testSupportedFiles(realPath.toLowerCase()))
			{
				return false;
			}
		}
		
		return true;
	}
	
	return false;
}

// This checks if any of the 'types' specified match 'lCasePath'. (Used internally)
function __os_supportedFile(lCasePath, data)
{
	var types = data.split("|");
	
	var extensionSeparator = ".";
	
	for (var i = 0; i < types.length; i++)
	{
		var fileType = types[i];
		var separatorPos = fileType.lastIndexOf(extensionSeparator);
		
		if (separatorPos == -1)
		{
			continue;
		}
		
		fileType = fileType.substring(separatorPos).toLowerCase(); // ..
		
		if (lCasePath.endsWith(fileType))
		{
			return fileType.substring(1); // .. // true;
		}
	}
	
	// Return the default response.
	return null; // false;
}

// This checks if any of the pre-defined supported file-types match 'lCasePath'. (Used internally)
function __os_testSupportedFiles(lCasePath)
{
	// Currently pre-determined types; may be changed later:
	if (__os_supportedFile(lCasePath, CFG_IMAGE_FILES)) return true;
	if (__os_supportedFile(lCasePath, CFG_TEXT_FILES)) return true;
	if (__os_supportedFile(lCasePath, CFG_BINARY_FILES)) return true;
	if (__os_supportedFile(lCasePath, CFG_SOUND_FILES)) return true;
	if (__os_supportedFile(lCasePath, CFG_MUSIC_FILES)) return true;
	
	// Return the default response.
	return false;
}

// This checks if the file at 'realPath' is stored or not.
function __os_storageLookup(realPath)
{
	var cs = __os_storage[realPath];
	
	if (cs != null)
	{
		return cs;
	}
	
	if (__os_storage_all_sources)
	{
		if (sessionStorage != __os_storage)
		{
			var ss = sessionStorage[realPath];
			
			if (ss != null)
			{
				return ss;
			}
		}
		
		if (localStorage != __os_storage)
		{
			var ls = localStorage[realPath];
			
			if (ls != null)
			{
				return ls;
			}
		}
	}
}

function __os_createFileEntryWith(storage, rep, data, force) //force=false
{
	var currentEntry = storage[rep];
	
	if (force || (!__os_safe || currentEntry == null || currentEntry == __os_emptyFile_symbol || currentEntry == __os_nativeEmpty()))
	{
		storage[rep] = data;
		
		return true;
	}
	
	// Return the default response.
	return false;
}

function __os_createFileEntry(rep, data, isDir, force)
{
	return __os_createFileEntryWith(__os_storage, rep, data, force);
}

// This creates a "file link". "File links" are basically 'to-be-loaded'
// symbols, that the file-system uses to reduce ahead-of-time requests.
// This command is abstract from the underlying storage system.
function __os_createFileLink(rep)
{
	return __os_createFileEntry(rep, __os_emptyFile_symbol, false);
}

// This gets a file using 'realPath' from a remote host.
// If this is already present in some kind of storage, it uses the cache.
function __os_getFile(realPath, isEmpty)
{
	var f = __os_storageLookup(realPath);
	
	if (f == null || isEmpty != null || (isEmpty = (f == __os_emptyFile_symbol))) // Set 'isEmpty', and check it.
	{
		return __os_downloadFile(__os_storage, realPath, isEmpty);
	}
	
	return f;
}

// This calls '__os_deleteFileEntries' with recursion enabled. (For safety)
function __os_safelyDeleteFileEntries(realPath, isDir)
{
	return __os_deleteFileEntries(realPath, isDir, true);
}

function __os_deleteFileEntries(realPath, isDir, recursive) // isDir=false, recursive=false
{
	var response = false;
	
	var cs = __os_storage[realPath];
	
	if (cs != null)
	{
		response |= __os_removeStorageEntry(__os_storage, realPath, isDir, recursive, cs);
	}
	
	if (__os_storage_all_sources)
	{
		if (sessionStorage != __os_storage)
		{
			// Test for 'realPath', and if found, remove the element(s):
			var ss = sessionStorage[realPath];
			
			if (ss != null)
			{
				response |= __os_removeStorageEntry(sessionStorage, realPath, isDir, recursive, ss); // =
			}
		}
		
		if (localStorage != __os_storage)
		{
			var ls = localStorage[realPath];
			
			if (ls != null)
			{
				response |= __os_removeStorageEntry(localStorage, realPath, isDir, recursive, ls);
			}
		}
	}
	
	return response;
}

// This is used to remove an entry from a specific source. For a properly abstracted routine, use '__os_deleteFileEntries'.
// This returns 'false' if this is not a directory, and the element could not be deleted (Doesn't exist).
function __os_removeStorageEntry(storage, realPath, isDir, recursive, value) // isDir=undefined, recursive=false, value=null
{
	var response = false;
	
	if (value === undefined)
	{
		value = storage[realPath];
	}
	
	if (value != null)
	{
		if (typeof storage.removeItem === "function")
		{
			storage.removeItem(realPath);
		}
		else
		{
			delete storage[realPath];
		}
		
		if (isDir === undefined && value == __os_directory_symbol)
		{
			isDir = true;
		}
		
		if (!isDir)
		{
			__os_remove_FileTime(realPath);
		}
		
		response = true;
	}
	
	if (isDir)
	{
		for (var e in storage)
		{
			if (e.indexOf(realPath) == 0)
			{
				var lastSlash = e.lastIndexOf("/");
				
				// Remove only what we need to: If we're doing this
				// recursively, delete everything, but if not,
				// make sure this isn't a sub-directory:
				if ((recursive || lastSlash < realPath.length))
				{
					__os_removeStorageEntry(storage, e, undefined, recursive); // 'isDir' may need to be calculated later.
				}
			}
		}
		
		response = true;
	}
	
	return response;
}

// This removes all elements in 'storage' that start with 'prefix'. (Use at your own risk)
function __os_eliminateByPrefix(storage, prefix)
{
	for (var e in storage)
	{
		if (e.indexOf(prefix) == 0)
		{
			var lastSlash = e.lastIndexOf("/");
			
			if (lastSlash < prefix.length)
			{
				__os_removeStorageEntry(storage, e, undefined, true);
			}
		}
	}
}

// This attempts to produce a valid MIME-type for 'path'.
function __os_get_MIMEType(realPath, fallback) //fallback=false
{
	var blobType;
	
	extPos = realPath.lastIndexOf(".");
	
	if (extPos != -1)
	{
		fullExt = realPath.substring(extPos).toLowerCase(); // ..
		ext = fullExt.substring(1); // ..
	}
	else // if (ext == null)
	{
		if (fallback)
		{
			// If nothing else could be done, assume PNG:
			fullExt = ".png";
			ext = "png"; // fullExt.substring(1); // ..
		}
		else
		{
			return null;
		}
	}
	
	if (__os_supportedFile(fullExt, CFG_IMAGE_FILES))
	{
		blobType = ("image/" + ext);
	}
	else
	{
		if (__os_supportedFile(fullExt, CFG_TEXT_FILES))
		{
			blobType = "text/plain ; charset=x-user-defined"; // "text/plain";
		}
		else
		{
			if (__os_supportedFile(fullExt, CFG_BINARY_FILES))
			{
				blobType = "text/plain ; charset=x-user-defined"; // "application/octet-stream";
			}
			else
			{
				if (__os_supportedFile(fullExt, CFG_SOUND_FILES) || __os_supportedFile(fullExt, CFG_MUSIC_FILES))
				{
					blobType = "audio/";
					
					switch (ext)
					{
						case "mp3":
						case "mpeg3":
							blobType += "mpeg3";
							
							break;
						//case "wav":
						//case "ogg":
						default:
							blobType += ext;
							
							break;
					}
				}
			}
		}
	}
	
	return blobType;
}

// This looks 'realPath' up internally, and if present, generates a URI for that resource.
// This is useful for frameworks like Mojo, which normally require server-side storage mechanics.
function __os_allocateResource(realPath, fallback) //fallback=false
{
	var f = __os_storageLookup(realPath);
	
	if (f == null)
	{
		return null;
	}
	
	if (__os_resources[realPath] != null)
	{
		return __os_resources[realPath];
	}
	
	// Resolve the file-extension:
	var extPos, fullExt, ext;
	
	// Build the resource:
	var blobType = __os_get_MIMEType(realPath, fallback);
	
	if (blobType == null)
	{
		return null;
	}
	
	var rawData = __os_Native_To_ArrayBuffer(f);
	var blob = new Blob([rawData], { type: blobType });
	
	var uri = __os_obtainResource(blob);
	
	__os_resources[realPath] = uri;
	
	//__os_deallocateResource(..);
	
	return uri;
}

// This command is considered unsafe, and should only be used under controlled environments.
// The behavior of the symbolized resource is undefined after calling this.
// The 'keepEntry' argument should only be 'true' when destructing all of '__os_resources'.
function __os_deallocateResource(realPath, keepEntry) // keepEntry=false
{
	var uri = __os_resources[realPath];
	__os_revokeResource(uri);
	
	if (!keepEntry)
	{
		delete __os_resources[realPath];
	}
	
	return true;
}

// These two commands obtain and revoke/release system-resources:

// Calling this is considered unsafe, and therefore should not be
// used in conjunction with automatic resource management.
// For that, you should use '__os_allocateResource', instead.
function __os_obtainResource(blob)
{
	return __os_resource_generator.createObjectURL(blob);
}

// Calling this is considered unsafe, and therefore should not be
// used in conjunction with automatic resource management.
// For that, you should use '__os_deallocateResource', instead.
function __os_revokeResource(uri)
{
	__os_resource_generator.revokeObjectURL(uri);
}

// This is considered highly unsafe, and should only
// be used when completely sure of the consequences.
function __os_destroyResources()
{
	for (var resource in __os_resources)
	{
		__os_deallocateResource(resource, true);
	}
	
	__os_resources = {};
}

// API:

// Used internally; DO NOT change.
function HostOS()
{
	return "web";
}

// The implied path of this program. (Compiler fix)
function AppPath()
{
	var page = window.location.pathname;
	
	var lastSlash = page.lastIndexOf("/");
	
	var x = page.substring(0, Math.max(lastSlash, 1));
	
	if (x != "/" && x.length != 0)
	{
		x += "/"
	}
	
	var result = x + "data/bin/" + page.substring(lastSlash+1);
	
	return result;
	
	//return RealPath("data/bin/MonkeyGame.html"); // window.location.pathname; // __os_globalDir();
}

// The 'AppPath' (Reserved), and any argument supplied by the user.
function AppArgs()
{
	return [AppPath()].concat(__os_appargs);
}

// The "real" (Local) path of 'f'.
function RealPath(path)
{
	if (path.indexOf("/") == 0)
	{
		// Nothing so far.
	}
	else
	{
		var x = __os_currentdir;
		
		if (x.indexOf("/") == 0) // if (!path.startsWith("/"))
		{
			x = __os_globalDir() + x;
		}
		else
		{
			x = __os_globalDir() + "/" + x;
		}
		
		if ((__os_currentdir.length != 0)) // && (x.lastIndexOf("/") != (__os_currentdir.length-1))
		{
			x += "/";
		}
		
		if (path.indexOf(x) != 0)
		{
			path = (x + path);
		}
	}
	
	var result = __os_fixDir(path);
	
	return result;
}

// This attempts to recognize the "file-type" of 'path'. (Uses supported files)
function FileType(path, skip_request) //skip_request=false
{
	var realPath = RealPath(path);
	
	// Grab the local entry, if any:
	var file = __os_storageLookup(realPath);
	
	var isEmpty;
	
	if (!skip_request)
	{
		// Check if we don't have an entry to view:
		if (file == null || (isEmpty = (file == __os_emptyFile_symbol))) // Set 'isEmpty', and check it.
		{
			// Check if we could load this file using the current file-system:
			if (isEmpty || __os_fileCouldExist(realPath))
			{
				// Try to load our file from the server.
				file = __os_getFile(realPath, isEmpty);
			}
		}
	}
	
	if (file != null)
	{
		//if (__os_testSupportedFiles(realPath.toLowerCase()))
		if (file != __os_directory_symbol)
		{
			return FILETYPE_FILE;
		}
		else
		{
			return FILETYPE_DIR;
		}
	}
	
	return FILETYPE_NONE;
}

function FileTime(path)
{
	var rpath = RealPath(path);
	
	return __os_get_FileTime(rpath);
}

function FileSize(path)
{
	var rpath = RealPath(path);
	var f = __os_downloadFile(__os_storage, rpath);
	
	if (f == null || f == __os_directory_symbol)
	{
		return 0; // -1;
	}
	
	return __os_nativeSize(f);
}

function CopyFile(src, dst)
{
	var rsrc = RealPath(src);
	var f = __os_downloadFile(__os_storage, rsrc); //__os_storageLookup(rsrc);
	
	if (f == null)
	{
		return false;
	}
	
	var rdst = RealPath(dst);
	
	if (!__os_createFileEntry(rdst, f))
	{
		return false;
	}
	
	// Update this entry's file-time.
	__os_set_FileTime(rdst, __os_get_FileTime(rsrc));
	
	// Return the default response.
	return true;
}

function DeleteFile(path)
{
	return __os_deleteFileEntries(RealPath(path));
}

function LoadString(path)
{
	var nativeData = __os_LoadNative(RealPath(path));
	
	if (nativeData != null)
	{
		return __os_Native_To_String(nativeData);
	}
	
	return "";
}

function SaveString(str, path, safe) //safe=false
{
	return __os_createFileEntry(RealPath(path), __os_String_To_Native(str), false, !safe);
}

// This loads all files and folders in 'realPath' specifically.
// In other words, this isn't recursive.
function __os_loadFileStructure(realPath, storage, out)
{
	for (var key in storage)
	{
		var parentPos = key.indexOf(realPath);
		
		//if (key.startsWith(..))
		if (parentPos == 0)
		{
			var subdir = key.lastIndexOf("/");
			
			if ((realPath.length) == subdir)
			{
				out.push(key.substring(subdir+1));
			}
		}
	}
}

function LoadDir(path)
{
	switch (path)
	{
		default:
			var rp = RealPath(path);
			
			var out = [];
			
			__os_loadFileStructure(rp, __os_storage, out);
			
			if (__os_storage_all_sources)
			{
				if (sessionStorage != __os_storage)
				{
					__os_loadFileStructure(rp, localStorage, out);
				}
				
				if (localStorage != __os_storage)
				{
					__os_loadFileStructure(rp, sessionStorage, out);
				}
			}
			
			return out; break;
	}
	
	return [];
}

function CreateFile(path)
{
	return __os_createFileEntry(RealPath(path), __os_nativeEmpty());
}

function CreateDir(path)
{
	return __os_createFileEntry(RealPath(path), __os_directory_symbol, true); // <-- Prefix added for debugging purposes.
}

function DeleteDir(path, recursive) // recursive=false
{
	return __os_deleteFileEntries(RealPath(path), true, recursive);
}

// I'm unsure if this is working 100%, but it helps get transcc running:
function ChangeDir(path)
{
	var realPos = __os_globalDir();
	
	if (path.indexOf(realPos) == 0)
	{
		var newStart = realPos.length;
		
		if (path.indexOf("/") == newStart)
		{
			newStart += 1;
		}
		
		path = path.substring(newStart); // ..
	}
	
	__os_currentdir = path;
	
	var first = __os_currentdir.indexOf("/");
	var second = __os_currentdir.lastIndexOf("/");
	
	// Could be changed to boolean logic:
	if (first == 0)
	{
		first = 1;
	}
	else
	{
		first = 0;
	}
	
	if (second != __os_currentdir.length-1)
	{
		second = __os_currentdir.length;
	}
	
	__os_currentdir = __os_currentdir.substring(first, second);
	
	return __os_currentdir;
}

function CurrentDir()
{
	return __os_currentdir;
}

function Execute(cmd)
{
	if (typeof __exec == 'function')
	{
		return __exec(cmd);
	}
	
	return 1; // -1;
}

function ExitApp(retCode)
{
	alert("EXIT: " + retCode);
	
	throw null;
}


// Global variable(s):
var __monkey_DirectoryLoaded = false;

function c_WebCC(){
	Object.call(this);
	this.m_args=[];
	this.m_monkeydir="";
	this.m_opt_srcpath="";
	this.m_opt_safe=false;
	this.m_opt_clean=false;
	this.m_opt_check=false;
	this.m_opt_update=false;
	this.m_opt_build=false;
	this.m_opt_run=false;
	this.m_opt_cfgfile="";
	this.m_opt_output="";
	this.m_opt_config="";
	this.m_opt_target="";
	this.m_opt_modpath="";
	this.m_opt_builddir="";
	this.m_ANDROID_PATH="";
	this.m_ANDROID_NDK_PATH="";
	this.m_JDK_PATH="";
	this.m_ANT_PATH="";
	this.m_FLEX_PATH="";
	this.m_MINGW_PATH="";
	this.m_PSM_PATH="";
	this.m_MSBUILD_PATH="";
	this.m_HTML_PLAYER="";
	this.m_FLASH_PLAYER="";
	this.m__builders=c_StringMap3.m_new.call(new c_StringMap3);
	this.m__targets=c_StringMap6.m_new.call(new c_StringMap6);
	this.m_target=null;
}
c_WebCC.m_new=function(){
	return this;
}
c_WebCC.prototype.p_ParseArgs=function(){
	if(this.m_args.length>1){
		this.m_opt_srcpath=bb_webcc_StripQuotes(string_trim(this.m_args[this.m_args.length-1]));
	}
	for(var t_i=1;t_i<this.m_args.length-1;t_i=t_i+1){
		var t_arg=string_trim(this.m_args[t_i]);
		var t_rhs="";
		var t_j=t_arg.indexOf("=",0);
		if(t_j!=-1){
			t_rhs=bb_webcc_StripQuotes(t_arg.slice(t_j+1));
			t_arg=t_arg.slice(0,t_j);
		}
		if(t_j==-1){
			var t_1=t_arg.toLowerCase();
			if(t_1=="-safe"){
				this.m_opt_safe=true;
			}else{
				if(t_1=="-clean"){
					this.m_opt_clean=true;
				}else{
					if(t_1=="-check"){
						this.m_opt_check=true;
					}else{
						if(t_1=="-update"){
							this.m_opt_check=true;
							this.m_opt_update=true;
						}else{
							if(t_1=="-build"){
								this.m_opt_check=true;
								this.m_opt_update=true;
								this.m_opt_build=true;
							}else{
								if(t_1=="-run"){
									this.m_opt_check=true;
									this.m_opt_update=true;
									this.m_opt_build=true;
									this.m_opt_run=true;
								}else{
									bb_webcc_Die("Unrecognized command line option: "+t_arg,-1);
								}
							}
						}
					}
				}
			}
		}else{
			if(string_startswith(t_arg,"-")){
				var t_2=t_arg.toLowerCase();
				if(t_2=="-cfgfile"){
					this.m_opt_cfgfile=t_rhs;
				}else{
					if(t_2=="-output"){
						this.m_opt_output=t_rhs;
					}else{
						if(t_2=="-config"){
							this.m_opt_config=t_rhs.toLowerCase();
						}else{
							if(t_2=="-target"){
								this.m_opt_target=t_rhs;
							}else{
								if(t_2=="-modpath"){
									this.m_opt_modpath=t_rhs;
								}else{
									if(t_2=="-builddir"){
										this.m_opt_builddir=t_rhs;
									}else{
										bb_webcc_Die("Unrecognized command line option: "+t_arg,-1);
									}
								}
							}
						}
					}
				}
			}else{
				if(string_startswith(t_arg,"+")){
					bb_config_SetConfigVar2(t_arg.slice(1),t_rhs);
				}else{
					bb_webcc_Die("Command line arg error: "+t_arg,-1);
				}
			}
		}
	}
}
c_WebCC.prototype.p_LoadConfig=function(){
	var t_cfgpath=this.m_monkeydir+"/bin/";
	if((this.m_opt_cfgfile).length!=0){
		t_cfgpath=t_cfgpath+this.m_opt_cfgfile;
	}else{
		t_cfgpath=t_cfgpath+("config."+HostOS()+".txt");
	}
	if(FileType(t_cfgpath)!=1){
		bb_webcc_Die("Failed to open config file",-1);
	}
	var t_cfg=LoadString(t_cfgpath);
	var t_=t_cfg.split("\n");
	var t_2=0;
	while(t_2<t_.length){
		var t_line=t_[t_2];
		t_2=t_2+1;
		t_line=string_trim(t_line);
		if(!((t_line).length!=0) || string_startswith(t_line,"'")){
			continue;
		}
		var t_i=t_line.indexOf("=",0);
		if(t_i==-1){
			bb_webcc_Die("Error in config file, line="+t_line,-1);
		}
		var t_lhs=string_trim(t_line.slice(0,t_i));
		var t_rhs=string_trim(t_line.slice(t_i+1));
		t_rhs=bb_webcc_ReplaceEnv(t_rhs);
		var t_path=bb_webcc_StripQuotes(t_rhs);
		while(string_endswith(t_path,"/") || string_endswith(t_path,"\\")){
			t_path=t_path.slice(0,-1);
		}
		var t_3=t_lhs;
		if(t_3=="MODPATH"){
			if(!((this.m_opt_modpath).length!=0)){
				this.m_opt_modpath=t_path;
			}
		}else{
			if(t_3=="ANDROID_PATH"){
				if(!((this.m_ANDROID_PATH).length!=0) && FileType(t_path)==2){
					this.m_ANDROID_PATH=t_path;
				}
			}else{
				if(t_3=="ANDROID_NDK_PATH"){
					if(!((this.m_ANDROID_NDK_PATH).length!=0) && FileType(t_path)==2){
						this.m_ANDROID_NDK_PATH=t_path;
					}
				}else{
					if(t_3=="JDK_PATH"){
						if(!((this.m_JDK_PATH).length!=0) && FileType(t_path)==2){
							this.m_JDK_PATH=t_path;
						}
					}else{
						if(t_3=="ANT_PATH"){
							if(!((this.m_ANT_PATH).length!=0) && FileType(t_path)==2){
								this.m_ANT_PATH=t_path;
							}
						}else{
							if(t_3=="FLEX_PATH"){
								if(!((this.m_FLEX_PATH).length!=0) && FileType(t_path)==2){
									this.m_FLEX_PATH=t_path;
								}
							}else{
								if(t_3=="MINGW_PATH"){
									if(!((this.m_MINGW_PATH).length!=0) && FileType(t_path)==2){
										this.m_MINGW_PATH=t_path;
									}
								}else{
									if(t_3=="PSM_PATH"){
										if(!((this.m_PSM_PATH).length!=0) && FileType(t_path)==2){
											this.m_PSM_PATH=t_path;
										}
									}else{
										if(t_3=="MSBUILD_PATH"){
											if(!((this.m_MSBUILD_PATH).length!=0) && FileType(t_path)==1){
												this.m_MSBUILD_PATH=t_path;
											}
										}else{
											if(t_3=="HTML_PLAYER"){
												this.m_HTML_PLAYER=t_rhs;
											}else{
												if(t_3=="FLASH_PLAYER"){
													this.m_FLASH_PLAYER=t_rhs;
												}else{
													print("Trans: ignoring unrecognized config var: "+t_lhs);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	var t_4=HostOS();
	if(t_4=="winnt"){
		var t_path2=bb_virtualos_GetEnv("PATH");
		if((this.m_ANDROID_PATH).length!=0){
			t_path2=t_path2+(";"+this.m_ANDROID_PATH+"/tools");
		}
		if((this.m_ANDROID_PATH).length!=0){
			t_path2=t_path2+(";"+this.m_ANDROID_PATH+"/platform-tools");
		}
		if((this.m_JDK_PATH).length!=0){
			t_path2=t_path2+(";"+this.m_JDK_PATH+"/bin");
		}
		if((this.m_ANT_PATH).length!=0){
			t_path2=t_path2+(";"+this.m_ANT_PATH+"/bin");
		}
		if((this.m_FLEX_PATH).length!=0){
			t_path2=t_path2+(";"+this.m_FLEX_PATH+"/bin");
		}
		if((this.m_MINGW_PATH).length!=0){
			t_path2=this.m_MINGW_PATH+"/bin;"+t_path2;
		}
		bb_virtualos_SetEnv("PATH",t_path2);
		if((this.m_JDK_PATH).length!=0){
			bb_virtualos_SetEnv("JAVA_HOME",this.m_JDK_PATH);
		}
	}else{
		if(t_4=="macos"){
			var t_path3=bb_virtualos_GetEnv("PATH");
			if((this.m_ANDROID_PATH).length!=0){
				t_path3=t_path3+(":"+this.m_ANDROID_PATH+"/tools");
			}
			if((this.m_ANDROID_PATH).length!=0){
				t_path3=t_path3+(":"+this.m_ANDROID_PATH+"/platform-tools");
			}
			if((this.m_ANT_PATH).length!=0){
				t_path3=t_path3+(":"+this.m_ANT_PATH+"/bin");
			}
			if((this.m_FLEX_PATH).length!=0){
				t_path3=t_path3+(":"+this.m_FLEX_PATH+"/bin");
			}
			bb_virtualos_SetEnv("PATH",t_path3);
		}else{
			if(t_4=="linux"){
				var t_path4=bb_virtualos_GetEnv("PATH");
				if((this.m_JDK_PATH).length!=0){
					t_path4=this.m_JDK_PATH+"/bin:"+t_path4;
				}
				if((this.m_ANDROID_PATH).length!=0){
					t_path4=this.m_ANDROID_PATH+"/platform-tools:"+t_path4;
				}
				if((this.m_FLEX_PATH).length!=0){
					t_path4=this.m_FLEX_PATH+"/bin:"+t_path4;
				}
				bb_virtualos_SetEnv("PATH",t_path4);
			}
		}
	}
}
c_WebCC.prototype.p_EnumBuilders=function(){
	var t_=bb_builders_Builders(this).p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_it=t_.p_NextObject();
		if(t_it.p_Value().p_IsValid()){
			this.m__builders.p_Set3(t_it.p_Key(),t_it.p_Value());
		}
	}
}
c_WebCC.prototype.p_EnumTargets=function(t_dir){
	var t_p=this.m_monkeydir+"/"+t_dir;
	var t_=LoadDir(t_p);
	var t_2=0;
	while(t_2<t_.length){
		var t_f=t_[t_2];
		t_2=t_2+1;
		var t_t=t_p+"/"+t_f+"/TARGET.MONKEY";
		if(FileType(t_t)!=1){
			continue;
		}
		bb_config_PushConfigScope();
		bb_preprocessor_PreProcess(t_t,null);
		var t_name=bb_config_GetConfigVar("TARGET_NAME");
		if((t_name).length!=0){
			var t_system=bb_config_GetConfigVar("TARGET_SYSTEM");
			if((t_system).length!=0){
				var t_builder=this.m__builders.p_Get2(bb_config_GetConfigVar("TARGET_BUILDER"));
				if((t_builder)!=null){
					var t_host=bb_config_GetConfigVar("TARGET_HOST");
					if(!((t_host).length!=0) || t_host==HostOS()){
						this.m__targets.p_Set6(t_name,c_Target.m_new.call(new c_Target,t_f,t_name,t_system,t_builder));
					}
				}
			}
		}
		bb_config_PopConfigScope();
	}
}
c_WebCC.prototype.p_GetReleaseVersion=function(){
	var t_f=LoadString(this.m_monkeydir+"/VERSIONS.TXT");
	var t_=t_f.split("\n");
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		t_t=string_trim(t_t);
		if(string_startswith(t_t,"***** v") && string_endswith(t_t," *****")){
			return t_t.slice(6,-6);
		}
	}
	return "";
}
c_WebCC.prototype.p_Run=function(t_args){
	this.m_args=t_args;
	print("TRANS monkey compiler V1.86");
	var t_APath=AppPath();
	var t_EDir=bb_virtualos_ExtractDir(t_APath);
	this.m_monkeydir=RealPath(t_EDir+"/..");
	bb_virtualos_SetEnv("MONKEYDIR",this.m_monkeydir);
	bb_virtualos_SetEnv("TRANSDIR",this.m_monkeydir+"/bin");
	this.p_ParseArgs();
	this.p_LoadConfig();
	this.p_EnumBuilders();
	this.p_EnumTargets("targets");
	if(t_args.length<2){
		var t_valid="";
		var t_=this.m__targets.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_it=t_.p_NextObject();
			t_valid=t_valid+(" "+string_replace(t_it.p_Key()," ","_"));
		}
		print("TRANS Usage: WebCC [-update] [-build] [-run] [-clean] [-config=...] [-target=...] [-cfgfile=...] [-modpath=...] <main_monkey_source_file>");
		print("Valid targets:"+t_valid);
		print("Valid configs: debug release");
		ExitApp(0);
	}
	this.m_target=this.m__targets.p_Get2(string_replace(this.m_opt_target,"_"," "));
	if(!((this.m_target)!=null)){
		bb_webcc_Die("Invalid target",-1);
	}
	this.m_target.m_builder.p_Make();
}
c_WebCC.prototype.p_Execute=function(t_cmd,t_failHard){
	var t_r=Execute(t_cmd);
	if(!((t_r)!=0)){
		return true;
	}
	if(t_failHard){
		bb_webcc_Die("Error executing '"+t_cmd+"', return code="+String(t_r),-1);
	}
	return false;
}
function c_DataBuffer(){
	BBDataBuffer.call(this);
}
c_DataBuffer.prototype=extend_class(BBDataBuffer);
c_DataBuffer.m_new=function(t_length,t_direct){
	if(!this._New(t_length)){
		error("Allocate DataBuffer failed");
	}
	return this;
}
c_DataBuffer.m_new2=function(){
	return this;
}
c_DataBuffer.prototype.p_PokeBytes=function(t_address,t_bytes,t_offset,t_count){
	if(t_address+t_count>this.Length()){
		t_count=this.Length()-t_address;
	}
	if(t_offset+t_count>t_bytes.length){
		t_count=t_bytes.length-t_offset;
	}
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.PokeByte(t_address+t_i,t_bytes[t_offset+t_i]);
	}
}
c_DataBuffer.prototype.p_PokeString=function(t_address,t_str,t_encoding){
	var t_2=t_encoding;
	if(t_2=="utf8"){
		var t_p=string_tochars(t_str);
		var t_i=0;
		var t_e=t_p.length;
		var t_q=new_number_array(t_e*3);
		var t_j=0;
		while(t_i<t_e){
			var t_c=t_p[t_i]&65535;
			t_i+=1;
			if(t_c<128){
				t_q[t_j]=t_c;
				t_j+=1;
			}else{
				if(t_c<2048){
					t_q[t_j]=192|t_c>>6;
					t_q[t_j+1]=128|t_c&63;
					t_j+=2;
				}else{
					t_q[t_j]=224|t_c>>12;
					t_q[t_j+1]=128|t_c>>6&63;
					t_q[t_j+2]=128|t_c&63;
					t_j+=3;
				}
			}
		}
		this.p_PokeBytes(t_address,t_q,0,t_j);
		return t_j;
	}else{
		if(t_2=="ascii"){
			this.p_PokeBytes(t_address,string_tochars(t_str),0,t_str.length);
			return t_str.length;
		}
	}
	error("Invalid string encoding:"+t_encoding);
	return 0;
}
c_DataBuffer.prototype.p_CopyBytes=function(t_address,t_dst,t_dstaddress,t_count){
	if(t_address+t_count>this.Length()){
		t_count=this.Length()-t_address;
	}
	if(t_dstaddress+t_count>t_dst.Length()){
		t_count=t_dst.Length()-t_dstaddress;
	}
	if(t_dstaddress<=t_address){
		for(var t_i=0;t_i<t_count;t_i=t_i+1){
			t_dst.PokeByte(t_dstaddress+t_i,this.PeekByte(t_address+t_i));
		}
	}else{
		for(var t_i2=t_count-1;t_i2>=0;t_i2=t_i2+-1){
			t_dst.PokeByte(t_dstaddress+t_i2,this.PeekByte(t_address+t_i2));
		}
	}
}
c_DataBuffer.prototype.p_PeekBytes=function(t_address,t_bytes,t_offset,t_count){
	if(t_address+t_count>this.Length()){
		t_count=this.Length()-t_address;
	}
	if(t_offset+t_count>t_bytes.length){
		t_count=t_bytes.length-t_offset;
	}
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		t_bytes[t_offset+t_i]=this.PeekByte(t_address+t_i);
	}
}
c_DataBuffer.prototype.p_PeekBytes2=function(t_address,t_count){
	if(t_address+t_count>this.Length()){
		t_count=this.Length()-t_address;
	}
	var t_bytes=new_number_array(t_count);
	this.p_PeekBytes(t_address,t_bytes,0,t_count);
	return t_bytes;
}
c_DataBuffer.prototype.p_PeekString=function(t_address,t_count,t_encoding){
	var t_1=t_encoding;
	if(t_1=="utf8"){
		var t_p=this.p_PeekBytes2(t_address,t_count);
		var t_i=0;
		var t_e=t_p.length;
		var t_err=false;
		var t_q=new_number_array(t_e);
		var t_j=0;
		while(t_i<t_e){
			var t_c=t_p[t_i]&255;
			t_i+=1;
			if((t_c&128)!=0){
				if((t_c&224)==192){
					if(t_i>=t_e || (t_p[t_i]&192)!=128){
						t_err=true;
						break;
					}
					t_c=(t_c&31)<<6|t_p[t_i]&63;
					t_i+=1;
				}else{
					if((t_c&240)==224){
						if(t_i+1>=t_e || (t_p[t_i]&192)!=128 || (t_p[t_i+1]&192)!=128){
							t_err=true;
							break;
						}
						t_c=(t_c&15)<<12|(t_p[t_i]&63)<<6|t_p[t_i+1]&63;
						t_i+=2;
					}else{
						t_err=true;
						break;
					}
				}
			}
			t_q[t_j]=t_c;
			t_j+=1;
		}
		if(t_err){
			return string_fromchars(t_p);
		}
		if(t_j<t_e){
			t_q=t_q.slice(0,t_j);
		}
		return string_fromchars(t_q);
	}else{
		if(t_1=="ascii"){
			var t_p2=this.p_PeekBytes2(t_address,t_count);
			for(var t_i2=0;t_i2<t_p2.length;t_i2=t_i2+1){
				t_p2[t_i2]&=255;
			}
			return string_fromchars(t_p2);
		}
	}
	error("Invalid string encoding:"+t_encoding);
	return "";
}
c_DataBuffer.prototype.p_PeekString2=function(t_address,t_encoding){
	return this.p_PeekString(t_address,this.Length()-t_address,t_encoding);
}
function c_Stream(){
	Object.call(this);
}
c_Stream.m_new=function(){
	return this;
}
c_Stream.prototype.p_Eof=function(){
}
c_Stream.prototype.p_Position=function(){
}
c_Stream.prototype.p_Read=function(t_buffer,t_offset,t_count){
}
c_Stream.prototype.p_ReadError=function(){
	throw c_StreamReadError.m_new.call(new c_StreamReadError,this);
}
c_Stream.prototype.p_ReadAll=function(t_buffer,t_offset,t_count){
	while(t_count>0){
		var t_n=this.p_Read(t_buffer,t_offset,t_count);
		if(t_n<=0){
			this.p_ReadError();
		}
		t_offset+=t_n;
		t_count-=t_n;
	}
}
c_Stream.prototype.p_ReadAll2=function(){
	var t_bufs=c_Stack2.m_new.call(new c_Stack2);
	var t_buf=c_DataBuffer.m_new.call(new c_DataBuffer,4096,false);
	var t_off=0;
	var t_len=0;
	do{
		var t_n=this.p_Read(t_buf,t_off,4096-t_off);
		if(t_n<=0){
			break;
		}
		t_off+=t_n;
		t_len+=t_n;
		if(t_off==4096){
			t_off=0;
			t_bufs.p_Push4(t_buf);
			t_buf=c_DataBuffer.m_new.call(new c_DataBuffer,4096,false);
		}
	}while(!(false));
	var t_data=c_DataBuffer.m_new.call(new c_DataBuffer,t_len,false);
	t_off=0;
	var t_=t_bufs.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_tbuf=t_.p_NextObject();
		t_tbuf.p_CopyBytes(0,t_data,t_off,4096);
		t_tbuf.Discard();
		t_off+=4096;
	}
	t_buf.p_CopyBytes(0,t_data,t_off,t_len-t_off);
	t_buf.Discard();
	return t_data;
}
c_Stream.prototype.p_ReadString=function(t_count,t_encoding){
	var t_buf=c_DataBuffer.m_new.call(new c_DataBuffer,t_count,false);
	this.p_ReadAll(t_buf,0,t_count);
	return t_buf.p_PeekString2(0,t_encoding);
}
c_Stream.prototype.p_ReadString2=function(t_encoding){
	var t_buf=this.p_ReadAll2();
	return t_buf.p_PeekString2(0,t_encoding);
}
c_Stream.prototype.p_Seek=function(t_position){
}
c_Stream.m__tmp=null;
c_Stream.prototype.p_ReadLine=function(){
	var t_buf=c_Stack3.m_new.call(new c_Stack3);
	while(!((this.p_Eof())!=0)){
		var t_n=this.p_Read(c_Stream.m__tmp,0,1);
		if(!((t_n)!=0)){
			break;
		}
		var t_ch=c_Stream.m__tmp.PeekByte(0);
		if(!((t_ch)!=0) || t_ch==10){
			break;
		}
		if(t_ch!=13){
			t_buf.p_Push7(t_ch);
		}
	}
	return string_fromchars(t_buf.p_ToArray());
}
c_Stream.prototype.p_Close=function(){
}
function c_DataStream(){
	c_Stream.call(this);
	this.m__buffer=null;
	this.m__offset=0;
	this.m__length=0;
	this.m__position=0;
}
c_DataStream.prototype=extend_class(c_Stream);
c_DataStream.m_new=function(t_buffer,t_offset){
	c_Stream.m_new.call(this);
	this.m__buffer=t_buffer;
	this.m__offset=t_offset;
	this.m__length=t_buffer.Length()-t_offset;
	return this;
}
c_DataStream.m_new2=function(t_buffer,t_offset,t_length){
	c_Stream.m_new.call(this);
	this.m__buffer=t_buffer;
	this.m__offset=t_offset;
	this.m__length=t_length;
	return this;
}
c_DataStream.m_new3=function(){
	c_Stream.m_new.call(this);
	return this;
}
c_DataStream.prototype.p_Position=function(){
	return this.m__position;
}
c_DataStream.prototype.p_Seek=function(t_position){
	this.m__position=bb_math_Clamp(t_position,0,this.m__length-1);
	return this.m__position;
}
c_DataStream.prototype.p_Eof=function(){
	return ((this.m__position==this.m__length)?1:0);
}
c_DataStream.prototype.p_Read=function(t_buf,t_offset,t_count){
	if(this.m__position+t_count>this.m__length){
		t_count=this.m__length-this.m__position;
	}
	this.m__buffer.p_CopyBytes(this.m__offset+this.m__position,t_buf,t_offset,t_count);
	this.m__position+=t_count;
	return t_count;
}
c_DataStream.prototype.p_Close=function(){
	if((this.m__buffer)!=null){
		this.m__buffer=null;
		this.m__offset=0;
		this.m__length=0;
		this.m__position=0;
	}
}
function c_Stack(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack.m_new=function(){
	return this;
}
c_Stack.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack.prototype.p_Push=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_string_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack.prototype.p_Push2=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push(t_values[t_offset+t_i]);
	}
}
c_Stack.prototype.p_Push3=function(t_values,t_offset){
	this.p_Push2(t_values,t_offset,t_values.length-t_offset);
}
c_Stack.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator2.m_new.call(new c_Enumerator2,this);
}
c_Stack.m_NIL="";
c_Stack.prototype.p_Length=function(t_newlength){
	if(t_newlength<this.m_length){
		for(var t_i=t_newlength;t_i<this.m_length;t_i=t_i+1){
			this.m_data[t_i]=c_Stack.m_NIL;
		}
	}else{
		if(t_newlength>this.m_data.length){
			this.m_data=resize_string_array(this.m_data,bb_math_Max(this.m_length*2+10,t_newlength));
		}
	}
	this.m_length=t_newlength;
}
c_Stack.prototype.p_Length2=function(){
	return this.m_length;
}
c_Stack.prototype.p_IsEmpty=function(){
	return this.m_length==0;
}
c_Stack.prototype.p_Pop=function(){
	this.m_length-=1;
	var t_v=this.m_data[this.m_length];
	this.m_data[this.m_length]=c_Stack.m_NIL;
	return t_v;
}
c_Stack.prototype.p_ToArray=function(){
	var t_t=new_string_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
c_Stack.prototype.p_Get=function(t_index){
	return this.m_data[t_index];
}
c_Stack.prototype.p_Clear=function(){
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		this.m_data[t_i]=c_Stack.m_NIL;
	}
	this.m_length=0;
}
function c_StringStack(){
	c_Stack.call(this);
}
c_StringStack.prototype=extend_class(c_Stack);
c_StringStack.m_new=function(t_data){
	c_Stack.m_new2.call(this,t_data);
	return this;
}
c_StringStack.m_new2=function(){
	c_Stack.m_new.call(this);
	return this;
}
c_StringStack.prototype.p_Join=function(t_separator){
	return this.p_ToArray().join(t_separator);
}
function c_StreamError(){
	ThrowableObject.call(this);
	this.m__stream=null;
}
c_StreamError.prototype=extend_class(ThrowableObject);
c_StreamError.m_new=function(t_stream){
	this.m__stream=t_stream;
	return this;
}
c_StreamError.m_new2=function(){
	return this;
}
function c_StreamReadError(){
	c_StreamError.call(this);
}
c_StreamReadError.prototype=extend_class(c_StreamError);
c_StreamReadError.m_new=function(t_stream){
	c_StreamError.m_new.call(this,t_stream);
	return this;
}
c_StreamReadError.m_new2=function(){
	c_StreamError.m_new2.call(this);
	return this;
}
function c_Stack2(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack2.m_new=function(){
	return this;
}
c_Stack2.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack2.prototype.p_Push4=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack2.prototype.p_Push5=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push4(t_values[t_offset+t_i]);
	}
}
c_Stack2.prototype.p_Push6=function(t_values,t_offset){
	this.p_Push5(t_values,t_offset,t_values.length-t_offset);
}
c_Stack2.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator.m_new.call(new c_Enumerator,this);
}
c_Stack2.m_NIL=null;
c_Stack2.prototype.p_Length=function(t_newlength){
	if(t_newlength<this.m_length){
		for(var t_i=t_newlength;t_i<this.m_length;t_i=t_i+1){
			this.m_data[t_i]=c_Stack2.m_NIL;
		}
	}else{
		if(t_newlength>this.m_data.length){
			this.m_data=resize_object_array(this.m_data,bb_math_Max(this.m_length*2+10,t_newlength));
		}
	}
	this.m_length=t_newlength;
}
c_Stack2.prototype.p_Length2=function(){
	return this.m_length;
}
function c_Enumerator(){
	Object.call(this);
	this.m_stack=null;
	this.m_index=0;
}
c_Enumerator.m_new=function(t_stack){
	this.m_stack=t_stack;
	return this;
}
c_Enumerator.m_new2=function(){
	return this;
}
c_Enumerator.prototype.p_HasNext=function(){
	return this.m_index<this.m_stack.p_Length2();
}
c_Enumerator.prototype.p_NextObject=function(){
	this.m_index+=1;
	return this.m_stack.m_data[this.m_index-1];
}
function bb_math_Max(t_x,t_y){
	if(t_x>t_y){
		return t_x;
	}
	return t_y;
}
function bb_math_Max2(t_x,t_y){
	if(t_x>t_y){
		return t_x;
	}
	return t_y;
}
function c_Enumerator2(){
	Object.call(this);
	this.m_stack=null;
	this.m_index=0;
}
c_Enumerator2.m_new=function(t_stack){
	this.m_stack=t_stack;
	return this;
}
c_Enumerator2.m_new2=function(){
	return this;
}
c_Enumerator2.prototype.p_HasNext=function(){
	return this.m_index<this.m_stack.p_Length2();
}
c_Enumerator2.prototype.p_NextObject=function(){
	this.m_index+=1;
	return this.m_stack.m_data[this.m_index-1];
}
function bb_virtualos___OS_ParseFileSystem_Update_ContextRep(t_Context){
	var t_Rep="";
	var t_=t_Context.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_Folder=t_.p_NextObject();
		t_Rep=t_Rep+(t_Folder+"/");
	}
	return t_Rep;
}
function c_Stack3(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack3.m_new=function(){
	return this;
}
c_Stack3.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack3.prototype.p_Push7=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_number_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack3.prototype.p_Push8=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push7(t_values[t_offset+t_i]);
	}
}
c_Stack3.prototype.p_Push9=function(t_values,t_offset){
	this.p_Push8(t_values,t_offset,t_values.length-t_offset);
}
c_Stack3.prototype.p_ToArray=function(){
	var t_t=new_number_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function bb_virtualos_SmartClip(t_Input,t_Symbol,t_Length){
	var t_FinalChar=t_Length-1;
	var t_XClip=0;
	var t_YClip=0;
	if(t_Input.charCodeAt(0)==t_Symbol){
		t_XClip=1;
	}else{
		t_XClip=0;
	}
	if(t_Input.charCodeAt(t_FinalChar)==t_Symbol){
		t_YClip=t_FinalChar;
	}else{
		t_YClip=t_Length;
	}
	if(t_XClip!=0 || t_YClip!=0){
		return t_Input.slice(t_XClip,t_YClip);
	}
	return t_Input;
}
function bb_virtualos_SmartClip2(t_Input,t_Symbol){
	return bb_virtualos_SmartClip(t_Input,t_Symbol,t_Input.length);
}
function bb_virtualos___OS_ParseFileSystem_CreateFileEntry(t_Entry,t_IsFileDescriptor){
	if(t_IsFileDescriptor){
		__os_createFileLink(RealPath(t_Entry));
	}else{
		CreateDir(t_Entry);
	}
	return;
}
function bb_virtualos___OS_ParseFileSystem(t_S,t_Context,t_OpenPrefix){
	var t_LastMasterPath="";
	var t_Cache_Context="";
	while(!((t_S.p_Eof())!=0)){
		var t_Origin=t_S.p_Position();
		var t_IsFileDescriptor=false;
		var t_FirstChar=t_S.p_ReadString(1,"utf8");
		var t_4=t_FirstChar;
		if(t_4=="\n" || t_4=="\r" || t_4=="\t" || t_4==" "){
			continue;
		}else{
			if(t_4=="!"){
				t_IsFileDescriptor=true;
			}else{
				if(t_4=="{"){
					t_Context.p_Push(t_LastMasterPath);
					t_Cache_Context=bb_virtualos___OS_ParseFileSystem_Update_ContextRep(t_Context);
					continue;
				}else{
					if(t_4=="}"){
						if(!t_Context.p_IsEmpty()){
							t_Context.p_Pop();
						}
						t_Cache_Context=bb_virtualos___OS_ParseFileSystem_Update_ContextRep(t_Context);
						continue;
					}else{
						t_IsFileDescriptor=false;
						t_S.p_Seek(t_Origin);
					}
				}
			}
		}
		var t_Line=t_S.p_ReadLine();
		var t_Entries=t_Line.split(",");
		if(!t_IsFileDescriptor){
			t_LastMasterPath=t_Entries[t_Entries.length-1];
		}
		for(var t_I=0;t_I<t_Entries.length;t_I=t_I+1){
			var t_E=t_Entries[t_I];
			var t_E_Length=t_E.length;
			t_E=t_Cache_Context+bb_virtualos_SmartClip(t_E,32,t_E_Length);
			var t_Time_First=t_E.indexOf("[",0);
			if(t_Time_First!=-1){
				var t_Processed_E=t_E.slice(0,t_Time_First);
				bb_virtualos___OS_ParseFileSystem_CreateFileEntry(t_Processed_E,t_IsFileDescriptor);
			}else{
				bb_virtualos___OS_ParseFileSystem_CreateFileEntry(t_E,t_IsFileDescriptor);
			}
		}
	}
	return;
}
function bb_virtualos___OS_ParseFileSystem2(t_S){
	bb_virtualos___OS_ParseFileSystem(t_S,(c_StringStack.m_new2.call(new c_StringStack)),true);
	return;
}
function bb_virtualos___OS_AddFileSystem(t_URL){
	var t_FileData=__os_download_as_string(t_URL);
	var t_Buf=c_DataBuffer.m_new.call(new c_DataBuffer,t_FileData.length,false);
	t_Buf.p_PokeString(0,t_FileData,"utf8");
	var t_SS=c_DataStream.m_new.call(new c_DataStream,t_Buf,0);
	bb_virtualos___OS_ParseFileSystem2(t_SS);
	return;
}
function bb_virtualos_ExtractDir(t_Path){
	var t_I=t_Path.lastIndexOf("/");
	if(t_I==-1){
		t_I=t_Path.lastIndexOf("\\");
	}
	if(t_I!=-1){
		return t_Path.slice(0,t_I);
	}
	return "";
}
function c_Map(){
	Object.call(this);
	this.m_root=null;
}
c_Map.m_new=function(){
	return this;
}
c_Map.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map.prototype.p_RotateLeft=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map.prototype.p_RotateRight=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map.prototype.p_InsertFixup=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map.prototype.p_Set=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node.m_new.call(new c_Node,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
c_Map.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map.prototype.p_Get2=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return "";
}
c_Map.prototype.p_Contains=function(t_key){
	return this.p_FindNode(t_key)!=null;
}
c_Map.prototype.p_FirstNode=function(){
	if(!((this.m_root)!=null)){
		return null;
	}
	var t_node=this.m_root;
	while((t_node.m_left)!=null){
		t_node=t_node.m_left;
	}
	return t_node;
}
c_Map.prototype.p_ObjectEnumerator=function(){
	return c_NodeEnumerator3.m_new.call(new c_NodeEnumerator3,this.p_FirstNode());
}
function c_StringMap(){
	c_Map.call(this);
}
c_StringMap.prototype=extend_class(c_Map);
c_StringMap.m_new=function(){
	c_Map.m_new.call(this);
	return this;
}
c_StringMap.prototype.p_Compare=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
var bb_virtualos___OS_Env=null;
function c_Node(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value="";
	this.m_color=0;
	this.m_parent=null;
}
c_Node.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node.m_new2=function(){
	return this;
}
c_Node.prototype.p_NextNode=function(){
	var t_node=null;
	if((this.m_right)!=null){
		t_node=this.m_right;
		while((t_node.m_left)!=null){
			t_node=t_node.m_left;
		}
		return t_node;
	}
	t_node=this;
	var t_parent=this.m_parent;
	while(((t_parent)!=null) && t_node==t_parent.m_right){
		t_node=t_parent;
		t_parent=t_parent.m_parent;
	}
	return t_parent;
}
c_Node.prototype.p_Key=function(){
	return this.m_key;
}
c_Node.prototype.p_Value=function(){
	return this.m_value;
}
function bb_virtualos_SetEnv(t_Name,t_Value){
	bb_virtualos___OS_Env.p_Set(t_Name,t_Value);
	return;
}
function bb_webcc_StripQuotes(t_Str){
	if(t_Str.length>=2 && string_startswith(t_Str,"\"") && string_endswith(t_Str,"\"")){
		return t_Str.slice(1,-1);
	}
	return t_Str;
}
function bb_webcc_Die(t_Message,t_ExitCode){
	print("TRANS FAILED: "+t_Message);
	ExitApp(t_ExitCode);
	return t_ExitCode;
}
function c_Type(){
	Object.call(this);
	this.m_arrayOf=null;
}
c_Type.m_new=function(){
	return this;
}
c_Type.m_stringType=null;
c_Type.m_intType=null;
c_Type.m_floatType=null;
c_Type.m_boolType=null;
c_Type.m_voidType=null;
c_Type.m_objectType=null;
c_Type.m_throwableType=null;
c_Type.prototype.p_ArrayOf=function(){
	if(!((this.m_arrayOf)!=null)){
		this.m_arrayOf=c_ArrayType.m_new.call(new c_ArrayType,this);
	}
	return this.m_arrayOf;
}
c_Type.m_emptyArrayType=null;
c_Type.m_nullObjectType=null;
c_Type.prototype.p_ToString=function(){
	return "??Type??";
}
c_Type.prototype.p_EqualsType=function(t_ty){
	return 0;
}
c_Type.prototype.p_Semant=function(){
	return this;
}
c_Type.prototype.p_ExtendsType=function(t_ty){
	return this.p_EqualsType(t_ty);
}
c_Type.prototype.p_GetClass=function(){
	return null;
}
function c_StringType(){
	c_Type.call(this);
}
c_StringType.prototype=extend_class(c_Type);
c_StringType.m_new=function(){
	c_Type.m_new.call(this);
	return this;
}
c_StringType.prototype.p_EqualsType=function(t_ty){
	return ((object_downcast((t_ty),c_StringType)!=null)?1:0);
}
c_StringType.prototype.p_ExtendsType=function(t_ty){
	if((object_downcast((t_ty),c_ObjectType))!=null){
		var t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(this),"")).p_Semant();
		var t_ctor=t_ty.p_GetClass().p_FindFuncDecl("new",[t_expr],1);
		return ((((t_ctor)!=null) && t_ctor.p_IsCtor())?1:0);
	}
	return this.p_EqualsType(t_ty);
}
c_StringType.prototype.p_GetClass=function(){
	return object_downcast((bb_decl__env.p_FindDecl("string")),c_ClassDecl);
}
c_StringType.prototype.p_ToString=function(){
	return "String";
}
function c_Decl(){
	Object.call(this);
	this.m_errInfo="";
	this.m_ident="";
	this.m_munged="";
	this.m_attrs=0;
	this.m_scope=null;
}
c_Decl.m_new=function(){
	this.m_errInfo=bb_config__errInfo;
	return this;
}
c_Decl.prototype.p_IsSemanted=function(){
	return (((this.m_attrs&1048576)!=0)?1:0);
}
c_Decl.prototype.p_IsPublic=function(){
	return (((this.m_attrs&16896)==0)?1:0);
}
c_Decl.prototype.p_ModuleScope=function(){
	if((object_downcast((this),c_ModuleDecl))!=null){
		return object_downcast((this),c_ModuleDecl);
	}
	if((this.m_scope)!=null){
		return this.m_scope.p_ModuleScope();
	}
	return null;
}
c_Decl.prototype.p_IsProtected=function(){
	return (((this.m_attrs&16384)!=0)?1:0);
}
c_Decl.prototype.p_ClassScope=function(){
	if((object_downcast((this),c_ClassDecl))!=null){
		return object_downcast((this),c_ClassDecl);
	}
	if((this.m_scope)!=null){
		return this.m_scope.p_ClassScope();
	}
	return null;
}
c_Decl.prototype.p_FuncScope=function(){
	if((object_downcast((this),c_FuncDecl))!=null){
		return object_downcast((this),c_FuncDecl);
	}
	if((this.m_scope)!=null){
		return this.m_scope.p_FuncScope();
	}
	return null;
}
c_Decl.prototype.p_CheckAccess=function(){
	if(!((bb_decl__env)!=null)){
		return 1;
	}
	if((this.p_IsPublic())!=0){
		return 1;
	}
	var t_mdecl=this.p_ModuleScope();
	if((t_mdecl)!=null){
		var t_mdecl2=bb_decl__env.p_ModuleScope();
		if(t_mdecl==t_mdecl2){
			return 1;
		}
		if(((t_mdecl2)!=null) && t_mdecl.m_friends.p_Contains(t_mdecl2.m_rmodpath)){
			return 1;
		}
	}
	if((this.p_IsProtected())!=0){
		var t_thisClass=this.p_ClassScope();
		var t_currentClass=bb_decl__env.p_ClassScope();
		while((t_currentClass)!=null){
			if(t_currentClass==t_thisClass){
				return 1;
			}
			t_currentClass=t_currentClass.m_superClass;
		}
	}
	var t_fdecl=bb_decl__env.p_FuncScope();
	if(((t_fdecl)!=null) && ((t_fdecl.m_attrs&8388608)!=0)){
		return 1;
	}
	return 0;
}
c_Decl.prototype.p_IsExtern=function(){
	return (((this.m_attrs&256)!=0)?1:0);
}
c_Decl.prototype.p_IsAbstract=function(){
	return (((this.m_attrs&1024)!=0)?1:0);
}
c_Decl.prototype.p_ToString=function(){
	if((object_downcast((this.m_scope),c_ClassDecl))!=null){
		return this.m_scope.p_ToString()+"."+this.m_ident;
	}
	return this.m_ident;
}
c_Decl.prototype.p_IsSemanting=function(){
	return (((this.m_attrs&2097152)!=0)?1:0);
}
c_Decl.prototype.p_OnSemant=function(){
}
c_Decl.prototype.p_AppScope=function(){
	if((object_downcast((this),c_AppDecl))!=null){
		return object_downcast((this),c_AppDecl);
	}
	if((this.m_scope)!=null){
		return this.m_scope.p_AppScope();
	}
	return null;
}
c_Decl.prototype.p_Semant=function(){
	if((this.p_IsSemanted())!=0){
		return 0;
	}
	if((this.p_IsSemanting())!=0){
		bb_config_Err("Cyclic declaration of '"+this.m_ident+"'.");
	}
	var t_cscope=object_downcast((this.m_scope),c_ClassDecl);
	if((t_cscope)!=null){
		t_cscope.m_attrs&=-5;
	}
	bb_config_PushErr(this.m_errInfo);
	if((this.m_scope)!=null){
		bb_decl_PushEnv(this.m_scope);
	}
	this.m_attrs|=2097152;
	this.p_OnSemant();
	this.m_attrs&=-2097153;
	this.m_attrs|=1048576;
	if((this.m_scope)!=null){
		if((this.p_IsExtern())!=0){
			if((object_downcast((this.m_scope),c_ModuleDecl))!=null){
				this.p_AppScope().m_allSemantedDecls.p_AddLast3(this);
			}
		}else{
			this.m_scope.m_semanted.p_AddLast3(this);
			if((object_downcast((this),c_GlobalDecl))!=null){
				this.p_AppScope().m_semantedGlobals.p_AddLast8(object_downcast((this),c_GlobalDecl));
			}
			if((object_downcast((this.m_scope),c_ModuleDecl))!=null){
				this.p_AppScope().m_semanted.p_AddLast3(this);
				this.p_AppScope().m_allSemantedDecls.p_AddLast3(this);
			}
		}
		bb_decl_PopEnv();
	}
	bb_config_PopErr();
	return 0;
}
c_Decl.prototype.p_IsPrivate=function(){
	return (((this.m_attrs&512)!=0)?1:0);
}
c_Decl.prototype.p_AssertAccess=function(){
	if((this.p_CheckAccess())!=0){
		return 0;
	}
	if((this.p_IsPrivate())!=0){
		bb_config_Err(this.p_ToString()+" is private.");
	}
	if((this.p_IsProtected())!=0){
		bb_config_Err(this.p_ToString()+" is protected.");
	}
	bb_config_Err(this.p_ToString()+" is inaccessible.");
	return 0;
}
c_Decl.prototype.p_OnCopy=function(){
}
c_Decl.prototype.p_Copy=function(){
	var t_t=this.p_OnCopy();
	t_t.m_munged=this.m_munged;
	t_t.m_errInfo=this.m_errInfo;
	return t_t;
}
c_Decl.prototype.p_IsFinal=function(){
	return (((this.m_attrs&2048)!=0)?1:0);
}
function c_ScopeDecl(){
	c_Decl.call(this);
	this.m_decls=c_List3.m_new.call(new c_List3);
	this.m_declsMap=c_StringMap4.m_new.call(new c_StringMap4);
	this.m_semanted=c_List3.m_new.call(new c_List3);
}
c_ScopeDecl.prototype=extend_class(c_Decl);
c_ScopeDecl.m_new=function(){
	c_Decl.m_new.call(this);
	return this;
}
c_ScopeDecl.prototype.p_InsertDecl=function(t_decl){
	if((t_decl.m_scope)!=null){
		bb_config_InternalErr("Internal error");
	}
	var t_ident=t_decl.m_ident;
	if(!((t_ident).length!=0)){
		return 0;
	}
	t_decl.m_scope=this;
	this.m_decls.p_AddLast3(t_decl);
	var t_decls=null;
	var t_tdecl=this.m_declsMap.p_Get2(t_ident);
	if((object_downcast((t_decl),c_FuncDecl))!=null){
		var t_funcs=object_downcast((t_tdecl),c_FuncDeclList);
		if(((t_funcs)!=null) || !((t_tdecl)!=null)){
			if(!((t_funcs)!=null)){
				t_funcs=c_FuncDeclList.m_new.call(new c_FuncDeclList);
				this.m_declsMap.p_Insert2(t_ident,(t_funcs));
			}
			t_funcs.p_AddLast4(object_downcast((t_decl),c_FuncDecl));
		}else{
			bb_config_Err("Duplicate identifier '"+t_ident+"'.");
		}
	}else{
		if(!((t_tdecl)!=null)){
			this.m_declsMap.p_Insert2(t_ident,(t_decl));
		}else{
			bb_config_Err("Duplicate identifier '"+t_ident+"'.");
		}
	}
	if((t_decl.p_IsSemanted())!=0){
		this.m_semanted.p_AddLast3(t_decl);
	}
	return 0;
}
c_ScopeDecl.prototype.p_GetDecl=function(t_ident){
	var t_decl=this.m_declsMap.p_Get2(t_ident);
	if(!((t_decl)!=null)){
		return null;
	}
	var t_adecl=object_downcast((t_decl),c_AliasDecl);
	if(!((t_adecl)!=null)){
		return t_decl;
	}
	if((t_adecl.p_CheckAccess())!=0){
		return t_adecl.m_decl;
	}
	return null;
}
c_ScopeDecl.prototype.p_FindDecl=function(t_ident){
	if(bb_decl__env!=this){
		return this.p_GetDecl(t_ident);
	}
	var t_tscope=this;
	while((t_tscope)!=null){
		var t_decl=t_tscope.p_GetDecl(t_ident);
		if((t_decl)!=null){
			return t_decl;
		}
		t_tscope=t_tscope.m_scope;
	}
	return null;
}
c_ScopeDecl.prototype.p_InsertDecls=function(t_decls){
	var t_=t_decls.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_decl=t_.p_NextObject();
		this.p_InsertDecl(t_decl);
	}
	return 0;
}
c_ScopeDecl.prototype.p_FindFuncDecl=function(t_ident,t_argExprs,t_explicit){
	var t_funcs=object_downcast((this.p_FindDecl(t_ident)),c_FuncDeclList);
	if(!((t_funcs)!=null)){
		return null;
	}
	var t_=t_funcs.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_func=t_.p_NextObject();
		t_func.p_Semant();
	}
	var t_match=null;
	var t_isexact=0;
	var t_err="";
	var t_2=t_funcs.p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_func2=t_2.p_NextObject();
		var t_argDecls=t_func2.m_argDecls;
		if(t_argExprs.length>t_argDecls.length){
			continue;
		}
		var t_exact=1;
		var t_possible=1;
		for(var t_i=0;t_i<t_argDecls.length;t_i=t_i+1){
			if(t_i<t_argExprs.length && ((t_argExprs[t_i])!=null)){
				var t_declTy=t_argDecls[t_i].m_type;
				var t_exprTy=t_argExprs[t_i].m_exprType;
				if((t_exprTy.p_EqualsType(t_declTy))!=0){
					continue;
				}
				t_exact=0;
				if(!((t_explicit)!=0) && ((t_exprTy.p_ExtendsType(t_declTy))!=0)){
					continue;
				}
			}else{
				if((t_argDecls[t_i].m_init)!=null){
					if(!((t_explicit)!=0)){
						continue;
					}
				}
			}
			t_possible=0;
			break;
		}
		if(!((t_possible)!=0)){
			continue;
		}
		if((t_exact)!=0){
			if((t_isexact)!=0){
				bb_config_Err("Unable to determine overload to use: "+t_match.p_ToString()+" or "+t_func2.p_ToString()+".");
			}else{
				t_err="";
				t_match=t_func2;
				t_isexact=1;
			}
		}else{
			if(!((t_isexact)!=0)){
				if((t_match)!=null){
					t_err="Unable to determine overload to use: "+t_match.p_ToString()+" or "+t_func2.p_ToString()+".";
				}else{
					t_match=t_func2;
				}
			}
		}
	}
	if(!((t_isexact)!=0)){
		if((t_err).length!=0){
			bb_config_Err(t_err);
		}
		if((t_explicit)!=0){
			return null;
		}
	}
	if(!((t_match)!=null)){
		var t_t="";
		for(var t_i2=0;t_i2<t_argExprs.length;t_i2=t_i2+1){
			if((t_t).length!=0){
				t_t=t_t+",";
			}
			if((t_argExprs[t_i2])!=null){
				t_t=t_t+t_argExprs[t_i2].m_exprType.p_ToString();
			}
		}
		bb_config_Err("Unable to find overload for "+t_ident+"("+t_t+").");
	}
	t_match.p_AssertAccess();
	return t_match;
}
c_ScopeDecl.prototype.p_Decls=function(){
	return this.m_decls;
}
c_ScopeDecl.prototype.p_FindType=function(t_ident,t_args){
	var t_decl=this.p_GetDecl(t_ident);
	if((t_decl)!=null){
		var t_type=object_downcast((t_decl),c_Type);
		if((t_type)!=null){
			if((t_args.length)!=0){
				bb_config_Err("Wrong number of type arguments");
			}
			return t_type;
		}
		var t_cdecl=object_downcast((t_decl),c_ClassDecl);
		if((t_cdecl)!=null){
			t_cdecl.p_AssertAccess();
			t_cdecl=t_cdecl.p_GenClassInstance(t_args);
			t_cdecl.p_Semant();
			return (t_cdecl.m_objectType);
		}
	}
	if((this.m_scope)!=null){
		return this.m_scope.p_FindType(t_ident,t_args);
	}
	return null;
}
c_ScopeDecl.prototype.p_MethodDecls=function(t_id){
	var t_fdecls=c_List4.m_new.call(new c_List4);
	var t_=this.m_decls.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_decl=t_.p_NextObject();
		if(((t_id).length!=0) && t_decl.m_ident!=t_id){
			continue;
		}
		var t_fdecl=object_downcast((t_decl),c_FuncDecl);
		if(((t_fdecl)!=null) && t_fdecl.p_IsMethod()){
			t_fdecls.p_AddLast4(t_fdecl);
		}
	}
	return t_fdecls;
}
c_ScopeDecl.prototype.p_Semanted=function(){
	return this.m_semanted;
}
c_ScopeDecl.prototype.p_SemantedMethods=function(t_id){
	var t_fdecls=c_List4.m_new.call(new c_List4);
	var t_=this.m_semanted.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_decl=t_.p_NextObject();
		if(((t_id).length!=0) && t_decl.m_ident!=t_id){
			continue;
		}
		var t_fdecl=object_downcast((t_decl),c_FuncDecl);
		if(((t_fdecl)!=null) && t_fdecl.p_IsMethod()){
			t_fdecls.p_AddLast4(t_fdecl);
		}
	}
	return t_fdecls;
}
c_ScopeDecl.prototype.p_FindValDecl=function(t_ident){
	var t_decl=object_downcast((this.p_FindDecl(t_ident)),c_ValDecl);
	if(!((t_decl)!=null)){
		return null;
	}
	t_decl.p_AssertAccess();
	t_decl.p_Semant();
	return t_decl;
}
c_ScopeDecl.prototype.p_OnCopy=function(){
	bb_config_InternalErr("Internal error");
	return null;
}
c_ScopeDecl.prototype.p_OnSemant=function(){
	return 0;
}
c_ScopeDecl.prototype.p_SemantedFuncs=function(t_id){
	var t_fdecls=c_List4.m_new.call(new c_List4);
	var t_=this.m_semanted.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_decl=t_.p_NextObject();
		if(((t_id).length!=0) && t_decl.m_ident!=t_id){
			continue;
		}
		var t_fdecl=object_downcast((t_decl),c_FuncDecl);
		if((t_fdecl)!=null){
			t_fdecls.p_AddLast4(t_fdecl);
		}
	}
	return t_fdecls;
}
c_ScopeDecl.prototype.p_FindModuleDecl=function(t_ident){
	var t_decl=object_downcast((this.p_GetDecl(t_ident)),c_ModuleDecl);
	if((t_decl)!=null){
		t_decl.p_AssertAccess();
		t_decl.p_Semant();
		return t_decl;
	}
	if((this.m_scope)!=null){
		return this.m_scope.p_FindModuleDecl(t_ident);
	}
	return null;
}
c_ScopeDecl.prototype.p_FuncDecls=function(t_id){
	var t_fdecls=c_List4.m_new.call(new c_List4);
	var t_=this.m_decls.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_decl=t_.p_NextObject();
		if(((t_id).length!=0) && t_decl.m_ident!=t_id){
			continue;
		}
		var t_fdecl=object_downcast((t_decl),c_FuncDecl);
		if((t_fdecl)!=null){
			t_fdecls.p_AddLast4(t_fdecl);
		}
	}
	return t_fdecls;
}
c_ScopeDecl.prototype.p_FindScopeDecl=function(t_ident){
	var t_decl=this.p_FindDecl(t_ident);
	var t_type=object_downcast((t_decl),c_Type);
	if((t_type)!=null){
		if(!((object_downcast((t_type),c_ObjectType))!=null)){
			return null;
		}
		return (t_type.p_GetClass());
	}
	var t_scope=object_downcast((t_decl),c_ScopeDecl);
	if((t_scope)!=null){
		var t_cdecl=object_downcast((t_scope),c_ClassDecl);
		if(((t_cdecl)!=null) && ((t_cdecl.m_args).length!=0)){
			return null;
		}
		t_scope.p_AssertAccess();
		t_scope.p_Semant();
		return t_scope;
	}
	return null;
}
function c_ConfigScope(){
	c_ScopeDecl.call(this);
	this.m_cdecls=c_StringMap2.m_new.call(new c_StringMap2);
	this.m_vars=c_StringMap.m_new.call(new c_StringMap);
}
c_ConfigScope.prototype=extend_class(c_ScopeDecl);
c_ConfigScope.m_new=function(){
	c_ScopeDecl.m_new.call(this);
	return this;
}
c_ConfigScope.prototype.p_FindValDecl=function(t_ident){
	if(this.m_cdecls.p_Contains(t_ident)){
		return (this.m_cdecls.p_Get2(t_ident));
	}
	return (c_ConstDecl.m_new.call(new c_ConstDecl,t_ident,1048576,(c_Type.m_boolType),null));
}
var bb_config__errInfo="";
var bb_config__cfgScope=null;
function c_ValDecl(){
	c_Decl.call(this);
	this.m_type=null;
	this.m_init=null;
}
c_ValDecl.prototype=extend_class(c_Decl);
c_ValDecl.m_new=function(){
	c_Decl.m_new.call(this);
	return this;
}
c_ValDecl.prototype.p_ToString=function(){
	var t_t=c_Decl.prototype.p_ToString.call(this);
	if((this.m_type)!=null){
		return t_t+":"+this.m_type.p_ToString();
	}
	return t_t;
}
c_ValDecl.prototype.p_OnSemant=function(){
	if((this.m_type)!=null){
		this.m_type=this.m_type.p_Semant();
		if((this.m_init)!=null){
			this.m_init=this.m_init.p_Semant2(this.m_type,0);
		}
	}else{
		if((this.m_init)!=null){
			this.m_init=this.m_init.p_Semant();
			this.m_type=this.m_init.m_exprType;
		}else{
			bb_config_InternalErr("Internal error");
		}
	}
	if((object_downcast((this.m_type),c_VoidType))!=null){
		bb_config_Err("Declaration has void type.");
	}
	return 0;
}
c_ValDecl.prototype.p_CopyInit=function(){
	if((this.m_init)!=null){
		return this.m_init.p_Copy();
	}
	return null;
}
function c_ConstDecl(){
	c_ValDecl.call(this);
	this.m_value="";
}
c_ConstDecl.prototype=extend_class(c_ValDecl);
c_ConstDecl.m_new=function(t_ident,t_attrs,t_type,t_init){
	c_ValDecl.m_new.call(this);
	this.m_ident=t_ident;
	this.m_munged=t_ident;
	this.m_attrs=t_attrs;
	this.m_type=t_type;
	this.m_init=t_init;
	return this;
}
c_ConstDecl.m_new2=function(){
	c_ValDecl.m_new.call(this);
	return this;
}
c_ConstDecl.prototype.p_OnCopy=function(){
	return (c_ConstDecl.m_new.call(new c_ConstDecl,this.m_ident,this.m_attrs,this.m_type,this.p_CopyInit()));
}
c_ConstDecl.prototype.p_OnSemant=function(){
	c_ValDecl.prototype.p_OnSemant.call(this);
	if(!((this.p_IsExtern())!=0)){
		this.m_value=this.m_init.p_Eval();
	}
	return 0;
}
function c_Map2(){
	Object.call(this);
	this.m_root=null;
}
c_Map2.m_new=function(){
	return this;
}
c_Map2.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map2.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map2.prototype.p_Get2=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
c_Map2.prototype.p_RotateLeft2=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map2.prototype.p_RotateRight2=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map2.prototype.p_InsertFixup2=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft2(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight2(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight2(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft2(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map2.prototype.p_Set2=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node2.m_new.call(new c_Node2,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup2(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
c_Map2.prototype.p_Contains=function(t_key){
	return this.p_FindNode(t_key)!=null;
}
function c_StringMap2(){
	c_Map2.call(this);
}
c_StringMap2.prototype=extend_class(c_Map2);
c_StringMap2.m_new=function(){
	c_Map2.m_new.call(this);
	return this;
}
c_StringMap2.prototype.p_Compare=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_Node2(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node2.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node2.m_new2=function(){
	return this;
}
function c_Expr(){
	Object.call(this);
	this.m_exprType=null;
}
c_Expr.m_new=function(){
	return this;
}
c_Expr.prototype.p_Semant=function(){
	bb_config_InternalErr("Internal error");
	return null;
}
c_Expr.prototype.p_SemantArgs=function(t_args){
	t_args=t_args.slice(0);
	for(var t_i=0;t_i<t_args.length;t_i=t_i+1){
		if((t_args[t_i])!=null){
			t_args[t_i]=t_args[t_i].p_Semant();
		}
	}
	return t_args;
}
c_Expr.prototype.p_Cast=function(t_ty,t_castFlags){
	if((this.m_exprType.p_EqualsType(t_ty))!=0){
		return this;
	}
	return (c_CastExpr.m_new.call(new c_CastExpr,t_ty,this,t_castFlags)).p_Semant();
}
c_Expr.prototype.p_CastArgs=function(t_args,t_funcDecl){
	if(t_args.length>t_funcDecl.m_argDecls.length){
		bb_config_InternalErr("Internal error");
	}
	t_args=resize_object_array(t_args,t_funcDecl.m_argDecls.length);
	for(var t_i=0;t_i<t_args.length;t_i=t_i+1){
		if((t_args[t_i])!=null){
			t_args[t_i]=t_args[t_i].p_Cast(t_funcDecl.m_argDecls[t_i].m_type,0);
		}else{
			if((t_funcDecl.m_argDecls[t_i].m_init)!=null){
				t_args[t_i]=t_funcDecl.m_argDecls[t_i].m_init;
			}else{
				bb_config_Err("Missing function argument '"+t_funcDecl.m_argDecls[t_i].m_ident+"'.");
			}
		}
	}
	return t_args;
}
c_Expr.prototype.p_ToString=function(){
	return "<Expr>";
}
c_Expr.prototype.p_Eval=function(){
	bb_config_Err(this.p_ToString()+" cannot be statically evaluated.");
	return "";
}
c_Expr.prototype.p_EvalConst=function(){
	return (c_ConstExpr.m_new.call(new c_ConstExpr,this.m_exprType,this.p_Eval())).p_Semant();
}
c_Expr.prototype.p_Semant2=function(t_ty,t_castFlags){
	var t_expr=this.p_Semant();
	if((t_expr.m_exprType.p_EqualsType(t_ty))!=0){
		return t_expr;
	}
	return (c_CastExpr.m_new.call(new c_CastExpr,t_ty,t_expr,t_castFlags)).p_Semant();
}
c_Expr.prototype.p_Copy=function(){
	bb_config_InternalErr("Internal error");
	return null;
}
c_Expr.prototype.p_CopyExpr=function(t_expr){
	if(!((t_expr)!=null)){
		return null;
	}
	return t_expr.p_Copy();
}
c_Expr.prototype.p_CopyArgs=function(t_exprs){
	t_exprs=t_exprs.slice(0);
	for(var t_i=0;t_i<t_exprs.length;t_i=t_i+1){
		t_exprs[t_i]=this.p_CopyExpr(t_exprs[t_i]);
	}
	return t_exprs;
}
c_Expr.prototype.p_BalanceTypes=function(t_lhs,t_rhs){
	if(((object_downcast((t_lhs),c_StringType))!=null) || ((object_downcast((t_rhs),c_StringType))!=null)){
		return (c_Type.m_stringType);
	}
	if(((object_downcast((t_lhs),c_FloatType))!=null) || ((object_downcast((t_rhs),c_FloatType))!=null)){
		return (c_Type.m_floatType);
	}
	if(((object_downcast((t_lhs),c_IntType))!=null) || ((object_downcast((t_rhs),c_IntType))!=null)){
		return (c_Type.m_intType);
	}
	if((t_lhs.p_ExtendsType(t_rhs))!=0){
		return t_rhs;
	}
	if((t_rhs.p_ExtendsType(t_lhs))!=0){
		return t_lhs;
	}
	bb_config_Err("Can't balance types "+t_lhs.p_ToString()+" and "+t_rhs.p_ToString()+".");
	return null;
}
c_Expr.prototype.p_SemantSet=function(t_op,t_rhs){
	bb_config_Err(this.p_ToString()+" cannot be assigned to.");
	return null;
}
c_Expr.prototype.p_SemantScope=function(){
	return null;
}
c_Expr.prototype.p_SemantFunc=function(t_args){
	bb_config_Err(this.p_ToString()+" cannot be invoked.");
	return null;
}
c_Expr.prototype.p_SideEffects=function(){
	return true;
}
c_Expr.prototype.p_Trans=function(){
	bb_config_Err("TODO!");
	return "";
}
c_Expr.prototype.p_TransStmt=function(){
	return this.p_Trans();
}
c_Expr.prototype.p_TransVar=function(){
	bb_config_InternalErr("Internal error");
	return "";
}
function c_BoolType(){
	c_Type.call(this);
}
c_BoolType.prototype=extend_class(c_Type);
c_BoolType.m_new=function(){
	c_Type.m_new.call(this);
	return this;
}
c_BoolType.prototype.p_EqualsType=function(t_ty){
	return ((object_downcast((t_ty),c_BoolType)!=null)?1:0);
}
c_BoolType.prototype.p_ExtendsType=function(t_ty){
	if((object_downcast((t_ty),c_ObjectType))!=null){
		var t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(this),"")).p_Semant();
		var t_ctor=t_ty.p_GetClass().p_FindFuncDecl("new",[t_expr],1);
		return ((((t_ctor)!=null) && t_ctor.p_IsCtor())?1:0);
	}
	return ((object_downcast((t_ty),c_IntType)!=null || object_downcast((t_ty),c_BoolType)!=null)?1:0);
}
c_BoolType.prototype.p_GetClass=function(){
	return object_downcast((bb_decl__env.p_FindDecl("bool")),c_ClassDecl);
}
c_BoolType.prototype.p_ToString=function(){
	return "Bool";
}
function bb_config_SetConfigVar(t_key,t_val,t_type){
	var t_decl=bb_config__cfgScope.m_cdecls.p_Get2(t_key);
	if((t_decl)!=null){
		t_decl.m_type=t_type;
	}else{
		t_decl=c_ConstDecl.m_new.call(new c_ConstDecl,t_key,1048576,t_type,null);
		bb_config__cfgScope.m_cdecls.p_Set2(t_key,t_decl);
	}
	t_decl.m_value=t_val;
	if((object_downcast((t_type),c_BoolType))!=null){
		if((t_val).length!=0){
			t_val="1";
		}else{
			t_val="0";
		}
	}
	bb_config__cfgScope.m_vars.p_Set(t_key,t_val);
	return 0;
}
function bb_config_SetConfigVar2(t_key,t_val){
	bb_config_SetConfigVar(t_key,t_val,(c_Type.m_stringType));
	return 0;
}
function bb_config_GetConfigVar(t_key){
	return bb_config__cfgScope.m_vars.p_Get2(t_key);
}
function bb_virtualos_GetEnv(t_Name){
	return bb_virtualos___OS_Env.p_Get2(t_Name);
}
function bb_webcc_ReplaceEnv(t_Str){
	var t_Bits=c_StringStack.m_new2.call(new c_StringStack);
	do{
		var t_i=t_Str.indexOf("${",0);
		if(t_i==-1){
			break;
		}
		var t_e=t_Str.indexOf("}",t_i+2);
		if(t_e==-1){
			break;
		}
		if(t_i>=2 && t_Str.slice(t_i-2,t_i)=="//"){
			t_Bits.p_Push(t_Str.slice(0,t_e+1));
			t_Str=t_Str.slice(t_e+1);
			continue;
		}
		var t_t=t_Str.slice(t_i+2,t_e);
		var t_v=bb_config_GetConfigVar(t_t);
		if(!((t_v).length!=0)){
			t_v=bb_virtualos_GetEnv(t_t);
		}
		t_Bits.p_Push(t_Str.slice(0,t_i));
		t_Bits.p_Push(t_v);
		t_Str=t_Str.slice(t_e+1);
	}while(!(false));
	if(t_Bits.p_IsEmpty()){
		return t_Str;
	}
	t_Bits.p_Push(t_Str);
	return t_Bits.p_Join("");
}
function c_Builder(){
	Object.call(this);
	this.m_WCC=null;
	this.m_casedConfig="";
	this.m_app=null;
	this.m_transCode="";
	this.m_TEXT_FILES="";
	this.m_IMAGE_FILES="";
	this.m_SOUND_FILES="";
	this.m_MUSIC_FILES="";
	this.m_BINARY_FILES="";
	this.m_DATA_FILES="";
	this.m_syncData=false;
	this.m_dataFiles=c_StringMap.m_new.call(new c_StringMap);
}
c_Builder.m_new=function(t_WCC){
	this.m_WCC=t_WCC;
	return this;
}
c_Builder.m_new2=function(){
	return this;
}
c_Builder.prototype.p_IsValid=function(){
}
c_Builder.prototype.p_Begin=function(){
}
c_Builder.prototype.p_MakeTarget=function(){
}
c_Builder.prototype.p_Make=function(){
	var t_1=this.m_WCC.m_opt_config;
	if(t_1=="" || t_1=="debug"){
		this.m_WCC.m_opt_config="debug";
		this.m_casedConfig="Debug";
	}else{
		if(t_1=="release"){
			this.m_casedConfig="Release";
		}else{
			bb_webcc_Die("Invalid config",-1);
		}
	}
	if(FileType(this.m_WCC.m_opt_srcpath)!=1){
		bb_webcc_Die("Invalid source file",-1);
	}
	this.m_WCC.m_opt_srcpath=RealPath(this.m_WCC.m_opt_srcpath);
	if(!((this.m_WCC.m_opt_modpath).length!=0)){
		this.m_WCC.m_opt_modpath=this.m_WCC.m_monkeydir+"/modules";
	}
	this.m_WCC.m_opt_modpath=".;"+bb_virtualos_ExtractDir(this.m_WCC.m_opt_srcpath)+";"+this.m_WCC.m_opt_modpath+";"+this.m_WCC.m_monkeydir+"/targets/"+this.m_WCC.m_target.m_dir+"/modules";
	if(!this.m_WCC.m_opt_check){
		this.m_WCC.m_opt_check=true;
		this.m_WCC.m_opt_update=true;
		this.m_WCC.m_opt_build=true;
	}
	bb_config_ENV_HOST=HostOS();
	bb_config_ENV_CONFIG=this.m_WCC.m_opt_config;
	bb_config_ENV_SAFEMODE=((this.m_WCC.m_opt_safe)?1:0);
	bb_config_ENV_MODPATH=this.m_WCC.m_opt_modpath;
	bb_config_ENV_TARGET=this.m_WCC.m_target.m_system;
	this.p_Begin();
	if(!this.m_WCC.m_opt_check){
		return;
	}
	print("Parsing...");
	bb_config_SetConfigVar2("HOST",bb_config_ENV_HOST);
	bb_config_SetConfigVar2("LANG",bb_config_ENV_LANG);
	bb_config_SetConfigVar2("TARGET",bb_config_ENV_TARGET);
	bb_config_SetConfigVar2("CONFIG",bb_config_ENV_CONFIG);
	bb_config_SetConfigVar2("SAFEMODE",String(bb_config_ENV_SAFEMODE));
	this.m_app=bb_parser_ParseApp(this.m_WCC.m_opt_srcpath);
	print("Semanting...");
	if((bb_config_GetConfigVar("REFLECTION_FILTER")).length!=0){
		var t_r=c_Reflector.m_new.call(new c_Reflector);
		t_r.p_Semant3(this.m_app);
	}else{
		this.m_app.p_Semant();
	}
	print("Translating...");
	var t_transbuf=c_StringStack.m_new2.call(new c_StringStack);
	var t_=this.m_app.m_fileImports.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_file=t_.p_NextObject();
		if(bb_virtualos_ExtractExt(t_file).toLowerCase()==bb_config_ENV_LANG){
			t_transbuf.p_Push(LoadString(t_file));
			t_transbuf.p_Push("\n");
		}
	}
	t_transbuf.p_Push(bb_translator__trans.p_TransApp(this.m_app));
	if(!this.m_WCC.m_opt_update){
		return;
	}
	print("Building...");
	this.m_transCode=t_transbuf.p_Join("");
	var t_buildPath="";
	if((this.m_WCC.m_opt_builddir).length!=0){
		t_buildPath=bb_virtualos_ExtractDir(this.m_WCC.m_opt_srcpath)+"/"+this.m_WCC.m_opt_builddir;
	}else{
		t_buildPath=bb_virtualos_StripExt(this.m_WCC.m_opt_srcpath)+".build"+this.m_WCC.p_GetReleaseVersion();
	}
	var t_targetPath=t_buildPath+"/"+this.m_WCC.m_target.m_dir;
	if(this.m_WCC.m_opt_clean){
		DeleteDir(t_targetPath,true);
		if(FileType(t_targetPath)!=0){
			bb_webcc_Die("Failed to clean target dir",-1);
		}
	}
	if(FileType(t_targetPath)==0){
		if(FileType(t_buildPath)==0){
			CreateDir(t_buildPath);
		}
		if(FileType(t_buildPath)!=2){
			bb_webcc_Die("Failed to create build dir: "+t_buildPath,-1);
		}
		if(!bb_virtualos_CopyDir(this.m_WCC.m_monkeydir+"/targets/"+this.m_WCC.m_target.m_dir+"/template",t_targetPath,true,false)){
			bb_webcc_Die("Failed to copy target dir",-1);
		}
	}
	if(FileType(t_targetPath)!=2){
		bb_webcc_Die("Failed to create target dir: "+t_targetPath,-1);
	}
	var t_cfgPath=t_targetPath+"/CONFIG.MONKEY";
	if(FileType(t_cfgPath)==1){
		bb_preprocessor_PreProcess(t_cfgPath,null);
	}
	this.m_TEXT_FILES=bb_config_GetConfigVar("TEXT_FILES");
	this.m_IMAGE_FILES=bb_config_GetConfigVar("IMAGE_FILES");
	this.m_SOUND_FILES=bb_config_GetConfigVar("SOUND_FILES");
	this.m_MUSIC_FILES=bb_config_GetConfigVar("MUSIC_FILES");
	this.m_BINARY_FILES=bb_config_GetConfigVar("BINARY_FILES");
	this.m_DATA_FILES=this.m_TEXT_FILES;
	if((this.m_IMAGE_FILES).length!=0){
		this.m_DATA_FILES=this.m_DATA_FILES+("|"+this.m_IMAGE_FILES);
	}
	if((this.m_SOUND_FILES).length!=0){
		this.m_DATA_FILES=this.m_DATA_FILES+("|"+this.m_SOUND_FILES);
	}
	if((this.m_MUSIC_FILES).length!=0){
		this.m_DATA_FILES=this.m_DATA_FILES+("|"+this.m_MUSIC_FILES);
	}
	if((this.m_BINARY_FILES).length!=0){
		this.m_DATA_FILES=this.m_DATA_FILES+("|"+this.m_BINARY_FILES);
	}
	this.m_DATA_FILES=string_replace(this.m_DATA_FILES,";","|");
	this.m_syncData=bb_config_GetConfigVar("FAST_SYNC_PROJECT_DATA")=="1";
	var t_cd=CurrentDir();
	ChangeDir(t_targetPath);
	this.p_MakeTarget();
	ChangeDir(t_cd);
}
c_Builder.prototype.p_CCopyFile=function(t_src,t_dst){
	if(FileTime(t_src)>FileTime(t_dst) || FileSize(t_src)!=FileSize(t_dst)){
		DeleteFile(t_dst);
		CopyFile(t_src,t_dst);
	}
}
c_Builder.prototype.p_CreateDataDir=function(t_dir){
	t_dir=RealPath(t_dir);
	if(!this.m_syncData){
		DeleteDir(t_dir,true);
	}
	CreateDir(t_dir);
	if(FileType(t_dir)!=2){
		bb_webcc_Die("Failed to create target project data dir: "+t_dir,-1);
	}
	var t_dataPath=bb_virtualos_StripExt(this.m_WCC.m_opt_srcpath)+".data";
	if(FileType(t_dataPath)!=2){
		t_dataPath="";
	}
	var t_udata=c_StringSet.m_new.call(new c_StringSet);
	if((t_dataPath).length!=0){
		var t_srcs=c_StringStack.m_new2.call(new c_StringStack);
		t_srcs.p_Push(t_dataPath);
		while(!t_srcs.p_IsEmpty()){
			var t_src=t_srcs.p_Pop();
			var t_=LoadDir(t_src);
			var t_2=0;
			while(t_2<t_.length){
				var t_f=t_[t_2];
				t_2=t_2+1;
				if(string_startswith(t_f,".")){
					continue;
				}
				var t_p=t_src+"/"+t_f;
				var t_r=t_p.slice(t_dataPath.length+1);
				var t_t=t_dir+"/"+t_r;
				var t_22=FileType(t_p);
				if(t_22==1){
					if(bb_webcc_MatchPath(t_r,this.m_DATA_FILES)){
						this.p_CCopyFile(t_p,t_t);
						t_udata.p_Insert(t_t);
						this.m_dataFiles.p_Set(t_p,t_r);
					}
				}else{
					if(t_22==2){
						CreateDir(t_t);
						t_srcs.p_Push(t_p);
					}
				}
			}
		}
	}
	var t_3=this.m_app.m_fileImports.p_ObjectEnumerator();
	while(t_3.p_HasNext()){
		var t_p2=t_3.p_NextObject();
		var t_r2=bb_virtualos_StripDir(t_p2);
		var t_t2=t_dir+"/"+t_r2;
		if(bb_webcc_MatchPath(t_r2,this.m_DATA_FILES)){
			this.p_CCopyFile(t_p2,t_t2);
			t_udata.p_Insert(t_t2);
			this.m_dataFiles.p_Set(t_p2,t_r2);
		}
	}
	if((t_dataPath).length!=0){
		var t_dsts=c_StringStack.m_new2.call(new c_StringStack);
		t_dsts.p_Push(t_dir);
		while(!t_dsts.p_IsEmpty()){
			var t_dst=t_dsts.p_Pop();
			var t_4=LoadDir(t_dst);
			var t_5=0;
			while(t_5<t_4.length){
				var t_f2=t_4[t_5];
				t_5=t_5+1;
				if(string_startswith(t_f2,".")){
					continue;
				}
				var t_p3=t_dst+"/"+t_f2;
				var t_r3=t_p3.slice(t_dir.length+1);
				var t_t3=t_dataPath+"/"+t_r3;
				var t_32=FileType(t_p3);
				if(t_32==1){
					if(!t_udata.p_Contains(t_p3)){
						DeleteFile(t_p3);
					}
				}else{
					if(t_32==2){
						if(FileType(t_t3)==2){
							t_dsts.p_Push(t_p3);
						}else{
							DeleteDir(t_p3,true);
						}
					}
				}
			}
		}
	}
}
c_Builder.prototype.p_Execute=function(t_cmd,t_failHard){
	return this.m_WCC.p_Execute(t_cmd,t_failHard);
}
function c_Map3(){
	Object.call(this);
	this.m_root=null;
}
c_Map3.m_new=function(){
	return this;
}
c_Map3.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map3.prototype.p_RotateLeft3=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map3.prototype.p_RotateRight3=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map3.prototype.p_InsertFixup3=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft3(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight3(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight3(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft3(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map3.prototype.p_Set3=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node3.m_new.call(new c_Node3,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup3(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
c_Map3.prototype.p_FirstNode=function(){
	if(!((this.m_root)!=null)){
		return null;
	}
	var t_node=this.m_root;
	while((t_node.m_left)!=null){
		t_node=t_node.m_left;
	}
	return t_node;
}
c_Map3.prototype.p_ObjectEnumerator=function(){
	return c_NodeEnumerator.m_new.call(new c_NodeEnumerator,this.p_FirstNode());
}
c_Map3.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map3.prototype.p_Get2=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
function c_StringMap3(){
	c_Map3.call(this);
}
c_StringMap3.prototype=extend_class(c_Map3);
c_StringMap3.m_new=function(){
	c_Map3.m_new.call(this);
	return this;
}
c_StringMap3.prototype.p_Compare=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_Html5Builder(){
	c_Builder.call(this);
}
c_Html5Builder.prototype=extend_class(c_Builder);
c_Html5Builder.m_new=function(t_WCC){
	c_Builder.m_new.call(this,t_WCC);
	return this;
}
c_Html5Builder.m_new2=function(){
	c_Builder.m_new2.call(this);
	return this;
}
c_Html5Builder.prototype.p_IsValid=function(){
	return true;
}
c_Html5Builder.prototype.p_Begin=function(){
	bb_config_ENV_LANG="js";
	bb_translator__trans=(c_JsTranslator.m_new.call(new c_JsTranslator));
}
c_Html5Builder.prototype.p_MetaData=function(){
	var t_meta=c_StringStack.m_new2.call(new c_StringStack);
	var t_=this.m_dataFiles.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_kv=t_.p_NextObject();
		var t_src=t_kv.p_Key();
		var t_ext=bb_virtualos_ExtractExt(t_src).toLowerCase();
		var t_3=t_ext;
		if(t_3=="png" || t_3=="jpg" || t_3=="gif"){
			bb_jshtml5_Info_Width=0;
			bb_jshtml5_Info_Height=0;
			var t_4=t_ext;
			if(t_4=="png"){
				bb_jshtml5_GetInfo_PNG(t_src);
			}else{
				if(t_4=="jpg"){
					bb_jshtml5_GetInfo_JPG(t_src);
				}else{
					if(t_4=="gif"){
						bb_jshtml5_GetInfo_GIF(t_src);
					}
				}
			}
			if(bb_jshtml5_Info_Width==0 || bb_jshtml5_Info_Height==0){
				bb_webcc_Die("Unable to load image file '"+t_src+"'.",-1);
			}
			t_meta.p_Push("["+t_kv.p_Value()+"];type=image/"+t_ext+";");
			t_meta.p_Push("width="+String(bb_jshtml5_Info_Width)+";");
			t_meta.p_Push("height="+String(bb_jshtml5_Info_Height)+";");
			t_meta.p_Push("\\n");
		}
	}
	return t_meta.p_Join("");
}
c_Html5Builder.prototype.p_Config=function(){
	var t_config=c_StringStack.m_new2.call(new c_StringStack);
	var t_=bb_config_GetConfigVars().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_kv=t_.p_NextObject();
		t_config.p_Push("CFG_"+t_kv.p_Key()+"="+bb_config_Enquote(t_kv.p_Value(),"js")+";");
	}
	return t_config.p_Join("\n");
}
c_Html5Builder.prototype.p_MakeTarget=function(){
	this.p_CreateDataDir("data");
	var t_meta="var META_DATA=\""+this.p_MetaData()+"\";\n";
	var t_main=LoadString("main.js");
	t_main=bb_webcc_ReplaceBlock(t_main,"TRANSCODE",this.m_transCode,"\n//");
	t_main=bb_webcc_ReplaceBlock(t_main,"METADATA",t_meta,"\n//");
	t_main=bb_webcc_ReplaceBlock(t_main,"CONFIG",this.p_Config(),"\n//");
	SaveString(t_main,"main.js");
	if(this.m_WCC.m_opt_run){
		var t_p=RealPath("MonkeyGame.html");
		var t_t=this.m_WCC.m_HTML_PLAYER+" \""+t_p+"\"";
		this.p_Execute(t_t,false);
	}
}
function c_Node3(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node3.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node3.m_new2=function(){
	return this;
}
c_Node3.prototype.p_NextNode=function(){
	var t_node=null;
	if((this.m_right)!=null){
		t_node=this.m_right;
		while((t_node.m_left)!=null){
			t_node=t_node.m_left;
		}
		return t_node;
	}
	t_node=this;
	var t_parent=this.m_parent;
	while(((t_parent)!=null) && t_node==t_parent.m_right){
		t_node=t_parent;
		t_parent=t_parent.m_parent;
	}
	return t_parent;
}
c_Node3.prototype.p_Value=function(){
	return this.m_value;
}
c_Node3.prototype.p_Key=function(){
	return this.m_key;
}
function bb_builders_Builders(t_WCC){
	var t_BuildMap=c_StringMap3.m_new.call(new c_StringMap3);
	t_BuildMap.p_Set3("html5",(c_Html5Builder.m_new.call(new c_Html5Builder,t_WCC)));
	return t_BuildMap;
}
function c_NodeEnumerator(){
	Object.call(this);
	this.m_node=null;
}
c_NodeEnumerator.m_new=function(t_node){
	this.m_node=t_node;
	return this;
}
c_NodeEnumerator.m_new2=function(){
	return this;
}
c_NodeEnumerator.prototype.p_HasNext=function(){
	return this.m_node!=null;
}
c_NodeEnumerator.prototype.p_NextObject=function(){
	var t_t=this.m_node;
	this.m_node=this.m_node.p_NextNode();
	return t_t;
}
function c_Deque(){
	Object.call(this);
	this.m__data=new_string_array(4);
	this.m__capacity=0;
	this.m__last=0;
	this.m__first=0;
}
c_Deque.m_new=function(){
	return this;
}
c_Deque.m_new2=function(t_arr){
	this.m__data=t_arr.slice(0);
	this.m__capacity=this.m__data.length;
	this.m__last=this.m__capacity;
	return this;
}
c_Deque.prototype.p_Length2=function(){
	if(this.m__last>=this.m__first){
		return this.m__last-this.m__first;
	}
	return this.m__capacity-this.m__first+this.m__last;
}
c_Deque.prototype.p_Grow=function(){
	var t_data=new_string_array(this.m__capacity*2+10);
	if(this.m__first<=this.m__last){
		for(var t_i=this.m__first;t_i<this.m__last;t_i=t_i+1){
			t_data[t_i-this.m__first]=this.m__data[t_i];
		}
		this.m__last-=this.m__first;
		this.m__first=0;
	}else{
		var t_n=this.m__capacity-this.m__first;
		for(var t_i2=0;t_i2<t_n;t_i2=t_i2+1){
			t_data[t_i2]=this.m__data[this.m__first+t_i2];
		}
		for(var t_i3=0;t_i3<this.m__last;t_i3=t_i3+1){
			t_data[t_n+t_i3]=this.m__data[t_i3];
		}
		this.m__last+=t_n;
		this.m__first=0;
	}
	this.m__capacity=t_data.length;
	this.m__data=t_data;
}
c_Deque.prototype.p_PushFirst=function(t_value){
	if(this.p_Length2()+1>=this.m__capacity){
		this.p_Grow();
	}
	this.m__first-=1;
	if(this.m__first<0){
		this.m__first=this.m__capacity-1;
	}
	this.m__data[this.m__first]=t_value;
}
c_Deque.prototype.p_IsEmpty=function(){
	return this.m__first==this.m__last;
}
c_Deque.m_NIL="";
c_Deque.prototype.p_PopFirst=function(){
	var t_v=this.m__data[this.m__first];
	this.m__data[this.m__first]=c_Deque.m_NIL;
	this.m__first+=1;
	if(this.m__first==this.m__capacity){
		this.m__first=0;
	}
	return t_v;
}
c_Deque.prototype.p_PushLast=function(t_value){
	if(this.p_Length2()+1>=this.m__capacity){
		this.p_Grow();
	}
	this.m__data[this.m__last]=t_value;
	this.m__last+=1;
	if(this.m__last==this.m__capacity){
		this.m__last=0;
	}
}
c_Deque.prototype.p_ToArray=function(){
	var t_data=new_string_array(this.p_Length2());
	if(this.m__first<=this.m__last){
		for(var t_i=this.m__first;t_i<this.m__last;t_i=t_i+1){
			t_data[t_i-this.m__first]=this.m__data[t_i];
		}
	}else{
		var t_n=this.m__capacity-this.m__first;
		for(var t_i2=0;t_i2<t_n;t_i2=t_i2+1){
			t_data[t_i2]=this.m__data[this.m__first+t_i2];
		}
		for(var t_i3=0;t_i3<this.m__last;t_i3=t_i3+1){
			t_data[t_n+t_i3]=this.m__data[t_i3];
		}
	}
	return t_data;
}
function c_StringDeque(){
	c_Deque.call(this);
}
c_StringDeque.prototype=extend_class(c_Deque);
c_StringDeque.m_new=function(){
	c_Deque.m_new.call(this);
	return this;
}
c_StringDeque.m_new2=function(t_data){
	c_Deque.m_new2.call(this,t_data);
	return this;
}
function bb_virtualos_LoadDir(t_Path,t_Recursive,t_Hidden){
	var t_Dirs=c_StringDeque.m_new.call(new c_StringDeque);
	var t_Files=c_StringDeque.m_new.call(new c_StringDeque);
	t_Dirs.p_PushFirst("");
	while(!t_Dirs.p_IsEmpty()){
		var t_Dir=t_Dirs.p_PopFirst();
		var t_=LoadDir(t_Path+"/"+t_Dir);
		var t_2=0;
		while(t_2<t_.length){
			var t_F=t_[t_2];
			t_2=t_2+1;
			if(!t_Hidden && string_startswith(t_F,".")){
				continue;
			}
			if(t_Dir.length>0){
				t_F=t_Dir+"/"+t_F;
			}
			var t_1=FileType(t_Path+"/"+t_F);
			if(t_1==1){
				t_Files.p_PushLast(t_F);
			}else{
				if(t_1==2){
					if(t_Recursive){
						t_Dirs.p_PushLast(t_F);
					}else{
						t_Files.p_PushLast(t_F);
					}
				}
			}
		}
	}
	return t_Files.p_ToArray();
}
function c_Stack4(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack4.m_new=function(){
	return this;
}
c_Stack4.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack4.prototype.p_Push10=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack4.prototype.p_Push11=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push10(t_values[t_offset+t_i]);
	}
}
c_Stack4.prototype.p_Push12=function(t_values,t_offset){
	this.p_Push11(t_values,t_offset,t_values.length-t_offset);
}
c_Stack4.m_NIL=null;
c_Stack4.prototype.p_Pop=function(){
	this.m_length-=1;
	var t_v=this.m_data[this.m_length];
	this.m_data[this.m_length]=c_Stack4.m_NIL;
	return t_v;
}
var bb_config__cfgScopeStack=null;
function bb_config_PushConfigScope(){
	bb_config__cfgScopeStack.p_Push10(bb_config__cfgScope);
	bb_config__cfgScope=c_ConfigScope.m_new.call(new c_ConfigScope);
}
function c_ModuleDecl(){
	c_ScopeDecl.call(this);
	this.m_rmodpath="";
	this.m_filepath="";
	this.m_modpath="";
	this.m_imported=c_StringMap5.m_new.call(new c_StringMap5);
	this.m_friends=c_StringSet.m_new.call(new c_StringSet);
	this.m_pubImported=c_StringMap5.m_new.call(new c_StringMap5);
}
c_ModuleDecl.prototype=extend_class(c_ScopeDecl);
c_ModuleDecl.m_new=function(t_ident,t_attrs,t_munged,t_modpath,t_filepath,t_app){
	c_ScopeDecl.m_new.call(this);
	this.m_ident=t_ident;
	this.m_attrs=t_attrs;
	this.m_munged=t_munged;
	this.m_modpath=t_modpath;
	this.m_rmodpath=t_modpath;
	this.m_filepath=t_filepath;
	if(t_modpath.indexOf(".")!=-1){
		var t_bits=t_modpath.split(".");
		var t_n=t_bits.length;
		if(t_n>1 && t_bits[t_n-2]==t_bits[t_n-1]){
			this.m_rmodpath=bb_virtualos_StripExt(t_modpath);
		}
	}
	this.m_imported.p_Set5(t_filepath,this);
	t_app.p_InsertModule(this);
	return this;
}
c_ModuleDecl.m_new2=function(){
	c_ScopeDecl.m_new.call(this);
	return this;
}
c_ModuleDecl.prototype.p_IsStrict=function(){
	return (((this.m_attrs&1)!=0)?1:0);
}
c_ModuleDecl.prototype.p_ImportModule=function(t_modpath,t_attrs){
	var t_cdir=bb_virtualos_ExtractDir(this.m_filepath);
	var t_dir="";
	var t_filepath="";
	var t_mpath=string_replace(t_modpath,".","/")+"."+bb_parser_FILE_EXT;
	var t_=bb_config_ENV_MODPATH.split(";");
	var t_2=0;
	while(t_2<t_.length){
		t_dir=t_[t_2];
		t_2=t_2+1;
		if(!((t_dir).length!=0)){
			continue;
		}
		if(t_dir=="."){
			t_filepath=t_cdir+"/"+t_mpath;
		}else{
			t_filepath=RealPath(t_dir)+"/"+t_mpath;
		}
		var t_filepath2=bb_virtualos_StripExt(t_filepath)+"/"+bb_virtualos_StripDir(t_filepath);
		if(FileType(t_filepath)==1){
			if(FileType(t_filepath2)!=1){
				break;
			}
			bb_config_Err("Duplicate module file: '"+t_filepath+"' and '"+t_filepath2+"'.");
		}
		t_filepath=t_filepath2;
		if(FileType(t_filepath)==1){
			if(t_modpath.indexOf(".")!=-1){
				t_modpath=t_modpath+("."+bb_virtualos_ExtractExt(t_modpath));
			}else{
				t_modpath=t_modpath+("."+t_modpath);
			}
			break;
		}
		t_filepath="";
	}
	if(t_dir=="." && (this.m_modpath.indexOf(".")!=-1)){
		t_modpath=bb_virtualos_StripExt(this.m_modpath)+"."+t_modpath;
	}
	var t_app=object_downcast((this.m_scope),c_AppDecl);
	var t_mdecl=t_app.m_imported.p_Get2(t_filepath);
	if(((t_mdecl)!=null) && t_mdecl.m_modpath!=t_modpath){
		print("Modpath error - import="+t_modpath+", existing="+t_mdecl.m_modpath);
	}
	if(this.m_imported.p_Contains(t_filepath)){
		return 0;
	}
	if(!((t_mdecl)!=null)){
		t_mdecl=bb_parser_ParseModule(t_modpath,t_filepath,t_app);
	}
	this.m_imported.p_Insert3(t_mdecl.m_filepath,t_mdecl);
	if(!((t_attrs&512)!=0)){
		this.m_pubImported.p_Insert3(t_mdecl.m_filepath,t_mdecl);
	}
	this.p_InsertDecl(c_AliasDecl.m_new.call(new c_AliasDecl,t_mdecl.m_ident,t_attrs,(t_mdecl)));
	return 0;
}
c_ModuleDecl.prototype.p_SemantAll=function(){
	var t_=this.p_Decls().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_decl=t_.p_NextObject();
		if((object_downcast((t_decl),c_AliasDecl))!=null){
			continue;
		}
		var t_cdecl=object_downcast((t_decl),c_ClassDecl);
		if((t_cdecl)!=null){
			if((t_cdecl.m_args).length!=0){
				var t_2=t_cdecl.m_instances.p_ObjectEnumerator();
				while(t_2.p_HasNext()){
					var t_inst=t_2.p_NextObject();
					var t_3=t_inst.p_Decls().p_ObjectEnumerator();
					while(t_3.p_HasNext()){
						var t_decl2=t_3.p_NextObject();
						if((object_downcast((t_decl2),c_AliasDecl))!=null){
							continue;
						}
						t_decl2.p_Semant();
					}
				}
			}else{
				t_decl.p_Semant();
				var t_4=t_cdecl.p_Decls().p_ObjectEnumerator();
				while(t_4.p_HasNext()){
					var t_decl3=t_4.p_NextObject();
					if((object_downcast((t_decl3),c_AliasDecl))!=null){
						continue;
					}
					t_decl3.p_Semant();
				}
			}
		}else{
			t_decl.p_Semant();
		}
	}
	this.m_attrs|=2;
	return 0;
}
c_ModuleDecl.prototype.p_ToString=function(){
	return "Module "+this.m_modpath;
}
c_ModuleDecl.prototype.p_GetDecl2=function(t_ident){
	return c_ScopeDecl.prototype.p_GetDecl.call(this,t_ident);
}
c_ModuleDecl.prototype.p_GetDecl=function(t_ident){
	var t_todo=c_List9.m_new.call(new c_List9);
	var t_done=c_StringMap5.m_new.call(new c_StringMap5);
	t_todo.p_AddLast9(this);
	t_done.p_Insert3(this.m_filepath,this);
	var t_decl=null;
	var t_declmod="";
	while(!t_todo.p_IsEmpty()){
		var t_mdecl=t_todo.p_RemoveLast();
		var t_tdecl=t_mdecl.p_GetDecl2(t_ident);
		if(((t_tdecl)!=null) && ((bb_decl__env)!=null)){
			var t_ddecl=object_downcast((t_tdecl),c_Decl);
			if(((t_ddecl)!=null) && !((t_ddecl.p_CheckAccess())!=0)){
				t_tdecl=null;
			}
			var t_flist=object_downcast((t_tdecl),c_FuncDeclList);
			if((t_flist)!=null){
				var t_pub=false;
				var t_=t_flist.p_ObjectEnumerator();
				while(t_.p_HasNext()){
					var t_fdecl=t_.p_NextObject();
					if(!((t_fdecl.p_CheckAccess())!=0)){
						continue;
					}
					t_pub=true;
					break;
				}
				if(!t_pub){
					t_tdecl=null;
				}
			}
		}
		if(((t_tdecl)!=null) && t_tdecl!=t_decl){
			if(t_mdecl==this){
				return t_tdecl;
			}
			if((t_decl)!=null){
				bb_config_Err("Duplicate identifier '"+t_ident+"' found in module '"+t_declmod+"' and module '"+t_mdecl.m_ident+"'.");
			}
			t_decl=t_tdecl;
			t_declmod=t_mdecl.m_ident;
		}
		if(!((bb_decl__env)!=null)){
			break;
		}
		var t_imps=t_mdecl.m_imported;
		if(t_mdecl!=bb_decl__env.p_ModuleScope()){
			t_imps=t_mdecl.m_pubImported;
		}
		var t_2=t_imps.p_Values().p_ObjectEnumerator();
		while(t_2.p_HasNext()){
			var t_mdecl2=t_2.p_NextObject();
			if(!t_done.p_Contains(t_mdecl2.m_filepath)){
				t_todo.p_AddLast9(t_mdecl2);
				t_done.p_Insert3(t_mdecl2.m_filepath,t_mdecl2);
			}
		}
	}
	return t_decl;
}
c_ModuleDecl.prototype.p_OnSemant=function(){
	return 0;
}
function bb_config_GetConfigScope(){
	return (bb_config__cfgScope);
}
var bb_decl__env=null;
function c_List(){
	Object.call(this);
	this.m__head=(c_HeadNode.m_new.call(new c_HeadNode));
}
c_List.m_new=function(){
	return this;
}
c_List.prototype.p_AddLast=function(t_data){
	return c_Node4.m_new.call(new c_Node4,this.m__head,this.m__head.m__pred,t_data);
}
c_List.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast(t_t);
	}
	return this;
}
c_List.prototype.p_IsEmpty=function(){
	return this.m__head.m__succ==this.m__head;
}
c_List.prototype.p_RemoveLast=function(){
	var t_data=this.m__head.m__pred.m__data;
	this.m__head.m__pred.p_Remove();
	return t_data;
}
c_List.prototype.p_Equals=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_List.prototype.p_FindLast=function(t_value,t_start){
	while(t_start!=this.m__head){
		if(this.p_Equals(t_value,t_start.m__data)){
			return t_start;
		}
		t_start=t_start.m__pred;
	}
	return null;
}
c_List.prototype.p_FindLast2=function(t_value){
	return this.p_FindLast(t_value,this.m__head.m__pred);
}
c_List.prototype.p_RemoveLast2=function(t_value){
	var t_node=this.p_FindLast2(t_value);
	if((t_node)!=null){
		t_node.p_Remove();
	}
}
function c_Node4(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node4.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node4.m_new2=function(){
	return this;
}
c_Node4.prototype.p_Remove=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode(){
	c_Node4.call(this);
}
c_HeadNode.prototype=extend_class(c_Node4);
c_HeadNode.m_new=function(){
	c_Node4.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
var bb_decl__envStack=null;
function bb_decl_PushEnv(t_env){
	bb_decl__envStack.p_AddLast(bb_decl__env);
	bb_decl__env=t_env;
	return 0;
}
function c_Toker(){
	Object.call(this);
	this.m__path="";
	this.m__line=0;
	this.m__source="";
	this.m__length=0;
	this.m__toke="";
	this.m__tokeType=0;
	this.m__tokePos=0;
}
c_Toker.m__keywords=null;
c_Toker.m__symbols=null;
c_Toker.prototype.p__init=function(){
	if((c_Toker.m__keywords)!=null){
		return 0;
	}
	c_Toker.m__keywords=c_StringSet.m_new.call(new c_StringSet);
	var t_="void strict public private protected friend property bool int float string array object mod continue exit include import module extern new self super eachin true false null not extends abstract final select case default const local global field method function class and or shl shr end if then else elseif endif while wend repeat until forever for to step next return interface implements inline alias try catch throw throwable".split(" ");
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		c_Toker.m__keywords.p_Insert(t_t);
	}
	c_Toker.m__symbols=c_StringSet.m_new.call(new c_StringSet);
	c_Toker.m__symbols.p_Insert("..");
	c_Toker.m__symbols.p_Insert(":=");
	c_Toker.m__symbols.p_Insert("*=");
	c_Toker.m__symbols.p_Insert("/=");
	c_Toker.m__symbols.p_Insert("+=");
	c_Toker.m__symbols.p_Insert("-=");
	c_Toker.m__symbols.p_Insert("|=");
	c_Toker.m__symbols.p_Insert("&=");
	c_Toker.m__symbols.p_Insert("~=");
	return 0;
}
c_Toker.m_new=function(t_path,t_source){
	this.p__init();
	this.m__path=t_path;
	this.m__line=1;
	this.m__source=t_source;
	this.m__length=this.m__source.length;
	this.m__toke="";
	this.m__tokeType=0;
	this.m__tokePos=0;
	return this;
}
c_Toker.m_new2=function(t_toker){
	this.p__init();
	this.m__path=t_toker.m__path;
	this.m__line=t_toker.m__line;
	this.m__source=t_toker.m__source;
	this.m__length=this.m__source.length;
	this.m__toke=t_toker.m__toke;
	this.m__tokeType=t_toker.m__tokeType;
	this.m__tokePos=t_toker.m__tokePos;
	return this;
}
c_Toker.m_new3=function(){
	return this;
}
c_Toker.prototype.p_TCHR=function(t_i){
	t_i+=this.m__tokePos;
	if(t_i<this.m__length){
		return this.m__source.charCodeAt(t_i);
	}
	return 0;
}
c_Toker.prototype.p_TSTR=function(t_i){
	t_i+=this.m__tokePos;
	if(t_i<this.m__length){
		return this.m__source.slice(t_i,t_i+1);
	}
	return "";
}
c_Toker.prototype.p_NextToke=function(){
	this.m__toke="";
	if(this.m__tokePos==this.m__length){
		this.m__tokeType=0;
		return this.m__toke;
	}
	var t_chr=this.p_TCHR(0);
	var t_str=this.p_TSTR(0);
	var t_start=this.m__tokePos;
	this.m__tokePos+=1;
	if(t_str=="\n"){
		this.m__tokeType=8;
		this.m__line+=1;
	}else{
		if((bb_config_IsSpace(t_chr))!=0){
			this.m__tokeType=1;
			while(this.m__tokePos<this.m__length && ((bb_config_IsSpace(this.p_TCHR(0)))!=0) && this.p_TSTR(0)!="\n"){
				this.m__tokePos+=1;
			}
		}else{
			if(t_str=="_" || ((bb_config_IsAlpha(t_chr))!=0)){
				this.m__tokeType=2;
				while(this.m__tokePos<this.m__length){
					var t_chr2=this.m__source.charCodeAt(this.m__tokePos);
					if(t_chr2!=95 && !((bb_config_IsAlpha(t_chr2))!=0) && !((bb_config_IsDigit(t_chr2))!=0)){
						break;
					}
					this.m__tokePos+=1;
				}
				this.m__toke=this.m__source.slice(t_start,this.m__tokePos);
				if(c_Toker.m__keywords.p_Contains(this.m__toke.toLowerCase())){
					this.m__tokeType=3;
				}
			}else{
				if(((bb_config_IsDigit(t_chr))!=0) || t_str=="." && ((bb_config_IsDigit(this.p_TCHR(0)))!=0)){
					this.m__tokeType=4;
					if(t_str=="."){
						this.m__tokeType=5;
					}
					while((bb_config_IsDigit(this.p_TCHR(0)))!=0){
						this.m__tokePos+=1;
					}
					if(this.m__tokeType==4 && this.p_TSTR(0)=="." && ((bb_config_IsDigit(this.p_TCHR(1)))!=0)){
						this.m__tokeType=5;
						this.m__tokePos+=2;
						while((bb_config_IsDigit(this.p_TCHR(0)))!=0){
							this.m__tokePos+=1;
						}
					}
					if(this.p_TSTR(0).toLowerCase()=="e"){
						this.m__tokeType=5;
						this.m__tokePos+=1;
						if(this.p_TSTR(0)=="+" || this.p_TSTR(0)=="-"){
							this.m__tokePos+=1;
						}
						while((bb_config_IsDigit(this.p_TCHR(0)))!=0){
							this.m__tokePos+=1;
						}
					}
				}else{
					if(t_str=="%" && ((bb_config_IsBinDigit(this.p_TCHR(0)))!=0)){
						this.m__tokeType=4;
						this.m__tokePos+=1;
						while((bb_config_IsBinDigit(this.p_TCHR(0)))!=0){
							this.m__tokePos+=1;
						}
					}else{
						if(t_str=="$" && ((bb_config_IsHexDigit(this.p_TCHR(0)))!=0)){
							this.m__tokeType=4;
							this.m__tokePos+=1;
							while((bb_config_IsHexDigit(this.p_TCHR(0)))!=0){
								this.m__tokePos+=1;
							}
						}else{
							if(t_str=="\""){
								this.m__tokeType=6;
								while(this.m__tokePos<this.m__length && this.p_TSTR(0)!="\""){
									this.m__tokePos+=1;
								}
								if(this.m__tokePos<this.m__length){
									this.m__tokePos+=1;
								}else{
									this.m__tokeType=7;
								}
							}else{
								if(t_str=="'"){
									this.m__tokeType=9;
									while(this.m__tokePos<this.m__length && this.p_TSTR(0)!="\n"){
										this.m__tokePos+=1;
									}
									if(this.m__tokePos<this.m__length){
										this.m__tokePos+=1;
										this.m__line+=1;
									}
								}else{
									if(t_str=="["){
										this.m__tokeType=8;
										var t_i=0;
										while(this.m__tokePos+t_i<this.m__length){
											if(this.p_TSTR(t_i)=="]"){
												this.m__tokePos+=t_i+1;
												break;
											}
											if(this.p_TSTR(t_i)=="\n" || !((bb_config_IsSpace(this.p_TCHR(t_i)))!=0)){
												break;
											}
											t_i+=1;
										}
									}else{
										this.m__tokeType=8;
										if(c_Toker.m__symbols.p_Contains(this.m__source.slice(this.m__tokePos-1,this.m__tokePos+1))){
											this.m__tokePos+=1;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if(!((this.m__toke).length!=0)){
		this.m__toke=this.m__source.slice(t_start,this.m__tokePos);
	}
	return this.m__toke;
}
c_Toker.prototype.p_Toke=function(){
	return this.m__toke;
}
c_Toker.prototype.p_TokeType=function(){
	return this.m__tokeType;
}
c_Toker.prototype.p_Path=function(){
	return this.m__path;
}
c_Toker.prototype.p_Line=function(){
	return this.m__line;
}
c_Toker.prototype.p_SkipSpace=function(){
	while(this.m__tokeType==1){
		this.p_NextToke();
	}
	return 0;
}
function c_Set(){
	Object.call(this);
	this.m_map=null;
}
c_Set.m_new=function(t_map){
	this.m_map=t_map;
	return this;
}
c_Set.m_new2=function(){
	return this;
}
c_Set.prototype.p_Insert=function(t_value){
	this.m_map.p_Insert2(t_value,null);
	return 0;
}
c_Set.prototype.p_Contains=function(t_value){
	return this.m_map.p_Contains(t_value);
}
function c_StringSet(){
	c_Set.call(this);
}
c_StringSet.prototype=extend_class(c_Set);
c_StringSet.m_new=function(){
	c_Set.m_new.call(this,(c_StringMap4.m_new.call(new c_StringMap4)));
	return this;
}
function c_Map4(){
	Object.call(this);
	this.m_root=null;
}
c_Map4.m_new=function(){
	return this;
}
c_Map4.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map4.prototype.p_RotateLeft4=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map4.prototype.p_RotateRight4=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map4.prototype.p_InsertFixup4=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft4(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight4(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight4(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft4(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map4.prototype.p_Set4=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node5.m_new.call(new c_Node5,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup4(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
c_Map4.prototype.p_Insert2=function(t_key,t_value){
	return this.p_Set4(t_key,t_value);
}
c_Map4.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map4.prototype.p_Contains=function(t_key){
	return this.p_FindNode(t_key)!=null;
}
c_Map4.prototype.p_Get2=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
function c_StringMap4(){
	c_Map4.call(this);
}
c_StringMap4.prototype=extend_class(c_Map4);
c_StringMap4.m_new=function(){
	c_Map4.m_new.call(this);
	return this;
}
c_StringMap4.prototype.p_Compare=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_Node5(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node5.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node5.m_new2=function(){
	return this;
}
function bb_config_IsSpace(t_ch){
	return ((t_ch<=32)?1:0);
}
function bb_config_IsAlpha(t_ch){
	return ((t_ch>=65 && t_ch<=90 || t_ch>=97 && t_ch<=122)?1:0);
}
function bb_config_IsDigit(t_ch){
	return ((t_ch>=48 && t_ch<=57)?1:0);
}
function bb_config_IsBinDigit(t_ch){
	return ((t_ch==48 || t_ch==49)?1:0);
}
function bb_config_IsHexDigit(t_ch){
	return ((t_ch>=48 && t_ch<=57 || t_ch>=65 && t_ch<=70 || t_ch>=97 && t_ch<=102)?1:0);
}
var bb_parser_FILE_EXT="";
var bb_config_ENV_MODPATH="";
function bb_virtualos_StripExt(t_Path){
	var t_I=t_Path.lastIndexOf(".");
	var t_SecondarySearchPos=t_I+1;
	if(t_I!=-1 && t_Path.indexOf("/",t_SecondarySearchPos)==-1 && t_Path.indexOf("\\",t_SecondarySearchPos)==-1){
		return t_Path.slice(0,t_I);
	}
	return t_Path;
}
function bb_virtualos_StripDir(t_Path){
	var t_I=t_Path.lastIndexOf("/");
	if(t_I==-1){
		t_I=t_Path.lastIndexOf("\\");
	}
	if(t_I!=-1){
		return t_Path.slice(t_I+1);
	}
	return t_Path;
}
function bb_config_Err(t_err){
	print(bb_config__errInfo+" : Error : "+t_err);
	ExitApp(-1);
	return 0;
}
function bb_virtualos_ExtractExt(t_Path){
	var t_I=t_Path.lastIndexOf(".");
	var t_SecondarySearchPos=t_I+1;
	if(t_I!=-1 && t_Path.indexOf("/",t_SecondarySearchPos)==-1 && t_Path.indexOf("\\",t_SecondarySearchPos)==-1){
		return t_Path.slice(t_SecondarySearchPos);
	}
	return "";
}
function c_AppDecl(){
	c_ScopeDecl.call(this);
	this.m_imported=c_StringMap5.m_new.call(new c_StringMap5);
	this.m_mainModule=null;
	this.m_fileImports=c_StringList.m_new2.call(new c_StringList);
	this.m_allSemantedDecls=c_List3.m_new.call(new c_List3);
	this.m_semantedGlobals=c_List8.m_new.call(new c_List8);
	this.m_semantedClasses=c_List6.m_new.call(new c_List6);
	this.m_mainFunc=null;
}
c_AppDecl.prototype=extend_class(c_ScopeDecl);
c_AppDecl.prototype.p_InsertModule=function(t_mdecl){
	t_mdecl.m_scope=(this);
	this.m_imported.p_Insert3(t_mdecl.m_filepath,t_mdecl);
	if(!((this.m_mainModule)!=null)){
		this.m_mainModule=t_mdecl;
	}
	return 0;
}
c_AppDecl.m_new=function(){
	c_ScopeDecl.m_new.call(this);
	return this;
}
c_AppDecl.prototype.p_FinalizeClasses=function(){
	bb_decl__env=null;
	do{
		var t_more=0;
		var t_=this.m_semantedClasses.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_cdecl=t_.p_NextObject();
			t_more+=t_cdecl.p_UpdateLiveMethods();
		}
		if(!((t_more)!=0)){
			break;
		}
	}while(!(false));
	var t_2=this.m_semantedClasses.p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_cdecl2=t_2.p_NextObject();
		t_cdecl2.p_FinalizeClass();
	}
	return 0;
}
c_AppDecl.prototype.p_OnSemant=function(){
	bb_decl__env=null;
	this.m_mainFunc=this.m_mainModule.p_FindFuncDecl("Main",[],0);
	if(!((this.m_mainFunc)!=null)){
		bb_config_Err("Function 'Main' not found.");
	}
	if(!((object_downcast((this.m_mainFunc.m_retType),c_IntType))!=null) || ((this.m_mainFunc.m_argDecls.length)!=0)){
		bb_config_Err("Main function must be of type Main:Int()");
	}
	this.p_FinalizeClasses();
	return 0;
}
function c_Map5(){
	Object.call(this);
	this.m_root=null;
}
c_Map5.m_new=function(){
	return this;
}
c_Map5.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map5.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map5.prototype.p_Get2=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
c_Map5.prototype.p_Contains=function(t_key){
	return this.p_FindNode(t_key)!=null;
}
c_Map5.prototype.p_RotateLeft5=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map5.prototype.p_RotateRight5=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map5.prototype.p_InsertFixup5=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft5(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight5(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight5(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft5(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map5.prototype.p_Set5=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node6.m_new.call(new c_Node6,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup5(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
c_Map5.prototype.p_Insert3=function(t_key,t_value){
	return this.p_Set5(t_key,t_value);
}
c_Map5.prototype.p_Values=function(){
	return c_MapValues.m_new.call(new c_MapValues,this);
}
c_Map5.prototype.p_FirstNode=function(){
	if(!((this.m_root)!=null)){
		return null;
	}
	var t_node=this.m_root;
	while((t_node.m_left)!=null){
		t_node=t_node.m_left;
	}
	return t_node;
}
function c_StringMap5(){
	c_Map5.call(this);
}
c_StringMap5.prototype=extend_class(c_Map5);
c_StringMap5.m_new=function(){
	c_Map5.m_new.call(this);
	return this;
}
c_StringMap5.prototype.p_Compare=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_Node6(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node6.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node6.m_new2=function(){
	return this;
}
c_Node6.prototype.p_NextNode=function(){
	var t_node=null;
	if((this.m_right)!=null){
		t_node=this.m_right;
		while((t_node.m_left)!=null){
			t_node=t_node.m_left;
		}
		return t_node;
	}
	t_node=this;
	var t_parent=this.m_parent;
	while(((t_parent)!=null) && t_node==t_parent.m_right){
		t_node=t_parent;
		t_parent=t_parent.m_parent;
	}
	return t_parent;
}
function c_Parser(){
	Object.call(this);
	this.m__toke="";
	this.m__toker=null;
	this.m__app=null;
	this.m__module=null;
	this.m__defattrs=0;
	this.m__tokeType=0;
	this.m__block=null;
	this.m__blockStack=c_List7.m_new.call(new c_List7);
	this.m__errStack=c_StringList.m_new2.call(new c_StringList);
	this.m__selTmpId=0;
}
c_Parser.prototype.p_SetErr=function(){
	if((this.m__toker.p_Path()).length!=0){
		bb_config__errInfo=this.m__toker.p_Path()+"<"+String(this.m__toker.p_Line())+">";
	}
	return 0;
}
c_Parser.prototype.p_CParse=function(t_toke){
	if(this.m__toke!=t_toke){
		return 0;
	}
	this.p_NextToke();
	return 1;
}
c_Parser.prototype.p_SkipEols=function(){
	while((this.p_CParse("\n"))!=0){
	}
	this.p_SetErr();
	return 0;
}
c_Parser.prototype.p_NextToke=function(){
	var t_toke=this.m__toke;
	do{
		this.m__toke=this.m__toker.p_NextToke();
		this.m__tokeType=this.m__toker.p_TokeType();
	}while(!(this.m__tokeType!=1));
	var t_2=this.m__tokeType;
	if(t_2==3){
		this.m__toke=this.m__toke.toLowerCase();
	}else{
		if(t_2==8){
			if(this.m__toke.charCodeAt(0)==91 && this.m__toke.charCodeAt(this.m__toke.length-1)==93){
				this.m__toke="[]";
			}
		}
	}
	if(t_toke==","){
		this.p_SkipEols();
	}
	return this.m__toke;
}
c_Parser.m_new=function(t_toker,t_app,t_mdecl,t_defattrs){
	this.m__toke="\n";
	this.m__toker=t_toker;
	this.m__app=t_app;
	this.m__module=t_mdecl;
	this.m__defattrs=t_defattrs;
	this.p_SetErr();
	this.p_NextToke();
	return this;
}
c_Parser.m_new2=function(){
	return this;
}
c_Parser.prototype.p_ParseStringLit=function(){
	if(this.m__tokeType!=6){
		bb_config_Err("Expecting string literal.");
	}
	var t_str=bb_config_Dequote(this.m__toke,"monkey");
	this.p_NextToke();
	return t_str;
}
c_Parser.prototype.p_RealPath=function(t_path){
	var t_popDir=CurrentDir();
	ChangeDir(bb_virtualos_ExtractDir(this.m__toker.p_Path()));
	t_path=RealPath(t_path);
	ChangeDir(t_popDir);
	return t_path;
}
c_Parser.prototype.p_ImportFile=function(t_filepath){
	if((bb_config_ENV_SAFEMODE)!=0){
		if(this.m__app.m_mainModule==this.m__module){
			bb_config_Err("Import of external files not permitted in safe mode.");
		}
	}
	t_filepath=this.p_RealPath(t_filepath);
	if(FileType(t_filepath)!=1){
		bb_config_Err("File '"+t_filepath+"' not found.");
	}
	this.m__app.m_fileImports.p_AddLast2(t_filepath);
	return 0;
}
c_Parser.prototype.p_ParseIdent=function(){
	var t_3=this.m__toke;
	if(t_3=="@"){
		this.p_NextToke();
	}else{
		if(t_3=="object" || t_3=="throwable"){
		}else{
			if(this.m__tokeType!=2){
				bb_config_Err("Syntax error - expecting identifier.");
			}
		}
	}
	var t_id=this.m__toke;
	this.p_NextToke();
	return t_id;
}
c_Parser.prototype.p_ParseModPath=function(){
	var t_path=this.p_ParseIdent();
	while((this.p_CParse("."))!=0){
		t_path=t_path+("."+this.p_ParseIdent());
	}
	return t_path;
}
c_Parser.prototype.p_ImportModule=function(t_modpath,t_attrs){
	return 0;
}
c_Parser.prototype.p_Parse=function(t_toke){
	if(!((this.p_CParse(t_toke))!=0)){
		bb_config_Err("Syntax error - expecting '"+t_toke+"'.");
	}
	return 0;
}
c_Parser.prototype.p_CParsePrimitiveType=function(){
	if((this.p_CParse("void"))!=0){
		return (c_Type.m_voidType);
	}
	if((this.p_CParse("bool"))!=0){
		return (c_Type.m_boolType);
	}
	if((this.p_CParse("int"))!=0){
		return (c_Type.m_intType);
	}
	if((this.p_CParse("float"))!=0){
		return (c_Type.m_floatType);
	}
	if((this.p_CParse("string"))!=0){
		return (c_Type.m_stringType);
	}
	if((this.p_CParse("object"))!=0){
		return (c_Type.m_objectType);
	}
	if((this.p_CParse("throwable"))!=0){
		return (c_Type.m_throwableType);
	}
	return null;
}
c_Parser.prototype.p_ParseIdentType=function(){
	var t_id=this.p_ParseIdent();
	if((this.p_CParse("."))!=0){
		t_id=t_id+("."+this.p_ParseIdent());
	}
	var t_args=c_Stack5.m_new.call(new c_Stack5);
	if((this.p_CParse("<"))!=0){
		do{
			var t_arg=this.p_ParseType();
			while((this.p_CParse("[]"))!=0){
				t_arg=(t_arg.p_ArrayOf());
			}
			t_args.p_Push13(t_arg);
		}while(!(!((this.p_CParse(","))!=0)));
		this.p_Parse(">");
	}
	return c_IdentType.m_new.call(new c_IdentType,t_id,t_args.p_ToArray());
}
c_Parser.prototype.p_ParseType=function(){
	var t_ty=this.p_CParsePrimitiveType();
	if((t_ty)!=null){
		return t_ty;
	}
	return (this.p_ParseIdentType());
}
c_Parser.prototype.p_ParseDeclType=function(){
	var t_ty=null;
	var t_4=this.m__toke;
	if(t_4=="?"){
		this.p_NextToke();
		t_ty=(c_Type.m_boolType);
	}else{
		if(t_4=="%"){
			this.p_NextToke();
			t_ty=(c_Type.m_intType);
		}else{
			if(t_4=="#"){
				this.p_NextToke();
				t_ty=(c_Type.m_floatType);
			}else{
				if(t_4=="$"){
					this.p_NextToke();
					t_ty=(c_Type.m_stringType);
				}else{
					if(t_4==":"){
						this.p_NextToke();
						t_ty=this.p_ParseType();
					}else{
						if((this.m__module.p_IsStrict())!=0){
							bb_config_Err("Illegal type expression.");
						}
						t_ty=(c_Type.m_intType);
					}
				}
			}
		}
	}
	while((this.p_CParse("[]"))!=0){
		t_ty=(t_ty.p_ArrayOf());
	}
	return t_ty;
}
c_Parser.prototype.p_ParseArrayExpr=function(){
	this.p_Parse("[");
	var t_args=c_Stack6.m_new.call(new c_Stack6);
	do{
		t_args.p_Push16(this.p_ParseExpr());
	}while(!(!((this.p_CParse(","))!=0)));
	this.p_Parse("]");
	return c_ArrayExpr.m_new.call(new c_ArrayExpr,t_args.p_ToArray());
}
c_Parser.prototype.p_AtEos=function(){
	return ((this.m__toke=="" || this.m__toke==";" || this.m__toke=="\n" || this.m__toke=="else")?1:0);
}
c_Parser.prototype.p_ParseArgs2=function(t_stmt){
	var t_args=[];
	if((t_stmt)!=0){
		if((this.p_AtEos())!=0){
			return t_args;
		}
	}else{
		if(this.m__toke!="("){
			return t_args;
		}
	}
	var t_nargs=0;
	var t_eat=0;
	if(this.m__toke=="("){
		if((t_stmt)!=0){
			var t_toker=c_Toker.m_new2.call(new c_Toker,this.m__toker);
			var t_bra=1;
			do{
				t_toker.p_NextToke();
				t_toker.p_SkipSpace();
				var t_5=t_toker.p_Toke().toLowerCase();
				if(t_5=="" || t_5=="else"){
					bb_config_Err("Parenthesis mismatch error.");
				}else{
					if(t_5=="(" || t_5=="["){
						t_bra+=1;
					}else{
						if(t_5=="]" || t_5==")"){
							t_bra-=1;
							if((t_bra)!=0){
								continue;
							}
							t_toker.p_NextToke();
							t_toker.p_SkipSpace();
							var t_6=t_toker.p_Toke().toLowerCase();
							if(t_6=="." || t_6=="(" || t_6=="[" || t_6=="" || t_6==";" || t_6=="\n" || t_6=="else"){
								t_eat=1;
							}
							break;
						}else{
							if(t_5==","){
								if(t_bra!=1){
									continue;
								}
								t_eat=1;
								break;
							}
						}
					}
				}
			}while(!(false));
		}else{
			t_eat=1;
		}
		if(((t_eat)!=0) && this.p_NextToke()==")"){
			this.p_NextToke();
			return t_args;
		}
	}
	do{
		var t_arg=null;
		if(((this.m__toke).length!=0) && this.m__toke!=","){
			t_arg=this.p_ParseExpr();
		}
		if(t_args.length==t_nargs){
			t_args=resize_object_array(t_args,t_nargs+10);
		}
		t_args[t_nargs]=t_arg;
		t_nargs+=1;
	}while(!(!((this.p_CParse(","))!=0)));
	t_args=t_args.slice(0,t_nargs);
	if((t_eat)!=0){
		this.p_Parse(")");
	}
	return t_args;
}
c_Parser.prototype.p_CParseIdentType=function(t_inner){
	if(this.m__tokeType!=2){
		return null;
	}
	var t_id=this.p_ParseIdent();
	if((this.p_CParse("."))!=0){
		if(this.m__tokeType!=2){
			return null;
		}
		t_id=t_id+("."+this.p_ParseIdent());
	}
	if(!((this.p_CParse("<"))!=0)){
		if(t_inner){
			return c_IdentType.m_new.call(new c_IdentType,t_id,[]);
		}
		return null;
	}
	var t_args=c_Stack5.m_new.call(new c_Stack5);
	do{
		var t_arg=this.p_CParsePrimitiveType();
		if(!((t_arg)!=null)){
			t_arg=(this.p_CParseIdentType(true));
			if(!((t_arg)!=null)){
				return null;
			}
		}
		while((this.p_CParse("[]"))!=0){
			t_arg=(t_arg.p_ArrayOf());
		}
		t_args.p_Push13(t_arg);
	}while(!(!((this.p_CParse(","))!=0)));
	if(!((this.p_CParse(">"))!=0)){
		return null;
	}
	return c_IdentType.m_new.call(new c_IdentType,t_id,t_args.p_ToArray());
}
c_Parser.prototype.p_ParsePrimaryExpr=function(t_stmt){
	var t_expr=null;
	var t_7=this.m__toke;
	if(t_7=="("){
		this.p_NextToke();
		t_expr=this.p_ParseExpr();
		this.p_Parse(")");
	}else{
		if(t_7=="["){
			t_expr=(this.p_ParseArrayExpr());
		}else{
			if(t_7=="[]"){
				this.p_NextToke();
				t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_emptyArrayType),""));
			}else{
				if(t_7=="."){
					t_expr=(c_ScopeExpr.m_new.call(new c_ScopeExpr,(this.m__module)));
				}else{
					if(t_7=="new"){
						this.p_NextToke();
						var t_ty=this.p_ParseType();
						if((this.p_CParse("["))!=0){
							var t_len=this.p_ParseExpr();
							this.p_Parse("]");
							while((this.p_CParse("[]"))!=0){
								t_ty=(t_ty.p_ArrayOf());
							}
							t_expr=(c_NewArrayExpr.m_new.call(new c_NewArrayExpr,t_ty,t_len));
						}else{
							t_expr=(c_NewObjectExpr.m_new.call(new c_NewObjectExpr,t_ty,this.p_ParseArgs2(t_stmt)));
						}
					}else{
						if(t_7=="null"){
							this.p_NextToke();
							t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_nullObjectType),""));
						}else{
							if(t_7=="true"){
								this.p_NextToke();
								t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_boolType),"1"));
							}else{
								if(t_7=="false"){
									this.p_NextToke();
									t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_boolType),""));
								}else{
									if(t_7=="bool" || t_7=="int" || t_7=="float" || t_7=="string" || t_7=="object" || t_7=="throwable"){
										var t_id=this.m__toke;
										var t_ty2=this.p_ParseType();
										if(((this.p_CParse("("))!=0)){
											t_expr=this.p_ParseExpr();
											this.p_Parse(")");
											t_expr=(c_CastExpr.m_new.call(new c_CastExpr,t_ty2,t_expr,1));
										}else{
											t_expr=(c_IdentExpr.m_new.call(new c_IdentExpr,t_id,null));
										}
									}else{
										if(t_7=="self"){
											this.p_NextToke();
											t_expr=(c_SelfExpr.m_new.call(new c_SelfExpr));
										}else{
											if(t_7=="super"){
												this.p_NextToke();
												this.p_Parse(".");
												this.p_SkipEols();
												if(this.m__toke=="new"){
													this.p_NextToke();
													var t_func=object_downcast((this.m__block),c_FuncDecl);
													if(!((t_func)!=null) || !((t_stmt)!=0) || !t_func.p_IsCtor() || !t_func.m_stmts.p_IsEmpty()){
														bb_config_Err("Call to Super.new must be first statement in a constructor.");
													}
													t_expr=(c_InvokeSuperExpr.m_new.call(new c_InvokeSuperExpr,"new",this.p_ParseArgs2(t_stmt)));
													t_func.m_attrs|=8;
												}else{
													var t_id2=this.p_ParseIdent();
													t_expr=(c_InvokeSuperExpr.m_new.call(new c_InvokeSuperExpr,t_id2,this.p_ParseArgs2(t_stmt)));
												}
											}else{
												var t_8=this.m__tokeType;
												if(t_8==2){
													var t_toker=c_Toker.m_new2.call(new c_Toker,this.m__toker);
													var t_ty3=this.p_CParseIdentType(false);
													if((t_ty3)!=null){
														t_expr=(c_IdentTypeExpr.m_new.call(new c_IdentTypeExpr,(t_ty3)));
													}else{
														this.m__toker=t_toker;
														this.m__toke=this.m__toker.p_Toke();
														this.m__tokeType=this.m__toker.p_TokeType();
														t_expr=(c_IdentExpr.m_new.call(new c_IdentExpr,this.p_ParseIdent(),null));
													}
												}else{
													if(t_8==4){
														t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_intType),this.m__toke));
														this.p_NextToke();
													}else{
														if(t_8==5){
															t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_floatType),this.m__toke));
															this.p_NextToke();
														}else{
															if(t_8==6){
																t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_stringType),bb_config_Dequote(this.m__toke,"monkey")));
																this.p_NextToke();
															}else{
																bb_config_Err("Syntax error - unexpected token '"+this.m__toke+"'");
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	do{
		var t_9=this.m__toke;
		if(t_9=="."){
			this.p_NextToke();
			this.p_SkipEols();
			var t_id3=this.p_ParseIdent();
			t_expr=(c_IdentExpr.m_new.call(new c_IdentExpr,t_id3,t_expr));
		}else{
			if(t_9=="("){
				t_expr=(c_FuncCallExpr.m_new.call(new c_FuncCallExpr,t_expr,this.p_ParseArgs2(t_stmt)));
			}else{
				if(t_9=="["){
					this.p_NextToke();
					if((this.p_CParse(".."))!=0){
						if(this.m__toke=="]"){
							t_expr=(c_SliceExpr.m_new.call(new c_SliceExpr,t_expr,null,null));
						}else{
							t_expr=(c_SliceExpr.m_new.call(new c_SliceExpr,t_expr,null,this.p_ParseExpr()));
						}
					}else{
						var t_from=this.p_ParseExpr();
						if((this.p_CParse(".."))!=0){
							if(this.m__toke=="]"){
								t_expr=(c_SliceExpr.m_new.call(new c_SliceExpr,t_expr,t_from,null));
							}else{
								t_expr=(c_SliceExpr.m_new.call(new c_SliceExpr,t_expr,t_from,this.p_ParseExpr()));
							}
						}else{
							t_expr=(c_IndexExpr.m_new.call(new c_IndexExpr,t_expr,t_from));
						}
					}
					this.p_Parse("]");
				}else{
					return t_expr;
				}
			}
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseUnaryExpr=function(){
	this.p_SkipEols();
	var t_op=this.m__toke;
	var t_10=t_op;
	if(t_10=="+" || t_10=="-" || t_10=="~" || t_10=="not"){
		this.p_NextToke();
		var t_expr=this.p_ParseUnaryExpr();
		return (c_UnaryExpr.m_new.call(new c_UnaryExpr,t_op,t_expr));
	}
	return this.p_ParsePrimaryExpr(0);
}
c_Parser.prototype.p_ParseMulDivExpr=function(){
	var t_expr=this.p_ParseUnaryExpr();
	do{
		var t_op=this.m__toke;
		var t_11=t_op;
		if(t_11=="*" || t_11=="/" || t_11=="mod" || t_11=="shl" || t_11=="shr"){
			this.p_NextToke();
			var t_rhs=this.p_ParseUnaryExpr();
			t_expr=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,t_op,t_expr,t_rhs));
		}else{
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseAddSubExpr=function(){
	var t_expr=this.p_ParseMulDivExpr();
	do{
		var t_op=this.m__toke;
		var t_12=t_op;
		if(t_12=="+" || t_12=="-"){
			this.p_NextToke();
			var t_rhs=this.p_ParseMulDivExpr();
			t_expr=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,t_op,t_expr,t_rhs));
		}else{
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseBitandExpr=function(){
	var t_expr=this.p_ParseAddSubExpr();
	do{
		var t_op=this.m__toke;
		var t_13=t_op;
		if(t_13=="&" || t_13=="~"){
			this.p_NextToke();
			var t_rhs=this.p_ParseAddSubExpr();
			t_expr=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,t_op,t_expr,t_rhs));
		}else{
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseBitorExpr=function(){
	var t_expr=this.p_ParseBitandExpr();
	do{
		var t_op=this.m__toke;
		var t_14=t_op;
		if(t_14=="|"){
			this.p_NextToke();
			var t_rhs=this.p_ParseBitandExpr();
			t_expr=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,t_op,t_expr,t_rhs));
		}else{
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseCompareExpr=function(){
	var t_expr=this.p_ParseBitorExpr();
	do{
		var t_op=this.m__toke;
		var t_15=t_op;
		if(t_15=="=" || t_15=="<" || t_15==">" || t_15=="<=" || t_15==">=" || t_15=="<>"){
			this.p_NextToke();
			if(t_op==">" && this.m__toke=="="){
				t_op=t_op+this.m__toke;
				this.p_NextToke();
			}else{
				if(t_op=="<" && (this.m__toke=="=" || this.m__toke==">")){
					t_op=t_op+this.m__toke;
					this.p_NextToke();
				}
			}
			var t_rhs=this.p_ParseBitorExpr();
			t_expr=(c_BinaryCompareExpr.m_new.call(new c_BinaryCompareExpr,t_op,t_expr,t_rhs));
		}else{
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseAndExpr=function(){
	var t_expr=this.p_ParseCompareExpr();
	do{
		var t_op=this.m__toke;
		if(t_op=="and"){
			this.p_NextToke();
			var t_rhs=this.p_ParseCompareExpr();
			t_expr=(c_BinaryLogicExpr.m_new.call(new c_BinaryLogicExpr,t_op,t_expr,t_rhs));
		}else{
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseOrExpr=function(){
	var t_expr=this.p_ParseAndExpr();
	do{
		var t_op=this.m__toke;
		if(t_op=="or"){
			this.p_NextToke();
			var t_rhs=this.p_ParseAndExpr();
			t_expr=(c_BinaryLogicExpr.m_new.call(new c_BinaryLogicExpr,t_op,t_expr,t_rhs));
		}else{
			return t_expr;
		}
	}while(!(false));
}
c_Parser.prototype.p_ParseExpr=function(){
	return this.p_ParseOrExpr();
}
c_Parser.prototype.p_ParseDecl=function(t_toke,t_attrs){
	this.p_SetErr();
	var t_id=this.p_ParseIdent();
	var t_ty=null;
	var t_init=null;
	if((t_attrs&256)!=0){
		t_ty=this.p_ParseDeclType();
	}else{
		if((this.p_CParse(":="))!=0){
			t_init=this.p_ParseExpr();
		}else{
			t_ty=this.p_ParseDeclType();
			if((this.p_CParse("="))!=0){
				t_init=this.p_ParseExpr();
			}else{
				if((this.p_CParse("["))!=0){
					var t_len=this.p_ParseExpr();
					this.p_Parse("]");
					while((this.p_CParse("[]"))!=0){
						t_ty=(t_ty.p_ArrayOf());
					}
					t_init=(c_NewArrayExpr.m_new.call(new c_NewArrayExpr,t_ty,t_len));
					t_ty=(t_ty.p_ArrayOf());
				}else{
					if(t_toke!="const"){
						t_init=(c_ConstExpr.m_new.call(new c_ConstExpr,t_ty,""));
					}else{
						bb_config_Err("Constants must be initialized.");
					}
				}
			}
		}
	}
	var t_decl=null;
	var t_21=t_toke;
	if(t_21=="global"){
		t_decl=(c_GlobalDecl.m_new.call(new c_GlobalDecl,t_id,t_attrs,t_ty,t_init));
	}else{
		if(t_21=="field"){
			t_decl=(c_FieldDecl.m_new.call(new c_FieldDecl,t_id,t_attrs,t_ty,t_init));
		}else{
			if(t_21=="const"){
				t_decl=(c_ConstDecl.m_new.call(new c_ConstDecl,t_id,t_attrs,t_ty,t_init));
			}else{
				if(t_21=="local"){
					t_decl=(c_LocalDecl.m_new.call(new c_LocalDecl,t_id,t_attrs,t_ty,t_init));
				}
			}
		}
	}
	if(((t_decl.p_IsExtern())!=0) || ((this.p_CParse("extern"))!=0)){
		t_decl.m_munged=t_decl.m_ident;
		if((this.p_CParse("="))!=0){
			t_decl.m_munged=this.p_ParseStringLit();
		}
	}
	return (t_decl);
}
c_Parser.prototype.p_ParseDecls=function(t_toke,t_attrs){
	if((t_toke).length!=0){
		this.p_Parse(t_toke);
	}
	var t_decls=c_List3.m_new.call(new c_List3);
	do{
		var t_decl=this.p_ParseDecl(t_toke,t_attrs);
		t_decls.p_AddLast3(t_decl);
		if(!((this.p_CParse(","))!=0)){
			return t_decls;
		}
	}while(!(false));
}
c_Parser.prototype.p_PushBlock=function(t_block){
	this.m__blockStack.p_AddLast7(this.m__block);
	this.m__errStack.p_AddLast2(bb_config__errInfo);
	this.m__block=t_block;
	return 0;
}
c_Parser.prototype.p_ParseDeclStmts=function(){
	var t_toke=this.m__toke;
	this.p_NextToke();
	do{
		var t_decl=this.p_ParseDecl(t_toke,0);
		this.m__block.p_AddStmt(c_DeclStmt.m_new.call(new c_DeclStmt,t_decl));
	}while(!(!((this.p_CParse(","))!=0)));
	return 0;
}
c_Parser.prototype.p_ParseReturnStmt=function(){
	this.p_Parse("return");
	var t_expr=null;
	if(!((this.p_AtEos())!=0)){
		t_expr=this.p_ParseExpr();
	}
	this.m__block.p_AddStmt(c_ReturnStmt.m_new.call(new c_ReturnStmt,t_expr));
	return 0;
}
c_Parser.prototype.p_ParseExitStmt=function(){
	this.p_Parse("exit");
	this.m__block.p_AddStmt(c_BreakStmt.m_new.call(new c_BreakStmt));
	return 0;
}
c_Parser.prototype.p_ParseContinueStmt=function(){
	this.p_Parse("continue");
	this.m__block.p_AddStmt(c_ContinueStmt.m_new.call(new c_ContinueStmt));
	return 0;
}
c_Parser.prototype.p_PopBlock=function(){
	this.m__block=this.m__blockStack.p_RemoveLast();
	bb_config__errInfo=this.m__errStack.p_RemoveLast();
	return 0;
}
c_Parser.prototype.p_ParseIfStmt=function(t_term){
	this.p_CParse("if");
	var t_expr=this.p_ParseExpr();
	this.p_CParse("then");
	var t_thenBlock=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	var t_elseBlock=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	var t_eatTerm=0;
	if(!((t_term).length!=0)){
		if(this.m__toke=="\n"){
			t_term="end";
		}else{
			t_term="\n";
		}
		t_eatTerm=1;
	}
	this.p_PushBlock(t_thenBlock);
	while(this.m__toke!=t_term){
		var t_16=this.m__toke;
		if(t_16=="endif"){
			if(t_term=="end"){
				break;
			}
			bb_config_Err("Syntax error - expecting 'End'.");
		}else{
			if(t_16=="else" || t_16=="elseif"){
				var t_elif=((this.m__toke=="elseif")?1:0);
				this.p_NextToke();
				if(this.m__block==t_elseBlock){
					bb_config_Err("If statement can only have one 'else' block.");
				}
				this.p_PopBlock();
				this.p_PushBlock(t_elseBlock);
				if(((t_elif)!=0) || this.m__toke=="if"){
					this.p_ParseIfStmt(t_term);
				}
			}else{
				this.p_ParseStmt();
			}
		}
	}
	this.p_PopBlock();
	if((t_eatTerm)!=0){
		this.p_NextToke();
		if(t_term=="end"){
			this.p_CParse("if");
		}
	}
	var t_stmt=c_IfStmt.m_new.call(new c_IfStmt,t_expr,t_thenBlock,t_elseBlock);
	this.m__block.p_AddStmt(t_stmt);
	return 0;
}
c_Parser.prototype.p_ParseWhileStmt=function(){
	this.p_Parse("while");
	var t_expr=this.p_ParseExpr();
	var t_block=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	this.p_PushBlock(t_block);
	while(!((this.p_CParse("wend"))!=0)){
		if((this.p_CParse("end"))!=0){
			this.p_CParse("while");
			break;
		}
		this.p_ParseStmt();
	}
	this.p_PopBlock();
	var t_stmt=c_WhileStmt.m_new.call(new c_WhileStmt,t_expr,t_block);
	this.m__block.p_AddStmt(t_stmt);
	return 0;
}
c_Parser.prototype.p_PushErr=function(){
	this.m__errStack.p_AddLast2(bb_config__errInfo);
	return 0;
}
c_Parser.prototype.p_PopErr=function(){
	bb_config__errInfo=this.m__errStack.p_RemoveLast();
	return 0;
}
c_Parser.prototype.p_ParseRepeatStmt=function(){
	this.p_Parse("repeat");
	var t_block=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	this.p_PushBlock(t_block);
	while(this.m__toke!="until" && this.m__toke!="forever"){
		this.p_ParseStmt();
	}
	this.p_PopBlock();
	var t_expr=null;
	if((this.p_CParse("until"))!=0){
		this.p_PushErr();
		t_expr=this.p_ParseExpr();
		this.p_PopErr();
	}else{
		this.p_Parse("forever");
		t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_boolType),""));
	}
	var t_stmt=c_RepeatStmt.m_new.call(new c_RepeatStmt,t_block,t_expr);
	this.m__block.p_AddStmt(t_stmt);
	return 0;
}
c_Parser.prototype.p_ParseForStmt=function(){
	this.p_Parse("for");
	var t_varid="";
	var t_varty=null;
	var t_varlocal=0;
	if((this.p_CParse("local"))!=0){
		t_varlocal=1;
		t_varid=this.p_ParseIdent();
		if(!((this.p_CParse(":="))!=0)){
			t_varty=this.p_ParseDeclType();
			this.p_Parse("=");
		}
	}else{
		t_varlocal=0;
		t_varid=this.p_ParseIdent();
		this.p_Parse("=");
	}
	if((this.p_CParse("eachin"))!=0){
		var t_expr=this.p_ParseExpr();
		var t_block=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
		this.p_PushBlock(t_block);
		while(!((this.p_CParse("next"))!=0)){
			if((this.p_CParse("end"))!=0){
				this.p_CParse("for");
				break;
			}
			this.p_ParseStmt();
		}
		if(this.m__tokeType==2 && this.p_ParseIdent()!=t_varid){
			bb_config_Err("Next variable name does not match For variable name");
		}
		this.p_PopBlock();
		var t_stmt=c_ForEachinStmt.m_new.call(new c_ForEachinStmt,t_varid,t_varty,t_varlocal,t_expr,t_block);
		this.m__block.p_AddStmt(t_stmt);
		return 0;
	}
	var t_from=this.p_ParseExpr();
	var t_op="";
	if((this.p_CParse("to"))!=0){
		t_op="<=";
	}else{
		if((this.p_CParse("until"))!=0){
			t_op="<";
		}else{
			bb_config_Err("Expecting 'To' or 'Until'.");
		}
	}
	var t_term=this.p_ParseExpr();
	var t_stp=null;
	if((this.p_CParse("step"))!=0){
		t_stp=this.p_ParseExpr();
	}else{
		t_stp=(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_intType),"1"));
	}
	var t_init=null;
	var t_expr2=null;
	var t_incr=null;
	if((t_varlocal)!=0){
		var t_indexVar=c_LocalDecl.m_new.call(new c_LocalDecl,t_varid,0,t_varty,t_from);
		t_init=(c_DeclStmt.m_new.call(new c_DeclStmt,(t_indexVar)));
	}else{
		t_init=(c_AssignStmt.m_new.call(new c_AssignStmt,"=",(c_IdentExpr.m_new.call(new c_IdentExpr,t_varid,null)),t_from));
	}
	t_expr2=(c_BinaryCompareExpr.m_new.call(new c_BinaryCompareExpr,t_op,(c_IdentExpr.m_new.call(new c_IdentExpr,t_varid,null)),t_term));
	t_incr=(c_AssignStmt.m_new.call(new c_AssignStmt,"=",(c_IdentExpr.m_new.call(new c_IdentExpr,t_varid,null)),(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,"+",(c_IdentExpr.m_new.call(new c_IdentExpr,t_varid,null)),t_stp))));
	var t_block2=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	this.p_PushBlock(t_block2);
	while(!((this.p_CParse("next"))!=0)){
		if((this.p_CParse("end"))!=0){
			this.p_CParse("for");
			break;
		}
		this.p_ParseStmt();
	}
	if(this.m__tokeType==2 && this.p_ParseIdent()!=t_varid){
		bb_config_Err("Next variable name does not match For variable name");
	}
	this.p_PopBlock();
	var t_stmt2=c_ForStmt.m_new.call(new c_ForStmt,t_init,t_expr2,t_incr,t_block2);
	this.m__block.p_AddStmt(t_stmt2);
	return 0;
}
c_Parser.prototype.p_ParseSelectStmt=function(){
	this.p_Parse("select");
	var t_expr=this.p_ParseExpr();
	var t_block=this.m__block;
	this.m__selTmpId+=1;
	var t_tmpId=String(this.m__selTmpId);
	t_block.p_AddStmt(c_DeclStmt.m_new2.call(new c_DeclStmt,t_tmpId,null,t_expr));
	var t_tmpExpr=c_IdentExpr.m_new.call(new c_IdentExpr,t_tmpId,null);
	while(this.m__toke!="end" && this.m__toke!="default"){
		this.p_SetErr();
		var t_17=this.m__toke;
		if(t_17=="\n"){
			this.p_NextToke();
		}else{
			if(t_17=="case"){
				this.p_NextToke();
				var t_comp=null;
				do{
					var t_expr2=(c_IdentExpr.m_new.call(new c_IdentExpr,t_tmpId,null));
					t_expr2=(c_BinaryCompareExpr.m_new.call(new c_BinaryCompareExpr,"=",t_expr2,this.p_ParseExpr()));
					if((t_comp)!=null){
						t_comp=(c_BinaryLogicExpr.m_new.call(new c_BinaryLogicExpr,"or",t_comp,t_expr2));
					}else{
						t_comp=t_expr2;
					}
				}while(!(!((this.p_CParse(","))!=0)));
				var t_thenBlock=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
				var t_elseBlock=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
				var t_ifstmt=c_IfStmt.m_new.call(new c_IfStmt,t_comp,t_thenBlock,t_elseBlock);
				t_block.p_AddStmt(t_ifstmt);
				t_block=t_ifstmt.m_thenBlock;
				this.p_PushBlock(t_block);
				while(this.m__toke!="case" && this.m__toke!="default" && this.m__toke!="end"){
					this.p_ParseStmt();
				}
				this.p_PopBlock();
				t_block=t_elseBlock;
			}else{
				bb_config_Err("Syntax error - expecting 'Case', 'Default' or 'End'.");
			}
		}
	}
	if(this.m__toke=="default"){
		this.p_NextToke();
		this.p_PushBlock(t_block);
		while(this.m__toke!="end"){
			this.p_SetErr();
			var t_18=this.m__toke;
			if(t_18=="case"){
				bb_config_Err("Case can not appear after default.");
			}else{
				if(t_18=="default"){
					bb_config_Err("Select statement can have only one default block.");
				}
			}
			this.p_ParseStmt();
		}
		this.p_PopBlock();
	}
	this.p_SetErr();
	this.p_Parse("end");
	this.p_CParse("select");
	return 0;
}
c_Parser.prototype.p_ParseTryStmt=function(){
	this.p_Parse("try");
	var t_block=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
	var t_catches=c_Stack9.m_new.call(new c_Stack9);
	this.p_PushBlock(t_block);
	while(this.m__toke!="end"){
		if((this.p_CParse("catch"))!=0){
			var t_id=this.p_ParseIdent();
			this.p_Parse(":");
			var t_ty=this.p_ParseType();
			var t_init=c_LocalDecl.m_new.call(new c_LocalDecl,t_id,0,t_ty,null);
			var t_block2=c_BlockDecl.m_new.call(new c_BlockDecl,(this.m__block));
			t_catches.p_Push25(c_CatchStmt.m_new.call(new c_CatchStmt,t_init,t_block2));
			this.p_PopBlock();
			this.p_PushBlock(t_block2);
		}else{
			this.p_ParseStmt();
		}
	}
	if(!((t_catches.p_Length2())!=0)){
		bb_config_Err("Try block must have at least one catch block");
	}
	this.p_PopBlock();
	this.p_NextToke();
	this.p_CParse("try");
	this.m__block.p_AddStmt(c_TryStmt.m_new.call(new c_TryStmt,t_block,t_catches.p_ToArray()));
	return 0;
}
c_Parser.prototype.p_ParseThrowStmt=function(){
	this.p_Parse("throw");
	this.m__block.p_AddStmt(c_ThrowStmt.m_new.call(new c_ThrowStmt,this.p_ParseExpr()));
	return 0;
}
c_Parser.prototype.p_ParseStmt=function(){
	this.p_SetErr();
	var t_19=this.m__toke;
	if(t_19==";" || t_19=="\n"){
		this.p_NextToke();
	}else{
		if(t_19=="const" || t_19=="local"){
			this.p_ParseDeclStmts();
		}else{
			if(t_19=="return"){
				this.p_ParseReturnStmt();
			}else{
				if(t_19=="exit"){
					this.p_ParseExitStmt();
				}else{
					if(t_19=="continue"){
						this.p_ParseContinueStmt();
					}else{
						if(t_19=="if"){
							this.p_ParseIfStmt("");
						}else{
							if(t_19=="while"){
								this.p_ParseWhileStmt();
							}else{
								if(t_19=="repeat"){
									this.p_ParseRepeatStmt();
								}else{
									if(t_19=="for"){
										this.p_ParseForStmt();
									}else{
										if(t_19=="select"){
											this.p_ParseSelectStmt();
										}else{
											if(t_19=="try"){
												this.p_ParseTryStmt();
											}else{
												if(t_19=="throw"){
													this.p_ParseThrowStmt();
												}else{
													var t_expr=this.p_ParsePrimaryExpr(1);
													var t_20=this.m__toke;
													if(t_20=="=" || t_20=="*=" || t_20=="/=" || t_20=="+=" || t_20=="-=" || t_20=="&=" || t_20=="|=" || t_20=="~=" || t_20=="mod" || t_20=="shl" || t_20=="shr"){
														if(((object_downcast((t_expr),c_IdentExpr))!=null) || ((object_downcast((t_expr),c_IndexExpr))!=null)){
															var t_op=this.m__toke;
															this.p_NextToke();
															if(!string_endswith(t_op,"=")){
																this.p_Parse("=");
																t_op=t_op+"=";
															}
															this.m__block.p_AddStmt(c_AssignStmt.m_new.call(new c_AssignStmt,t_op,t_expr,this.p_ParseExpr()));
														}else{
															bb_config_Err("Assignment operator '"+this.m__toke+"' cannot be used this way.");
														}
														return 0;
													}
													if((object_downcast((t_expr),c_IdentExpr))!=null){
														t_expr=(c_FuncCallExpr.m_new.call(new c_FuncCallExpr,t_expr,this.p_ParseArgs2(1)));
													}else{
														if(((object_downcast((t_expr),c_FuncCallExpr))!=null) || ((object_downcast((t_expr),c_InvokeSuperExpr))!=null) || ((object_downcast((t_expr),c_NewObjectExpr))!=null)){
														}else{
															bb_config_Err("Expression cannot be used as a statement.");
														}
													}
													this.m__block.p_AddStmt(c_ExprStmt.m_new.call(new c_ExprStmt,t_expr));
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return 0;
}
c_Parser.prototype.p_ParseFuncDecl=function(t_attrs){
	this.p_SetErr();
	if((this.p_CParse("method"))!=0){
		t_attrs|=1;
	}else{
		if(!((this.p_CParse("function"))!=0)){
			bb_config_InternalErr("Internal error");
		}
	}
	t_attrs|=this.m__defattrs;
	var t_id="";
	var t_ty=null;
	if((t_attrs&1)!=0){
		if(this.m__toke=="new"){
			if((t_attrs&256)!=0){
				bb_config_Err("Extern classes cannot have constructors.");
			}
			t_id=this.m__toke;
			this.p_NextToke();
			t_attrs|=2;
			t_attrs&=-2;
		}else{
			t_id=this.p_ParseIdent();
			t_ty=this.p_ParseDeclType();
		}
	}else{
		t_id=this.p_ParseIdent();
		t_ty=this.p_ParseDeclType();
	}
	var t_args=c_Stack8.m_new.call(new c_Stack8);
	this.p_Parse("(");
	this.p_SkipEols();
	if(this.m__toke!=")"){
		do{
			var t_id2=this.p_ParseIdent();
			var t_ty2=this.p_ParseDeclType();
			var t_init=null;
			if((this.p_CParse("="))!=0){
				t_init=this.p_ParseExpr();
			}
			t_args.p_Push22(c_ArgDecl.m_new.call(new c_ArgDecl,t_id2,0,t_ty2,t_init));
			if(this.m__toke==")"){
				break;
			}
			this.p_Parse(",");
		}while(!(false));
	}
	this.p_Parse(")");
	do{
		if((this.p_CParse("final"))!=0){
			if(!((t_attrs&1)!=0)){
				bb_config_Err("Functions cannot be final.");
			}
			if((t_attrs&2048)!=0){
				bb_config_Err("Duplicate method attribute.");
			}
			if((t_attrs&1024)!=0){
				bb_config_Err("Methods cannot be both final and abstract.");
			}
			t_attrs|=2048;
		}else{
			if((this.p_CParse("abstract"))!=0){
				if(!((t_attrs&1)!=0)){
					bb_config_Err("Functions cannot be abstract.");
				}
				if((t_attrs&1024)!=0){
					bb_config_Err("Duplicate method attribute.");
				}
				if((t_attrs&2048)!=0){
					bb_config_Err("Methods cannot be both final and abstract.");
				}
				t_attrs|=1024;
			}else{
				if((this.p_CParse("property"))!=0){
					if(!((t_attrs&1)!=0)){
						bb_config_Err("Functions cannot be properties.");
					}
					if((t_attrs&4)!=0){
						bb_config_Err("Duplicate method attribute.");
					}
					t_attrs|=4;
				}else{
					break;
				}
			}
		}
	}while(!(false));
	var t_funcDecl=c_FuncDecl.m_new.call(new c_FuncDecl,t_id,t_attrs,t_ty,t_args.p_ToArray());
	if(((t_funcDecl.p_IsExtern())!=0) || ((this.p_CParse("extern"))!=0)){
		t_funcDecl.m_munged=t_funcDecl.m_ident;
		if((this.p_CParse("="))!=0){
			t_funcDecl.m_munged=this.p_ParseStringLit();
			if(t_funcDecl.m_munged=="$resize"){
				t_funcDecl.m_retType=(c_Type.m_emptyArrayType);
			}
		}
	}
	if(((t_funcDecl.p_IsExtern())!=0) || ((t_funcDecl.p_IsAbstract())!=0)){
		return t_funcDecl;
	}
	this.p_PushBlock(t_funcDecl);
	while(this.m__toke!="end"){
		this.p_ParseStmt();
	}
	this.p_PopBlock();
	this.p_NextToke();
	if((t_attrs&3)!=0){
		this.p_CParse("method");
	}else{
		this.p_CParse("function");
	}
	return t_funcDecl;
}
c_Parser.prototype.p_ParseClassDecl=function(t_attrs){
	this.p_SetErr();
	var t_toke=this.m__toke;
	if((this.p_CParse("interface"))!=0){
		if((t_attrs&256)!=0){
			bb_config_Err("Interfaces cannot be extern.");
		}
		t_attrs|=5120;
	}else{
		if(!((this.p_CParse("class"))!=0)){
			bb_config_InternalErr("Internal error");
		}
	}
	var t_id=this.p_ParseIdent();
	var t_args=c_StringStack.m_new2.call(new c_StringStack);
	var t_superTy=c_Type.m_objectType;
	var t_imps=c_Stack7.m_new.call(new c_Stack7);
	if((this.p_CParse("<"))!=0){
		if((t_attrs&256)!=0){
			bb_config_Err("Extern classes cannot be generic.");
		}
		do{
			t_args.p_Push(this.p_ParseIdent());
		}while(!(!((this.p_CParse(","))!=0)));
		this.p_Parse(">");
	}
	if((this.p_CParse("extends"))!=0){
		if((this.p_CParse("null"))!=0){
			if((t_attrs&4096)!=0){
				bb_config_Err("Interfaces cannot extend null");
			}
			if(!((t_attrs&256)!=0)){
				bb_config_Err("Only extern objects can extend null.");
			}
			t_superTy=null;
		}else{
			if((t_attrs&4096)!=0){
				do{
					t_imps.p_Push19(this.p_ParseIdentType());
				}while(!(!((this.p_CParse(","))!=0)));
				t_superTy=c_Type.m_objectType;
			}else{
				t_superTy=this.p_ParseIdentType();
			}
		}
	}
	if((this.p_CParse("implements"))!=0){
		if((t_attrs&256)!=0){
			bb_config_Err("Implements cannot be used with external classes.");
		}
		if((t_attrs&4096)!=0){
			bb_config_Err("Implements cannot be used with interfaces.");
		}
		do{
			t_imps.p_Push19(this.p_ParseIdentType());
		}while(!(!((this.p_CParse(","))!=0)));
	}
	do{
		if((this.p_CParse("final"))!=0){
			if((t_attrs&4096)!=0){
				bb_config_Err("Interfaces cannot be final.");
			}
			if((t_attrs&2048)!=0){
				bb_config_Err("Duplicate class attribute.");
			}
			if((t_attrs&1024)!=0){
				bb_config_Err("Classes cannot be both final and abstract.");
			}
			t_attrs|=2048;
		}else{
			if((this.p_CParse("abstract"))!=0){
				if((t_attrs&4096)!=0){
					bb_config_Err("Interfaces cannot be abstract.");
				}
				if((t_attrs&1024)!=0){
					bb_config_Err("Duplicate class attribute.");
				}
				if((t_attrs&2048)!=0){
					bb_config_Err("Classes cannot be both final and abstract.");
				}
				t_attrs|=1024;
			}else{
				break;
			}
		}
	}while(!(false));
	var t_classDecl=c_ClassDecl.m_new.call(new c_ClassDecl,t_id,t_attrs,t_args.p_ToArray(),t_superTy,t_imps.p_ToArray());
	if(((t_classDecl.p_IsExtern())!=0) || ((this.p_CParse("extern"))!=0)){
		t_classDecl.m_munged=t_classDecl.m_ident;
		if((this.p_CParse("="))!=0){
			t_classDecl.m_munged=this.p_ParseStringLit();
		}
	}
	var t_decl_attrs=t_attrs&256;
	var t_func_attrs=0;
	if((t_attrs&4096)!=0){
		t_func_attrs|=1024;
	}
	do{
		this.p_SkipEols();
		var t_22=this.m__toke;
		if(t_22=="end"){
			this.p_NextToke();
			break;
		}else{
			if(t_22=="public"){
				this.p_NextToke();
				t_decl_attrs&=-16897;
			}else{
				if(t_22=="private"){
					this.p_NextToke();
					t_decl_attrs&=-16897;
					t_decl_attrs|=512;
				}else{
					if(t_22=="protected"){
						this.p_NextToke();
						t_decl_attrs&=-16897;
						t_decl_attrs|=16384;
					}else{
						if(t_22=="const" || t_22=="global" || t_22=="field"){
							if(((t_attrs&4096)!=0) && this.m__toke!="const"){
								bb_config_Err("Interfaces can only contain constants and methods.");
							}
							t_classDecl.p_InsertDecls(this.p_ParseDecls(this.m__toke,t_decl_attrs));
						}else{
							if(t_22=="method"){
								t_classDecl.p_InsertDecl(this.p_ParseFuncDecl(t_decl_attrs|t_func_attrs));
							}else{
								if(t_22=="function"){
									if((t_attrs&4096)!=0){
										bb_config_Err("Interfaces can only contain constants and methods.");
									}
									t_classDecl.p_InsertDecl(this.p_ParseFuncDecl(t_decl_attrs|t_func_attrs));
								}else{
									bb_config_Err("Syntax error - expecting class member declaration.");
								}
							}
						}
					}
				}
			}
		}
	}while(!(false));
	if((t_toke).length!=0){
		this.p_CParse(t_toke);
	}
	return t_classDecl;
}
c_Parser.prototype.p_ParseMain=function(){
	this.p_SkipEols();
	if((this.p_CParse("strict"))!=0){
		this.m__module.m_attrs|=1;
	}
	var t_attrs=0;
	while((this.m__toke).length!=0){
		this.p_SetErr();
		var t_23=this.m__toke;
		if(t_23=="\n"){
			this.p_NextToke();
		}else{
			if(t_23=="public"){
				this.p_NextToke();
				t_attrs=0;
			}else{
				if(t_23=="private"){
					this.p_NextToke();
					t_attrs=512;
				}else{
					if(t_23=="protected"){
						bb_config_Err("Protected may only be used within classes.");
					}else{
						if(t_23=="import"){
							this.p_NextToke();
							if(this.m__tokeType==6){
								this.p_ImportFile(bb_config_EvalConfigTags(this.p_ParseStringLit()));
							}else{
								this.p_ImportModule(this.p_ParseModPath(),t_attrs);
							}
						}else{
							if(t_23=="friend"){
								this.p_NextToke();
								var t_modpath=this.p_ParseModPath();
								this.m__module.m_friends.p_Insert(t_modpath);
							}else{
								if(t_23=="alias"){
									this.p_NextToke();
									do{
										var t_ident=this.p_ParseIdent();
										this.p_Parse("=");
										var t_decl=null;
										var t_24=this.m__toke;
										if(t_24=="int"){
											t_decl=(c_Type.m_intType);
										}else{
											if(t_24=="float"){
												t_decl=(c_Type.m_floatType);
											}else{
												if(t_24=="string"){
													t_decl=(c_Type.m_stringType);
												}
											}
										}
										if((t_decl)!=null){
											this.m__module.p_InsertDecl(c_AliasDecl.m_new.call(new c_AliasDecl,t_ident,t_attrs,t_decl));
											this.p_NextToke();
											continue;
										}
										var t_scope=(this.m__module);
										bb_decl_PushEnv(this.m__module);
										do{
											var t_id=this.p_ParseIdent();
											t_decl=t_scope.p_FindDecl(t_id);
											if(!((t_decl)!=null)){
												bb_config_Err("Identifier '"+t_id+"' not found.");
											}
											if(!((this.p_CParse("."))!=0)){
												break;
											}
											t_scope=object_downcast((t_decl),c_ScopeDecl);
											if(!((t_scope)!=null) || ((object_downcast((t_scope),c_FuncDecl))!=null)){
												bb_config_Err("Invalid scope '"+t_id+"'.");
											}
										}while(!(false));
										bb_decl_PopEnv();
										this.m__module.p_InsertDecl(c_AliasDecl.m_new.call(new c_AliasDecl,t_ident,t_attrs,t_decl));
									}while(!(!((this.p_CParse(","))!=0)));
								}else{
									break;
								}
							}
						}
					}
				}
			}
		}
	}
	while((this.m__toke).length!=0){
		this.p_SetErr();
		var t_25=this.m__toke;
		if(t_25=="\n"){
			this.p_NextToke();
		}else{
			if(t_25=="public"){
				this.p_NextToke();
				t_attrs=0;
			}else{
				if(t_25=="private"){
					this.p_NextToke();
					t_attrs=512;
				}else{
					if(t_25=="extern"){
						if((bb_config_ENV_SAFEMODE)!=0){
							if(this.m__app.m_mainModule==this.m__module){
								bb_config_Err("Extern not permitted in safe mode.");
							}
						}
						this.p_NextToke();
						t_attrs=256;
						if((this.p_CParse("private"))!=0){
							t_attrs|=512;
						}
					}else{
						if(t_25=="const" || t_25=="global"){
							this.m__module.p_InsertDecls(this.p_ParseDecls(this.m__toke,t_attrs));
						}else{
							if(t_25=="class"){
								this.m__module.p_InsertDecl(this.p_ParseClassDecl(t_attrs));
							}else{
								if(t_25=="interface"){
									this.m__module.p_InsertDecl(this.p_ParseClassDecl(t_attrs));
								}else{
									if(t_25=="function"){
										this.m__module.p_InsertDecl(this.p_ParseFuncDecl(t_attrs));
									}else{
										bb_config_Err("Syntax error - expecting declaration.");
									}
								}
							}
						}
					}
				}
			}
		}
	}
	bb_config__errInfo="";
	return 0;
}
function bb_config_InternalErr(t_err){
	print(bb_config__errInfo+" : "+t_err);
	error(bb_config__errInfo+" : "+t_err);
	return 0;
}
function bb_config_StringToInt(t_str,t_base){
	var t_i=0;
	var t_l=t_str.length;
	while(t_i<t_l && t_str.charCodeAt(t_i)<=32){
		t_i+=1;
	}
	var t_neg=false;
	if(t_i<t_l && (t_str.charCodeAt(t_i)==43 || t_str.charCodeAt(t_i)==45)){
		t_neg=t_str.charCodeAt(t_i)==45;
		t_i+=1;
	}
	var t_n=0;
	while(t_i<t_l){
		var t_c=t_str.charCodeAt(t_i);
		var t_t=0;
		if(t_c>=48 && t_c<58){
			t_t=t_c-48;
		}else{
			if(t_c>=65 && t_c<=90){
				t_t=t_c-55;
			}else{
				if(t_c>=97 && t_c<=122){
					t_t=t_c-87;
				}else{
					break;
				}
			}
		}
		if(t_t>=t_base){
			break;
		}
		t_n=t_n*t_base+t_t;
		t_i+=1;
	}
	if(t_neg){
		t_n=-t_n;
	}
	return t_n;
}
function bb_config_Dequote(t_str,t_lang){
	var t_4=t_lang;
	if(t_4=="monkey"){
		if(t_str.length<2 || !string_startswith(t_str,"\"") || !string_endswith(t_str,"\"")){
			bb_config_InternalErr("Internal error");
		}
		t_str=t_str.slice(1,-1);
		var t_i=0;
		do{
			t_i=t_str.indexOf("~",t_i);
			if(t_i==-1){
				break;
			}
			if(t_i+1>=t_str.length){
				bb_config_Err("Invalid escape sequence in string");
			}
			var t_ch=t_str.slice(t_i+1,t_i+2);
			var t_5=t_ch;
			if(t_5=="~"){
				t_ch="~";
			}else{
				if(t_5=="q"){
					t_ch="\"";
				}else{
					if(t_5=="n"){
						t_ch="\n";
					}else{
						if(t_5=="r"){
							t_ch="\r";
						}else{
							if(t_5=="t"){
								t_ch="\t";
							}else{
								if(t_5=="u"){
									var t_t=t_str.slice(t_i+2,t_i+6);
									if(t_t.length!=4){
										bb_config_Err("Invalid unicode hex value in string");
									}
									for(var t_j=0;t_j<4;t_j=t_j+1){
										if(!((bb_config_IsHexDigit(t_t.charCodeAt(t_j)))!=0)){
											bb_config_Err("Invalid unicode hex digit in string");
										}
									}
									t_str=t_str.slice(0,t_i)+String.fromCharCode(bb_config_StringToInt(t_t,16))+t_str.slice(t_i+6);
									t_i+=1;
									continue;
								}else{
									if(t_5=="0"){
										t_ch=String.fromCharCode(0);
									}else{
										bb_config_Err("Invalid escape character in string: '"+t_ch+"'");
									}
								}
							}
						}
					}
				}
			}
			t_str=t_str.slice(0,t_i)+t_ch+t_str.slice(t_i+2);
			t_i+=t_ch.length;
		}while(!(false));
		return t_str;
	}
	bb_config_InternalErr("Internal error");
	return "";
}
function bb_config_EvalConfigTags(t_cfg){
	var t_i=0;
	do{
		t_i=t_cfg.indexOf("${",0);
		if(t_i==-1){
			return t_cfg;
		}
		var t_e=t_cfg.indexOf("}",t_i+2);
		if(t_e==-1){
			return t_cfg;
		}
		var t_key=t_cfg.slice(t_i+2,t_e);
		var t_val=bb_config__cfgScope.m_vars.p_Get2(t_key);
		t_cfg=t_cfg.slice(0,t_i)+t_val+t_cfg.slice(t_e+1);
		t_i+=t_val.length;
	}while(!(false));
}
var bb_config_ENV_SAFEMODE=0;
function c_List2(){
	Object.call(this);
	this.m__head=(c_HeadNode2.m_new.call(new c_HeadNode2));
}
c_List2.m_new=function(){
	return this;
}
c_List2.prototype.p_AddLast2=function(t_data){
	return c_Node7.m_new.call(new c_Node7,this.m__head,this.m__head.m__pred,t_data);
}
c_List2.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast2(t_t);
	}
	return this;
}
c_List2.prototype.p_RemoveLast=function(){
	var t_data=this.m__head.m__pred.m__data;
	this.m__head.m__pred.p_Remove();
	return t_data;
}
c_List2.prototype.p_Equals2=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_List2.prototype.p_FindLast3=function(t_value,t_start){
	while(t_start!=this.m__head){
		if(this.p_Equals2(t_value,t_start.m__data)){
			return t_start;
		}
		t_start=t_start.m__pred;
	}
	return null;
}
c_List2.prototype.p_FindLast4=function(t_value){
	return this.p_FindLast3(t_value,this.m__head.m__pred);
}
c_List2.prototype.p_RemoveLast3=function(t_value){
	var t_node=this.p_FindLast4(t_value);
	if((t_node)!=null){
		t_node.p_Remove();
	}
}
c_List2.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator6.m_new.call(new c_Enumerator6,this);
}
function c_StringList(){
	c_List2.call(this);
}
c_StringList.prototype=extend_class(c_List2);
c_StringList.m_new=function(t_data){
	c_List2.m_new2.call(this,t_data);
	return this;
}
c_StringList.m_new2=function(){
	c_List2.m_new.call(this);
	return this;
}
c_StringList.prototype.p_Equals2=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
function c_Node7(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data="";
}
c_Node7.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node7.m_new2=function(){
	return this;
}
c_Node7.prototype.p_Remove=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode2(){
	c_Node7.call(this);
}
c_HeadNode2.prototype=extend_class(c_Node7);
c_HeadNode2.m_new=function(){
	c_Node7.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_NumericType(){
	c_Type.call(this);
}
c_NumericType.prototype=extend_class(c_Type);
c_NumericType.m_new=function(){
	c_Type.m_new.call(this);
	return this;
}
function c_IntType(){
	c_NumericType.call(this);
}
c_IntType.prototype=extend_class(c_NumericType);
c_IntType.m_new=function(){
	c_NumericType.m_new.call(this);
	return this;
}
c_IntType.prototype.p_EqualsType=function(t_ty){
	return ((object_downcast((t_ty),c_IntType)!=null)?1:0);
}
c_IntType.prototype.p_ExtendsType=function(t_ty){
	if((object_downcast((t_ty),c_ObjectType))!=null){
		var t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(this),"")).p_Semant();
		var t_ctor=t_ty.p_GetClass().p_FindFuncDecl("new",[t_expr],1);
		return ((((t_ctor)!=null) && t_ctor.p_IsCtor())?1:0);
	}
	return ((object_downcast((t_ty),c_NumericType)!=null || object_downcast((t_ty),c_StringType)!=null)?1:0);
}
c_IntType.prototype.p_GetClass=function(){
	return object_downcast((bb_decl__env.p_FindDecl("int")),c_ClassDecl);
}
c_IntType.prototype.p_ToString=function(){
	return "Int";
}
function c_FloatType(){
	c_NumericType.call(this);
}
c_FloatType.prototype=extend_class(c_NumericType);
c_FloatType.m_new=function(){
	c_NumericType.m_new.call(this);
	return this;
}
c_FloatType.prototype.p_EqualsType=function(t_ty){
	return ((object_downcast((t_ty),c_FloatType)!=null)?1:0);
}
c_FloatType.prototype.p_ExtendsType=function(t_ty){
	if((object_downcast((t_ty),c_ObjectType))!=null){
		var t_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,(this),"")).p_Semant();
		var t_ctor=t_ty.p_GetClass().p_FindFuncDecl("new",[t_expr],1);
		return ((((t_ctor)!=null) && t_ctor.p_IsCtor())?1:0);
	}
	return ((object_downcast((t_ty),c_NumericType)!=null || object_downcast((t_ty),c_StringType)!=null)?1:0);
}
c_FloatType.prototype.p_GetClass=function(){
	return object_downcast((bb_decl__env.p_FindDecl("float")),c_ClassDecl);
}
c_FloatType.prototype.p_ToString=function(){
	return "Float";
}
function c_AliasDecl(){
	c_Decl.call(this);
	this.m_decl=null;
}
c_AliasDecl.prototype=extend_class(c_Decl);
c_AliasDecl.m_new=function(t_ident,t_attrs,t_decl){
	c_Decl.m_new.call(this);
	this.m_ident=t_ident;
	this.m_attrs=t_attrs;
	this.m_decl=t_decl;
	return this;
}
c_AliasDecl.m_new2=function(){
	c_Decl.m_new.call(this);
	return this;
}
c_AliasDecl.prototype.p_OnCopy=function(){
	return (c_AliasDecl.m_new.call(new c_AliasDecl,this.m_ident,this.m_attrs,this.m_decl));
}
c_AliasDecl.prototype.p_OnSemant=function(){
	return 0;
}
function c_List3(){
	Object.call(this);
	this.m__head=(c_HeadNode3.m_new.call(new c_HeadNode3));
}
c_List3.m_new=function(){
	return this;
}
c_List3.prototype.p_AddLast3=function(t_data){
	return c_Node8.m_new.call(new c_Node8,this.m__head,this.m__head.m__pred,t_data);
}
c_List3.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast3(t_t);
	}
	return this;
}
c_List3.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator3.m_new.call(new c_Enumerator3,this);
}
c_List3.prototype.p_Count=function(){
	var t_n=0;
	var t_node=this.m__head.m__succ;
	while(t_node!=this.m__head){
		t_node=t_node.m__succ;
		t_n+=1;
	}
	return t_n;
}
function c_Node8(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node8.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node8.m_new2=function(){
	return this;
}
function c_HeadNode3(){
	c_Node8.call(this);
}
c_HeadNode3.prototype=extend_class(c_Node8);
c_HeadNode3.m_new=function(){
	c_Node8.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_BlockDecl(){
	c_ScopeDecl.call(this);
	this.m_stmts=c_List5.m_new.call(new c_List5);
}
c_BlockDecl.prototype=extend_class(c_ScopeDecl);
c_BlockDecl.m_new=function(t_scope){
	c_ScopeDecl.m_new.call(this);
	this.m_scope=t_scope;
	return this;
}
c_BlockDecl.m_new2=function(){
	c_ScopeDecl.m_new.call(this);
	return this;
}
c_BlockDecl.prototype.p_AddStmt=function(t_stmt){
	this.m_stmts.p_AddLast5(t_stmt);
	return 0;
}
c_BlockDecl.prototype.p_OnCopy=function(){
	var t_t=c_BlockDecl.m_new2.call(new c_BlockDecl);
	var t_=this.m_stmts.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_stmt=t_.p_NextObject();
		t_t.p_AddStmt(t_stmt.p_Copy2(t_t));
	}
	return (t_t);
}
c_BlockDecl.prototype.p_OnSemant=function(){
	bb_decl_PushEnv(this);
	var t_=this.m_stmts.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_stmt=t_.p_NextObject();
		t_stmt.p_Semant();
	}
	bb_decl_PopEnv();
	return 0;
}
c_BlockDecl.prototype.p_CopyBlock=function(t_scope){
	var t_t=object_downcast((this.p_Copy()),c_BlockDecl);
	t_t.m_scope=t_scope;
	return t_t;
}
function c_FuncDecl(){
	c_BlockDecl.call(this);
	this.m_retType=null;
	this.m_argDecls=[];
	this.m_overrides=null;
}
c_FuncDecl.prototype=extend_class(c_BlockDecl);
c_FuncDecl.prototype.p_IsCtor=function(){
	return (this.m_attrs&2)!=0;
}
c_FuncDecl.m_new=function(t_ident,t_attrs,t_retType,t_argDecls){
	c_BlockDecl.m_new2.call(this);
	this.m_ident=t_ident;
	this.m_attrs=t_attrs;
	this.m_retType=t_retType;
	this.m_argDecls=t_argDecls;
	return this;
}
c_FuncDecl.m_new2=function(){
	c_BlockDecl.m_new2.call(this);
	return this;
}
c_FuncDecl.prototype.p_IsMethod=function(){
	return (this.m_attrs&1)!=0;
}
c_FuncDecl.prototype.p_ToString=function(){
	var t_t="";
	var t_=this.m_argDecls;
	var t_2=0;
	while(t_2<t_.length){
		var t_decl=t_[t_2];
		t_2=t_2+1;
		if((t_t).length!=0){
			t_t=t_t+",";
		}
		t_t=t_t+t_decl.p_ToString();
	}
	var t_q="";
	if(this.p_IsCtor()){
		t_q="Method "+c_Decl.prototype.p_ToString.call(this);
	}else{
		if(this.p_IsMethod()){
			t_q="Method ";
		}else{
			t_q="Function ";
		}
		t_q=t_q+(c_Decl.prototype.p_ToString.call(this)+":");
		t_q=t_q+this.m_retType.p_ToString();
	}
	return t_q+"("+t_t+")";
}
c_FuncDecl.prototype.p_EqualsArgs=function(t_decl){
	if(this.m_argDecls.length!=t_decl.m_argDecls.length){
		return false;
	}
	for(var t_i=0;t_i<this.m_argDecls.length;t_i=t_i+1){
		if(!((this.m_argDecls[t_i].m_type.p_EqualsType(t_decl.m_argDecls[t_i].m_type))!=0)){
			return false;
		}
	}
	return true;
}
c_FuncDecl.prototype.p_EqualsFunc=function(t_decl){
	return ((this.m_retType.p_EqualsType(t_decl.m_retType))!=0) && this.p_EqualsArgs(t_decl);
}
c_FuncDecl.prototype.p_OnCopy=function(){
	var t_args=this.m_argDecls.slice(0);
	for(var t_i=0;t_i<t_args.length;t_i=t_i+1){
		t_args[t_i]=object_downcast((t_args[t_i].p_Copy()),c_ArgDecl);
	}
	var t_t=c_FuncDecl.m_new.call(new c_FuncDecl,this.m_ident,this.m_attrs,this.m_retType,t_args);
	var t_=this.m_stmts.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_stmt=t_.p_NextObject();
		t_t.p_AddStmt(t_stmt.p_Copy2(t_t));
	}
	return (t_t);
}
c_FuncDecl.prototype.p_OnSemant=function(){
	var t_cdecl=this.p_ClassScope();
	var t_sclass=null;
	if((t_cdecl)!=null){
		t_sclass=t_cdecl.m_superClass;
	}
	if(this.p_IsCtor()){
		this.m_retType=(t_cdecl.m_objectType);
	}else{
		this.m_retType=this.m_retType.p_Semant();
	}
	var t_=this.m_argDecls;
	var t_2=0;
	while(t_2<t_.length){
		var t_arg=t_[t_2];
		t_2=t_2+1;
		this.p_InsertDecl(t_arg);
		t_arg.p_Semant();
	}
	var t_3=this.m_scope.p_SemantedFuncs(this.m_ident).p_ObjectEnumerator();
	while(t_3.p_HasNext()){
		var t_decl=t_3.p_NextObject();
		if(t_decl!=this && this.p_EqualsArgs(t_decl)){
			bb_config_Err("Duplicate declaration "+this.p_ToString());
		}
	}
	if(this.p_IsCtor() && !((this.m_attrs&8)!=0)){
		if((t_sclass.p_FindFuncDecl("new",[],0))!=null){
			var t_expr=c_InvokeSuperExpr.m_new.call(new c_InvokeSuperExpr,"new",[]);
			this.m_stmts.p_AddFirst(c_ExprStmt.m_new.call(new c_ExprStmt,(t_expr)));
		}
	}
	if(((t_sclass)!=null) && this.p_IsMethod()){
		while((t_sclass)!=null){
			var t_found=0;
			var t_4=t_sclass.p_MethodDecls(this.m_ident).p_ObjectEnumerator();
			while(t_4.p_HasNext()){
				var t_decl2=t_4.p_NextObject();
				t_found=1;
				t_decl2.p_Semant();
				if(this.p_EqualsFunc(t_decl2)){
					this.m_overrides=t_decl2;
					t_decl2.m_attrs|=16;
					break;
				}
			}
			if((t_found)!=0){
				if(!((this.m_overrides)!=null)){
					bb_config_Err("Overriding method does not match any overridden method.");
				}
				if((this.m_overrides.p_IsFinal())!=0){
					bb_config_Err("Cannot override final method.");
				}
				if((this.m_overrides.m_munged).length!=0){
					if(((this.m_munged).length!=0) && this.m_munged!=this.m_overrides.m_munged){
						bb_config_InternalErr("Internal error");
					}
					this.m_munged=this.m_overrides.m_munged;
				}
				break;
			}
			t_sclass=t_sclass.m_superClass;
		}
	}
	this.m_attrs|=1048576;
	c_BlockDecl.prototype.p_OnSemant.call(this);
	return 0;
}
c_FuncDecl.prototype.p_IsStatic=function(){
	return (this.m_attrs&3)==0;
}
c_FuncDecl.prototype.p_IsProperty=function(){
	return (this.m_attrs&4)!=0;
}
function c_List4(){
	Object.call(this);
	this.m__head=(c_HeadNode4.m_new.call(new c_HeadNode4));
}
c_List4.m_new=function(){
	return this;
}
c_List4.prototype.p_AddLast4=function(t_data){
	return c_Node9.m_new.call(new c_Node9,this.m__head,this.m__head.m__pred,t_data);
}
c_List4.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast4(t_t);
	}
	return this;
}
c_List4.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator4.m_new.call(new c_Enumerator4,this);
}
function c_FuncDeclList(){
	c_List4.call(this);
}
c_FuncDeclList.prototype=extend_class(c_List4);
c_FuncDeclList.m_new=function(){
	c_List4.m_new.call(this);
	return this;
}
function c_Node9(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node9.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node9.m_new2=function(){
	return this;
}
function c_HeadNode4(){
	c_Node9.call(this);
}
c_HeadNode4.prototype=extend_class(c_Node9);
c_HeadNode4.m_new=function(){
	c_Node9.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_ClassDecl(){
	c_ScopeDecl.call(this);
	this.m_superClass=null;
	this.m_args=[];
	this.m_superTy=null;
	this.m_impltys=[];
	this.m_objectType=null;
	this.m_instances=null;
	this.m_instanceof=null;
	this.m_instArgs=[];
	this.m_implmentsAll=[];
	this.m_implments=[];
}
c_ClassDecl.prototype=extend_class(c_ScopeDecl);
c_ClassDecl.m_new=function(t_ident,t_attrs,t_args,t_superTy,t_impls){
	c_ScopeDecl.m_new.call(this);
	this.m_ident=t_ident;
	this.m_attrs=t_attrs;
	this.m_args=t_args;
	this.m_superTy=t_superTy;
	this.m_impltys=t_impls;
	this.m_objectType=c_ObjectType.m_new.call(new c_ObjectType,this);
	if((t_args).length!=0){
		this.m_instances=c_List6.m_new.call(new c_List6);
	}
	return this;
}
c_ClassDecl.m_new2=function(){
	c_ScopeDecl.m_new.call(this);
	return this;
}
c_ClassDecl.prototype.p_IsInterface=function(){
	return (((this.m_attrs&4096)!=0)?1:0);
}
c_ClassDecl.prototype.p_ToString=function(){
	var t_t="";
	if((this.m_args).length!=0){
		t_t=this.m_args.join(",");
	}else{
		if((this.m_instArgs).length!=0){
			var t_=this.m_instArgs;
			var t_2=0;
			while(t_2<t_.length){
				var t_arg=t_[t_2];
				t_2=t_2+1;
				if((t_t).length!=0){
					t_t=t_t+",";
				}
				t_t=t_t+t_arg.p_ToString();
			}
		}
	}
	if((t_t).length!=0){
		t_t="<"+t_t+">";
	}
	return this.m_ident+t_t;
}
c_ClassDecl.prototype.p_FindFuncDecl2=function(t_ident,t_args,t_explicit){
	return c_ScopeDecl.prototype.p_FindFuncDecl.call(this,t_ident,t_args,t_explicit);
}
c_ClassDecl.prototype.p_FindFuncDecl=function(t_ident,t_args,t_explicit){
	if(!((this.p_IsInterface())!=0)){
		return this.p_FindFuncDecl2(t_ident,t_args,t_explicit);
	}
	var t_fdecl=this.p_FindFuncDecl2(t_ident,t_args,1);
	var t_=this.m_implmentsAll;
	var t_2=0;
	while(t_2<t_.length){
		var t_iface=t_[t_2];
		t_2=t_2+1;
		var t_decl=t_iface.p_FindFuncDecl2(t_ident,t_args,1);
		if(!((t_decl)!=null)){
			continue;
		}
		if((t_fdecl)!=null){
			if(t_fdecl.p_EqualsFunc(t_decl)){
				continue;
			}
			bb_config_Err("Unable to determine overload to use: "+t_fdecl.p_ToString()+" or "+t_decl.p_ToString()+".");
		}
		t_fdecl=t_decl;
	}
	if(((t_fdecl)!=null) || ((t_explicit)!=0)){
		return t_fdecl;
	}
	t_fdecl=this.p_FindFuncDecl2(t_ident,t_args,0);
	var t_3=this.m_implmentsAll;
	var t_4=0;
	while(t_4<t_3.length){
		var t_iface2=t_3[t_4];
		t_4=t_4+1;
		var t_decl2=t_iface2.p_FindFuncDecl2(t_ident,t_args,0);
		if(!((t_decl2)!=null)){
			continue;
		}
		if((t_fdecl)!=null){
			if(t_fdecl.p_EqualsFunc(t_decl2)){
				continue;
			}
			bb_config_Err("Unable to determine overload to use: "+t_fdecl.p_ToString()+" or "+t_decl2.p_ToString()+".");
		}
		t_fdecl=t_decl2;
	}
	return t_fdecl;
}
c_ClassDecl.prototype.p_ExtendsObject=function(){
	return (((this.m_attrs&2)!=0)?1:0);
}
c_ClassDecl.prototype.p_GenClassInstance=function(t_instArgs){
	if((this.m_instanceof)!=null){
		bb_config_InternalErr("Internal error");
	}
	if(!((t_instArgs).length!=0)){
		if(!((this.m_args).length!=0)){
			return this;
		}
		var t_=this.m_instances.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_inst=t_.p_NextObject();
			if(bb_decl__env.p_ClassScope()==t_inst){
				return t_inst;
			}
		}
	}
	if(this.m_args.length!=t_instArgs.length){
		bb_config_Err("Wrong number of type arguments for class "+this.p_ToString());
	}
	var t_2=this.m_instances.p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_inst2=t_2.p_NextObject();
		var t_equal=1;
		for(var t_i=0;t_i<this.m_args.length;t_i=t_i+1){
			if(!((t_inst2.m_instArgs[t_i].p_EqualsType(t_instArgs[t_i]))!=0)){
				t_equal=0;
				break;
			}
		}
		if((t_equal)!=0){
			return t_inst2;
		}
	}
	var t_inst3=c_ClassDecl.m_new.call(new c_ClassDecl,this.m_ident,this.m_attrs,[],this.m_superTy,this.m_impltys);
	t_inst3.m_attrs&=-1048577;
	t_inst3.m_munged=this.m_munged;
	t_inst3.m_errInfo=this.m_errInfo;
	t_inst3.m_scope=this.m_scope;
	t_inst3.m_instanceof=this;
	t_inst3.m_instArgs=t_instArgs;
	this.m_instances.p_AddLast6(t_inst3);
	for(var t_i2=0;t_i2<this.m_args.length;t_i2=t_i2+1){
		t_inst3.p_InsertDecl(c_AliasDecl.m_new.call(new c_AliasDecl,this.m_args[t_i2],0,(t_instArgs[t_i2])));
	}
	var t_3=this.m_decls.p_ObjectEnumerator();
	while(t_3.p_HasNext()){
		var t_decl=t_3.p_NextObject();
		t_inst3.p_InsertDecl(t_decl.p_Copy());
	}
	return t_inst3;
}
c_ClassDecl.prototype.p_IsFinalized=function(){
	return (((this.m_attrs&4)!=0)?1:0);
}
c_ClassDecl.prototype.p_UpdateLiveMethods=function(){
	if((this.p_IsFinalized())!=0){
		return 0;
	}
	if((this.p_IsInterface())!=0){
		return 0;
	}
	if(!((this.m_superClass)!=null)){
		return 0;
	}
	var t_n=0;
	var t_=this.p_MethodDecls("").p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_decl=t_.p_NextObject();
		if((t_decl.p_IsSemanted())!=0){
			continue;
		}
		var t_live=0;
		var t_unsem=c_List4.m_new.call(new c_List4);
		t_unsem.p_AddLast4(t_decl);
		var t_sclass=this.m_superClass;
		while((t_sclass)!=null){
			var t_2=t_sclass.p_MethodDecls(t_decl.m_ident).p_ObjectEnumerator();
			while(t_2.p_HasNext()){
				var t_decl2=t_2.p_NextObject();
				if((t_decl2.p_IsSemanted())!=0){
					t_live=1;
				}else{
					t_unsem.p_AddLast4(t_decl2);
					if((t_decl2.p_IsExtern())!=0){
						t_live=1;
					}
					if((t_decl2.p_IsSemanted())!=0){
						t_live=1;
					}
				}
			}
			t_sclass=t_sclass.m_superClass;
		}
		if(!((t_live)!=0)){
			var t_cdecl=this;
			while((t_cdecl)!=null){
				var t_3=t_cdecl.m_implmentsAll;
				var t_4=0;
				while(t_4<t_3.length){
					var t_iface=t_3[t_4];
					t_4=t_4+1;
					var t_5=t_iface.p_MethodDecls(t_decl.m_ident).p_ObjectEnumerator();
					while(t_5.p_HasNext()){
						var t_decl22=t_5.p_NextObject();
						if((t_decl22.p_IsSemanted())!=0){
							t_live=1;
						}else{
							t_unsem.p_AddLast4(t_decl22);
							if((t_decl22.p_IsExtern())!=0){
								t_live=1;
							}
							if((t_decl22.p_IsSemanted())!=0){
								t_live=1;
							}
						}
					}
				}
				t_cdecl=t_cdecl.m_superClass;
			}
		}
		if(!((t_live)!=0)){
			continue;
		}
		var t_6=t_unsem.p_ObjectEnumerator();
		while(t_6.p_HasNext()){
			var t_decl3=t_6.p_NextObject();
			t_decl3.p_Semant();
			t_n+=1;
		}
	}
	return t_n;
}
c_ClassDecl.prototype.p_IsInstanced=function(){
	return (((this.m_attrs&1)!=0)?1:0);
}
c_ClassDecl.prototype.p_FinalizeClass=function(){
	if((this.p_IsFinalized())!=0){
		return 0;
	}
	this.m_attrs|=4;
	if((this.p_IsInterface())!=0){
		return 0;
	}
	bb_config_PushErr(this.m_errInfo);
	var t_=this.p_Semanted().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_decl=t_.p_NextObject();
		var t_fdecl=object_downcast((t_decl),c_FieldDecl);
		if(!((t_fdecl)!=null)){
			continue;
		}
		var t_cdecl=this.m_superClass;
		while((t_cdecl)!=null){
			var t_2=t_cdecl.p_Semanted().p_ObjectEnumerator();
			while(t_2.p_HasNext()){
				var t_decl2=t_2.p_NextObject();
				if(t_decl2.m_ident==t_fdecl.m_ident){
					bb_config__errInfo=t_fdecl.m_errInfo;
					bb_config_Err("Field '"+t_fdecl.m_ident+"' in class "+this.p_ToString()+" overrides existing declaration in class "+t_cdecl.p_ToString());
				}
			}
			t_cdecl=t_cdecl.m_superClass;
		}
	}
	if((this.p_IsAbstract())!=0){
		if((this.p_IsInstanced())!=0){
			bb_config_Err("Can't create instance of abstract class "+this.p_ToString()+".");
		}
	}else{
		var t_cdecl2=this;
		var t_impls=c_List4.m_new.call(new c_List4);
		while(((t_cdecl2)!=null) && !((this.p_IsAbstract())!=0)){
			var t_3=t_cdecl2.p_SemantedMethods("").p_ObjectEnumerator();
			while(t_3.p_HasNext()){
				var t_decl3=t_3.p_NextObject();
				if((t_decl3.p_IsAbstract())!=0){
					var t_found=0;
					var t_4=t_impls.p_ObjectEnumerator();
					while(t_4.p_HasNext()){
						var t_decl22=t_4.p_NextObject();
						if(t_decl3.m_ident==t_decl22.m_ident && t_decl3.p_EqualsFunc(t_decl22)){
							t_found=1;
							break;
						}
					}
					if(!((t_found)!=0)){
						if((this.p_IsInstanced())!=0){
							bb_config_Err("Can't create instance of class "+this.p_ToString()+" due to abstract method "+t_decl3.p_ToString()+".");
						}
						this.m_attrs|=1024;
						break;
					}
				}else{
					t_impls.p_AddLast4(t_decl3);
				}
			}
			t_cdecl2=t_cdecl2.m_superClass;
		}
	}
	var t_5=this.m_implmentsAll;
	var t_6=0;
	while(t_6<t_5.length){
		var t_iface=t_5[t_6];
		t_6=t_6+1;
		var t_cdecl3=this.m_superClass;
		var t_found2=false;
		while((t_cdecl3)!=null){
			var t_7=t_cdecl3.m_implmentsAll;
			var t_8=0;
			while(t_8<t_7.length){
				var t_iface2=t_7[t_8];
				t_8=t_8+1;
				if(t_iface!=t_iface2){
					continue;
				}
				t_found2=true;
				break;
			}
			if(t_found2){
				break;
			}
			t_cdecl3=t_cdecl3.m_superClass;
		}
		if(t_found2){
			continue;
		}
		var t_9=t_iface.p_SemantedMethods("").p_ObjectEnumerator();
		while(t_9.p_HasNext()){
			var t_decl4=t_9.p_NextObject();
			var t_found3=false;
			var t_10=this.p_SemantedMethods(t_decl4.m_ident).p_ObjectEnumerator();
			while(t_10.p_HasNext()){
				var t_decl23=t_10.p_NextObject();
				if(t_decl4.p_EqualsFunc(t_decl23)){
					if((t_decl23.m_munged).length!=0){
						bb_config_Err("Extern methods cannot be used to implement interface methods.");
					}
					t_found3=true;
				}
			}
			if(!t_found3){
				bb_config_Err(t_decl4.p_ToString()+" must be implemented by class "+this.p_ToString());
			}
		}
	}
	bb_config_PopErr();
	return 0;
}
c_ClassDecl.prototype.p_OnCopy=function(){
	bb_config_InternalErr("Internal error");
	return null;
}
c_ClassDecl.prototype.p_GetDecl2=function(t_ident){
	return c_ScopeDecl.prototype.p_GetDecl.call(this,t_ident);
}
c_ClassDecl.prototype.p_GetDecl=function(t_ident){
	var t_cdecl=this;
	while((t_cdecl)!=null){
		var t_decl=t_cdecl.p_GetDecl2(t_ident);
		if((t_decl)!=null){
			return t_decl;
		}
		t_cdecl=t_cdecl.m_superClass;
	}
	return null;
}
c_ClassDecl.m_nullObjectClass=null;
c_ClassDecl.prototype.p_IsThrowable=function(){
	return (((this.m_attrs&8192)!=0)?1:0);
}
c_ClassDecl.prototype.p_OnSemant=function(){
	if((this.m_args).length!=0){
		return 0;
	}
	bb_decl_PushEnv(this);
	if((this.m_superTy)!=null){
		this.m_superClass=this.m_superTy.p_SemantClass();
		if((this.m_superClass.p_IsFinal())!=0){
			bb_config_Err("Cannot extend final class.");
		}
		if((this.m_superClass.p_IsInterface())!=0){
			bb_config_Err("Cannot extend an interface.");
		}
		if(this.m_munged=="ThrowableObject" || ((this.m_superClass.p_IsThrowable())!=0)){
			this.m_attrs|=8192;
		}
		if((this.m_superClass.p_ExtendsObject())!=0){
			this.m_attrs|=2;
		}
	}else{
		if(this.m_munged=="Object"){
			this.m_attrs|=2;
		}
	}
	var t_impls=new_object_array(this.m_impltys.length);
	var t_implsall=c_Stack10.m_new.call(new c_Stack10);
	for(var t_i=0;t_i<this.m_impltys.length;t_i=t_i+1){
		var t_cdecl=this.m_impltys[t_i].p_SemantClass();
		if(!((t_cdecl.p_IsInterface())!=0)){
			bb_config_Err(t_cdecl.p_ToString()+" is a class, not an interface.");
		}
		for(var t_j=0;t_j<t_i;t_j=t_j+1){
			if(t_impls[t_j]==t_cdecl){
				bb_config_Err("Duplicate interface "+t_cdecl.p_ToString()+".");
			}
		}
		t_impls[t_i]=t_cdecl;
		t_implsall.p_Push28(t_cdecl);
		var t_=t_cdecl.m_implmentsAll;
		var t_2=0;
		while(t_2<t_.length){
			var t_tdecl=t_[t_2];
			t_2=t_2+1;
			t_implsall.p_Push28(t_tdecl);
		}
	}
	this.m_implmentsAll=new_object_array(t_implsall.p_Length2());
	for(var t_i2=0;t_i2<t_implsall.p_Length2();t_i2=t_i2+1){
		this.m_implmentsAll[t_i2]=t_implsall.p_Get(t_i2);
	}
	this.m_implments=t_impls;
	bb_decl_PopEnv();
	if(!((this.p_IsAbstract())!=0)){
		var t_3=this.m_decls.p_ObjectEnumerator();
		while(t_3.p_HasNext()){
			var t_decl=t_3.p_NextObject();
			var t_fdecl=object_downcast((t_decl),c_FuncDecl);
			if(((t_fdecl)!=null) && ((t_fdecl.p_IsAbstract())!=0)){
				this.m_attrs|=1024;
				break;
			}
		}
	}
	if(!((this.p_IsExtern())!=0) && !((this.p_IsInterface())!=0)){
		var t_fdecl2=null;
		var t_4=this.p_FuncDecls("").p_ObjectEnumerator();
		while(t_4.p_HasNext()){
			var t_decl2=t_4.p_NextObject();
			if(!t_decl2.p_IsCtor()){
				continue;
			}
			var t_nargs=0;
			var t_5=t_decl2.m_argDecls;
			var t_6=0;
			while(t_6<t_5.length){
				var t_arg=t_5[t_6];
				t_6=t_6+1;
				if(!((t_arg.m_init)!=null)){
					t_nargs+=1;
				}
			}
			if((t_nargs)!=0){
				continue;
			}
			t_fdecl2=t_decl2;
			break;
		}
		if(!((t_fdecl2)!=null)){
			t_fdecl2=c_FuncDecl.m_new.call(new c_FuncDecl,"new",2,(this.m_objectType),[]);
			t_fdecl2.p_AddStmt(c_ReturnStmt.m_new.call(new c_ReturnStmt,null));
			this.p_InsertDecl(t_fdecl2);
		}
	}
	this.p_AppScope().m_semantedClasses.p_AddLast6(this);
	return 0;
}
c_ClassDecl.prototype.p_ExtendsClass=function(t_cdecl){
	if(this==c_ClassDecl.m_nullObjectClass){
		return 1;
	}
	var t_tdecl=this;
	while((t_tdecl)!=null){
		if(t_tdecl==t_cdecl){
			return 1;
		}
		if((t_cdecl.p_IsInterface())!=0){
			var t_=t_tdecl.m_implmentsAll;
			var t_2=0;
			while(t_2<t_.length){
				var t_iface=t_[t_2];
				t_2=t_2+1;
				if(t_iface==t_cdecl){
					return 1;
				}
			}
		}
		t_tdecl=t_tdecl.m_superClass;
	}
	return 0;
}
function bb_decl_PopEnv(){
	if(bb_decl__envStack.p_IsEmpty()){
		bb_config_InternalErr("Internal error");
	}
	bb_decl__env=bb_decl__envStack.p_RemoveLast();
	return 0;
}
function c_VoidType(){
	c_Type.call(this);
}
c_VoidType.prototype=extend_class(c_Type);
c_VoidType.m_new=function(){
	c_Type.m_new.call(this);
	return this;
}
c_VoidType.prototype.p_EqualsType=function(t_ty){
	return ((object_downcast((t_ty),c_VoidType)!=null)?1:0);
}
c_VoidType.prototype.p_ToString=function(){
	return "Void";
}
function c_IdentType(){
	c_Type.call(this);
	this.m_ident="";
	this.m_args=[];
}
c_IdentType.prototype=extend_class(c_Type);
c_IdentType.m_new=function(t_ident,t_args){
	c_Type.m_new.call(this);
	this.m_ident=t_ident;
	this.m_args=t_args;
	return this;
}
c_IdentType.m_new2=function(){
	c_Type.m_new.call(this);
	return this;
}
c_IdentType.prototype.p_Semant=function(){
	if(!((this.m_ident).length!=0)){
		return (c_ClassDecl.m_nullObjectClass.m_objectType);
	}
	var t_targs=new_object_array(this.m_args.length);
	for(var t_i=0;t_i<this.m_args.length;t_i=t_i+1){
		t_targs[t_i]=this.m_args[t_i].p_Semant();
	}
	var t_tyid="";
	var t_type=null;
	var t_i2=this.m_ident.indexOf(".",0);
	if(t_i2==-1){
		t_tyid=this.m_ident;
		t_type=bb_decl__env.p_FindType(t_tyid,t_targs);
	}else{
		var t_modid=this.m_ident.slice(0,t_i2);
		var t_mdecl=bb_decl__env.p_FindModuleDecl(t_modid);
		if(!((t_mdecl)!=null)){
			bb_config_Err("Module '"+t_modid+"' not found");
		}
		t_tyid=this.m_ident.slice(t_i2+1);
		t_type=t_mdecl.p_FindType(t_tyid,t_targs);
	}
	if(!((t_type)!=null)){
		bb_config_Err("Type '"+t_tyid+"' not found");
	}
	return t_type;
}
c_IdentType.prototype.p_SemantClass=function(){
	var t_type=object_downcast((this.p_Semant()),c_ObjectType);
	if(!((t_type)!=null)){
		bb_config_Err("Type is not a class");
	}
	return t_type.m_classDecl;
}
c_IdentType.prototype.p_EqualsType=function(t_ty){
	bb_config_InternalErr("Internal error");
	return 0;
}
c_IdentType.prototype.p_ExtendsType=function(t_ty){
	bb_config_InternalErr("Internal error");
	return 0;
}
c_IdentType.prototype.p_ToString=function(){
	var t_t="";
	var t_=this.m_args;
	var t_2=0;
	while(t_2<t_.length){
		var t_arg=t_[t_2];
		t_2=t_2+1;
		if((t_t).length!=0){
			t_t=t_t+",";
		}
		t_t=t_t+t_arg.p_ToString();
	}
	if((t_t).length!=0){
		return "$"+this.m_ident+"<"+string_replace(t_t,"$","")+">";
	}
	return "$"+this.m_ident;
}
function c_Stack5(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack5.m_new=function(){
	return this;
}
c_Stack5.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack5.prototype.p_Push13=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack5.prototype.p_Push14=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push13(t_values[t_offset+t_i]);
	}
}
c_Stack5.prototype.p_Push15=function(t_values,t_offset){
	this.p_Push14(t_values,t_offset,t_values.length-t_offset);
}
c_Stack5.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_ArrayType(){
	c_Type.call(this);
	this.m_elemType=null;
}
c_ArrayType.prototype=extend_class(c_Type);
c_ArrayType.m_new=function(t_elemType){
	c_Type.m_new.call(this);
	this.m_elemType=t_elemType;
	return this;
}
c_ArrayType.m_new2=function(){
	c_Type.m_new.call(this);
	return this;
}
c_ArrayType.prototype.p_EqualsType=function(t_ty){
	var t_arrayType=object_downcast((t_ty),c_ArrayType);
	return ((((t_arrayType)!=null) && ((this.m_elemType.p_EqualsType(t_arrayType.m_elemType))!=0))?1:0);
}
c_ArrayType.prototype.p_ExtendsType=function(t_ty){
	var t_arrayType=object_downcast((t_ty),c_ArrayType);
	return ((((t_arrayType)!=null) && (((object_downcast((this.m_elemType),c_VoidType))!=null) || ((this.m_elemType.p_EqualsType(t_arrayType.m_elemType))!=0)))?1:0);
}
c_ArrayType.prototype.p_Semant=function(){
	var t_ty=this.m_elemType.p_Semant();
	if(t_ty!=this.m_elemType){
		return (c_ArrayType.m_new.call(new c_ArrayType,t_ty));
	}
	return (this);
}
c_ArrayType.prototype.p_GetClass=function(){
	return object_downcast((bb_decl__env.p_FindDecl("array")),c_ClassDecl);
}
c_ArrayType.prototype.p_ToString=function(){
	return this.m_elemType.p_ToString()+"[]";
}
function c_UnaryExpr(){
	c_Expr.call(this);
	this.m_op="";
	this.m_expr=null;
}
c_UnaryExpr.prototype=extend_class(c_Expr);
c_UnaryExpr.m_new=function(t_op,t_expr){
	c_Expr.m_new.call(this);
	this.m_op=t_op;
	this.m_expr=t_expr;
	return this;
}
c_UnaryExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_UnaryExpr.prototype.p_Copy=function(){
	return (c_UnaryExpr.m_new.call(new c_UnaryExpr,this.m_op,this.p_CopyExpr(this.m_expr)));
}
c_UnaryExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	var t_1=this.m_op;
	if(t_1=="+" || t_1=="-"){
		this.m_expr=this.m_expr.p_Semant();
		if(!((object_downcast((this.m_expr.m_exprType),c_NumericType))!=null)){
			bb_config_Err(this.m_expr.p_ToString()+" must be numeric for use with unary operator '"+this.m_op+"'");
		}
		this.m_exprType=this.m_expr.m_exprType;
	}else{
		if(t_1=="~"){
			this.m_expr=this.m_expr.p_Semant2((c_Type.m_intType),0);
			this.m_exprType=(c_Type.m_intType);
		}else{
			if(t_1=="not"){
				this.m_expr=this.m_expr.p_Semant2((c_Type.m_boolType),1);
				this.m_exprType=(c_Type.m_boolType);
			}else{
				bb_config_InternalErr("Internal error");
			}
		}
	}
	if((object_downcast((this.m_expr),c_ConstExpr))!=null){
		return this.p_EvalConst();
	}
	return (this);
}
c_UnaryExpr.prototype.p_Eval=function(){
	var t_val=this.m_expr.p_Eval();
	var t_2=this.m_op;
	if(t_2=="~"){
		return String(~parseInt((t_val),10));
	}else{
		if(t_2=="+"){
			return t_val;
		}else{
			if(t_2=="-"){
				if(string_startswith(t_val,"-")){
					return t_val.slice(1);
				}
				return "-"+t_val;
			}else{
				if(t_2=="not"){
					if((t_val).length!=0){
						return "";
					}
					return "1";
				}
			}
		}
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_UnaryExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransUnaryExpr(this);
}
function c_ArrayExpr(){
	c_Expr.call(this);
	this.m_exprs=[];
}
c_ArrayExpr.prototype=extend_class(c_Expr);
c_ArrayExpr.m_new=function(t_exprs){
	c_Expr.m_new.call(this);
	this.m_exprs=t_exprs;
	return this;
}
c_ArrayExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_ArrayExpr.prototype.p_Copy=function(){
	return (c_ArrayExpr.m_new.call(new c_ArrayExpr,this.p_CopyArgs(this.m_exprs)));
}
c_ArrayExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_exprs[0]=this.m_exprs[0].p_Semant();
	var t_ty=this.m_exprs[0].m_exprType;
	for(var t_i=1;t_i<this.m_exprs.length;t_i=t_i+1){
		this.m_exprs[t_i]=this.m_exprs[t_i].p_Semant();
		t_ty=this.p_BalanceTypes(t_ty,this.m_exprs[t_i].m_exprType);
	}
	for(var t_i2=0;t_i2<this.m_exprs.length;t_i2=t_i2+1){
		this.m_exprs[t_i2]=this.m_exprs[t_i2].p_Cast(t_ty,0);
	}
	this.m_exprType=(t_ty.p_ArrayOf());
	return (this);
}
c_ArrayExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransArrayExpr(this);
}
function c_Stack6(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack6.m_new=function(){
	return this;
}
c_Stack6.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack6.prototype.p_Push16=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack6.prototype.p_Push17=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push16(t_values[t_offset+t_i]);
	}
}
c_Stack6.prototype.p_Push18=function(t_values,t_offset){
	this.p_Push17(t_values,t_offset,t_values.length-t_offset);
}
c_Stack6.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_ConstExpr(){
	c_Expr.call(this);
	this.m_ty=null;
	this.m_value="";
}
c_ConstExpr.prototype=extend_class(c_Expr);
c_ConstExpr.m_new=function(t_ty,t_value){
	c_Expr.m_new.call(this);
	if((object_downcast((t_ty),c_IntType))!=null){
		if(string_startswith(t_value,"%")){
			t_value=String(bb_config_StringToInt(t_value.slice(1),2));
		}else{
			if(string_startswith(t_value,"$")){
				t_value=String(bb_config_StringToInt(t_value.slice(1),16));
			}else{
				while(t_value.length>1 && string_startswith(t_value,"0")){
					t_value=t_value.slice(1);
				}
			}
		}
	}else{
		if((object_downcast((t_ty),c_FloatType))!=null){
			if(!((t_value.indexOf("e")!=-1) || (t_value.indexOf("E")!=-1) || (t_value.indexOf(".")!=-1))){
				t_value=t_value+".0";
			}
		}
	}
	this.m_ty=t_ty;
	this.m_value=t_value;
	return this;
}
c_ConstExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_ConstExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_exprType=this.m_ty.p_Semant();
	return (this);
}
c_ConstExpr.prototype.p_Copy=function(){
	return (c_ConstExpr.m_new.call(new c_ConstExpr,this.m_ty,this.m_value));
}
c_ConstExpr.prototype.p_ToString=function(){
	return "ConstExpr(\""+this.m_value+"\")";
}
c_ConstExpr.prototype.p_Eval=function(){
	return this.m_value;
}
c_ConstExpr.prototype.p_EvalConst=function(){
	return (this);
}
c_ConstExpr.prototype.p_SideEffects=function(){
	return false;
}
c_ConstExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransConstExpr(this);
}
function c_ScopeExpr(){
	c_Expr.call(this);
	this.m_scope=null;
}
c_ScopeExpr.prototype=extend_class(c_Expr);
c_ScopeExpr.m_new=function(t_scope){
	c_Expr.m_new.call(this);
	this.m_scope=t_scope;
	return this;
}
c_ScopeExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_ScopeExpr.prototype.p_Copy=function(){
	return (this);
}
c_ScopeExpr.prototype.p_ToString=function(){
	print("ScopeExpr("+this.m_scope.p_ToString()+")");
	return "";
}
c_ScopeExpr.prototype.p_Semant=function(){
	bb_config_InternalErr("Internal error");
	return null;
}
c_ScopeExpr.prototype.p_SemantScope=function(){
	return this.m_scope;
}
function c_NewArrayExpr(){
	c_Expr.call(this);
	this.m_ty=null;
	this.m_expr=null;
}
c_NewArrayExpr.prototype=extend_class(c_Expr);
c_NewArrayExpr.m_new=function(t_ty,t_expr){
	c_Expr.m_new.call(this);
	this.m_ty=t_ty;
	this.m_expr=t_expr;
	return this;
}
c_NewArrayExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_NewArrayExpr.prototype.p_Copy=function(){
	if((this.m_exprType)!=null){
		bb_config_InternalErr("Internal error");
	}
	return (c_NewArrayExpr.m_new.call(new c_NewArrayExpr,this.m_ty,this.p_CopyExpr(this.m_expr)));
}
c_NewArrayExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_ty=this.m_ty.p_Semant();
	this.m_exprType=(this.m_ty.p_ArrayOf());
	this.m_expr=this.m_expr.p_Semant2((c_Type.m_intType),0);
	return (this);
}
c_NewArrayExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransNewArrayExpr(this);
}
function c_NewObjectExpr(){
	c_Expr.call(this);
	this.m_ty=null;
	this.m_args=[];
	this.m_classDecl=null;
	this.m_ctor=null;
}
c_NewObjectExpr.prototype=extend_class(c_Expr);
c_NewObjectExpr.m_new=function(t_ty,t_args){
	c_Expr.m_new.call(this);
	this.m_ty=t_ty;
	this.m_args=t_args;
	return this;
}
c_NewObjectExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_NewObjectExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_ty=this.m_ty.p_Semant();
	this.m_args=this.p_SemantArgs(this.m_args);
	var t_objTy=object_downcast((this.m_ty),c_ObjectType);
	if(!((t_objTy)!=null)){
		bb_config_Err("Expression is not a class.");
	}
	this.m_classDecl=t_objTy.m_classDecl;
	if((this.m_classDecl.p_IsInterface())!=0){
		bb_config_Err("Cannot create instance of an interface.");
	}
	if((this.m_classDecl.p_IsAbstract())!=0){
		bb_config_Err("Cannot create instance of an abstract class.");
	}
	if(((this.m_classDecl.m_args).length!=0) && !((this.m_classDecl.m_instanceof)!=null)){
		bb_config_Err("Cannot create instance of a generic class.");
	}
	if((this.m_classDecl.p_IsExtern())!=0){
		if((this.m_args).length!=0){
			bb_config_Err("No suitable constructor found for class "+this.m_classDecl.p_ToString()+".");
		}
	}else{
		this.m_ctor=this.m_classDecl.p_FindFuncDecl("new",this.m_args,0);
		if(!((this.m_ctor)!=null)){
			bb_config_Err("No suitable constructor found for class "+this.m_classDecl.p_ToString()+".");
		}
		this.m_args=this.p_CastArgs(this.m_args,this.m_ctor);
	}
	this.m_classDecl.m_attrs|=1;
	this.m_exprType=this.m_ty;
	return (this);
}
c_NewObjectExpr.prototype.p_Copy=function(){
	return (c_NewObjectExpr.m_new.call(new c_NewObjectExpr,this.m_ty,this.p_CopyArgs(this.m_args)));
}
c_NewObjectExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransNewObjectExpr(this);
}
function c_CastExpr(){
	c_Expr.call(this);
	this.m_ty=null;
	this.m_expr=null;
	this.m_flags=0;
}
c_CastExpr.prototype=extend_class(c_Expr);
c_CastExpr.m_new=function(t_ty,t_expr,t_flags){
	c_Expr.m_new.call(this);
	this.m_ty=t_ty;
	this.m_expr=t_expr;
	this.m_flags=t_flags;
	return this;
}
c_CastExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_CastExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_ty=this.m_ty.p_Semant();
	this.m_expr=this.m_expr.p_Semant();
	var t_src=this.m_expr.m_exprType;
	if((t_src.p_EqualsType(this.m_ty))!=0){
		return this.m_expr;
	}
	if((t_src.p_ExtendsType(this.m_ty))!=0){
		if(((object_downcast((t_src),c_ArrayType))!=null) && ((object_downcast((object_downcast((t_src),c_ArrayType).m_elemType),c_VoidType))!=null)){
			return (c_ConstExpr.m_new.call(new c_ConstExpr,this.m_ty,"")).p_Semant();
		}
		if(((object_downcast((this.m_ty),c_ObjectType))!=null) && !((object_downcast((t_src),c_ObjectType))!=null)){
			this.m_expr=(c_NewObjectExpr.m_new.call(new c_NewObjectExpr,this.m_ty,[this.m_expr])).p_Semant();
		}else{
			if(((object_downcast((t_src),c_ObjectType))!=null) && !((object_downcast((this.m_ty),c_ObjectType))!=null)){
				var t_op="";
				if((object_downcast((this.m_ty),c_BoolType))!=null){
					t_op="ToBool";
				}else{
					if((object_downcast((this.m_ty),c_IntType))!=null){
						t_op="ToInt";
					}else{
						if((object_downcast((this.m_ty),c_FloatType))!=null){
							t_op="ToFloat";
						}else{
							if((object_downcast((this.m_ty),c_StringType))!=null){
								t_op="ToString";
							}else{
								bb_config_InternalErr("Internal error");
							}
						}
					}
				}
				var t_fdecl=t_src.p_GetClass().p_FindFuncDecl(t_op,[],0);
				this.m_expr=(c_InvokeMemberExpr.m_new.call(new c_InvokeMemberExpr,this.m_expr,t_fdecl,[])).p_Semant();
			}
		}
		this.m_exprType=this.m_ty;
	}else{
		if((object_downcast((this.m_ty),c_BoolType))!=null){
			if((object_downcast((t_src),c_VoidType))!=null){
				bb_config_Err("Cannot convert from Void to Bool.");
			}
			if((this.m_flags&1)!=0){
				this.m_exprType=this.m_ty;
			}
		}else{
			if((this.m_ty.p_ExtendsType(t_src))!=0){
				if((this.m_flags&1)!=0){
					if(object_downcast((this.m_ty),c_ObjectType)!=null==(object_downcast((t_src),c_ObjectType)!=null)){
						this.m_exprType=this.m_ty;
					}
				}
			}else{
				if(((object_downcast((this.m_ty),c_ObjectType))!=null) && ((object_downcast((t_src),c_ObjectType))!=null)){
					if((this.m_flags&1)!=0){
						if(((t_src.p_GetClass().p_IsInterface())!=0) || ((this.m_ty.p_GetClass().p_IsInterface())!=0)){
							this.m_exprType=this.m_ty;
						}
					}
				}
			}
		}
	}
	if(!((this.m_exprType)!=null)){
		bb_config_Err("Cannot convert from "+t_src.p_ToString()+" to "+this.m_ty.p_ToString()+".");
	}
	if((object_downcast((this.m_expr),c_ConstExpr))!=null){
		return this.p_EvalConst();
	}
	return (this);
}
c_CastExpr.prototype.p_Copy=function(){
	return (c_CastExpr.m_new.call(new c_CastExpr,this.m_ty,this.p_CopyExpr(this.m_expr),this.m_flags));
}
c_CastExpr.prototype.p_Eval=function(){
	var t_val=this.m_expr.p_Eval();
	if((object_downcast((this.m_exprType),c_BoolType))!=null){
		if((object_downcast((this.m_expr.m_exprType),c_IntType))!=null){
			if((parseInt((t_val),10))!=0){
				return "1";
			}
			return "";
		}else{
			if((object_downcast((this.m_expr.m_exprType),c_FloatType))!=null){
				if((parseFloat(t_val))!=0.0){
					return "1";
				}
				return "";
			}else{
				if((object_downcast((this.m_expr.m_exprType),c_StringType))!=null){
					if((t_val).length!=0){
						return "1";
					}
					return "";
				}
			}
		}
	}else{
		if((object_downcast((this.m_exprType),c_IntType))!=null){
			if((object_downcast((this.m_expr.m_exprType),c_BoolType))!=null){
				if((t_val).length!=0){
					return "1";
				}
				return "0";
			}
			return String(parseInt((t_val),10));
		}else{
			if((object_downcast((this.m_exprType),c_FloatType))!=null){
				return String(parseFloat(t_val));
			}else{
				if((object_downcast((this.m_exprType),c_StringType))!=null){
					return t_val;
				}
			}
		}
	}
	if(!((t_val).length!=0)){
		return t_val;
	}
	return c_Expr.prototype.p_Eval.call(this);
}
c_CastExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransCastExpr(this);
}
function c_IdentExpr(){
	c_Expr.call(this);
	this.m_ident="";
	this.m_expr=null;
	this.m_scope=null;
	this.m_static=false;
}
c_IdentExpr.prototype=extend_class(c_Expr);
c_IdentExpr.m_new=function(t_ident,t_expr){
	c_Expr.m_new.call(this);
	this.m_ident=t_ident;
	this.m_expr=t_expr;
	return this;
}
c_IdentExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_IdentExpr.prototype.p_Copy=function(){
	return (c_IdentExpr.m_new.call(new c_IdentExpr,this.m_ident,this.p_CopyExpr(this.m_expr)));
}
c_IdentExpr.prototype.p_ToString=function(){
	var t_t="IdentExpr(\""+this.m_ident+"\"";
	if((this.m_expr)!=null){
		t_t=t_t+(","+this.m_expr.p_ToString());
	}
	return t_t+")";
}
c_IdentExpr.prototype.p__Semant=function(){
	if((this.m_scope)!=null){
		return 0;
	}
	if((this.m_expr)!=null){
		this.m_scope=this.m_expr.p_SemantScope();
		if((this.m_scope)!=null){
			this.m_static=true;
		}else{
			this.m_expr=this.m_expr.p_Semant();
			this.m_scope=(this.m_expr.m_exprType.p_GetClass());
			if(!((this.m_scope)!=null)){
				bb_config_Err("Expression has no scope");
			}
		}
	}else{
		this.m_scope=bb_decl__env;
		this.m_static=bb_decl__env.p_FuncScope()==null || bb_decl__env.p_FuncScope().p_IsStatic();
	}
	return 0;
}
c_IdentExpr.prototype.p_IdentErr=function(){
	var t_close="";
	var t_=this.m_scope.p_Decls().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_decl=t_.p_NextObject();
		if(this.m_ident.toLowerCase()==t_decl.m_ident.toLowerCase()){
			t_close=t_decl.m_ident;
		}
	}
	if(((t_close).length!=0) && this.m_ident!=t_close){
		bb_config_Err("Identifier '"+this.m_ident+"' not found - perhaps you meant '"+t_close+"'?");
	}
	bb_config_Err("Identifier '"+this.m_ident+"' not found.");
	return 0;
}
c_IdentExpr.prototype.p_SemantSet=function(t_op,t_rhs){
	this.p__Semant();
	var t_vdecl=this.m_scope.p_FindValDecl(this.m_ident);
	if((t_vdecl)!=null){
		if((object_downcast((t_vdecl),c_ConstDecl))!=null){
			if((t_rhs)!=null){
				bb_config_Err("Constant '"+this.m_ident+"' cannot be modified.");
			}
			var t_cexpr=c_ConstExpr.m_new.call(new c_ConstExpr,t_vdecl.m_type,object_downcast((t_vdecl),c_ConstDecl).m_value);
			if(!this.m_static && (((object_downcast((this.m_expr),c_InvokeExpr))!=null) || ((object_downcast((this.m_expr),c_InvokeMemberExpr))!=null))){
				return (c_StmtExpr.m_new.call(new c_StmtExpr,(c_ExprStmt.m_new.call(new c_ExprStmt,this.m_expr)),(t_cexpr))).p_Semant();
			}
			return t_cexpr.p_Semant();
		}else{
			if((object_downcast((t_vdecl),c_FieldDecl))!=null){
				if(this.m_static){
					bb_config_Err("Field '"+this.m_ident+"' cannot be accessed from here.");
				}
				if((this.m_expr)!=null){
					return (c_MemberVarExpr.m_new.call(new c_MemberVarExpr,this.m_expr,object_downcast((t_vdecl),c_VarDecl))).p_Semant();
				}
			}
		}
		return (c_VarExpr.m_new.call(new c_VarExpr,object_downcast((t_vdecl),c_VarDecl))).p_Semant();
	}
	if(((t_op).length!=0) && t_op!="="){
		var t_fdecl=this.m_scope.p_FindFuncDecl(this.m_ident,[],0);
		if(!((t_fdecl)!=null)){
			this.p_IdentErr();
		}
		if(((bb_decl__env.p_ModuleScope().p_IsStrict())!=0) && !t_fdecl.p_IsProperty()){
			bb_config_Err("Identifier '"+this.m_ident+"' cannot be used in this way.");
		}
		var t_lhs=null;
		if(t_fdecl.p_IsStatic() || this.m_scope==bb_decl__env && !bb_decl__env.p_FuncScope().p_IsStatic()){
			t_lhs=(c_InvokeExpr.m_new.call(new c_InvokeExpr,t_fdecl,[]));
		}else{
			if((this.m_expr)!=null){
				var t_tmp=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,null,this.m_expr);
				t_lhs=(c_InvokeMemberExpr.m_new.call(new c_InvokeMemberExpr,(c_VarExpr.m_new.call(new c_VarExpr,(t_tmp))),t_fdecl,[]));
				t_lhs=(c_StmtExpr.m_new.call(new c_StmtExpr,(c_DeclStmt.m_new.call(new c_DeclStmt,(t_tmp))),t_lhs));
			}else{
				return null;
			}
		}
		var t_bop=t_op.slice(0,1);
		var t_1=t_bop;
		if(t_1=="*" || t_1=="/" || t_1=="shl" || t_1=="shr" || t_1=="+" || t_1=="-" || t_1=="&" || t_1=="|" || t_1=="~"){
			t_rhs=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,t_bop,t_lhs,t_rhs));
		}else{
			bb_config_InternalErr("Internal error");
		}
		t_rhs=t_rhs.p_Semant();
	}
	var t_args=[];
	if((t_rhs)!=null){
		t_args=[t_rhs];
	}
	var t_fdecl2=this.m_scope.p_FindFuncDecl(this.m_ident,t_args,0);
	if((t_fdecl2)!=null){
		if(((bb_decl__env.p_ModuleScope().p_IsStrict())!=0) && !t_fdecl2.p_IsProperty()){
			bb_config_Err("Identifier '"+this.m_ident+"' cannot be used in this way.");
		}
		if(!t_fdecl2.p_IsStatic()){
			if(this.m_static){
				bb_config_Err("Method '"+this.m_ident+"' cannot be accessed from here.");
			}
			if((this.m_expr)!=null){
				return (c_InvokeMemberExpr.m_new.call(new c_InvokeMemberExpr,this.m_expr,t_fdecl2,t_args)).p_Semant();
			}
		}
		return (c_InvokeExpr.m_new.call(new c_InvokeExpr,t_fdecl2,t_args)).p_Semant();
	}
	this.p_IdentErr();
	return null;
}
c_IdentExpr.prototype.p_Semant=function(){
	return this.p_SemantSet("",null);
}
c_IdentExpr.prototype.p_SemantScope=function(){
	this.p__Semant();
	return this.m_scope.p_FindScopeDecl(this.m_ident);
}
c_IdentExpr.prototype.p_SemantFunc=function(t_args){
	this.p__Semant();
	var t_fdecl=this.m_scope.p_FindFuncDecl(this.m_ident,t_args,0);
	if((t_fdecl)!=null){
		if(!t_fdecl.p_IsStatic()){
			if(this.m_static){
				bb_config_Err("Method '"+this.m_ident+"' cannot be accessed from here.");
			}
			if((this.m_expr)!=null){
				return (c_InvokeMemberExpr.m_new.call(new c_InvokeMemberExpr,this.m_expr,t_fdecl,t_args)).p_Semant();
			}
		}
		return (c_InvokeExpr.m_new.call(new c_InvokeExpr,t_fdecl,t_args)).p_Semant();
	}
	var t_type=this.m_scope.p_FindType(this.m_ident,[]);
	if((t_type)!=null){
		if(t_args.length==1 && ((t_args[0])!=null)){
			return t_args[0].p_Cast(t_type,1);
		}
		bb_config_Err("Illegal number of arguments for type conversion");
	}
	this.p_IdentErr();
	return null;
}
function c_SelfExpr(){
	c_Expr.call(this);
}
c_SelfExpr.prototype=extend_class(c_Expr);
c_SelfExpr.m_new=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_SelfExpr.prototype.p_Copy=function(){
	return (c_SelfExpr.m_new.call(new c_SelfExpr));
}
c_SelfExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	if((bb_decl__env.p_FuncScope())!=null){
		if(bb_decl__env.p_FuncScope().p_IsStatic()){
			bb_config_Err("Illegal use of Self within static scope.");
		}
	}else{
		bb_config_Err("Self cannot be used here.");
	}
	this.m_exprType=(bb_decl__env.p_ClassScope().m_objectType);
	return (this);
}
c_SelfExpr.prototype.p_SideEffects=function(){
	return false;
}
c_SelfExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransSelfExpr(this);
}
function c_Stmt(){
	Object.call(this);
	this.m_errInfo="";
}
c_Stmt.m_new=function(){
	this.m_errInfo=bb_config__errInfo;
	return this;
}
c_Stmt.prototype.p_OnCopy2=function(t_scope){
}
c_Stmt.prototype.p_Copy2=function(t_scope){
	var t_t=this.p_OnCopy2(t_scope);
	t_t.m_errInfo=this.m_errInfo;
	return t_t;
}
c_Stmt.prototype.p_OnSemant=function(){
}
c_Stmt.prototype.p_Semant=function(){
	bb_config_PushErr(this.m_errInfo);
	this.p_OnSemant();
	bb_config_PopErr();
	return 0;
}
c_Stmt.prototype.p_Trans=function(){
}
function c_List5(){
	Object.call(this);
	this.m__head=(c_HeadNode5.m_new.call(new c_HeadNode5));
}
c_List5.m_new=function(){
	return this;
}
c_List5.prototype.p_AddLast5=function(t_data){
	return c_Node10.m_new.call(new c_Node10,this.m__head,this.m__head.m__pred,t_data);
}
c_List5.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast5(t_t);
	}
	return this;
}
c_List5.prototype.p_IsEmpty=function(){
	return this.m__head.m__succ==this.m__head;
}
c_List5.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator7.m_new.call(new c_Enumerator7,this);
}
c_List5.prototype.p_AddFirst=function(t_data){
	return c_Node10.m_new.call(new c_Node10,this.m__head.m__succ,this.m__head,t_data);
}
function c_Node10(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node10.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node10.m_new2=function(){
	return this;
}
function c_HeadNode5(){
	c_Node10.call(this);
}
c_HeadNode5.prototype=extend_class(c_Node10);
c_HeadNode5.m_new=function(){
	c_Node10.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_InvokeSuperExpr(){
	c_Expr.call(this);
	this.m_ident="";
	this.m_args=[];
	this.m_funcDecl=null;
}
c_InvokeSuperExpr.prototype=extend_class(c_Expr);
c_InvokeSuperExpr.m_new=function(t_ident,t_args){
	c_Expr.m_new.call(this);
	this.m_ident=t_ident;
	this.m_args=t_args;
	return this;
}
c_InvokeSuperExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_InvokeSuperExpr.prototype.p_Copy=function(){
	return (c_InvokeSuperExpr.m_new.call(new c_InvokeSuperExpr,this.m_ident,this.p_CopyArgs(this.m_args)));
}
c_InvokeSuperExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	if(bb_decl__env.p_FuncScope().p_IsStatic()){
		bb_config_Err("Illegal use of Super.");
	}
	var t_classScope=bb_decl__env.p_ClassScope();
	var t_superClass=t_classScope.m_superClass;
	if(!((t_superClass)!=null)){
		bb_config_Err("Class has no super class.");
	}
	this.m_args=this.p_SemantArgs(this.m_args);
	this.m_funcDecl=t_superClass.p_FindFuncDecl(this.m_ident,this.m_args,0);
	if(!((this.m_funcDecl)!=null)){
		bb_config_Err("Can't find superclass method '"+this.m_ident+"'.");
	}
	if((this.m_funcDecl.p_IsAbstract())!=0){
		bb_config_Err("Can't invoke abstract superclass method '"+this.m_ident+"'.");
	}
	this.m_args=this.p_CastArgs(this.m_args,this.m_funcDecl);
	this.m_exprType=this.m_funcDecl.m_retType;
	return (this);
}
c_InvokeSuperExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransInvokeSuperExpr(this);
}
function c_IdentTypeExpr(){
	c_Expr.call(this);
	this.m_cdecl=null;
}
c_IdentTypeExpr.prototype=extend_class(c_Expr);
c_IdentTypeExpr.m_new=function(t_type){
	c_Expr.m_new.call(this);
	this.m_exprType=t_type;
	return this;
}
c_IdentTypeExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_IdentTypeExpr.prototype.p_Copy=function(){
	return (c_IdentTypeExpr.m_new.call(new c_IdentTypeExpr,this.m_exprType));
}
c_IdentTypeExpr.prototype.p__Semant=function(){
	if((this.m_cdecl)!=null){
		return 0;
	}
	this.m_exprType=this.m_exprType.p_Semant();
	this.m_cdecl=this.m_exprType.p_GetClass();
	if(!((this.m_cdecl)!=null)){
		bb_config_InternalErr("Internal error");
	}
	return 0;
}
c_IdentTypeExpr.prototype.p_Semant=function(){
	this.p__Semant();
	bb_config_Err("Expression can't be used in this way");
	return null;
}
c_IdentTypeExpr.prototype.p_SemantScope=function(){
	this.p__Semant();
	return (this.m_cdecl);
}
c_IdentTypeExpr.prototype.p_SemantFunc=function(t_args){
	this.p__Semant();
	if(t_args.length==1 && ((t_args[0])!=null)){
		return t_args[0].p_Cast((this.m_cdecl.m_objectType),1);
	}
	bb_config_Err("Illegal number of arguments for type conversion");
	return null;
}
function c_FuncCallExpr(){
	c_Expr.call(this);
	this.m_expr=null;
	this.m_args=[];
}
c_FuncCallExpr.prototype=extend_class(c_Expr);
c_FuncCallExpr.m_new=function(t_expr,t_args){
	c_Expr.m_new.call(this);
	this.m_expr=t_expr;
	this.m_args=t_args;
	return this;
}
c_FuncCallExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_FuncCallExpr.prototype.p_Copy=function(){
	return (c_FuncCallExpr.m_new.call(new c_FuncCallExpr,this.p_CopyExpr(this.m_expr),this.p_CopyArgs(this.m_args)));
}
c_FuncCallExpr.prototype.p_ToString=function(){
	var t_t="FuncCallExpr("+this.m_expr.p_ToString();
	var t_=this.m_args;
	var t_2=0;
	while(t_2<t_.length){
		var t_arg=t_[t_2];
		t_2=t_2+1;
		t_t=t_t+(","+t_arg.p_ToString());
	}
	return t_t+")";
}
c_FuncCallExpr.prototype.p_Semant=function(){
	this.m_args=this.p_SemantArgs(this.m_args);
	return this.m_expr.p_SemantFunc(this.m_args);
}
function c_SliceExpr(){
	c_Expr.call(this);
	this.m_expr=null;
	this.m_from=null;
	this.m_term=null;
}
c_SliceExpr.prototype=extend_class(c_Expr);
c_SliceExpr.m_new=function(t_expr,t_from,t_term){
	c_Expr.m_new.call(this);
	this.m_expr=t_expr;
	this.m_from=t_from;
	this.m_term=t_term;
	return this;
}
c_SliceExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_SliceExpr.prototype.p_Copy=function(){
	return (c_SliceExpr.m_new.call(new c_SliceExpr,this.p_CopyExpr(this.m_expr),this.p_CopyExpr(this.m_from),this.p_CopyExpr(this.m_term)));
}
c_SliceExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_expr=this.m_expr.p_Semant();
	if(((object_downcast((this.m_expr.m_exprType),c_ArrayType))!=null) || ((object_downcast((this.m_expr.m_exprType),c_StringType))!=null)){
		if((this.m_from)!=null){
			this.m_from=this.m_from.p_Semant2((c_Type.m_intType),0);
		}
		if((this.m_term)!=null){
			this.m_term=this.m_term.p_Semant2((c_Type.m_intType),0);
		}
		this.m_exprType=this.m_expr.m_exprType;
	}else{
		bb_config_Err("Slices can only be used on strings or arrays.");
	}
	return (this);
}
c_SliceExpr.prototype.p_Eval=function(){
	var t_from=parseInt((this.m_from.p_Eval()),10);
	var t_term=parseInt((this.m_term.p_Eval()),10);
	if((object_downcast((this.m_expr.m_exprType),c_StringType))!=null){
		return this.m_expr.p_Eval().slice(t_from,t_term);
	}else{
		if((object_downcast((this.m_expr.m_exprType),c_ArrayType))!=null){
			bb_config_Err("TODO!");
		}
	}
	return "";
}
c_SliceExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransSliceExpr(this);
}
function c_IndexExpr(){
	c_Expr.call(this);
	this.m_expr=null;
	this.m_index=null;
}
c_IndexExpr.prototype=extend_class(c_Expr);
c_IndexExpr.m_new=function(t_expr,t_index){
	c_Expr.m_new.call(this);
	this.m_expr=t_expr;
	this.m_index=t_index;
	return this;
}
c_IndexExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_IndexExpr.prototype.p_Copy=function(){
	return (c_IndexExpr.m_new.call(new c_IndexExpr,this.p_CopyExpr(this.m_expr),this.p_CopyExpr(this.m_index)));
}
c_IndexExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_expr=this.m_expr.p_Semant();
	this.m_index=this.m_index.p_Semant2((c_Type.m_intType),0);
	if((object_downcast((this.m_expr.m_exprType),c_StringType))!=null){
		this.m_exprType=(c_Type.m_intType);
	}else{
		if((object_downcast((this.m_expr.m_exprType),c_ArrayType))!=null){
			this.m_exprType=object_downcast((this.m_expr.m_exprType),c_ArrayType).m_elemType;
		}else{
			bb_config_Err("Only strings and arrays may be indexed.");
		}
	}
	if(((object_downcast((this.m_expr.m_exprType),c_StringType))!=null) && ((object_downcast((this.m_expr),c_ConstExpr))!=null) && ((object_downcast((this.m_index),c_ConstExpr))!=null)){
		return this.p_EvalConst();
	}
	return (this);
}
c_IndexExpr.prototype.p_Eval=function(){
	if((object_downcast((this.m_expr.m_exprType),c_StringType))!=null){
		var t_str=this.m_expr.p_Eval();
		var t_idx=parseInt((this.m_index.p_Eval()),10);
		if(t_idx<0 || t_idx>=t_str.length){
			bb_config_Err("String index out of range.");
		}
		return String(t_str.charCodeAt(t_idx));
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_IndexExpr.prototype.p_SemantSet=function(t_op,t_rhs){
	this.p_Semant();
	if((object_downcast((this.m_expr.m_exprType),c_StringType))!=null){
		bb_config_Err("Strings are read only.");
	}
	return (this);
}
c_IndexExpr.prototype.p_SideEffects=function(){
	return this.m_expr.p_SideEffects() || this.m_index.p_SideEffects();
}
c_IndexExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransIndexExpr(this);
}
c_IndexExpr.prototype.p_TransVar=function(){
	return bb_translator__trans.p_TransIndexExpr(this);
}
function c_BinaryExpr(){
	c_Expr.call(this);
	this.m_op="";
	this.m_lhs=null;
	this.m_rhs=null;
}
c_BinaryExpr.prototype=extend_class(c_Expr);
c_BinaryExpr.m_new=function(t_op,t_lhs,t_rhs){
	c_Expr.m_new.call(this);
	this.m_op=t_op;
	this.m_lhs=t_lhs;
	this.m_rhs=t_rhs;
	return this;
}
c_BinaryExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_BinaryExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransBinaryExpr(this);
}
function c_BinaryMathExpr(){
	c_BinaryExpr.call(this);
}
c_BinaryMathExpr.prototype=extend_class(c_BinaryExpr);
c_BinaryMathExpr.m_new=function(t_op,t_lhs,t_rhs){
	c_BinaryExpr.m_new2.call(this);
	this.m_op=t_op;
	this.m_lhs=t_lhs;
	this.m_rhs=t_rhs;
	return this;
}
c_BinaryMathExpr.m_new2=function(){
	c_BinaryExpr.m_new2.call(this);
	return this;
}
c_BinaryMathExpr.prototype.p_Copy=function(){
	return (c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,this.m_op,this.p_CopyExpr(this.m_lhs),this.p_CopyExpr(this.m_rhs)));
}
c_BinaryMathExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_lhs=this.m_lhs.p_Semant();
	this.m_rhs=this.m_rhs.p_Semant();
	var t_3=this.m_op;
	if(t_3=="&" || t_3=="~" || t_3=="|" || t_3=="shl" || t_3=="shr"){
		this.m_exprType=(c_Type.m_intType);
	}else{
		this.m_exprType=this.p_BalanceTypes(this.m_lhs.m_exprType,this.m_rhs.m_exprType);
		if((object_downcast((this.m_exprType),c_StringType))!=null){
			if(this.m_op!="+"){
				bb_config_Err("Illegal string operator.");
			}
		}else{
			if(!((object_downcast((this.m_exprType),c_NumericType))!=null)){
				bb_config_Err("Illegal expression type.");
			}
		}
	}
	this.m_lhs=this.m_lhs.p_Cast(this.m_exprType,0);
	this.m_rhs=this.m_rhs.p_Cast(this.m_exprType,0);
	if(((object_downcast((this.m_lhs),c_ConstExpr))!=null) && ((object_downcast((this.m_rhs),c_ConstExpr))!=null)){
		return this.p_EvalConst();
	}
	return (this);
}
c_BinaryMathExpr.prototype.p_Eval=function(){
	var t_lhs=this.m_lhs.p_Eval();
	var t_rhs=this.m_rhs.p_Eval();
	if((object_downcast((this.m_exprType),c_IntType))!=null){
		var t_x=parseInt((t_lhs),10);
		var t_y=parseInt((t_rhs),10);
		var t_4=this.m_op;
		if(t_4=="/"){
			if(!((t_y)!=0)){
				bb_config_Err("Divide by zero error.");
			}
			return String((t_x/t_y)|0);
		}else{
			if(t_4=="*"){
				return String(t_x*t_y);
			}else{
				if(t_4=="mod"){
					if(!((t_y)!=0)){
						bb_config_Err("Divide by zero error.");
					}
					return String(t_x % t_y);
				}else{
					if(t_4=="shl"){
						return String(t_x<<t_y);
					}else{
						if(t_4=="shr"){
							return String(t_x>>t_y);
						}else{
							if(t_4=="+"){
								return String(t_x+t_y);
							}else{
								if(t_4=="-"){
									return String(t_x-t_y);
								}else{
									if(t_4=="&"){
										return String(t_x&t_y);
									}else{
										if(t_4=="~"){
											return String(t_x^t_y);
										}else{
											if(t_4=="|"){
												return String(t_x|t_y);
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}else{
		if((object_downcast((this.m_exprType),c_FloatType))!=null){
			var t_x2=parseFloat(t_lhs);
			var t_y2=parseFloat(t_rhs);
			var t_5=this.m_op;
			if(t_5=="/"){
				if(!((t_y2)!=0.0)){
					bb_config_Err("Divide by zero error.");
				}
				return String(t_x2/t_y2);
			}else{
				if(t_5=="*"){
					return String(t_x2*t_y2);
				}else{
					if(t_5=="mod"){
						if(!((t_y2)!=0.0)){
							bb_config_Err("Divide by zero error.");
						}
						return String(t_x2 % t_y2);
					}else{
						if(t_5=="+"){
							return String(t_x2+t_y2);
						}else{
							if(t_5=="-"){
								return String(t_x2-t_y2);
							}
						}
					}
				}
			}
		}else{
			if((object_downcast((this.m_exprType),c_StringType))!=null){
				var t_6=this.m_op;
				if(t_6=="+"){
					return t_lhs+t_rhs;
				}
			}
		}
	}
	bb_config_InternalErr("Internal error");
	return "";
}
function c_BinaryCompareExpr(){
	c_BinaryExpr.call(this);
	this.m_ty=null;
}
c_BinaryCompareExpr.prototype=extend_class(c_BinaryExpr);
c_BinaryCompareExpr.m_new=function(t_op,t_lhs,t_rhs){
	c_BinaryExpr.m_new2.call(this);
	this.m_op=t_op;
	this.m_lhs=t_lhs;
	this.m_rhs=t_rhs;
	return this;
}
c_BinaryCompareExpr.m_new2=function(){
	c_BinaryExpr.m_new2.call(this);
	return this;
}
c_BinaryCompareExpr.prototype.p_Copy=function(){
	return (c_BinaryCompareExpr.m_new.call(new c_BinaryCompareExpr,this.m_op,this.p_CopyExpr(this.m_lhs),this.p_CopyExpr(this.m_rhs)));
}
c_BinaryCompareExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_lhs=this.m_lhs.p_Semant();
	this.m_rhs=this.m_rhs.p_Semant();
	this.m_ty=this.p_BalanceTypes(this.m_lhs.m_exprType,this.m_rhs.m_exprType);
	if((object_downcast((this.m_ty),c_ArrayType))!=null){
		bb_config_Err("Arrays cannot be compared.");
	}
	if(((object_downcast((this.m_ty),c_BoolType))!=null) && this.m_op!="=" && this.m_op!="<>"){
		bb_config_Err("Bools can only be compared for equality.");
	}
	if(((object_downcast((this.m_ty),c_ObjectType))!=null) && this.m_op!="=" && this.m_op!="<>"){
		bb_config_Err("Objects can only be compared for equality.");
	}
	this.m_lhs=this.m_lhs.p_Cast(this.m_ty,0);
	this.m_rhs=this.m_rhs.p_Cast(this.m_ty,0);
	this.m_exprType=(c_Type.m_boolType);
	if(((object_downcast((this.m_lhs),c_ConstExpr))!=null) && ((object_downcast((this.m_rhs),c_ConstExpr))!=null)){
		return this.p_EvalConst();
	}
	return (this);
}
c_BinaryCompareExpr.prototype.p_Eval=function(){
	var t_r=-1;
	if((object_downcast((this.m_ty),c_BoolType))!=null){
		var t_lhs=this.m_lhs.p_Eval();
		var t_rhs=this.m_rhs.p_Eval();
		var t_7=this.m_op;
		if(t_7=="="){
			t_r=((t_lhs==t_rhs)?1:0);
		}else{
			if(t_7=="<>"){
				t_r=((t_lhs!=t_rhs)?1:0);
			}
		}
	}else{
		if((object_downcast((this.m_ty),c_IntType))!=null){
			var t_lhs2=parseInt((this.m_lhs.p_Eval()),10);
			var t_rhs2=parseInt((this.m_rhs.p_Eval()),10);
			var t_8=this.m_op;
			if(t_8=="="){
				t_r=((t_lhs2==t_rhs2)?1:0);
			}else{
				if(t_8=="<>"){
					t_r=((t_lhs2!=t_rhs2)?1:0);
				}else{
					if(t_8=="<"){
						t_r=((t_lhs2<t_rhs2)?1:0);
					}else{
						if(t_8=="<="){
							t_r=((t_lhs2<=t_rhs2)?1:0);
						}else{
							if(t_8==">"){
								t_r=((t_lhs2>t_rhs2)?1:0);
							}else{
								if(t_8==">="){
									t_r=((t_lhs2>=t_rhs2)?1:0);
								}
							}
						}
					}
				}
			}
		}else{
			if((object_downcast((this.m_ty),c_FloatType))!=null){
				var t_lhs3=parseFloat(this.m_lhs.p_Eval());
				var t_rhs3=parseFloat(this.m_rhs.p_Eval());
				var t_9=this.m_op;
				if(t_9=="="){
					t_r=((t_lhs3==t_rhs3)?1:0);
				}else{
					if(t_9=="<>"){
						t_r=((t_lhs3!=t_rhs3)?1:0);
					}else{
						if(t_9=="<"){
							t_r=((t_lhs3<t_rhs3)?1:0);
						}else{
							if(t_9=="<="){
								t_r=((t_lhs3<=t_rhs3)?1:0);
							}else{
								if(t_9==">"){
									t_r=((t_lhs3>t_rhs3)?1:0);
								}else{
									if(t_9==">="){
										t_r=((t_lhs3>=t_rhs3)?1:0);
									}
								}
							}
						}
					}
				}
			}else{
				if((object_downcast((this.m_ty),c_StringType))!=null){
					var t_lhs4=this.m_lhs.p_Eval();
					var t_rhs4=this.m_rhs.p_Eval();
					var t_10=this.m_op;
					if(t_10=="="){
						t_r=((t_lhs4==t_rhs4)?1:0);
					}else{
						if(t_10=="<>"){
							t_r=((t_lhs4!=t_rhs4)?1:0);
						}else{
							if(t_10=="<"){
								t_r=((t_lhs4<t_rhs4)?1:0);
							}else{
								if(t_10=="<="){
									t_r=((t_lhs4<=t_rhs4)?1:0);
								}else{
									if(t_10==">"){
										t_r=((t_lhs4>t_rhs4)?1:0);
									}else{
										if(t_10==">="){
											t_r=((t_lhs4>=t_rhs4)?1:0);
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if(t_r==1){
		return "1";
	}
	if(t_r==0){
		return "";
	}
	bb_config_InternalErr("Internal error");
	return "";
}
function c_BinaryLogicExpr(){
	c_BinaryExpr.call(this);
}
c_BinaryLogicExpr.prototype=extend_class(c_BinaryExpr);
c_BinaryLogicExpr.m_new=function(t_op,t_lhs,t_rhs){
	c_BinaryExpr.m_new2.call(this);
	this.m_op=t_op;
	this.m_lhs=t_lhs;
	this.m_rhs=t_rhs;
	return this;
}
c_BinaryLogicExpr.m_new2=function(){
	c_BinaryExpr.m_new2.call(this);
	return this;
}
c_BinaryLogicExpr.prototype.p_Copy=function(){
	return (c_BinaryLogicExpr.m_new.call(new c_BinaryLogicExpr,this.m_op,this.p_CopyExpr(this.m_lhs),this.p_CopyExpr(this.m_rhs)));
}
c_BinaryLogicExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_lhs=this.m_lhs.p_Semant2((c_Type.m_boolType),1);
	this.m_rhs=this.m_rhs.p_Semant2((c_Type.m_boolType),1);
	this.m_exprType=(c_Type.m_boolType);
	if(((object_downcast((this.m_lhs),c_ConstExpr))!=null) && ((object_downcast((this.m_rhs),c_ConstExpr))!=null)){
		return this.p_EvalConst();
	}
	return (this);
}
c_BinaryLogicExpr.prototype.p_Eval=function(){
	var t_11=this.m_op;
	if(t_11=="and"){
		if(((this.m_lhs.p_Eval()).length!=0) && ((this.m_rhs.p_Eval()).length!=0)){
			return "1";
		}else{
			return "";
		}
	}else{
		if(t_11=="or"){
			if(((this.m_lhs.p_Eval()).length!=0) || ((this.m_rhs.p_Eval()).length!=0)){
				return "1";
			}else{
				return "";
			}
		}
	}
	bb_config_InternalErr("Internal error");
	return "";
}
function c_VarDecl(){
	c_ValDecl.call(this);
}
c_VarDecl.prototype=extend_class(c_ValDecl);
c_VarDecl.m_new=function(){
	c_ValDecl.m_new.call(this);
	return this;
}
function c_GlobalDecl(){
	c_VarDecl.call(this);
}
c_GlobalDecl.prototype=extend_class(c_VarDecl);
c_GlobalDecl.m_new=function(t_ident,t_attrs,t_type,t_init){
	c_VarDecl.m_new.call(this);
	this.m_ident=t_ident;
	this.m_attrs=t_attrs;
	this.m_type=t_type;
	this.m_init=t_init;
	return this;
}
c_GlobalDecl.m_new2=function(){
	c_VarDecl.m_new.call(this);
	return this;
}
c_GlobalDecl.prototype.p_ToString=function(){
	return "Global "+c_ValDecl.prototype.p_ToString.call(this);
}
c_GlobalDecl.prototype.p_OnCopy=function(){
	return (c_GlobalDecl.m_new.call(new c_GlobalDecl,this.m_ident,this.m_attrs,this.m_type,this.p_CopyInit()));
}
function c_FieldDecl(){
	c_VarDecl.call(this);
}
c_FieldDecl.prototype=extend_class(c_VarDecl);
c_FieldDecl.m_new=function(t_ident,t_attrs,t_type,t_init){
	c_VarDecl.m_new.call(this);
	this.m_ident=t_ident;
	this.m_attrs=t_attrs;
	this.m_type=t_type;
	this.m_init=t_init;
	return this;
}
c_FieldDecl.m_new2=function(){
	c_VarDecl.m_new.call(this);
	return this;
}
c_FieldDecl.prototype.p_ToString=function(){
	return "Field "+c_ValDecl.prototype.p_ToString.call(this);
}
c_FieldDecl.prototype.p_OnCopy=function(){
	return (c_FieldDecl.m_new.call(new c_FieldDecl,this.m_ident,this.m_attrs,this.m_type,this.p_CopyInit()));
}
function c_LocalDecl(){
	c_VarDecl.call(this);
}
c_LocalDecl.prototype=extend_class(c_VarDecl);
c_LocalDecl.m_new=function(t_ident,t_attrs,t_type,t_init){
	c_VarDecl.m_new.call(this);
	this.m_ident=t_ident;
	this.m_attrs=t_attrs;
	this.m_type=t_type;
	this.m_init=t_init;
	return this;
}
c_LocalDecl.m_new2=function(){
	c_VarDecl.m_new.call(this);
	return this;
}
c_LocalDecl.prototype.p_ToString=function(){
	return "Local "+c_ValDecl.prototype.p_ToString.call(this);
}
c_LocalDecl.prototype.p_OnCopy=function(){
	return (c_LocalDecl.m_new.call(new c_LocalDecl,this.m_ident,this.m_attrs,this.m_type,this.p_CopyInit()));
}
function c_Enumerator3(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator3.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator3.m_new2=function(){
	return this;
}
c_Enumerator3.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator3.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_Stack7(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack7.m_new=function(){
	return this;
}
c_Stack7.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack7.prototype.p_Push19=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack7.prototype.p_Push20=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push19(t_values[t_offset+t_i]);
	}
}
c_Stack7.prototype.p_Push21=function(t_values,t_offset){
	this.p_Push20(t_values,t_offset,t_values.length-t_offset);
}
c_Stack7.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_ObjectType(){
	c_Type.call(this);
	this.m_classDecl=null;
}
c_ObjectType.prototype=extend_class(c_Type);
c_ObjectType.m_new=function(t_classDecl){
	c_Type.m_new.call(this);
	this.m_classDecl=t_classDecl;
	return this;
}
c_ObjectType.m_new2=function(){
	c_Type.m_new.call(this);
	return this;
}
c_ObjectType.prototype.p_EqualsType=function(t_ty){
	var t_objty=object_downcast((t_ty),c_ObjectType);
	return ((((t_objty)!=null) && this.m_classDecl==t_objty.m_classDecl)?1:0);
}
c_ObjectType.prototype.p_GetClass=function(){
	return this.m_classDecl;
}
c_ObjectType.prototype.p_ExtendsType=function(t_ty){
	var t_objty=object_downcast((t_ty),c_ObjectType);
	if((t_objty)!=null){
		return this.m_classDecl.p_ExtendsClass(t_objty.m_classDecl);
	}
	var t_op="";
	if((object_downcast((t_ty),c_BoolType))!=null){
		t_op="ToBool";
	}else{
		if((object_downcast((t_ty),c_IntType))!=null){
			t_op="ToInt";
		}else{
			if((object_downcast((t_ty),c_FloatType))!=null){
				t_op="ToFloat";
			}else{
				if((object_downcast((t_ty),c_StringType))!=null){
					t_op="ToString";
				}else{
					return 0;
				}
			}
		}
	}
	var t_fdecl=this.p_GetClass().p_FindFuncDecl(t_op,[],1);
	return ((((t_fdecl)!=null) && t_fdecl.p_IsMethod() && ((t_fdecl.m_retType.p_EqualsType(t_ty))!=0))?1:0);
}
c_ObjectType.prototype.p_ToString=function(){
	return this.m_classDecl.p_ToString();
}
function c_List6(){
	Object.call(this);
	this.m__head=(c_HeadNode6.m_new.call(new c_HeadNode6));
}
c_List6.m_new=function(){
	return this;
}
c_List6.prototype.p_AddLast6=function(t_data){
	return c_Node11.m_new.call(new c_Node11,this.m__head,this.m__head.m__pred,t_data);
}
c_List6.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast6(t_t);
	}
	return this;
}
c_List6.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator5.m_new.call(new c_Enumerator5,this);
}
function c_Node11(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node11.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node11.m_new2=function(){
	return this;
}
function c_HeadNode6(){
	c_Node11.call(this);
}
c_HeadNode6.prototype=extend_class(c_Node11);
c_HeadNode6.m_new=function(){
	c_Node11.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_ArgDecl(){
	c_LocalDecl.call(this);
}
c_ArgDecl.prototype=extend_class(c_LocalDecl);
c_ArgDecl.m_new=function(t_ident,t_attrs,t_type,t_init){
	c_LocalDecl.m_new2.call(this);
	this.m_ident=t_ident;
	this.m_attrs=t_attrs;
	this.m_type=t_type;
	this.m_init=t_init;
	return this;
}
c_ArgDecl.m_new2=function(){
	c_LocalDecl.m_new2.call(this);
	return this;
}
c_ArgDecl.prototype.p_ToString=function(){
	return c_LocalDecl.prototype.p_ToString.call(this);
}
c_ArgDecl.prototype.p_OnCopy=function(){
	return (c_ArgDecl.m_new.call(new c_ArgDecl,this.m_ident,this.m_attrs,this.m_type,this.p_CopyInit()));
}
function c_Stack8(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack8.m_new=function(){
	return this;
}
c_Stack8.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack8.prototype.p_Push22=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack8.prototype.p_Push23=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push22(t_values[t_offset+t_i]);
	}
}
c_Stack8.prototype.p_Push24=function(t_values,t_offset){
	this.p_Push23(t_values,t_offset,t_values.length-t_offset);
}
c_Stack8.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_List7(){
	Object.call(this);
	this.m__head=(c_HeadNode7.m_new.call(new c_HeadNode7));
}
c_List7.m_new=function(){
	return this;
}
c_List7.prototype.p_AddLast7=function(t_data){
	return c_Node12.m_new.call(new c_Node12,this.m__head,this.m__head.m__pred,t_data);
}
c_List7.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast7(t_t);
	}
	return this;
}
c_List7.prototype.p_RemoveLast=function(){
	var t_data=this.m__head.m__pred.m__data;
	this.m__head.m__pred.p_Remove();
	return t_data;
}
c_List7.prototype.p_Equals3=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_List7.prototype.p_FindLast5=function(t_value,t_start){
	while(t_start!=this.m__head){
		if(this.p_Equals3(t_value,t_start.m__data)){
			return t_start;
		}
		t_start=t_start.m__pred;
	}
	return null;
}
c_List7.prototype.p_FindLast6=function(t_value){
	return this.p_FindLast5(t_value,this.m__head.m__pred);
}
c_List7.prototype.p_RemoveLast4=function(t_value){
	var t_node=this.p_FindLast6(t_value);
	if((t_node)!=null){
		t_node.p_Remove();
	}
}
function c_Node12(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node12.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node12.m_new2=function(){
	return this;
}
c_Node12.prototype.p_Remove=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode7(){
	c_Node12.call(this);
}
c_HeadNode7.prototype=extend_class(c_Node12);
c_HeadNode7.m_new=function(){
	c_Node12.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_DeclStmt(){
	c_Stmt.call(this);
	this.m_decl=null;
}
c_DeclStmt.prototype=extend_class(c_Stmt);
c_DeclStmt.m_new=function(t_decl){
	c_Stmt.m_new.call(this);
	this.m_decl=t_decl;
	return this;
}
c_DeclStmt.m_new2=function(t_id,t_ty,t_init){
	c_Stmt.m_new.call(this);
	this.m_decl=(c_LocalDecl.m_new.call(new c_LocalDecl,t_id,0,t_ty,t_init));
	return this;
}
c_DeclStmt.m_new3=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_DeclStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_DeclStmt.m_new.call(new c_DeclStmt,this.m_decl.p_Copy()));
}
c_DeclStmt.prototype.p_OnSemant=function(){
	this.m_decl.p_Semant();
	bb_decl__env.p_InsertDecl(this.m_decl);
	return 0;
}
c_DeclStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransDeclStmt(this);
}
function c_ReturnStmt(){
	c_Stmt.call(this);
	this.m_expr=null;
}
c_ReturnStmt.prototype=extend_class(c_Stmt);
c_ReturnStmt.m_new=function(t_expr){
	c_Stmt.m_new.call(this);
	this.m_expr=t_expr;
	return this;
}
c_ReturnStmt.m_new2=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_ReturnStmt.prototype.p_OnCopy2=function(t_scope){
	if((this.m_expr)!=null){
		return (c_ReturnStmt.m_new.call(new c_ReturnStmt,this.m_expr.p_Copy()));
	}
	return (c_ReturnStmt.m_new.call(new c_ReturnStmt,null));
}
c_ReturnStmt.prototype.p_OnSemant=function(){
	var t_fdecl=bb_decl__env.p_FuncScope();
	if((this.m_expr)!=null){
		if(t_fdecl.p_IsCtor()){
			bb_config_Err("Constructors may not return a value.");
		}
		if((object_downcast((t_fdecl.m_retType),c_VoidType))!=null){
			bb_config_Err("Void functions may not return a value.");
		}
		this.m_expr=this.m_expr.p_Semant2(t_fdecl.m_retType,0);
	}else{
		if(t_fdecl.p_IsCtor()){
			this.m_expr=(c_SelfExpr.m_new.call(new c_SelfExpr)).p_Semant();
		}else{
			if(!((object_downcast((t_fdecl.m_retType),c_VoidType))!=null)){
				if((bb_decl__env.p_ModuleScope().p_IsStrict())!=0){
					bb_config_Err("Missing return expression.");
				}
				this.m_expr=(c_ConstExpr.m_new.call(new c_ConstExpr,t_fdecl.m_retType,"")).p_Semant();
			}
		}
	}
	return 0;
}
c_ReturnStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransReturnStmt(this);
}
function c_BreakStmt(){
	c_Stmt.call(this);
}
c_BreakStmt.prototype=extend_class(c_Stmt);
c_BreakStmt.m_new=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_BreakStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_BreakStmt.m_new.call(new c_BreakStmt));
}
c_BreakStmt.prototype.p_OnSemant=function(){
	if(!((bb_decl__loopnest)!=0)){
		bb_config_Err("Exit statement must appear inside a loop.");
	}
	return 0;
}
c_BreakStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransBreakStmt(this);
}
function c_ContinueStmt(){
	c_Stmt.call(this);
}
c_ContinueStmt.prototype=extend_class(c_Stmt);
c_ContinueStmt.m_new=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_ContinueStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_ContinueStmt.m_new.call(new c_ContinueStmt));
}
c_ContinueStmt.prototype.p_OnSemant=function(){
	if(!((bb_decl__loopnest)!=0)){
		bb_config_Err("Continue statement must appear inside a loop.");
	}
	return 0;
}
c_ContinueStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransContinueStmt(this);
}
function c_IfStmt(){
	c_Stmt.call(this);
	this.m_expr=null;
	this.m_thenBlock=null;
	this.m_elseBlock=null;
}
c_IfStmt.prototype=extend_class(c_Stmt);
c_IfStmt.m_new=function(t_expr,t_thenBlock,t_elseBlock){
	c_Stmt.m_new.call(this);
	this.m_expr=t_expr;
	this.m_thenBlock=t_thenBlock;
	this.m_elseBlock=t_elseBlock;
	return this;
}
c_IfStmt.m_new2=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_IfStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_IfStmt.m_new.call(new c_IfStmt,this.m_expr.p_Copy(),this.m_thenBlock.p_CopyBlock(t_scope),this.m_elseBlock.p_CopyBlock(t_scope)));
}
c_IfStmt.prototype.p_OnSemant=function(){
	this.m_expr=this.m_expr.p_Semant2((c_Type.m_boolType),1);
	this.m_thenBlock.p_Semant();
	this.m_elseBlock.p_Semant();
	return 0;
}
c_IfStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransIfStmt(this);
}
function c_WhileStmt(){
	c_Stmt.call(this);
	this.m_expr=null;
	this.m_block=null;
}
c_WhileStmt.prototype=extend_class(c_Stmt);
c_WhileStmt.m_new=function(t_expr,t_block){
	c_Stmt.m_new.call(this);
	this.m_expr=t_expr;
	this.m_block=t_block;
	return this;
}
c_WhileStmt.m_new2=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_WhileStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_WhileStmt.m_new.call(new c_WhileStmt,this.m_expr.p_Copy(),this.m_block.p_CopyBlock(t_scope)));
}
c_WhileStmt.prototype.p_OnSemant=function(){
	this.m_expr=this.m_expr.p_Semant2((c_Type.m_boolType),1);
	bb_decl__loopnest+=1;
	this.m_block.p_Semant();
	bb_decl__loopnest-=1;
	return 0;
}
c_WhileStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransWhileStmt(this);
}
function c_RepeatStmt(){
	c_Stmt.call(this);
	this.m_block=null;
	this.m_expr=null;
}
c_RepeatStmt.prototype=extend_class(c_Stmt);
c_RepeatStmt.m_new=function(t_block,t_expr){
	c_Stmt.m_new.call(this);
	this.m_block=t_block;
	this.m_expr=t_expr;
	return this;
}
c_RepeatStmt.m_new2=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_RepeatStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_RepeatStmt.m_new.call(new c_RepeatStmt,this.m_block.p_CopyBlock(t_scope),this.m_expr.p_Copy()));
}
c_RepeatStmt.prototype.p_OnSemant=function(){
	bb_decl__loopnest+=1;
	this.m_block.p_Semant();
	bb_decl__loopnest-=1;
	this.m_expr=this.m_expr.p_Semant2((c_Type.m_boolType),1);
	return 0;
}
c_RepeatStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransRepeatStmt(this);
}
function c_ForEachinStmt(){
	c_Stmt.call(this);
	this.m_varid="";
	this.m_varty=null;
	this.m_varlocal=0;
	this.m_expr=null;
	this.m_block=null;
}
c_ForEachinStmt.prototype=extend_class(c_Stmt);
c_ForEachinStmt.m_new=function(t_varid,t_varty,t_varlocal,t_expr,t_block){
	c_Stmt.m_new.call(this);
	this.m_varid=t_varid;
	this.m_varty=t_varty;
	this.m_varlocal=t_varlocal;
	this.m_expr=t_expr;
	this.m_block=t_block;
	return this;
}
c_ForEachinStmt.m_new2=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_ForEachinStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_ForEachinStmt.m_new.call(new c_ForEachinStmt,this.m_varid,this.m_varty,this.m_varlocal,this.m_expr.p_Copy(),this.m_block.p_CopyBlock(t_scope)));
}
c_ForEachinStmt.prototype.p_OnSemant=function(){
	this.m_expr=this.m_expr.p_Semant();
	if(((object_downcast((this.m_expr.m_exprType),c_ArrayType))!=null) || ((object_downcast((this.m_expr.m_exprType),c_StringType))!=null)){
		var t_exprTmp=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,null,this.m_expr);
		var t_indexTmp=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,null,(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_intType),"0")));
		var t_lenExpr=(c_IdentExpr.m_new.call(new c_IdentExpr,"Length",(c_VarExpr.m_new.call(new c_VarExpr,(t_exprTmp)))));
		var t_cmpExpr=(c_BinaryCompareExpr.m_new.call(new c_BinaryCompareExpr,"<",(c_VarExpr.m_new.call(new c_VarExpr,(t_indexTmp))),t_lenExpr));
		var t_indexExpr=(c_IndexExpr.m_new.call(new c_IndexExpr,(c_VarExpr.m_new.call(new c_VarExpr,(t_exprTmp))),(c_VarExpr.m_new.call(new c_VarExpr,(t_indexTmp)))));
		var t_addExpr=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,"+",(c_VarExpr.m_new.call(new c_VarExpr,(t_indexTmp))),(c_ConstExpr.m_new.call(new c_ConstExpr,(c_Type.m_intType),"1"))));
		this.m_block.m_stmts.p_AddFirst(c_AssignStmt.m_new.call(new c_AssignStmt,"=",(c_VarExpr.m_new.call(new c_VarExpr,(t_indexTmp))),t_addExpr));
		if((this.m_varlocal)!=0){
			var t_varTmp=c_LocalDecl.m_new.call(new c_LocalDecl,this.m_varid,0,this.m_varty,t_indexExpr);
			this.m_block.m_stmts.p_AddFirst(c_DeclStmt.m_new.call(new c_DeclStmt,(t_varTmp)));
		}else{
			this.m_block.m_stmts.p_AddFirst(c_AssignStmt.m_new.call(new c_AssignStmt,"=",(c_IdentExpr.m_new.call(new c_IdentExpr,this.m_varid,null)),t_indexExpr));
		}
		var t_whileStmt=c_WhileStmt.m_new.call(new c_WhileStmt,t_cmpExpr,this.m_block);
		this.m_block=c_BlockDecl.m_new.call(new c_BlockDecl,this.m_block.m_scope);
		this.m_block.p_AddStmt(c_DeclStmt.m_new.call(new c_DeclStmt,(t_exprTmp)));
		this.m_block.p_AddStmt(c_DeclStmt.m_new.call(new c_DeclStmt,(t_indexTmp)));
		this.m_block.p_AddStmt(t_whileStmt);
	}else{
		if((object_downcast((this.m_expr.m_exprType),c_ObjectType))!=null){
			var t_enumerInit=(c_FuncCallExpr.m_new.call(new c_FuncCallExpr,(c_IdentExpr.m_new.call(new c_IdentExpr,"ObjectEnumerator",this.m_expr)),[]));
			var t_enumerTmp=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,null,t_enumerInit);
			var t_hasNextExpr=(c_FuncCallExpr.m_new.call(new c_FuncCallExpr,(c_IdentExpr.m_new.call(new c_IdentExpr,"HasNext",(c_VarExpr.m_new.call(new c_VarExpr,(t_enumerTmp))))),[]));
			var t_nextObjExpr=(c_FuncCallExpr.m_new.call(new c_FuncCallExpr,(c_IdentExpr.m_new.call(new c_IdentExpr,"NextObject",(c_VarExpr.m_new.call(new c_VarExpr,(t_enumerTmp))))),[]));
			if((this.m_varlocal)!=0){
				var t_varTmp2=c_LocalDecl.m_new.call(new c_LocalDecl,this.m_varid,0,this.m_varty,t_nextObjExpr);
				this.m_block.m_stmts.p_AddFirst(c_DeclStmt.m_new.call(new c_DeclStmt,(t_varTmp2)));
			}else{
				this.m_block.m_stmts.p_AddFirst(c_AssignStmt.m_new.call(new c_AssignStmt,"=",(c_IdentExpr.m_new.call(new c_IdentExpr,this.m_varid,null)),t_nextObjExpr));
			}
			var t_whileStmt2=c_WhileStmt.m_new.call(new c_WhileStmt,t_hasNextExpr,this.m_block);
			this.m_block=c_BlockDecl.m_new.call(new c_BlockDecl,this.m_block.m_scope);
			this.m_block.p_AddStmt(c_DeclStmt.m_new.call(new c_DeclStmt,(t_enumerTmp)));
			this.m_block.p_AddStmt(t_whileStmt2);
		}else{
			bb_config_Err("Expression cannot be used with For Each.");
		}
	}
	this.m_block.p_Semant();
	return 0;
}
c_ForEachinStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransBlock(this.m_block);
}
function c_AssignStmt(){
	c_Stmt.call(this);
	this.m_op="";
	this.m_lhs=null;
	this.m_rhs=null;
	this.m_tmp1=null;
	this.m_tmp2=null;
}
c_AssignStmt.prototype=extend_class(c_Stmt);
c_AssignStmt.m_new=function(t_op,t_lhs,t_rhs){
	c_Stmt.m_new.call(this);
	this.m_op=t_op;
	this.m_lhs=t_lhs;
	this.m_rhs=t_rhs;
	return this;
}
c_AssignStmt.m_new2=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_AssignStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_AssignStmt.m_new.call(new c_AssignStmt,this.m_op,this.m_lhs.p_Copy(),this.m_rhs.p_Copy()));
}
c_AssignStmt.prototype.p_FixSideEffects=function(){
	var t_e1=object_downcast((this.m_lhs),c_MemberVarExpr);
	if((t_e1)!=null){
		if(t_e1.m_expr.p_SideEffects()){
			this.m_tmp1=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,t_e1.m_expr.m_exprType,t_e1.m_expr);
			this.m_tmp1.p_Semant();
			this.m_lhs=(c_MemberVarExpr.m_new.call(new c_MemberVarExpr,(c_VarExpr.m_new.call(new c_VarExpr,(this.m_tmp1))),t_e1.m_decl));
		}
	}
	var t_e2=object_downcast((this.m_lhs),c_IndexExpr);
	if((t_e2)!=null){
		var t_expr=t_e2.m_expr;
		var t_index=t_e2.m_index;
		if(t_expr.p_SideEffects() || t_index.p_SideEffects()){
			if(t_expr.p_SideEffects()){
				this.m_tmp1=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,t_expr.m_exprType,t_expr);
				this.m_tmp1.p_Semant();
				t_expr=(c_VarExpr.m_new.call(new c_VarExpr,(this.m_tmp1)));
			}
			if(t_index.p_SideEffects()){
				this.m_tmp2=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,t_index.m_exprType,t_index);
				this.m_tmp2.p_Semant();
				t_index=(c_VarExpr.m_new.call(new c_VarExpr,(this.m_tmp2)));
			}
			this.m_lhs=(c_IndexExpr.m_new.call(new c_IndexExpr,t_expr,t_index)).p_Semant();
		}
	}
	return 0;
}
c_AssignStmt.prototype.p_OnSemant=function(){
	this.m_rhs=this.m_rhs.p_Semant();
	this.m_lhs=this.m_lhs.p_SemantSet(this.m_op,this.m_rhs);
	if(((object_downcast((this.m_lhs),c_InvokeExpr))!=null) || ((object_downcast((this.m_lhs),c_InvokeMemberExpr))!=null)){
		this.m_rhs=null;
		return 0;
	}
	var t_kludge=true;
	var t_1=this.m_op;
	if(t_1=="="){
		this.m_rhs=this.m_rhs.p_Cast(this.m_lhs.m_exprType,0);
		t_kludge=false;
	}else{
		if(t_1=="*=" || t_1=="/=" || t_1=="+=" || t_1=="-="){
			if(((object_downcast((this.m_lhs.m_exprType),c_NumericType))!=null) && ((this.m_lhs.m_exprType.p_EqualsType(this.m_rhs.m_exprType))!=0)){
				t_kludge=false;
				if(bb_config_ENV_LANG=="js"){
					if(this.m_op=="/=" && ((object_downcast((this.m_lhs.m_exprType),c_IntType))!=null)){
						t_kludge=true;
					}
				}
			}
		}else{
			if(t_1=="&=" || t_1=="|=" || t_1=="~=" || t_1=="shl=" || t_1=="shr=" || t_1=="mod="){
				if(((object_downcast((this.m_lhs.m_exprType),c_IntType))!=null) && ((this.m_lhs.m_exprType.p_EqualsType(this.m_rhs.m_exprType))!=0)){
					t_kludge=false;
				}
			}else{
				bb_config_InternalErr("Internal error");
			}
		}
	}
	if(bb_config_ENV_LANG==""){
		t_kludge=true;
	}
	if(t_kludge){
		this.p_FixSideEffects();
		this.m_rhs=(c_BinaryMathExpr.m_new.call(new c_BinaryMathExpr,this.m_op.slice(0,-1),this.m_lhs,this.m_rhs)).p_Semant().p_Cast(this.m_lhs.m_exprType,0);
		this.m_op="=";
	}
	return 0;
}
c_AssignStmt.prototype.p_Trans=function(){
	bb_config__errInfo=this.m_errInfo;
	return bb_translator__trans.p_TransAssignStmt(this);
}
function c_ForStmt(){
	c_Stmt.call(this);
	this.m_init=null;
	this.m_expr=null;
	this.m_incr=null;
	this.m_block=null;
}
c_ForStmt.prototype=extend_class(c_Stmt);
c_ForStmt.m_new=function(t_init,t_expr,t_incr,t_block){
	c_Stmt.m_new.call(this);
	this.m_init=t_init;
	this.m_expr=t_expr;
	this.m_incr=t_incr;
	this.m_block=t_block;
	return this;
}
c_ForStmt.m_new2=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_ForStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_ForStmt.m_new.call(new c_ForStmt,this.m_init.p_Copy2(t_scope),this.m_expr.p_Copy(),this.m_incr.p_Copy2(t_scope),this.m_block.p_CopyBlock(t_scope)));
}
c_ForStmt.prototype.p_OnSemant=function(){
	bb_decl_PushEnv(this.m_block);
	this.m_init.p_Semant();
	this.m_expr=this.m_expr.p_Semant();
	bb_decl__loopnest+=1;
	this.m_block.p_Semant();
	bb_decl__loopnest-=1;
	this.m_incr.p_Semant();
	bb_decl_PopEnv();
	var t_assop=object_downcast((this.m_incr),c_AssignStmt);
	var t_addop=object_downcast((t_assop.m_rhs),c_BinaryExpr);
	if(!((t_addop)!=null)){
		bb_config_Err("Invalid step expression");
	}
	var t_stpval=t_addop.m_rhs.p_Eval();
	if(string_startswith(t_stpval,"-")){
		var t_bexpr=object_downcast((this.m_expr),c_BinaryExpr);
		var t_2=t_bexpr.m_op;
		if(t_2=="<"){
			t_bexpr.m_op=">";
		}else{
			if(t_2=="<="){
				t_bexpr.m_op=">=";
			}
		}
	}
	return 0;
}
c_ForStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransForStmt(this);
}
function c_CatchStmt(){
	c_Stmt.call(this);
	this.m_init=null;
	this.m_block=null;
}
c_CatchStmt.prototype=extend_class(c_Stmt);
c_CatchStmt.m_new=function(t_init,t_block){
	c_Stmt.m_new.call(this);
	this.m_init=t_init;
	this.m_block=t_block;
	return this;
}
c_CatchStmt.m_new2=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_CatchStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_CatchStmt.m_new.call(new c_CatchStmt,object_downcast((this.m_init.p_Copy()),c_LocalDecl),this.m_block.p_CopyBlock(t_scope)));
}
c_CatchStmt.prototype.p_OnSemant=function(){
	this.m_init.p_Semant();
	if(!((object_downcast((this.m_init.m_type),c_ObjectType))!=null)){
		bb_config_Err("Variable type must extend Throwable");
	}
	if(!((this.m_init.m_type.p_GetClass().p_IsThrowable())!=0)){
		bb_config_Err("Variable type must extend Throwable");
	}
	this.m_block.p_InsertDecl(this.m_init);
	this.m_block.p_Semant();
	return 0;
}
c_CatchStmt.prototype.p_Trans=function(){
	return "";
}
function c_Stack9(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack9.m_new=function(){
	return this;
}
c_Stack9.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack9.prototype.p_Push25=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack9.prototype.p_Push26=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push25(t_values[t_offset+t_i]);
	}
}
c_Stack9.prototype.p_Push27=function(t_values,t_offset){
	this.p_Push26(t_values,t_offset,t_values.length-t_offset);
}
c_Stack9.m_NIL=null;
c_Stack9.prototype.p_Length=function(t_newlength){
	if(t_newlength<this.m_length){
		for(var t_i=t_newlength;t_i<this.m_length;t_i=t_i+1){
			this.m_data[t_i]=c_Stack9.m_NIL;
		}
	}else{
		if(t_newlength>this.m_data.length){
			this.m_data=resize_object_array(this.m_data,bb_math_Max(this.m_length*2+10,t_newlength));
		}
	}
	this.m_length=t_newlength;
}
c_Stack9.prototype.p_Length2=function(){
	return this.m_length;
}
c_Stack9.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_TryStmt(){
	c_Stmt.call(this);
	this.m_block=null;
	this.m_catches=[];
}
c_TryStmt.prototype=extend_class(c_Stmt);
c_TryStmt.m_new=function(t_block,t_catches){
	c_Stmt.m_new.call(this);
	this.m_block=t_block;
	this.m_catches=t_catches;
	return this;
}
c_TryStmt.m_new2=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_TryStmt.prototype.p_OnCopy2=function(t_scope){
	var t_tcatches=this.m_catches.slice(0);
	for(var t_i=0;t_i<t_tcatches.length;t_i=t_i+1){
		t_tcatches[t_i]=object_downcast((t_tcatches[t_i].p_Copy2(t_scope)),c_CatchStmt);
	}
	return (c_TryStmt.m_new.call(new c_TryStmt,this.m_block.p_CopyBlock(t_scope),t_tcatches));
}
c_TryStmt.prototype.p_OnSemant=function(){
	this.m_block.p_Semant();
	for(var t_i=0;t_i<this.m_catches.length;t_i=t_i+1){
		this.m_catches[t_i].p_Semant();
		for(var t_j=0;t_j<t_i;t_j=t_j+1){
			if((this.m_catches[t_i].m_init.m_type.p_ExtendsType(this.m_catches[t_j].m_init.m_type))!=0){
				bb_config_PushErr(this.m_catches[t_i].m_errInfo);
				bb_config_Err("Catch variable class extends earlier catch variable class");
			}
		}
	}
	return 0;
}
c_TryStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransTryStmt(this);
}
function c_ThrowStmt(){
	c_Stmt.call(this);
	this.m_expr=null;
}
c_ThrowStmt.prototype=extend_class(c_Stmt);
c_ThrowStmt.m_new=function(t_expr){
	c_Stmt.m_new.call(this);
	this.m_expr=t_expr;
	return this;
}
c_ThrowStmt.m_new2=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_ThrowStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_ThrowStmt.m_new.call(new c_ThrowStmt,this.m_expr.p_Copy()));
}
c_ThrowStmt.prototype.p_OnSemant=function(){
	this.m_expr=this.m_expr.p_Semant();
	if(!((object_downcast((this.m_expr.m_exprType),c_ObjectType))!=null)){
		bb_config_Err("Expression type must extend Throwable");
	}
	if(!((this.m_expr.m_exprType.p_GetClass().p_IsThrowable())!=0)){
		bb_config_Err("Expression type must extend Throwable");
	}
	return 0;
}
c_ThrowStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransThrowStmt(this);
}
function c_ExprStmt(){
	c_Stmt.call(this);
	this.m_expr=null;
}
c_ExprStmt.prototype=extend_class(c_Stmt);
c_ExprStmt.m_new=function(t_expr){
	c_Stmt.m_new.call(this);
	this.m_expr=t_expr;
	return this;
}
c_ExprStmt.m_new2=function(){
	c_Stmt.m_new.call(this);
	return this;
}
c_ExprStmt.prototype.p_OnCopy2=function(t_scope){
	return (c_ExprStmt.m_new.call(new c_ExprStmt,this.m_expr.p_Copy()));
}
c_ExprStmt.prototype.p_OnSemant=function(){
	this.m_expr=this.m_expr.p_Semant();
	if(!((this.m_expr)!=null)){
		bb_config_InternalErr("Internal error");
	}
	return 0;
}
c_ExprStmt.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransExprStmt(this);
}
function bb_parser_ParseModule(t_modpath,t_filepath,t_app){
	var t_ident=t_modpath;
	if(t_ident.indexOf(".")!=-1){
		t_ident=bb_virtualos_ExtractExt(t_ident);
	}
	var t_mdecl=c_ModuleDecl.m_new.call(new c_ModuleDecl,t_ident,0,"",t_modpath,t_filepath,t_app);
	t_mdecl.p_ImportModule("monkey",0);
	var t_source=bb_preprocessor_PreProcess(t_filepath,t_mdecl);
	var t_toker=c_Toker.m_new.call(new c_Toker,t_filepath,t_source);
	var t_parser=c_Parser.m_new.call(new c_Parser,t_toker,t_app,t_mdecl,0);
	t_parser.p_ParseMain();
	return t_parser.m__module;
}
function c_Enumerator4(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator4.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator4.m_new2=function(){
	return this;
}
c_Enumerator4.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator4.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
var bb_config__errStack=null;
function bb_config_PushErr(t_errInfo){
	bb_config__errStack.p_AddLast2(bb_config__errInfo);
	bb_config__errInfo=t_errInfo;
	return 0;
}
function c_List8(){
	Object.call(this);
	this.m__head=(c_HeadNode8.m_new.call(new c_HeadNode8));
}
c_List8.m_new=function(){
	return this;
}
c_List8.prototype.p_AddLast8=function(t_data){
	return c_Node13.m_new.call(new c_Node13,this.m__head,this.m__head.m__pred,t_data);
}
c_List8.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast8(t_t);
	}
	return this;
}
c_List8.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator8.m_new.call(new c_Enumerator8,this);
}
function c_Node13(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node13.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node13.m_new2=function(){
	return this;
}
function c_HeadNode8(){
	c_Node13.call(this);
}
c_HeadNode8.prototype=extend_class(c_Node13);
c_HeadNode8.m_new=function(){
	c_Node13.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function bb_config_PopErr(){
	bb_config__errInfo=bb_config__errStack.p_RemoveLast();
	return 0;
}
function c_InvokeMemberExpr(){
	c_Expr.call(this);
	this.m_expr=null;
	this.m_decl=null;
	this.m_args=[];
	this.m_isResize=0;
}
c_InvokeMemberExpr.prototype=extend_class(c_Expr);
c_InvokeMemberExpr.m_new=function(t_expr,t_decl,t_args){
	c_Expr.m_new.call(this);
	this.m_expr=t_expr;
	this.m_decl=t_decl;
	this.m_args=t_args;
	return this;
}
c_InvokeMemberExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_InvokeMemberExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_exprType=this.m_decl.m_retType;
	this.m_args=this.p_CastArgs(this.m_args,this.m_decl);
	if(((object_downcast((this.m_exprType),c_ArrayType))!=null) && ((object_downcast((object_downcast((this.m_exprType),c_ArrayType).m_elemType),c_VoidType))!=null)){
		this.m_isResize=1;
		this.m_exprType=this.m_expr.m_exprType;
	}
	return (this);
}
c_InvokeMemberExpr.prototype.p_ToString=function(){
	var t_t="InvokeMemberExpr("+this.m_expr.p_ToString()+","+this.m_decl.p_ToString();
	var t_=this.m_args;
	var t_2=0;
	while(t_2<t_.length){
		var t_arg=t_[t_2];
		t_2=t_2+1;
		t_t=t_t+(","+t_arg.p_ToString());
	}
	return t_t+")";
}
c_InvokeMemberExpr.prototype.p_Trans=function(){
	if((this.m_isResize)!=0){
		return bb_translator__trans.p_TransInvokeMemberExpr(this);
	}
	return bb_translator__trans.p_TransInvokeMemberExpr(this);
}
c_InvokeMemberExpr.prototype.p_TransStmt=function(){
	return bb_translator__trans.p_TransInvokeMemberExpr(this);
}
function bb_preprocessor_EvalExpr(t_toker){
	var t_buf=c_StringStack.m_new2.call(new c_StringStack);
	while(((t_toker.p_Toke()).length!=0) && t_toker.p_Toke()!="\n" && t_toker.p_TokeType()!=9){
		t_buf.p_Push(t_toker.p_Toke());
		t_toker.p_NextToke();
	}
	var t_source=t_buf.p_Join("");
	t_toker=c_Toker.m_new.call(new c_Toker,"",t_source);
	var t_parser=c_Parser.m_new.call(new c_Parser,t_toker,null,null,0);
	var t_expr=t_parser.p_ParseExpr().p_Semant();
	return t_expr;
}
function bb_preprocessor_EvalBool(t_toker){
	var t_expr=bb_preprocessor_EvalExpr(t_toker);
	if(!((object_downcast((t_expr.m_exprType),c_BoolType))!=null)){
		t_expr=t_expr.p_Cast((c_Type.m_boolType),1);
	}
	if((t_expr.p_Eval()).length!=0){
		return true;
	}
	return false;
}
function bb_preprocessor_EvalText(t_toker){
	var t_expr=bb_preprocessor_EvalExpr(t_toker);
	var t_val=t_expr.p_Eval();
	if((object_downcast((t_expr.m_exprType),c_StringType))!=null){
		return bb_config_EvalConfigTags(t_val);
	}
	if((object_downcast((t_expr.m_exprType),c_BoolType))!=null){
		if((t_val).length!=0){
			return "True";
		}
		return "False";
	}
	return t_val;
}
function bb_config_GetConfigVars(){
	return bb_config__cfgScope.m_vars;
}
function bb_config_GetConfigVarType(t_key){
	var t_decl=bb_config__cfgScope.m_cdecls.p_Get2(t_key);
	if((t_decl)!=null){
		return t_decl.m_type;
	}
	return null;
}
function bb_preprocessor_PreProcess(t_path,t_mdecl){
	var t_cnest=0;
	var t_ifnest=0;
	var t_line=0;
	var t_source=c_StringStack.m_new2.call(new c_StringStack);
	bb_decl_PushEnv(bb_config_GetConfigScope());
	var t_p_cd=bb_config_GetConfigVar("CD");
	var t_p_modpath=bb_config_GetConfigVar("MODPATH");
	bb_config_SetConfigVar2("CD",bb_virtualos_ExtractDir(RealPath(t_path)));
	if((t_mdecl)!=null){
		bb_config_SetConfigVar2("MODPATH",t_mdecl.m_rmodpath);
	}else{
		bb_config_SetConfigVar2("MODPATH","");
	}
	var t_toker=c_Toker.m_new.call(new c_Toker,t_path,LoadString(t_path));
	t_toker.p_NextToke();
	var t_attrs=0;
	do{
		if((t_line)!=0){
			t_source.p_Push("\n");
			while(((t_toker.p_Toke()).length!=0) && t_toker.p_Toke()!="\n" && t_toker.p_TokeType()!=9){
				t_toker.p_NextToke();
			}
			if(!((t_toker.p_Toke()).length!=0)){
				break;
			}
			t_toker.p_NextToke();
		}
		t_line+=1;
		bb_config__errInfo=t_toker.p_Path()+"<"+String(t_toker.p_Line())+">";
		if(t_toker.p_TokeType()==1){
			t_toker.p_NextToke();
		}
		if(t_toker.p_Toke()!="#"){
			if(t_cnest==t_ifnest){
				var t_line2="";
				while(((t_toker.p_Toke()).length!=0) && t_toker.p_Toke()!="\n" && t_toker.p_TokeType()!=9){
					var t_toke=t_toker.p_Toke();
					t_toker.p_NextToke();
					if((t_mdecl)!=null){
						var t_1=t_toke.toLowerCase();
						if(t_1=="public"){
							t_attrs=0;
						}else{
							if(t_1=="private"){
								t_attrs=512;
							}else{
								if(t_1=="import"){
									while(t_toker.p_TokeType()==1){
										t_toke=t_toke+t_toker.p_Toke();
										t_toker.p_NextToke();
									}
									if(t_toker.p_TokeType()==2){
										var t_modpath=t_toker.p_Toke();
										while(t_toker.p_NextToke()=="."){
											t_modpath=t_modpath+".";
											t_toker.p_NextToke();
											if(t_toker.p_TokeType()!=2){
												break;
											}
											t_modpath=t_modpath+t_toker.p_Toke();
										}
										t_toke=t_toke+t_modpath;
										t_mdecl.p_ImportModule(t_modpath,t_attrs);
									}
								}
							}
						}
					}
					t_line2=t_line2+t_toke;
				}
				if((t_line2).length!=0){
					t_source.p_Push(t_line2);
				}
			}
			continue;
		}
		var t_toke2=t_toker.p_NextToke();
		if(t_toker.p_TokeType()==1){
			t_toke2=t_toker.p_NextToke();
		}
		var t_stm=t_toke2.toLowerCase();
		var t_ty=t_toker.p_TokeType();
		t_toker.p_NextToke();
		if(t_stm=="end" || t_stm=="else"){
			if(t_toker.p_TokeType()==1){
				t_toker.p_NextToke();
			}
			if(t_toker.p_Toke().toLowerCase()=="if"){
				t_toker.p_NextToke();
				t_stm=t_stm+"if";
			}
		}
		var t_2=t_stm;
		if(t_2=="rem"){
			t_ifnest+=1;
		}else{
			if(t_2=="if"){
				t_ifnest+=1;
				if(t_cnest==t_ifnest-1){
					if(bb_preprocessor_EvalBool(t_toker)){
						t_cnest=t_ifnest;
					}
				}
			}else{
				if(t_2=="else"){
					if(!((t_ifnest)!=0)){
						bb_config_Err("#Else without #If");
					}
					if(t_cnest==t_ifnest){
						t_cnest|=65536;
					}else{
						if(t_cnest==t_ifnest-1){
							t_cnest=t_ifnest;
						}
					}
				}else{
					if(t_2=="elseif"){
						if(!((t_ifnest)!=0)){
							bb_config_Err("#ElseIf without #If");
						}
						if(t_cnest==t_ifnest){
							t_cnest|=65536;
						}else{
							if(t_cnest==t_ifnest-1){
								if(bb_preprocessor_EvalBool(t_toker)){
									t_cnest=t_ifnest;
								}
							}
						}
					}else{
						if(t_2=="end" || t_2=="endif"){
							if(!((t_ifnest)!=0)){
								bb_config_Err("#End without #If or #Rem");
							}
							t_ifnest-=1;
							if(t_ifnest<(t_cnest&65535)){
								t_cnest=t_ifnest;
							}
						}else{
							if(t_2=="print"){
								if(t_cnest==t_ifnest){
									print(bb_preprocessor_EvalText(t_toker));
								}
							}else{
								if(t_2=="error"){
									if(t_cnest==t_ifnest){
										bb_config_Err(bb_preprocessor_EvalText(t_toker));
									}
								}else{
									if(t_cnest==t_ifnest){
										if(t_ty==2){
											if(t_toker.p_TokeType()==1){
												t_toker.p_NextToke();
											}
											var t_op=t_toker.p_Toke();
											var t_3=t_op;
											if(t_3=="=" || t_3=="+="){
												var t_4=t_toke2;
												if(t_4=="HOST" || t_4=="LANG" || t_4=="CONFIG" || t_4=="TARGET" || t_4=="SAFEMODE"){
													bb_config_Err("App config var '"+t_toke2+"' cannot be modified");
												}
												t_toker.p_NextToke();
												var t_5=t_op;
												if(t_5=="="){
													var t_expr=bb_preprocessor_EvalExpr(t_toker);
													var t_val=t_expr.p_Eval();
													if(!bb_config_GetConfigVars().p_Contains(t_toke2)){
														if((object_downcast((t_expr.m_exprType),c_StringType))!=null){
															t_val=bb_config_EvalConfigTags(t_val);
														}
														bb_config_SetConfigVar(t_toke2,t_val,t_expr.m_exprType);
													}
												}else{
													if(t_5=="+="){
														var t_val2=bb_preprocessor_EvalText(t_toker);
														var t_var=bb_config_GetConfigVar(t_toke2);
														if((object_downcast((bb_config_GetConfigVarType(t_toke2)),c_BoolType))!=null){
															if(t_var=="1"){
																t_var="True";
															}else{
																t_var="False";
															}
														}
														if(((t_var).length!=0) && !string_startswith(t_val2,";")){
															t_val2=";"+t_val2;
														}
														bb_config_SetConfigVar2(t_toke2,t_var+t_val2);
													}
												}
											}else{
												bb_config_Err("Expecting assignment operator.");
											}
										}else{
											bb_config_Err("Unrecognized preprocessor directive '"+t_toke2+"'");
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}while(!(false));
	bb_config_SetConfigVar2("MODPATH",t_p_modpath);
	bb_config_SetConfigVar2("CD",t_p_cd);
	bb_decl_PopEnv();
	return t_source.p_Join("");
}
function c_Target(){
	Object.call(this);
	this.m_dir="";
	this.m_name="";
	this.m_system="";
	this.m_builder=null;
}
c_Target.m_new=function(t_dir,t_name,t_system,t_builder){
	this.m_dir=t_dir;
	this.m_name=t_name;
	this.m_system=t_system;
	this.m_builder=t_builder;
	return this;
}
c_Target.m_new2=function(){
	return this;
}
function c_Map6(){
	Object.call(this);
	this.m_root=null;
}
c_Map6.m_new=function(){
	return this;
}
c_Map6.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map6.prototype.p_RotateLeft6=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map6.prototype.p_RotateRight6=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map6.prototype.p_InsertFixup6=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft6(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight6(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight6(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft6(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map6.prototype.p_Set6=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node14.m_new.call(new c_Node14,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup6(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
c_Map6.prototype.p_FirstNode=function(){
	if(!((this.m_root)!=null)){
		return null;
	}
	var t_node=this.m_root;
	while((t_node.m_left)!=null){
		t_node=t_node.m_left;
	}
	return t_node;
}
c_Map6.prototype.p_ObjectEnumerator=function(){
	return c_NodeEnumerator2.m_new.call(new c_NodeEnumerator2,this.p_FirstNode());
}
c_Map6.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map6.prototype.p_Get2=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
function c_StringMap6(){
	c_Map6.call(this);
}
c_StringMap6.prototype=extend_class(c_Map6);
c_StringMap6.m_new=function(){
	c_Map6.m_new.call(this);
	return this;
}
c_StringMap6.prototype.p_Compare=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_Node14(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node14.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node14.m_new2=function(){
	return this;
}
c_Node14.prototype.p_NextNode=function(){
	var t_node=null;
	if((this.m_right)!=null){
		t_node=this.m_right;
		while((t_node.m_left)!=null){
			t_node=t_node.m_left;
		}
		return t_node;
	}
	t_node=this;
	var t_parent=this.m_parent;
	while(((t_parent)!=null) && t_node==t_parent.m_right){
		t_node=t_parent;
		t_parent=t_parent.m_parent;
	}
	return t_parent;
}
c_Node14.prototype.p_Key=function(){
	return this.m_key;
}
function bb_config_PopConfigScope(){
	bb_config__cfgScope=bb_config__cfgScopeStack.p_Pop();
}
function c_NodeEnumerator2(){
	Object.call(this);
	this.m_node=null;
}
c_NodeEnumerator2.m_new=function(t_node){
	this.m_node=t_node;
	return this;
}
c_NodeEnumerator2.m_new2=function(){
	return this;
}
c_NodeEnumerator2.prototype.p_HasNext=function(){
	return this.m_node!=null;
}
c_NodeEnumerator2.prototype.p_NextObject=function(){
	var t_t=this.m_node;
	this.m_node=this.m_node.p_NextNode();
	return t_t;
}
var bb_config_ENV_HOST="";
var bb_config_ENV_CONFIG="";
var bb_config_ENV_TARGET="";
var bb_config_ENV_LANG="";
function bb_virtualos_StripAll(t_Path){
	return bb_virtualos_StripDir(bb_virtualos_StripExt(t_Path));
}
function bb_parser_ParseApp(t_filepath){
	bb_config__errInfo=t_filepath+"<1>";
	var t_app=c_AppDecl.m_new.call(new c_AppDecl);
	var t_modpath=bb_virtualos_StripAll(t_filepath);
	bb_parser_ParseModule(t_modpath,t_filepath,t_app);
	return t_app;
}
function c_Reflector(){
	Object.call(this);
	this.m_debug=false;
	this.m_refmod=null;
	this.m_langmod=null;
	this.m_boxesmod=null;
	this.m_munged=c_StringMap7.m_new.call(new c_StringMap7);
	this.m_modexprs=c_StringMap.m_new.call(new c_StringMap);
	this.m_refmods=c_StringSet.m_new.call(new c_StringSet);
	this.m_classdecls=c_Stack10.m_new.call(new c_Stack10);
	this.m_classids=c_StringMap7.m_new.call(new c_StringMap7);
	this.m_output=c_StringStack.m_new2.call(new c_StringStack);
}
c_Reflector.m_new=function(){
	return this;
}
c_Reflector.m_MatchPath=function(t_text,t_pattern){
	var t_alts=t_pattern.split("|");
	var t_=t_alts;
	var t_2=0;
	while(t_2<t_.length){
		var t_alt=t_[t_2];
		t_2=t_2+1;
		if(!((t_alt).length!=0)){
			continue;
		}
		var t_bits=t_alt.split("*");
		if(t_bits.length==1){
			if(t_bits[0]==t_text){
				return true;
			}
			continue;
		}
		if(!string_startswith(t_text,t_bits[0])){
			continue;
		}
		var t_i=t_bits[0].length;
		for(var t_j=1;t_j<t_bits.length-1;t_j=t_j+1){
			var t_bit=t_bits[t_j];
			t_i=t_text.indexOf(t_bit,t_i);
			if(t_i==-1){
				break;
			}
			t_i+=t_bit.length;
		}
		if(t_i!=-1 && string_endswith(t_text.slice(t_i),t_bits[t_bits.length-1])){
			return true;
		}
	}
	return false;
}
c_Reflector.prototype.p_Mung=function(t_ident){
	if(this.m_debug){
		t_ident="R"+t_ident;
		t_ident=string_replace(t_ident,"_","_0");
		t_ident=string_replace(t_ident,"[","_1");
		t_ident=string_replace(t_ident,"]","_2");
		t_ident=string_replace(t_ident,"<","_3");
		t_ident=string_replace(t_ident,">","_4");
		t_ident=string_replace(t_ident,",","_5");
		t_ident=string_replace(t_ident,".","_");
	}else{
		t_ident="R";
	}
	if(this.m_munged.p_Contains(t_ident)){
		var t_n=this.m_munged.p_Get2(t_ident);
		t_n+=1;
		this.m_munged.p_Set7(t_ident,t_n);
		t_ident=t_ident+String(t_n);
	}else{
		this.m_munged.p_Set7(t_ident,1);
	}
	return t_ident;
}
c_Reflector.prototype.p_ValidClass=function(t_cdecl){
	if(t_cdecl.m_munged=="Object"){
		return true;
	}
	if(t_cdecl.m_munged=="ThrowableObject"){
		return true;
	}
	if(!((t_cdecl.p_ExtendsObject())!=0)){
		return false;
	}
	if(!this.m_refmods.p_Contains(t_cdecl.p_ModuleScope().m_filepath)){
		return false;
	}
	var t_=t_cdecl.m_instArgs;
	var t_2=0;
	while(t_2<t_.length){
		var t_arg=t_[t_2];
		t_2=t_2+1;
		if(((object_downcast((t_arg),c_ObjectType))!=null) && !this.p_ValidClass(t_arg.p_GetClass())){
			return false;
		}
	}
	if((t_cdecl.m_superClass)!=null){
		return this.p_ValidClass(t_cdecl.m_superClass);
	}
	return true;
}
c_Reflector.prototype.p_TypeExpr=function(t_ty,t_path){
	if((object_downcast((t_ty),c_VoidType))!=null){
		return "Void";
	}
	if((object_downcast((t_ty),c_BoolType))!=null){
		return "Bool";
	}
	if((object_downcast((t_ty),c_IntType))!=null){
		return "Int";
	}
	if((object_downcast((t_ty),c_FloatType))!=null){
		return "Float";
	}
	if((object_downcast((t_ty),c_StringType))!=null){
		return "String";
	}
	if((object_downcast((t_ty),c_ArrayType))!=null){
		return this.p_TypeExpr(object_downcast((t_ty),c_ArrayType).m_elemType,t_path)+"[]";
	}
	if((object_downcast((t_ty),c_ObjectType))!=null){
		return this.p_DeclExpr((t_ty.p_GetClass()),t_path);
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_Reflector.prototype.p_DeclExpr=function(t_decl,t_path){
	if(t_path && ((object_downcast((t_decl.m_scope),c_ClassDecl))!=null)){
		return t_decl.m_ident;
	}
	var t_mdecl=object_downcast((t_decl),c_ModuleDecl);
	if((t_mdecl)!=null){
		if(t_path){
			return t_mdecl.m_rmodpath;
		}
		var t_expr=this.m_modexprs.p_Get2(t_mdecl.m_filepath);
		if(!((t_expr).length!=0)){
			print("REFLECTION ERROR");
			t_expr=this.p_Mung(t_mdecl.m_rmodpath);
			this.m_refmod.p_InsertDecl(c_AliasDecl.m_new.call(new c_AliasDecl,t_expr,0,(t_mdecl)));
			this.m_modexprs.p_Set(t_mdecl.m_filepath,t_expr);
		}
		return t_expr;
	}
	var t_cdecl=object_downcast((t_decl),c_ClassDecl);
	if(((t_cdecl)!=null) && t_cdecl.m_munged=="Object"){
		if(t_path){
			return "monkey.lang.Object";
		}
		return "Object";
	}
	if(((t_cdecl)!=null) && t_cdecl.m_munged=="ThrowableObject"){
		if(t_path){
			return "monkey.lang.Throwable";
		}
		return "Throwable";
	}
	var t_ident=this.p_DeclExpr((t_decl.m_scope),t_path)+"."+t_decl.m_ident;
	if(((t_cdecl)!=null) && ((t_cdecl.m_instArgs).length!=0)){
		var t_t="";
		var t_=t_cdecl.m_instArgs;
		var t_2=0;
		while(t_2<t_.length){
			var t_arg=t_[t_2];
			t_2=t_2+1;
			if((t_t).length!=0){
				t_t=t_t+",";
			}
			t_t=t_t+this.p_TypeExpr(t_arg,t_path);
		}
		t_ident=t_ident+("<"+t_t+">");
	}
	return t_ident;
}
c_Reflector.prototype.p_Emit=function(t_t){
	this.m_output.p_Push(t_t);
	return 0;
}
c_Reflector.prototype.p_ValidType=function(t_ty){
	if((object_downcast((t_ty),c_ArrayType))!=null){
		return this.p_ValidType(object_downcast((t_ty),c_ArrayType).m_elemType);
	}
	if((object_downcast((t_ty),c_ObjectType))!=null){
		return this.p_ValidClass(t_ty.p_GetClass());
	}
	return true;
}
c_Reflector.prototype.p_TypeInfo=function(t_ty){
	if((object_downcast((t_ty),c_VoidType))!=null){
		return "Null";
	}
	if((object_downcast((t_ty),c_BoolType))!=null){
		return "_boolClass";
	}
	if((object_downcast((t_ty),c_IntType))!=null){
		return "_intClass";
	}
	if((object_downcast((t_ty),c_FloatType))!=null){
		return "_floatClass";
	}
	if((object_downcast((t_ty),c_StringType))!=null){
		return "_stringClass";
	}
	if((object_downcast((t_ty),c_ArrayType))!=null){
		var t_elemType=object_downcast((t_ty),c_ArrayType).m_elemType;
		var t_name="monkey.boxes.ArrayObject<"+this.p_TypeExpr(t_elemType,true)+">";
		if(this.m_classids.p_Contains(t_name)){
			return "_classes["+String(this.m_classids.p_Get2(t_name))+"]";
		}
		if(this.m_debug){
			print("Instantiating class: "+t_name);
		}
		var t_cdecl=this.m_boxesmod.p_FindType("ArrayObject",[t_elemType]).p_GetClass();
		var t_=t_cdecl.p_Decls().p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_decl=t_.p_NextObject();
			if(!((object_downcast((t_decl),c_AliasDecl))!=null)){
				t_decl.p_Semant();
			}
		}
		var t_id=this.m_classdecls.p_Length2();
		this.m_classids.p_Set7(t_name,t_id);
		this.m_classdecls.p_Push28(t_cdecl);
		return "_classes["+String(t_id)+"]";
	}
	if((object_downcast((t_ty),c_ObjectType))!=null){
		var t_name2=this.p_DeclExpr((t_ty.p_GetClass()),true);
		if(this.m_classids.p_Contains(t_name2)){
			return "_classes["+String(this.m_classids.p_Get2(t_name2))+"]";
		}
		return "_unknownClass";
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_Reflector.prototype.p_Attrs=function(t_decl){
	return t_decl.m_attrs>>8&255;
}
c_Reflector.prototype.p_Box=function(t_ty,t_expr){
	if((object_downcast((t_ty),c_VoidType))!=null){
		return t_expr;
	}
	if((object_downcast((t_ty),c_BoolType))!=null){
		return "New BoolObject("+t_expr+")";
	}
	if((object_downcast((t_ty),c_IntType))!=null){
		return "New IntObject("+t_expr+")";
	}
	if((object_downcast((t_ty),c_FloatType))!=null){
		return "New FloatObject("+t_expr+")";
	}
	if((object_downcast((t_ty),c_StringType))!=null){
		return "New StringObject("+t_expr+")";
	}
	if((object_downcast((t_ty),c_ArrayType))!=null){
		return "New ArrayObject<"+this.p_TypeExpr(object_downcast((t_ty),c_ArrayType).m_elemType,false)+">("+t_expr+")";
	}
	if((object_downcast((t_ty),c_ObjectType))!=null){
		return t_expr;
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_Reflector.prototype.p_Emit2=function(t_tdecl){
	if(!this.p_ValidType(t_tdecl.m_type)){
		return "";
	}
	var t_name=this.p_DeclExpr((t_tdecl),true);
	var t_expr=this.p_DeclExpr((t_tdecl),false);
	var t_type=this.p_TypeInfo(t_tdecl.m_type);
	return "New ConstInfo(\""+t_name+"\","+String(this.p_Attrs(t_tdecl))+","+t_type+","+this.p_Box(t_tdecl.m_type,t_expr)+")";
}
c_Reflector.prototype.p_Unbox=function(t_ty,t_expr){
	if((object_downcast((t_ty),c_BoolType))!=null){
		return "BoolObject("+t_expr+").value";
	}
	if((object_downcast((t_ty),c_IntType))!=null){
		return "IntObject("+t_expr+").value";
	}
	if((object_downcast((t_ty),c_FloatType))!=null){
		return "FloatObject("+t_expr+").value";
	}
	if((object_downcast((t_ty),c_StringType))!=null){
		return "StringObject("+t_expr+").value";
	}
	if((object_downcast((t_ty),c_ArrayType))!=null){
		return "ArrayObject<"+this.p_TypeExpr(object_downcast((t_ty),c_ArrayType).m_elemType,false)+">("+t_expr+").value";
	}
	if((object_downcast((t_ty),c_ObjectType))!=null){
		return this.p_DeclExpr((t_ty.p_GetClass()),false)+"("+t_expr+")";
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_Reflector.prototype.p_Emit3=function(t_cdecl){
	if((t_cdecl.m_args).length!=0){
		bb_config_InternalErr("Internal error");
	}
	var t_name=this.p_DeclExpr((t_cdecl),true);
	var t_expr=this.p_DeclExpr((t_cdecl),false);
	var t_ident=this.p_Mung(t_name);
	var t_sclass="Null";
	if((t_cdecl.m_superClass)!=null){
		t_sclass=this.p_TypeInfo(t_cdecl.m_superClass.m_objectType);
	}
	var t_ifaces="";
	var t_=t_cdecl.m_implments;
	var t_2=0;
	while(t_2<t_.length){
		var t_idecl=t_[t_2];
		t_2=t_2+1;
		if((t_ifaces).length!=0){
			t_ifaces=t_ifaces+",";
		}
		t_ifaces=t_ifaces+this.p_TypeInfo(t_idecl.m_objectType);
	}
	var t_consts=c_StringStack.m_new2.call(new c_StringStack);
	var t_globals=c_StringStack.m_new2.call(new c_StringStack);
	var t_fields=c_StringStack.m_new2.call(new c_StringStack);
	var t_methods=c_StringStack.m_new2.call(new c_StringStack);
	var t_functions=c_StringStack.m_new2.call(new c_StringStack);
	var t_ctors=c_StringStack.m_new2.call(new c_StringStack);
	var t_3=t_cdecl.p_Decls().p_ObjectEnumerator();
	while(t_3.p_HasNext()){
		var t_decl=t_3.p_NextObject();
		if((object_downcast((t_decl),c_AliasDecl))!=null){
			continue;
		}
		if(!((t_decl.p_IsSemanted())!=0)){
			continue;
		}
		var t_pdecl=object_downcast((t_decl),c_ConstDecl);
		if((t_pdecl)!=null){
			var t_p=this.p_Emit2(t_pdecl);
			if((t_p).length!=0){
				t_consts.p_Push(t_p);
			}
			continue;
		}
		var t_gdecl=object_downcast((t_decl),c_GlobalDecl);
		if((t_gdecl)!=null){
			var t_g=this.p_Emit6(t_gdecl);
			if((t_g).length!=0){
				t_globals.p_Push(t_g);
			}
			continue;
		}
		var t_tdecl=object_downcast((t_decl),c_FieldDecl);
		if((t_tdecl)!=null){
			var t_f=this.p_Emit5(t_tdecl);
			if((t_f).length!=0){
				t_fields.p_Push(t_f);
			}
			continue;
		}
		var t_fdecl=object_downcast((t_decl),c_FuncDecl);
		if((t_fdecl)!=null){
			var t_f2=this.p_Emit4(t_fdecl);
			if((t_f2).length!=0){
				if(t_fdecl.p_IsCtor()){
					t_ctors.p_Push(t_f2);
				}else{
					if(t_fdecl.p_IsMethod()){
						t_methods.p_Push(t_f2);
					}else{
						t_functions.p_Push(t_f2);
					}
				}
			}
			continue;
		}
	}
	this.p_Emit("Class "+t_ident+" Extends ClassInfo");
	this.p_Emit(" Method New()");
	this.p_Emit("  Super.New(\""+t_name+"\","+String(this.p_Attrs(t_cdecl))+","+t_sclass+",["+t_ifaces+"])");
	var t_1=t_name;
	if(t_1=="monkey.boxes.BoolObject"){
		this.p_Emit("  _boolClass=Self");
	}else{
		if(t_1=="monkey.boxes.IntObject"){
			this.p_Emit("  _intClass=Self");
		}else{
			if(t_1=="monkey.boxes.FloatObject"){
				this.p_Emit("  _floatClass=Self");
			}else{
				if(t_1=="monkey.boxes.StringObject"){
					this.p_Emit("  _stringClass=Self");
				}
			}
		}
	}
	this.p_Emit(" End");
	if(string_startswith(t_name,"monkey.boxes.ArrayObject<")){
		var t_elemType=t_cdecl.m_instArgs[0];
		var t_elemExpr=this.p_TypeExpr(t_elemType,false);
		var t_i=t_elemExpr.indexOf("[]",0);
		if(t_i==-1){
			t_i=t_elemExpr.length;
		}
		var t_ARRAY_PREFIX=this.m_modexprs.p_Get2(this.m_boxesmod.m_filepath)+".ArrayObject<";
		this.p_Emit(" Method ElementType:ClassInfo() Property");
		this.p_Emit("  Return "+this.p_TypeInfo(t_elemType));
		this.p_Emit(" End");
		this.p_Emit(" Method ArrayLength:Int(i:Object) Property");
		this.p_Emit("  Return "+t_ARRAY_PREFIX+t_elemExpr+">(i).value.Length");
		this.p_Emit(" End");
		this.p_Emit(" Method GetElement:Object(i:Object,e)");
		this.p_Emit("  Return "+this.p_Box(t_elemType,t_ARRAY_PREFIX+t_elemExpr+">(i).value[e]"));
		this.p_Emit(" End");
		this.p_Emit(" Method SetElement:Void(i:Object,e,v:Object)");
		this.p_Emit("  "+t_ARRAY_PREFIX+t_elemExpr+">(i).value[e]="+this.p_Unbox(t_elemType,"v"));
		this.p_Emit(" End");
		this.p_Emit(" Method NewArray:Object(l:Int)");
		this.p_Emit("  Return "+this.p_Box((t_elemType.p_ArrayOf()),"New "+t_elemExpr.slice(0,t_i)+"[l]"+t_elemExpr.slice(t_i)));
		this.p_Emit(" End");
	}
	if(!((t_cdecl.p_IsAbstract())!=0) && !((t_cdecl.p_IsExtern())!=0)){
		this.p_Emit(" Method NewInstance:Object()");
		this.p_Emit("  Return New "+t_expr);
		this.p_Emit(" End");
	}
	this.p_Emit(" Method Init()");
	if((t_consts.p_Length2())!=0){
		this.p_Emit("  _consts=new ConstInfo["+String(t_consts.p_Length2())+"]");
		for(var t_i2=0;t_i2<t_consts.p_Length2();t_i2=t_i2+1){
			this.p_Emit("  _consts["+String(t_i2)+"]="+t_consts.p_Get(t_i2));
		}
	}
	if((t_globals.p_Length2())!=0){
		this.p_Emit("  _globals=new GlobalInfo["+String(t_globals.p_Length2())+"]");
		for(var t_i3=0;t_i3<t_globals.p_Length2();t_i3=t_i3+1){
			this.p_Emit("  _globals["+String(t_i3)+"]=New "+t_globals.p_Get(t_i3));
		}
	}
	if((t_fields.p_Length2())!=0){
		this.p_Emit("  _fields=New FieldInfo["+String(t_fields.p_Length2())+"]");
		for(var t_i4=0;t_i4<t_fields.p_Length2();t_i4=t_i4+1){
			this.p_Emit("  _fields["+String(t_i4)+"]=New "+t_fields.p_Get(t_i4));
		}
	}
	if((t_methods.p_Length2())!=0){
		this.p_Emit("  _methods=New MethodInfo["+String(t_methods.p_Length2())+"]");
		for(var t_i5=0;t_i5<t_methods.p_Length2();t_i5=t_i5+1){
			this.p_Emit("  _methods["+String(t_i5)+"]=New "+t_methods.p_Get(t_i5));
		}
	}
	if((t_functions.p_Length2())!=0){
		this.p_Emit("  _functions=New FunctionInfo["+String(t_functions.p_Length2())+"]");
		for(var t_i6=0;t_i6<t_functions.p_Length2();t_i6=t_i6+1){
			this.p_Emit("  _functions["+String(t_i6)+"]=New "+t_functions.p_Get(t_i6));
		}
	}
	if((t_ctors.p_Length2())!=0){
		this.p_Emit("  _ctors=New FunctionInfo["+String(t_ctors.p_Length2())+"]");
		for(var t_i7=0;t_i7<t_ctors.p_Length2();t_i7=t_i7+1){
			this.p_Emit("  _ctors["+String(t_i7)+"]=New "+t_ctors.p_Get(t_i7));
		}
	}
	this.p_Emit(" InitR()");
	this.p_Emit(" End");
	this.p_Emit("End");
	return t_ident;
}
c_Reflector.prototype.p_Emit4=function(t_fdecl){
	if(!this.p_ValidType(t_fdecl.m_retType)){
		return "";
	}
	var t_=t_fdecl.m_argDecls;
	var t_2=0;
	while(t_2<t_.length){
		var t_arg=t_[t_2];
		t_2=t_2+1;
		if(!this.p_ValidType(t_arg.m_type)){
			return "";
		}
	}
	var t_name=this.p_DeclExpr((t_fdecl),true);
	var t_expr=this.p_DeclExpr((t_fdecl),false);
	var t_ident=this.p_Mung(t_name);
	var t_rtype=this.p_TypeInfo(t_fdecl.m_retType);
	var t_base="FunctionInfo";
	if(t_fdecl.p_IsMethod()){
		var t_clas=this.p_DeclExpr((t_fdecl.p_ClassScope()),false);
		t_expr=t_clas+"(i)."+t_fdecl.m_ident;
		t_base="MethodInfo";
	}
	var t_argtys=new_string_array(t_fdecl.m_argDecls.length);
	for(var t_i=0;t_i<t_argtys.length;t_i=t_i+1){
		t_argtys[t_i]=this.p_TypeInfo(t_fdecl.m_argDecls[t_i].m_type);
	}
	this.p_Emit("Class "+t_ident+" Extends "+t_base);
	this.p_Emit(" Method New()");
	this.p_Emit("  Super.New(\""+t_name+"\","+String(this.p_Attrs(t_fdecl))+","+t_rtype+",["+t_argtys.join(",")+"])");
	this.p_Emit(" End");
	if(t_fdecl.p_IsMethod()){
		this.p_Emit(" Method Invoke:Object(i:Object,p:Object[])");
	}else{
		this.p_Emit(" Method Invoke:Object(p:Object[])");
	}
	var t_args=c_StringStack.m_new2.call(new c_StringStack);
	for(var t_i2=0;t_i2<t_fdecl.m_argDecls.length;t_i2=t_i2+1){
		var t_arg2=t_fdecl.m_argDecls[t_i2];
		t_args.p_Push(this.p_Unbox(t_arg2.m_type,"p["+String(t_i2)+"]"));
	}
	if(t_fdecl.p_IsCtor()){
		var t_cdecl=t_fdecl.p_ClassScope();
		if((t_cdecl.p_IsAbstract())!=0){
			this.p_Emit("  Return Null");
		}else{
			this.p_Emit("  Return New "+this.p_DeclExpr((t_cdecl),false)+"("+t_args.p_Join(",")+")");
		}
	}else{
		if((object_downcast((t_fdecl.m_retType),c_VoidType))!=null){
			this.p_Emit("  "+t_expr+"("+t_args.p_Join(",")+")");
		}else{
			this.p_Emit("  Return "+this.p_Box(t_fdecl.m_retType,t_expr+"("+t_args.p_Join(",")+")"));
		}
	}
	this.p_Emit(" End");
	this.p_Emit("End");
	return t_ident;
}
c_Reflector.prototype.p_Emit5=function(t_tdecl){
	if(!this.p_ValidType(t_tdecl.m_type)){
		return "";
	}
	var t_name=t_tdecl.m_ident;
	var t_ident=this.p_Mung(t_name);
	var t_type=this.p_TypeInfo(t_tdecl.m_type);
	var t_clas=this.p_DeclExpr((t_tdecl.p_ClassScope()),false);
	var t_expr=t_clas+"(i)."+t_tdecl.m_ident;
	this.p_Emit("Class "+t_ident+" Extends FieldInfo");
	this.p_Emit(" Method New()");
	this.p_Emit("  Super.New(\""+t_name+"\","+String(this.p_Attrs(t_tdecl))+","+t_type+")");
	this.p_Emit(" End");
	this.p_Emit(" Method GetValue:Object(i:Object)");
	this.p_Emit("  Return "+this.p_Box(t_tdecl.m_type,t_expr));
	this.p_Emit(" End");
	this.p_Emit(" Method SetValue:Void(i:Object,v:Object)");
	this.p_Emit("  "+t_expr+"="+this.p_Unbox(t_tdecl.m_type,"v"));
	this.p_Emit(" End");
	this.p_Emit("End");
	return t_ident;
}
c_Reflector.prototype.p_Emit6=function(t_gdecl){
	if(!this.p_ValidType(t_gdecl.m_type)){
		return "";
	}
	var t_name=this.p_DeclExpr((t_gdecl),true);
	var t_expr=this.p_DeclExpr((t_gdecl),false);
	var t_ident=this.p_Mung(t_name);
	var t_type=this.p_TypeInfo(t_gdecl.m_type);
	this.p_Emit("Class "+t_ident+" Extends GlobalInfo");
	this.p_Emit(" Method New()");
	this.p_Emit("  Super.New(\""+t_name+"\","+String(this.p_Attrs(t_gdecl))+","+t_type+")");
	this.p_Emit(" End");
	this.p_Emit(" Method GetValue:Object()");
	this.p_Emit("  Return "+this.p_Box(t_gdecl.m_type,t_expr));
	this.p_Emit(" End");
	this.p_Emit(" Method SetValue:Void(v:Object)");
	this.p_Emit("  "+t_expr+"="+this.p_Unbox(t_gdecl.m_type,"v"));
	this.p_Emit(" End");
	this.p_Emit("End");
	return t_ident;
}
c_Reflector.prototype.p_Semant3=function(t_app){
	var t_filter=bb_config_GetConfigVar("REFLECTION_FILTER");
	if(!((t_filter).length!=0)){
		return 0;
	}
	t_filter=string_replace(t_filter,";","|");
	this.m_debug=bb_config_GetConfigVar("DEBUG_REFLECTION")=="1";
	var t_=t_app.m_imported.p_Values().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_mdecl=t_.p_NextObject();
		var t_path=t_mdecl.m_rmodpath;
		if(t_path=="reflection"){
			this.m_refmod=t_mdecl;
		}else{
			if(t_path=="monkey.lang"){
				this.m_langmod=t_mdecl;
			}else{
				if(t_path=="monkey.boxes"){
					this.m_boxesmod=t_mdecl;
				}
			}
		}
	}
	if(!((this.m_refmod)!=null)){
		error("reflection module not found!");
	}
	if(this.m_debug){
		print("Semanting all");
	}
	var t_2=t_app.m_imported.p_Values().p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_mdecl2=t_2.p_NextObject();
		var t_path2=t_mdecl2.m_rmodpath;
		if(t_mdecl2!=this.m_boxesmod && t_mdecl2!=this.m_langmod && !c_Reflector.m_MatchPath(t_path2,t_filter)){
			continue;
		}
		var t_expr=this.p_Mung(t_path2);
		this.m_refmod.p_InsertDecl(c_AliasDecl.m_new.call(new c_AliasDecl,t_expr,0,(t_mdecl2)));
		this.m_modexprs.p_Set(t_mdecl2.m_filepath,t_expr);
		this.m_refmods.p_Insert(t_mdecl2.m_filepath);
		t_mdecl2.p_SemantAll();
	}
	do{
		var t_n=t_app.m_allSemantedDecls.p_Count();
		var t_3=t_app.m_imported.p_Values().p_ObjectEnumerator();
		while(t_3.p_HasNext()){
			var t_mdecl3=t_3.p_NextObject();
			if(!this.m_refmods.p_Contains(t_mdecl3.m_filepath)){
				continue;
			}
			t_mdecl3.p_SemantAll();
		}
		t_n=t_app.m_allSemantedDecls.p_Count()-t_n;
		if(!((t_n)!=0)){
			break;
		}
		if(this.m_debug){
			print("Semanting more: "+String(t_n));
		}
	}while(!(false));
	var t_4=t_app.m_allSemantedDecls.p_ObjectEnumerator();
	while(t_4.p_HasNext()){
		var t_decl=t_4.p_NextObject();
		if(!this.m_refmods.p_Contains(t_decl.p_ModuleScope().m_filepath)){
			continue;
		}
		var t_cdecl=object_downcast((t_decl),c_ClassDecl);
		if(((t_cdecl)!=null) && this.p_ValidClass(t_cdecl)){
			this.m_classids.p_Set7(this.p_DeclExpr((t_cdecl),true),this.m_classdecls.p_Length2());
			this.m_classdecls.p_Push28(t_cdecl);
			continue;
		}
	}
	var t_classes=c_StringStack.m_new2.call(new c_StringStack);
	var t_consts=c_StringStack.m_new2.call(new c_StringStack);
	var t_globals=c_StringStack.m_new2.call(new c_StringStack);
	var t_functions=c_StringStack.m_new2.call(new c_StringStack);
	if(this.m_debug){
		print("Generating reflection info");
	}
	var t_5=t_app.m_allSemantedDecls.p_ObjectEnumerator();
	while(t_5.p_HasNext()){
		var t_decl2=t_5.p_NextObject();
		if(!this.m_refmods.p_Contains(t_decl2.p_ModuleScope().m_filepath)){
			continue;
		}
		var t_pdecl=object_downcast((t_decl2),c_ConstDecl);
		if((t_pdecl)!=null){
			var t_p=this.p_Emit2(t_pdecl);
			if((t_p).length!=0){
				t_consts.p_Push(t_p);
			}
			continue;
		}
		var t_gdecl=object_downcast((t_decl2),c_GlobalDecl);
		if((t_gdecl)!=null){
			var t_g=this.p_Emit6(t_gdecl);
			if((t_g).length!=0){
				t_globals.p_Push(t_g);
			}
			continue;
		}
		var t_fdecl=object_downcast((t_decl2),c_FuncDecl);
		if((t_fdecl)!=null){
			var t_f=this.p_Emit4(t_fdecl);
			if((t_f).length!=0){
				t_functions.p_Push(t_f);
			}
			continue;
		}
	}
	if(this.m_debug){
		print("Finalizing classes");
	}
	t_app.p_FinalizeClasses();
	if(this.m_debug){
		print("Generating class reflection info");
	}
	for(var t_i=0;t_i<this.m_classdecls.p_Length2();t_i=t_i+1){
		t_classes.p_Push(this.p_Emit3(this.m_classdecls.p_Get(t_i)));
	}
	this.p_Emit("Global _init:=__init()");
	this.p_Emit("Function __init()");
	if((t_classes.p_Length2())!=0){
		this.p_Emit(" _classes=New ClassInfo["+String(t_classes.p_Length2())+"]");
		for(var t_i2=0;t_i2<t_classes.p_Length2();t_i2=t_i2+1){
			this.p_Emit(" _classes["+String(t_i2)+"]=New "+t_classes.p_Get(t_i2));
		}
		for(var t_i3=0;t_i3<t_classes.p_Length2();t_i3=t_i3+1){
			this.p_Emit(" _classes["+String(t_i3)+"].Init()");
		}
	}
	if((t_consts.p_Length2())!=0){
		this.p_Emit(" _consts=new ConstInfo["+String(t_consts.p_Length2())+"]");
		for(var t_i4=0;t_i4<t_consts.p_Length2();t_i4=t_i4+1){
			this.p_Emit(" _consts["+String(t_i4)+"]="+t_consts.p_Get(t_i4));
		}
	}
	if((t_globals.p_Length2())!=0){
		this.p_Emit(" _globals=New GlobalInfo["+String(t_globals.p_Length2())+"]");
		for(var t_i5=0;t_i5<t_globals.p_Length2();t_i5=t_i5+1){
			this.p_Emit(" _globals["+String(t_i5)+"]=New "+t_globals.p_Get(t_i5));
		}
	}
	if((t_functions.p_Length2())!=0){
		this.p_Emit(" _functions=New FunctionInfo["+String(t_functions.p_Length2())+"]");
		for(var t_i6=0;t_i6<t_functions.p_Length2();t_i6=t_i6+1){
			this.p_Emit(" _functions["+String(t_i6)+"]=New "+t_functions.p_Get(t_i6));
		}
	}
	this.p_Emit(" _getClass=New __GetClass");
	this.p_Emit("End");
	this.p_Emit("Class __GetClass Extends _GetClass");
	this.p_Emit(" Method GetClass:ClassInfo(o:Object)");
	for(var t_i7=t_classes.p_Length2()-1;t_i7>=0;t_i7=t_i7+-1){
		var t_expr2=this.p_DeclExpr((this.m_classdecls.p_Get(t_i7)),false);
		this.p_Emit("  If "+t_expr2+"(o)<>Null Return _classes["+String(t_i7)+"]");
	}
	this.p_Emit("  Return _unknownClass");
	this.p_Emit(" End");
	this.p_Emit("End");
	var t_source=this.m_output.p_Join("\n");
	var t_attrs=8388608;
	if(this.m_debug){
		print("Reflection source:\n"+t_source);
	}else{
		t_attrs|=4194304;
	}
	bb_parser_ParseSource(t_source,t_app,this.m_refmod,t_attrs);
	this.m_refmod.p_FindValDecl("_init");
	t_app.p_Semant();
	return 0;
}
function c_MapValues(){
	Object.call(this);
	this.m_map=null;
}
c_MapValues.m_new=function(t_map){
	this.m_map=t_map;
	return this;
}
c_MapValues.m_new2=function(){
	return this;
}
c_MapValues.prototype.p_ObjectEnumerator=function(){
	return c_ValueEnumerator.m_new.call(new c_ValueEnumerator,this.m_map.p_FirstNode());
}
function c_ValueEnumerator(){
	Object.call(this);
	this.m_node=null;
}
c_ValueEnumerator.m_new=function(t_node){
	this.m_node=t_node;
	return this;
}
c_ValueEnumerator.m_new2=function(){
	return this;
}
c_ValueEnumerator.prototype.p_HasNext=function(){
	return this.m_node!=null;
}
c_ValueEnumerator.prototype.p_NextObject=function(){
	var t_t=this.m_node;
	this.m_node=this.m_node.p_NextNode();
	return t_t.m_value;
}
function c_Map7(){
	Object.call(this);
	this.m_root=null;
}
c_Map7.m_new=function(){
	return this;
}
c_Map7.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map7.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map7.prototype.p_Contains=function(t_key){
	return this.p_FindNode(t_key)!=null;
}
c_Map7.prototype.p_Get2=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return 0;
}
c_Map7.prototype.p_RotateLeft7=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map7.prototype.p_RotateRight7=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map7.prototype.p_InsertFixup7=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft7(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight7(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight7(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft7(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map7.prototype.p_Set7=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node15.m_new.call(new c_Node15,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup7(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
function c_StringMap7(){
	c_Map7.call(this);
}
c_StringMap7.prototype=extend_class(c_Map7);
c_StringMap7.m_new=function(){
	c_Map7.m_new.call(this);
	return this;
}
c_StringMap7.prototype.p_Compare=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_Node15(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=0;
	this.m_color=0;
	this.m_parent=null;
}
c_Node15.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node15.m_new2=function(){
	return this;
}
function c_Enumerator5(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator5.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator5.m_new2=function(){
	return this;
}
c_Enumerator5.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator5.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_Stack10(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack10.m_new=function(){
	return this;
}
c_Stack10.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack10.m_NIL=null;
c_Stack10.prototype.p_Length=function(t_newlength){
	if(t_newlength<this.m_length){
		for(var t_i=t_newlength;t_i<this.m_length;t_i=t_i+1){
			this.m_data[t_i]=c_Stack10.m_NIL;
		}
	}else{
		if(t_newlength>this.m_data.length){
			this.m_data=resize_object_array(this.m_data,bb_math_Max(this.m_length*2+10,t_newlength));
		}
	}
	this.m_length=t_newlength;
}
c_Stack10.prototype.p_Length2=function(){
	return this.m_length;
}
c_Stack10.prototype.p_Push28=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack10.prototype.p_Push29=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push28(t_values[t_offset+t_i]);
	}
}
c_Stack10.prototype.p_Push30=function(t_values,t_offset){
	this.p_Push29(t_values,t_offset,t_values.length-t_offset);
}
c_Stack10.prototype.p_Get=function(t_index){
	return this.m_data[t_index];
}
function bb_parser_ParseSource(t_source,t_app,t_mdecl,t_defattrs){
	var t_toker=c_Toker.m_new.call(new c_Toker,"$SOURCE",t_source);
	var t_parser=c_Parser.m_new.call(new c_Parser,t_toker,t_app,t_mdecl,t_defattrs);
	t_parser.p_ParseMain();
	return 0;
}
function c_Enumerator6(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator6.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator6.m_new2=function(){
	return this;
}
c_Enumerator6.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator6.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_Translator(){
	Object.call(this);
}
c_Translator.prototype.p_TransApp=function(t_app){
}
c_Translator.m_new=function(){
	return this;
}
c_Translator.prototype.p_TransInvokeExpr=function(t_expr){
}
c_Translator.prototype.p_TransStmtExpr=function(t_expr){
}
c_Translator.prototype.p_TransMemberVarExpr=function(t_expr){
}
c_Translator.prototype.p_TransVarExpr=function(t_expr){
}
c_Translator.prototype.p_TransUnaryExpr=function(t_expr){
}
c_Translator.prototype.p_TransArrayExpr=function(t_expr){
}
c_Translator.prototype.p_TransConstExpr=function(t_expr){
}
c_Translator.prototype.p_TransNewArrayExpr=function(t_expr){
}
c_Translator.prototype.p_TransNewObjectExpr=function(t_expr){
}
c_Translator.prototype.p_TransCastExpr=function(t_expr){
}
c_Translator.prototype.p_TransSelfExpr=function(t_expr){
}
c_Translator.prototype.p_TransInvokeSuperExpr=function(t_expr){
}
c_Translator.prototype.p_TransSliceExpr=function(t_expr){
}
c_Translator.prototype.p_TransIndexExpr=function(t_expr){
}
c_Translator.prototype.p_TransBinaryExpr=function(t_expr){
}
c_Translator.prototype.p_TransDeclStmt=function(t_stmt){
}
c_Translator.prototype.p_TransReturnStmt=function(t_stmt){
}
c_Translator.prototype.p_TransBreakStmt=function(t_stmt){
}
c_Translator.prototype.p_TransContinueStmt=function(t_stmt){
}
c_Translator.prototype.p_TransIfStmt=function(t_stmt){
}
c_Translator.prototype.p_TransWhileStmt=function(t_stmt){
}
c_Translator.prototype.p_TransRepeatStmt=function(t_stmt){
}
c_Translator.prototype.p_TransBlock=function(t_block){
}
c_Translator.prototype.p_TransAssignStmt=function(t_stmt){
}
c_Translator.prototype.p_TransForStmt=function(t_stmt){
}
c_Translator.prototype.p_TransTryStmt=function(t_stmt){
}
c_Translator.prototype.p_TransThrowStmt=function(t_stmt){
}
c_Translator.prototype.p_TransExprStmt=function(t_stmt){
}
c_Translator.prototype.p_TransInvokeMemberExpr=function(t_expr){
}
var bb_translator__trans=null;
function bb_virtualos_CopyDir(t_SourcePath,t_DestinationPath,t_Recursive,t_Hidden){
	if(FileType(t_SourcePath)!=2){
		return false;
	}
	var t_Files=LoadDir(t_SourcePath);
	var t_2=FileType(t_DestinationPath);
	if(t_2==0){
		if(!CreateDir(t_DestinationPath)){
			return false;
		}
	}else{
		if(t_2==1){
			return false;
		}
	}
	var t_=t_Files;
	var t_3=0;
	while(t_3<t_.length){
		var t_F=t_[t_3];
		t_3=t_3+1;
		if(!t_Hidden && string_startswith(t_F,".")){
			continue;
		}
		var t_SrcP=t_SourcePath+"/"+t_F;
		var t_DstP=t_DestinationPath+"/"+t_F;
		var t_32=FileType(t_SrcP);
		if(t_32==1){
			if(!CopyFile(t_SrcP,t_DstP)){
				return false;
			}
		}else{
			if(t_32==2){
				if(t_Recursive && !bb_virtualos_CopyDir(t_SrcP,t_DstP,t_Recursive,t_Hidden)){
					return false;
				}
			}
		}
	}
	return true;
}
function bbMain(){
	var t_CC=c_WebCC.m_new.call(new c_WebCC);
	if(!__monkey_DirectoryLoaded){
		bb_virtualos___OS_AddFileSystem(__os_toRemotePath(RealPath("data/webcc_filesystem.txt")));
		__monkey_DirectoryLoaded=true;
	}
	t_CC.p_Run(AppArgs());
	return 0;
}
function bb_math_Clamp(t_n,t_min,t_max){
	if(t_n<t_min){
		return t_min;
	}
	if(t_n>t_max){
		return t_max;
	}
	return t_n;
}
function bb_math_Clamp2(t_n,t_min,t_max){
	if(t_n<t_min){
		return t_min;
	}
	if(t_n>t_max){
		return t_max;
	}
	return t_n;
}
function c_CTranslator(){
	c_Translator.call(this);
	this.m_funcMungs=c_StringMap8.m_new.call(new c_StringMap8);
	this.m_mungedFuncs=c_StringMap9.m_new.call(new c_StringMap9);
	this.m_mungedScopes=c_StringMap10.m_new.call(new c_StringMap10);
	this.m_indent="";
	this.m_lines=c_StringStack.m_new2.call(new c_StringStack);
	this.m_emitDebugInfo=false;
	this.m_unreachable=0;
	this.m_broken=0;
}
c_CTranslator.prototype=extend_class(c_Translator);
c_CTranslator.m_new=function(){
	c_Translator.m_new.call(this);
	return this;
}
c_CTranslator.prototype.p_MungMethodDecl=function(t_fdecl){
	if((t_fdecl.m_munged).length!=0){
		return 0;
	}
	if((t_fdecl.m_overrides)!=null){
		this.p_MungMethodDecl(t_fdecl.m_overrides);
		t_fdecl.m_munged=t_fdecl.m_overrides.m_munged;
		return 0;
	}
	var t_funcs=this.m_funcMungs.p_Get2(t_fdecl.m_ident);
	if((t_funcs)!=null){
		var t_=t_funcs.p_ObjectEnumerator();
		while(t_.p_HasNext()){
			var t_tdecl=t_.p_NextObject();
			if(t_fdecl.p_EqualsArgs(t_tdecl)){
				t_fdecl.m_munged=t_tdecl.m_munged;
				return 0;
			}
		}
	}else{
		t_funcs=c_FuncDeclList.m_new.call(new c_FuncDeclList);
		this.m_funcMungs.p_Set8(t_fdecl.m_ident,t_funcs);
	}
	var t_id=t_fdecl.m_ident;
	if(this.m_mungedFuncs.p_Contains(t_id)){
		var t_n=1;
		do{
			t_n+=1;
			t_id=t_fdecl.m_ident+String(t_n);
		}while(!(!this.m_mungedFuncs.p_Contains(t_id)));
	}
	this.m_mungedFuncs.p_Set9(t_id,t_fdecl);
	t_fdecl.m_munged="p_"+t_id;
	t_funcs.p_AddLast4(t_fdecl);
	return 0;
}
c_CTranslator.prototype.p_MungDecl=function(t_decl){
	if((t_decl.m_munged).length!=0){
		return 0;
	}
	var t_fdecl=object_downcast((t_decl),c_FuncDecl);
	if(((t_fdecl)!=null) && t_fdecl.p_IsMethod()){
		return this.p_MungMethodDecl(t_fdecl);
	}
	var t_id=t_decl.m_ident;
	var t_munged="";
	var t_scope="";
	if((object_downcast((t_decl),c_LocalDecl))!=null){
		t_scope="$";
		t_munged="t_"+t_id;
	}else{
		if((object_downcast((t_decl),c_ClassDecl))!=null){
			t_scope="";
			t_munged="c_"+t_id;
		}else{
			if((object_downcast((t_decl),c_ModuleDecl))!=null){
				t_scope="";
				t_munged="bb_"+t_id;
			}else{
				if((object_downcast((t_decl.m_scope),c_ClassDecl))!=null){
					t_scope=t_decl.m_scope.m_munged;
					t_munged="m_"+t_id;
				}else{
					if((object_downcast((t_decl.m_scope),c_ModuleDecl))!=null){
						if(bb_config_ENV_LANG=="cs" || bb_config_ENV_LANG=="java"){
							t_scope=t_decl.m_scope.m_munged;
							t_munged="g_"+t_id;
						}else{
							t_scope="";
							t_munged=t_decl.m_scope.m_munged+"_"+t_id;
						}
					}else{
						bb_config_InternalErr("Internal error");
					}
				}
			}
		}
	}
	var t_set=this.m_mungedScopes.p_Get2(t_scope);
	if((t_set)!=null){
		if(t_set.p_Contains(t_munged.toLowerCase())){
			var t_id2=1;
			do{
				t_id2+=1;
				var t_t=t_munged+String(t_id2);
				if(t_set.p_Contains(t_t.toLowerCase())){
					continue;
				}
				t_munged=t_t;
				break;
			}while(!(false));
		}
	}else{
		if(t_scope=="$"){
			print("OOPS2");
			bb_config_InternalErr("Internal error");
		}
		t_set=c_StringSet.m_new.call(new c_StringSet);
		this.m_mungedScopes.p_Set10(t_scope,t_set);
	}
	t_set.p_Insert(t_munged.toLowerCase());
	t_decl.m_munged=t_munged;
	return 0;
}
c_CTranslator.prototype.p_TransGlobal=function(t_decl){
}
c_CTranslator.prototype.p_TransValue=function(t_ty,t_value){
}
c_CTranslator.prototype.p_Enquote=function(t_str){
	return bb_config_Enquote(t_str,bb_config_ENV_LANG);
}
c_CTranslator.prototype.p_Emit=function(t_t){
	if(!((t_t).length!=0)){
		return 0;
	}
	if(string_startswith(t_t,"}")){
		this.m_indent=this.m_indent.slice(0,this.m_indent.length-1);
	}
	this.m_lines.p_Push(this.m_indent+t_t);
	if(string_endswith(t_t,"{")){
		this.m_indent=this.m_indent+"\t";
	}
	return 0;
}
c_CTranslator.prototype.p_BeginLocalScope=function(){
	this.m_mungedScopes.p_Set10("$",c_StringSet.m_new.call(new c_StringSet));
	return 0;
}
c_CTranslator.prototype.p_Bra=function(t_str){
	if(string_startswith(t_str,"(") && string_endswith(t_str,")")){
		var t_n=1;
		for(var t_i=1;t_i<t_str.length-1;t_i=t_i+1){
			var t_1=t_str.slice(t_i,t_i+1);
			if(t_1=="("){
				t_n+=1;
			}else{
				if(t_1==")"){
					t_n-=1;
					if(!((t_n)!=0)){
						return "("+t_str+")";
					}
				}
			}
		}
		if(t_n==1){
			return t_str;
		}
	}
	return "("+t_str+")";
}
c_CTranslator.prototype.p_EmitEnter=function(t_func){
	return 0;
}
c_CTranslator.prototype.p_EmitEnterBlock=function(){
	return 0;
}
c_CTranslator.prototype.p_EmitSetErr=function(t_errInfo){
	return 0;
}
c_CTranslator.prototype.p_TransLocalDecl=function(t_munged,t_init){
}
c_CTranslator.prototype.p_CreateLocal=function(t_expr){
	var t_tmp=c_LocalDecl.m_new.call(new c_LocalDecl,"",0,t_expr.m_exprType,t_expr);
	this.p_MungDecl(t_tmp);
	this.p_Emit(this.p_TransLocalDecl(t_tmp.m_munged,t_expr)+";");
	return t_tmp.m_munged;
}
c_CTranslator.prototype.p_TransExprNS=function(t_expr){
	if(!t_expr.p_SideEffects()){
		return t_expr.p_Trans();
	}
	return this.p_CreateLocal(t_expr);
}
c_CTranslator.prototype.p_EmitLeave=function(){
	return 0;
}
c_CTranslator.prototype.p_EmitLeaveBlock=function(){
	return 0;
}
c_CTranslator.prototype.p_EmitBlock=function(t_block,t_realBlock){
	bb_decl_PushEnv(t_block);
	var t_func=object_downcast((t_block),c_FuncDecl);
	if((t_func)!=null){
		this.m_emitDebugInfo=bb_config_ENV_CONFIG!="release";
		if((t_func.m_attrs&4194304)!=0){
			this.m_emitDebugInfo=false;
		}
		if(this.m_emitDebugInfo){
			this.p_EmitEnter(t_func);
		}
	}else{
		if(this.m_emitDebugInfo && t_realBlock){
			this.p_EmitEnterBlock();
		}
	}
	var t_lastStmt=null;
	var t_=t_block.m_stmts.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_stmt=t_.p_NextObject();
		bb_config__errInfo=t_stmt.m_errInfo;
		if((this.m_unreachable)!=0){
			break;
		}
		t_lastStmt=t_stmt;
		if(this.m_emitDebugInfo){
			var t_rs=object_downcast((t_stmt),c_ReturnStmt);
			if((t_rs)!=null){
				if((t_rs.m_expr)!=null){
					if((t_stmt.m_errInfo).length!=0){
						this.p_EmitSetErr(t_stmt.m_errInfo);
					}
					var t_t_expr=this.p_TransExprNS(t_rs.m_expr);
					this.p_EmitLeave();
					this.p_Emit("return "+t_t_expr+";");
				}else{
					this.p_EmitLeave();
					this.p_Emit("return;");
				}
				this.m_unreachable=1;
				continue;
			}
			if((t_stmt.m_errInfo).length!=0){
				this.p_EmitSetErr(t_stmt.m_errInfo);
			}
		}
		var t_t=t_stmt.p_Trans();
		if((t_t).length!=0){
			this.p_Emit(t_t+";");
		}
	}
	bb_config__errInfo="";
	var t_unr=this.m_unreachable;
	this.m_unreachable=0;
	if((t_unr)!=0){
		if(((t_func)!=null) && bb_config_ENV_LANG=="as" && !((object_downcast((t_func.m_retType),c_VoidType))!=null)){
			if(!((object_downcast((t_lastStmt),c_ReturnStmt))!=null)){
				this.p_Emit("return "+this.p_TransValue(t_func.m_retType,"")+";");
			}
		}
	}else{
		if((t_func)!=null){
			if(this.m_emitDebugInfo){
				this.p_EmitLeave();
			}
			if(!((object_downcast((t_func.m_retType),c_VoidType))!=null)){
				if(t_func.p_IsCtor()){
					this.p_Emit("return this;");
				}else{
					if((t_func.p_ModuleScope().p_IsStrict())!=0){
						bb_config__errInfo=t_func.m_errInfo;
						bb_config_Err("Missing return statement.");
					}
					this.p_Emit("return "+this.p_TransValue(t_func.m_retType,"")+";");
				}
			}
		}else{
			if(this.m_emitDebugInfo && t_realBlock){
				this.p_EmitLeaveBlock();
			}
		}
	}
	bb_decl_PopEnv();
	return t_unr;
}
c_CTranslator.prototype.p_EndLocalScope=function(){
	this.m_mungedScopes.p_Set10("$",null);
	return 0;
}
c_CTranslator.prototype.p_JoinLines=function(){
	var t_code=this.m_lines.p_Join("\n");
	this.m_lines.p_Clear();
	return t_code;
}
c_CTranslator.prototype.p_TransStmtExpr=function(t_expr){
	var t_t=t_expr.m_stmt.p_Trans();
	if((t_t).length!=0){
		this.p_Emit(t_t+";");
	}
	return t_expr.m_expr.p_Trans();
}
c_CTranslator.prototype.p_TransIntrinsicExpr=function(t_decl,t_expr,t_args){
}
c_CTranslator.prototype.p_TransField=function(t_decl,t_lhs){
}
c_CTranslator.prototype.p_TransVarExpr=function(t_expr){
	var t_decl=t_expr.m_decl;
	if(string_startswith(t_decl.m_munged,"$")){
		return this.p_TransIntrinsicExpr((t_decl),null,[]);
	}
	if((object_downcast((t_decl),c_LocalDecl))!=null){
		return t_decl.m_munged;
	}
	if((object_downcast((t_decl),c_FieldDecl))!=null){
		return this.p_TransField(object_downcast((t_decl),c_FieldDecl),null);
	}
	if((object_downcast((t_decl),c_GlobalDecl))!=null){
		return this.p_TransGlobal(object_downcast((t_decl),c_GlobalDecl));
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_CTranslator.prototype.p_TransMemberVarExpr=function(t_expr){
	var t_decl=t_expr.m_decl;
	if(string_startswith(t_decl.m_munged,"$")){
		return this.p_TransIntrinsicExpr((t_decl),t_expr.m_expr,[]);
	}
	if((object_downcast((t_decl),c_FieldDecl))!=null){
		return this.p_TransField(object_downcast((t_decl),c_FieldDecl),t_expr.m_expr);
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_CTranslator.prototype.p_TransFunc=function(t_decl,t_args,t_lhs){
}
c_CTranslator.prototype.p_TransInvokeExpr=function(t_expr){
	var t_decl=t_expr.m_decl;
	var t_t="";
	if(string_startswith(t_decl.m_munged,"$")){
		return this.p_TransIntrinsicExpr((t_decl),null,t_expr.m_args);
	}
	if((t_decl)!=null){
		return this.p_TransFunc(t_decl,t_expr.m_args,null);
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_CTranslator.prototype.p_TransInvokeMemberExpr=function(t_expr){
	var t_decl=t_expr.m_decl;
	var t_t="";
	if(string_startswith(t_decl.m_munged,"$")){
		return this.p_TransIntrinsicExpr((t_decl),t_expr.m_expr,t_expr.m_args);
	}
	if((t_decl)!=null){
		return this.p_TransFunc(t_decl,t_expr.m_args,t_expr.m_expr);
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_CTranslator.prototype.p_TransSuperFunc=function(t_decl,t_args){
}
c_CTranslator.prototype.p_TransInvokeSuperExpr=function(t_expr){
	var t_decl=t_expr.m_funcDecl;
	var t_t="";
	if(string_startswith(t_decl.m_munged,"$")){
		return this.p_TransIntrinsicExpr((t_decl),(t_expr),[]);
	}
	if((t_decl)!=null){
		return this.p_TransSuperFunc(t_decl,t_expr.m_args);
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_CTranslator.prototype.p_TransExprStmt=function(t_stmt){
	return t_stmt.m_expr.p_TransStmt();
}
c_CTranslator.prototype.p_TransAssignOp=function(t_op){
	var t_4=t_op;
	if(t_4=="~="){
		return "^=";
	}else{
		if(t_4=="mod="){
			return "%=";
		}else{
			if(t_4=="shl="){
				return "<<=";
			}else{
				if(t_4=="shr="){
					return ">>=";
				}
			}
		}
	}
	return t_op;
}
c_CTranslator.prototype.p_TransAssignStmt2=function(t_stmt){
	return t_stmt.m_lhs.p_TransVar()+this.p_TransAssignOp(t_stmt.m_op)+t_stmt.m_rhs.p_Trans();
}
c_CTranslator.prototype.p_TransAssignStmt=function(t_stmt){
	if(!((t_stmt.m_rhs)!=null)){
		return t_stmt.m_lhs.p_Trans();
	}
	if((t_stmt.m_tmp1)!=null){
		this.p_MungDecl(t_stmt.m_tmp1);
		this.p_Emit(this.p_TransLocalDecl(t_stmt.m_tmp1.m_munged,t_stmt.m_tmp1.m_init)+";");
	}
	if((t_stmt.m_tmp2)!=null){
		this.p_MungDecl(t_stmt.m_tmp2);
		this.p_Emit(this.p_TransLocalDecl(t_stmt.m_tmp2.m_munged,t_stmt.m_tmp2.m_init)+";");
	}
	return this.p_TransAssignStmt2(t_stmt);
}
c_CTranslator.prototype.p_TransReturnStmt=function(t_stmt){
	var t_t="return";
	if((t_stmt.m_expr)!=null){
		t_t=t_t+(" "+t_stmt.m_expr.p_Trans());
	}
	this.m_unreachable=1;
	return t_t;
}
c_CTranslator.prototype.p_TransContinueStmt=function(t_stmt){
	this.m_unreachable=1;
	return "continue";
}
c_CTranslator.prototype.p_TransBreakStmt=function(t_stmt){
	this.m_unreachable=1;
	this.m_broken+=1;
	return "break";
}
c_CTranslator.prototype.p_TransBlock=function(t_block){
	this.p_EmitBlock(t_block,false);
	return "";
}
c_CTranslator.prototype.p_TransDeclStmt=function(t_stmt){
	var t_decl=object_downcast((t_stmt.m_decl),c_LocalDecl);
	if((t_decl)!=null){
		this.p_MungDecl(t_decl);
		return this.p_TransLocalDecl(t_decl.m_munged,t_decl.m_init);
	}
	var t_cdecl=object_downcast((t_stmt.m_decl),c_ConstDecl);
	if((t_cdecl)!=null){
		return "";
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_CTranslator.prototype.p_TransIfStmt=function(t_stmt){
	if(((object_downcast((t_stmt.m_expr),c_ConstExpr))!=null) && bb_config_ENV_LANG!="java"){
		if((object_downcast((t_stmt.m_expr),c_ConstExpr).m_value).length!=0){
			if(!t_stmt.m_thenBlock.m_stmts.p_IsEmpty()){
				this.p_Emit("if(true){");
				if((this.p_EmitBlock(t_stmt.m_thenBlock,true))!=0){
					this.m_unreachable=1;
				}
				this.p_Emit("}");
			}
		}else{
			if(!t_stmt.m_elseBlock.m_stmts.p_IsEmpty()){
				this.p_Emit("if(true){");
				if((this.p_EmitBlock(t_stmt.m_elseBlock,true))!=0){
					this.m_unreachable=1;
				}
				this.p_Emit("}");
			}
		}
	}else{
		if(!t_stmt.m_elseBlock.m_stmts.p_IsEmpty()){
			this.p_Emit("if"+this.p_Bra(t_stmt.m_expr.p_Trans())+"{");
			var t_unr=this.p_EmitBlock(t_stmt.m_thenBlock,true);
			this.p_Emit("}else{");
			var t_unr2=this.p_EmitBlock(t_stmt.m_elseBlock,true);
			this.p_Emit("}");
			if(((t_unr)!=0) && ((t_unr2)!=0)){
				this.m_unreachable=1;
			}
		}else{
			this.p_Emit("if"+this.p_Bra(t_stmt.m_expr.p_Trans())+"{");
			var t_unr3=this.p_EmitBlock(t_stmt.m_thenBlock,true);
			this.p_Emit("}");
		}
	}
	return "";
}
c_CTranslator.prototype.p_BeginLoop=function(){
	return 0;
}
c_CTranslator.prototype.p_EndLoop=function(){
	return 0;
}
c_CTranslator.prototype.p_TransWhileStmt=function(t_stmt){
	var t_nbroken=this.m_broken;
	this.p_Emit("while"+this.p_Bra(t_stmt.m_expr.p_Trans())+"{");
	this.p_BeginLoop();
	var t_unr=this.p_EmitBlock(t_stmt.m_block,true);
	this.p_EndLoop();
	this.p_Emit("}");
	if(this.m_broken==t_nbroken && ((object_downcast((t_stmt.m_expr),c_ConstExpr))!=null) && ((object_downcast((t_stmt.m_expr),c_ConstExpr).m_value).length!=0)){
		this.m_unreachable=1;
	}
	this.m_broken=t_nbroken;
	return "";
}
c_CTranslator.prototype.p_TransRepeatStmt=function(t_stmt){
	var t_nbroken=this.m_broken;
	this.p_Emit("do{");
	this.p_BeginLoop();
	var t_unr=this.p_EmitBlock(t_stmt.m_block,true);
	this.p_EndLoop();
	this.p_Emit("}while(!"+this.p_Bra(t_stmt.m_expr.p_Trans())+");");
	if(this.m_broken==t_nbroken && ((object_downcast((t_stmt.m_expr),c_ConstExpr))!=null) && !((object_downcast((t_stmt.m_expr),c_ConstExpr).m_value).length!=0)){
		this.m_unreachable=1;
	}
	this.m_broken=t_nbroken;
	return "";
}
c_CTranslator.prototype.p_TransForStmt=function(t_stmt){
	var t_nbroken=this.m_broken;
	var t_init=t_stmt.m_init.p_Trans();
	var t_expr=t_stmt.m_expr.p_Trans();
	var t_incr=t_stmt.m_incr.p_Trans();
	this.p_Emit("for("+t_init+";"+t_expr+";"+t_incr+"){");
	this.p_BeginLoop();
	var t_unr=this.p_EmitBlock(t_stmt.m_block,true);
	this.p_EndLoop();
	this.p_Emit("}");
	if(this.m_broken==t_nbroken && ((object_downcast((t_stmt.m_expr),c_ConstExpr))!=null) && ((object_downcast((t_stmt.m_expr),c_ConstExpr).m_value).length!=0)){
		this.m_unreachable=1;
	}
	this.m_broken=t_nbroken;
	return "";
}
c_CTranslator.prototype.p_TransTryStmt=function(t_stmt){
	bb_config_Err("TODO!");
	return "";
}
c_CTranslator.prototype.p_TransThrowStmt=function(t_stmt){
	this.m_unreachable=1;
	return "throw "+t_stmt.m_expr.p_Trans();
}
c_CTranslator.prototype.p_ExprPri=function(t_expr){
	if((object_downcast((t_expr),c_NewObjectExpr))!=null){
		return 3;
	}else{
		if((object_downcast((t_expr),c_UnaryExpr))!=null){
			var t_5=object_downcast((t_expr),c_UnaryExpr).m_op;
			if(t_5=="+" || t_5=="-" || t_5=="~" || t_5=="not"){
				return 3;
			}
			bb_config_InternalErr("Internal error");
		}else{
			if((object_downcast((t_expr),c_BinaryExpr))!=null){
				var t_6=object_downcast((t_expr),c_BinaryExpr).m_op;
				if(t_6=="*" || t_6=="/" || t_6=="mod"){
					return 4;
				}else{
					if(t_6=="+" || t_6=="-"){
						return 5;
					}else{
						if(t_6=="shl" || t_6=="shr"){
							return 6;
						}else{
							if(t_6=="<" || t_6=="<=" || t_6==">" || t_6==">="){
								return 7;
							}else{
								if(t_6=="=" || t_6=="<>"){
									return 8;
								}else{
									if(t_6=="&"){
										return 9;
									}else{
										if(t_6=="~"){
											return 10;
										}else{
											if(t_6=="|"){
												return 11;
											}else{
												if(t_6=="and"){
													return 12;
												}else{
													if(t_6=="or"){
														return 13;
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
				bb_config_InternalErr("Internal error");
			}
		}
	}
	return 2;
}
c_CTranslator.prototype.p_TransSubExpr=function(t_expr,t_pri){
	var t_t_expr=t_expr.p_Trans();
	if(this.p_ExprPri(t_expr)>t_pri){
		t_t_expr=this.p_Bra(t_t_expr);
	}
	return t_t_expr;
}
c_CTranslator.prototype.p_TransUnaryOp=function(t_op){
	var t_2=t_op;
	if(t_2=="+"){
		return "+";
	}else{
		if(t_2=="-"){
			return "-";
		}else{
			if(t_2=="~"){
				return t_op;
			}else{
				if(t_2=="not"){
					return "!";
				}
			}
		}
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_CTranslator.prototype.p_TransBinaryOp=function(t_op,t_rhs){
	var t_3=t_op;
	if(t_3=="+" || t_3=="-"){
		if(string_startswith(t_rhs,t_op)){
			return t_op+" ";
		}
		return t_op;
	}else{
		if(t_3=="*" || t_3=="/"){
			return t_op;
		}else{
			if(t_3=="shl"){
				return "<<";
			}else{
				if(t_3=="shr"){
					return ">>";
				}else{
					if(t_3=="mod"){
						return " % ";
					}else{
						if(t_3=="and"){
							return " && ";
						}else{
							if(t_3=="or"){
								return " || ";
							}else{
								if(t_3=="="){
									return "==";
								}else{
									if(t_3=="<>"){
										return "!=";
									}else{
										if(t_3=="<" || t_3=="<=" || t_3==">" || t_3==">="){
											return t_op;
										}else{
											if(t_3=="&" || t_3=="|"){
												return t_op;
											}else{
												if(t_3=="~"){
													return "^";
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	bb_config_InternalErr("Internal error");
	return "";
}
function c_JsTranslator(){
	c_CTranslator.call(this);
}
c_JsTranslator.prototype=extend_class(c_CTranslator);
c_JsTranslator.m_new=function(){
	c_CTranslator.m_new.call(this);
	return this;
}
c_JsTranslator.prototype.p_TransStatic=function(t_decl){
	if(((t_decl.p_IsExtern())!=0) && ((object_downcast((t_decl.m_scope),c_ModuleDecl))!=null)){
		return t_decl.m_munged;
	}else{
		if(((bb_decl__env)!=null) && ((t_decl.m_scope)!=null) && t_decl.m_scope==(bb_decl__env.p_ClassScope())){
			return t_decl.m_scope.m_munged+"."+t_decl.m_munged;
		}else{
			if((object_downcast((t_decl.m_scope),c_ClassDecl))!=null){
				return t_decl.m_scope.m_munged+"."+t_decl.m_munged;
			}else{
				if((object_downcast((t_decl.m_scope),c_ModuleDecl))!=null){
					return t_decl.m_munged;
				}
			}
		}
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_JsTranslator.prototype.p_TransGlobal=function(t_decl){
	return this.p_TransStatic(t_decl);
}
c_JsTranslator.prototype.p_TransValue=function(t_ty,t_value){
	if((t_value).length!=0){
		if((object_downcast((t_ty),c_BoolType))!=null){
			return "true";
		}
		if((object_downcast((t_ty),c_NumericType))!=null){
			return t_value;
		}
		if((object_downcast((t_ty),c_StringType))!=null){
			return this.p_Enquote(t_value);
		}
	}else{
		if((object_downcast((t_ty),c_BoolType))!=null){
			return "false";
		}
		if((object_downcast((t_ty),c_NumericType))!=null){
			return "0";
		}
		if((object_downcast((t_ty),c_StringType))!=null){
			return "\"\"";
		}
		if((object_downcast((t_ty),c_ArrayType))!=null){
			return "[]";
		}
		if((object_downcast((t_ty),c_ObjectType))!=null){
			return "null";
		}
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_JsTranslator.prototype.p_EmitFuncDecl=function(t_decl){
	this.p_BeginLocalScope();
	var t_args="";
	var t_=t_decl.m_argDecls;
	var t_2=0;
	while(t_2<t_.length){
		var t_arg=t_[t_2];
		t_2=t_2+1;
		this.p_MungDecl(t_arg);
		if((t_args).length!=0){
			t_args=t_args+",";
		}
		t_args=t_args+t_arg.m_munged;
	}
	t_args=this.p_Bra(t_args);
	if(t_decl.p_IsMethod()){
		this.p_Emit(t_decl.m_scope.m_munged+".prototype."+t_decl.m_munged+"=function"+t_args+"{");
	}else{
		if((t_decl.p_ClassScope())!=null){
			this.p_Emit(this.p_TransStatic(t_decl)+"=function"+t_args+"{");
		}else{
			this.p_Emit("function "+t_decl.m_munged+t_args+"{");
		}
	}
	if(!((t_decl.p_IsAbstract())!=0)){
		this.p_EmitBlock((t_decl),true);
	}
	this.p_Emit("}");
	this.p_EndLocalScope();
	return 0;
}
c_JsTranslator.prototype.p_EmitClassDecl=function(t_classDecl){
	if((t_classDecl.p_IsInterface())!=0){
		return 0;
	}
	var t_classid=t_classDecl.m_munged;
	var t_superid=t_classDecl.m_superClass.m_munged;
	this.p_Emit("function "+t_classid+"(){");
	this.p_Emit(t_superid+".call(this);");
	var t_=t_classDecl.p_Semanted().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_decl=t_.p_NextObject();
		var t_fdecl=object_downcast((t_decl),c_FieldDecl);
		if((t_fdecl)!=null){
			this.p_Emit("this."+t_fdecl.m_munged+"="+t_fdecl.m_init.p_Trans()+";");
		}
	}
	var t_impls="";
	var t_tdecl=t_classDecl;
	var t_iset=c_StringSet.m_new.call(new c_StringSet);
	while((t_tdecl)!=null){
		var t_2=t_tdecl.m_implmentsAll;
		var t_3=0;
		while(t_3<t_2.length){
			var t_iface=t_2[t_3];
			t_3=t_3+1;
			var t_t=t_iface.m_munged;
			if(t_iset.p_Contains(t_t)){
				continue;
			}
			t_iset.p_Insert(t_t);
			if((t_impls).length!=0){
				t_impls=t_impls+",";
			}
			t_impls=t_impls+(t_t+":1");
		}
		t_tdecl=t_tdecl.m_superClass;
	}
	if((t_impls).length!=0){
		this.p_Emit("this.implments={"+t_impls+"};");
	}
	this.p_Emit("}");
	if(t_superid!="Object"){
		this.p_Emit(t_classid+".prototype=extend_class("+t_superid+");");
	}
	var t_4=t_classDecl.p_Semanted().p_ObjectEnumerator();
	while(t_4.p_HasNext()){
		var t_decl2=t_4.p_NextObject();
		if((t_decl2.p_IsExtern())!=0){
			continue;
		}
		var t_fdecl2=object_downcast((t_decl2),c_FuncDecl);
		if((t_fdecl2)!=null){
			this.p_EmitFuncDecl(t_fdecl2);
			continue;
		}
		var t_gdecl=object_downcast((t_decl2),c_GlobalDecl);
		if((t_gdecl)!=null){
			this.p_Emit(this.p_TransGlobal(t_gdecl)+"="+this.p_TransValue(t_gdecl.m_type,"")+";");
			continue;
		}
	}
	return 0;
}
c_JsTranslator.prototype.p_TransApp=function(t_app){
	t_app.m_mainFunc.m_munged="bbMain";
	var t_=t_app.m_imported.p_Values().p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_decl=t_.p_NextObject();
		this.p_MungDecl(t_decl);
	}
	var t_2=t_app.p_Semanted().p_ObjectEnumerator();
	while(t_2.p_HasNext()){
		var t_decl2=t_2.p_NextObject();
		this.p_MungDecl(t_decl2);
		var t_cdecl=object_downcast((t_decl2),c_ClassDecl);
		if(!((t_cdecl)!=null)){
			continue;
		}
		var t_3=t_cdecl.p_Semanted().p_ObjectEnumerator();
		while(t_3.p_HasNext()){
			var t_decl3=t_3.p_NextObject();
			this.p_MungDecl(t_decl3);
		}
	}
	var t_4=t_app.p_Semanted().p_ObjectEnumerator();
	while(t_4.p_HasNext()){
		var t_decl4=t_4.p_NextObject();
		var t_gdecl=object_downcast((t_decl4),c_GlobalDecl);
		if((t_gdecl)!=null){
			this.p_Emit("var "+this.p_TransGlobal(t_gdecl)+"="+this.p_TransValue(t_gdecl.m_type,"")+";");
			continue;
		}
		var t_fdecl=object_downcast((t_decl4),c_FuncDecl);
		if((t_fdecl)!=null){
			this.p_EmitFuncDecl(t_fdecl);
			continue;
		}
		var t_cdecl2=object_downcast((t_decl4),c_ClassDecl);
		if((t_cdecl2)!=null){
			this.p_EmitClassDecl(t_cdecl2);
			continue;
		}
	}
	this.p_Emit("function bbInit(){");
	var t_5=t_app.m_semantedGlobals.p_ObjectEnumerator();
	while(t_5.p_HasNext()){
		var t_decl5=t_5.p_NextObject();
		this.p_Emit(this.p_TransGlobal(t_decl5)+"="+t_decl5.m_init.p_Trans()+";");
	}
	this.p_Emit("}");
	return this.p_JoinLines();
}
c_JsTranslator.prototype.p_TransLocalDecl=function(t_munged,t_init){
	return "var "+t_munged+"="+t_init.p_Trans();
}
c_JsTranslator.prototype.p_EmitEnter=function(t_func){
	this.p_Emit("push_err();");
	return 0;
}
c_JsTranslator.prototype.p_EmitSetErr=function(t_info){
	this.p_Emit("err_info=\""+string_replace(t_info,"\\","/")+"\";");
	return 0;
}
c_JsTranslator.prototype.p_EmitLeave=function(){
	this.p_Emit("pop_err();");
	return 0;
}
c_JsTranslator.prototype.p_TransField=function(t_decl,t_lhs){
	var t_t_lhs="this";
	if((t_lhs)!=null){
		t_t_lhs=this.p_TransSubExpr(t_lhs,2);
		if(bb_config_ENV_CONFIG=="debug"){
			t_t_lhs="dbg_object"+this.p_Bra(t_t_lhs);
		}
	}
	return t_t_lhs+"."+t_decl.m_munged;
}
c_JsTranslator.prototype.p_TransArgs=function(t_args,t_first){
	var t_t=t_first;
	var t_=t_args;
	var t_2=0;
	while(t_2<t_.length){
		var t_arg=t_[t_2];
		t_2=t_2+1;
		if((t_t).length!=0){
			t_t=t_t+",";
		}
		t_t=t_t+t_arg.p_Trans();
	}
	return this.p_Bra(t_t);
}
c_JsTranslator.prototype.p_TransFunc=function(t_decl,t_args,t_lhs){
	if(t_decl.p_IsMethod()){
		var t_t_lhs="this";
		if((t_lhs)!=null){
			t_t_lhs=this.p_TransSubExpr(t_lhs,2);
		}
		return t_t_lhs+"."+t_decl.m_munged+this.p_TransArgs(t_args,"");
	}
	return this.p_TransStatic(t_decl)+this.p_TransArgs(t_args,"");
}
c_JsTranslator.prototype.p_TransSuperFunc=function(t_decl,t_args){
	if(t_decl.p_IsCtor()){
		return this.p_TransStatic(t_decl)+".call"+this.p_TransArgs(t_args,"this");
	}
	return t_decl.m_scope.m_munged+".prototype."+t_decl.m_munged+".call"+this.p_TransArgs(t_args,"this");
}
c_JsTranslator.prototype.p_TransConstExpr=function(t_expr){
	return this.p_TransValue(t_expr.m_exprType,t_expr.m_value);
}
c_JsTranslator.prototype.p_TransNewObjectExpr=function(t_expr){
	var t_t="new "+t_expr.m_classDecl.m_munged;
	if((t_expr.m_ctor)!=null){
		t_t=this.p_TransStatic(t_expr.m_ctor)+".call"+this.p_TransArgs(t_expr.m_args,t_t);
	}else{
		t_t="("+t_t+")";
	}
	return t_t;
}
c_JsTranslator.prototype.p_TransNewArrayExpr=function(t_expr){
	var t_texpr=t_expr.m_expr.p_Trans();
	var t_ty=object_downcast((t_expr.m_exprType),c_ArrayType).m_elemType;
	if((object_downcast((t_ty),c_BoolType))!=null){
		return "new_bool_array("+t_texpr+")";
	}
	if((object_downcast((t_ty),c_NumericType))!=null){
		return "new_number_array("+t_texpr+")";
	}
	if((object_downcast((t_ty),c_StringType))!=null){
		return "new_string_array("+t_texpr+")";
	}
	if((object_downcast((t_ty),c_ObjectType))!=null){
		return "new_object_array("+t_texpr+")";
	}
	if((object_downcast((t_ty),c_ArrayType))!=null){
		return "new_array_array("+t_texpr+")";
	}
	bb_config_InternalErr("Internal error");
	return "";
}
c_JsTranslator.prototype.p_TransSelfExpr=function(t_expr){
	return "this";
}
c_JsTranslator.prototype.p_TransCastExpr=function(t_expr){
	var t_dst=t_expr.m_exprType;
	var t_src=t_expr.m_expr.m_exprType;
	var t_texpr=this.p_Bra(t_expr.m_expr.p_Trans());
	if((object_downcast((t_dst),c_BoolType))!=null){
		if((object_downcast((t_src),c_BoolType))!=null){
			return t_texpr;
		}
		if((object_downcast((t_src),c_IntType))!=null){
			return this.p_Bra(t_texpr+"!=0");
		}
		if((object_downcast((t_src),c_FloatType))!=null){
			return this.p_Bra(t_texpr+"!=0.0");
		}
		if((object_downcast((t_src),c_StringType))!=null){
			return this.p_Bra(t_texpr+".length!=0");
		}
		if((object_downcast((t_src),c_ArrayType))!=null){
			return this.p_Bra(t_texpr+".length!=0");
		}
		if((object_downcast((t_src),c_ObjectType))!=null){
			return this.p_Bra(t_texpr+"!=null");
		}
	}else{
		if((object_downcast((t_dst),c_IntType))!=null){
			if((object_downcast((t_src),c_BoolType))!=null){
				return this.p_Bra(t_texpr+"?1:0");
			}
			if((object_downcast((t_src),c_IntType))!=null){
				return t_texpr;
			}
			if((object_downcast((t_src),c_FloatType))!=null){
				return this.p_Bra(t_texpr+"|0");
			}
			if((object_downcast((t_src),c_StringType))!=null){
				return "parseInt"+this.p_Bra(t_texpr+",10");
			}
		}else{
			if((object_downcast((t_dst),c_FloatType))!=null){
				if((object_downcast((t_src),c_NumericType))!=null){
					return t_texpr;
				}
				if((object_downcast((t_src),c_StringType))!=null){
					return "parseFloat"+t_texpr;
				}
			}else{
				if((object_downcast((t_dst),c_StringType))!=null){
					if((object_downcast((t_src),c_NumericType))!=null){
						return "String"+t_texpr;
					}
					if((object_downcast((t_src),c_StringType))!=null){
						return t_texpr;
					}
				}else{
					if(((object_downcast((t_dst),c_ObjectType))!=null) && ((object_downcast((t_src),c_ObjectType))!=null)){
						if((t_src.p_GetClass().p_ExtendsClass(t_dst.p_GetClass()))!=0){
							return t_texpr;
						}else{
							if((t_dst.p_GetClass().p_IsInterface())!=0){
								return "object_implements"+this.p_Bra(t_texpr+",\""+t_dst.p_GetClass().m_munged+"\"");
							}else{
								return "object_downcast"+this.p_Bra(t_texpr+","+t_dst.p_GetClass().m_munged);
							}
						}
					}
				}
			}
		}
	}
	bb_config_Err("JS translator can't convert "+t_src.p_ToString()+" to "+t_dst.p_ToString());
	return "";
}
c_JsTranslator.prototype.p_TransUnaryExpr=function(t_expr){
	var t_pri=this.p_ExprPri(t_expr);
	var t_t_expr=this.p_TransSubExpr(t_expr.m_expr,t_pri);
	return this.p_TransUnaryOp(t_expr.m_op)+t_t_expr;
}
c_JsTranslator.prototype.p_TransBinaryExpr=function(t_expr){
	var t_pri=this.p_ExprPri(t_expr);
	var t_t_lhs=this.p_TransSubExpr(t_expr.m_lhs,t_pri);
	var t_t_rhs=this.p_TransSubExpr(t_expr.m_rhs,t_pri-1);
	var t_t_expr=t_t_lhs+this.p_TransBinaryOp(t_expr.m_op,t_t_rhs)+t_t_rhs;
	if(t_expr.m_op=="/" && ((object_downcast((t_expr.m_exprType),c_IntType))!=null)){
		t_t_expr=this.p_Bra(this.p_Bra(t_t_expr)+"|0");
	}
	return t_t_expr;
}
c_JsTranslator.prototype.p_TransIndexExpr=function(t_expr){
	var t_t_expr=this.p_TransSubExpr(t_expr.m_expr,2);
	if((object_downcast((t_expr.m_expr.m_exprType),c_StringType))!=null){
		var t_t_index=t_expr.m_index.p_Trans();
		if(bb_config_ENV_CONFIG=="debug"){
			return "dbg_charCodeAt("+t_t_expr+","+t_t_index+")";
		}
		return t_t_expr+".charCodeAt("+t_t_index+")";
	}else{
		if(bb_config_ENV_CONFIG=="debug"){
			var t_t_index2=t_expr.m_index.p_Trans();
			return "dbg_array("+t_t_expr+","+t_t_index2+")[dbg_index]";
		}else{
			var t_t_index3=t_expr.m_index.p_Trans();
			return t_t_expr+"["+t_t_index3+"]";
		}
	}
}
c_JsTranslator.prototype.p_TransSliceExpr=function(t_expr){
	var t_t_expr=this.p_TransSubExpr(t_expr.m_expr,2);
	var t_t_args="0";
	if((t_expr.m_from)!=null){
		t_t_args=t_expr.m_from.p_Trans();
	}
	if((t_expr.m_term)!=null){
		t_t_args=t_t_args+(","+t_expr.m_term.p_Trans());
	}
	return t_t_expr+".slice("+t_t_args+")";
}
c_JsTranslator.prototype.p_TransArrayExpr=function(t_expr){
	var t_t="";
	var t_=t_expr.m_exprs;
	var t_2=0;
	while(t_2<t_.length){
		var t_elem=t_[t_2];
		t_2=t_2+1;
		if((t_t).length!=0){
			t_t=t_t+",";
		}
		t_t=t_t+t_elem.p_Trans();
	}
	return "["+t_t+"]";
}
c_JsTranslator.prototype.p_TransTryStmt=function(t_stmt){
	this.p_Emit("try{");
	var t_unr=this.p_EmitBlock(t_stmt.m_block,true);
	this.p_Emit("}catch(_eek_){");
	for(var t_i=0;t_i<t_stmt.m_catches.length;t_i=t_i+1){
		var t_c=t_stmt.m_catches[t_i];
		this.p_MungDecl(t_c.m_init);
		if((t_i)!=0){
			this.p_Emit("}else if("+t_c.m_init.m_munged+"=object_downcast(_eek_,"+t_c.m_init.m_type.p_GetClass().m_munged+")){");
		}else{
			this.p_Emit("if("+t_c.m_init.m_munged+"=object_downcast(_eek_,"+t_c.m_init.m_type.p_GetClass().m_munged+")){");
		}
		var t_unr2=this.p_EmitBlock(t_c.m_block,true);
	}
	this.p_Emit("}else{");
	this.p_Emit("throw _eek_;");
	this.p_Emit("}");
	this.p_Emit("}");
	return "";
}
c_JsTranslator.prototype.p_TransIntrinsicExpr=function(t_decl,t_expr,t_args){
	var t_texpr="";
	var t_arg0="";
	var t_arg1="";
	var t_arg2="";
	if((t_expr)!=null){
		t_texpr=this.p_TransSubExpr(t_expr,2);
	}
	if(t_args.length>0 && ((t_args[0])!=null)){
		t_arg0=t_args[0].p_Trans();
	}
	if(t_args.length>1 && ((t_args[1])!=null)){
		t_arg1=t_args[1].p_Trans();
	}
	if(t_args.length>2 && ((t_args[2])!=null)){
		t_arg2=t_args[2].p_Trans();
	}
	var t_id=t_decl.m_munged.slice(1);
	var t_1=t_id;
	if(t_1=="print"){
		return "print"+this.p_Bra(t_arg0);
	}else{
		if(t_1=="error"){
			return "error"+this.p_Bra(t_arg0);
		}else{
			if(t_1=="debuglog"){
				return "debugLog"+this.p_Bra(t_arg0);
			}else{
				if(t_1=="debugstop"){
					return "debugStop()";
				}else{
					if(t_1=="length"){
						return t_texpr+".length";
					}else{
						if(t_1=="resize"){
							var t_ty=object_downcast((t_expr.m_exprType),c_ArrayType).m_elemType;
							if((object_downcast((t_ty),c_BoolType))!=null){
								return "resize_bool_array"+this.p_Bra(t_texpr+","+t_arg0);
							}
							if((object_downcast((t_ty),c_NumericType))!=null){
								return "resize_number_array"+this.p_Bra(t_texpr+","+t_arg0);
							}
							if((object_downcast((t_ty),c_StringType))!=null){
								return "resize_string_array"+this.p_Bra(t_texpr+","+t_arg0);
							}
							if((object_downcast((t_ty),c_ArrayType))!=null){
								return "resize_array_array"+this.p_Bra(t_texpr+","+t_arg0);
							}
							if((object_downcast((t_ty),c_ObjectType))!=null){
								return "resize_object_array"+this.p_Bra(t_texpr+","+t_arg0);
							}
							bb_config_InternalErr("Internal error");
						}else{
							if(t_1=="compare"){
								return "string_compare"+this.p_Bra(t_texpr+","+t_arg0);
							}else{
								if(t_1=="find"){
									return t_texpr+".indexOf"+this.p_Bra(t_arg0+","+t_arg1);
								}else{
									if(t_1=="findlast"){
										return t_texpr+".lastIndexOf"+this.p_Bra(t_arg0);
									}else{
										if(t_1=="findlast2"){
											return t_texpr+".lastIndexOf"+this.p_Bra(t_arg0+","+t_arg1);
										}else{
											if(t_1=="trim"){
												return "string_trim"+this.p_Bra(t_texpr);
											}else{
												if(t_1=="join"){
													return t_arg0+".join"+this.p_Bra(t_texpr);
												}else{
													if(t_1=="split"){
														return t_texpr+".split"+this.p_Bra(t_arg0);
													}else{
														if(t_1=="replace"){
															return "string_replace"+this.p_Bra(t_texpr+","+t_arg0+","+t_arg1);
														}else{
															if(t_1=="tolower"){
																return t_texpr+".toLowerCase()";
															}else{
																if(t_1=="toupper"){
																	return t_texpr+".toUpperCase()";
																}else{
																	if(t_1=="contains"){
																		return this.p_Bra(t_texpr+".indexOf"+this.p_Bra(t_arg0)+"!=-1");
																	}else{
																		if(t_1=="startswith"){
																			return "string_startswith"+this.p_Bra(t_texpr+","+t_arg0);
																		}else{
																			if(t_1=="endswith"){
																				return "string_endswith"+this.p_Bra(t_texpr+","+t_arg0);
																			}else{
																				if(t_1=="tochars"){
																					return "string_tochars"+this.p_Bra(t_texpr);
																				}else{
																					if(t_1=="fromchar"){
																						return "String.fromCharCode"+this.p_Bra(t_arg0);
																					}else{
																						if(t_1=="fromchars"){
																							return "string_fromchars"+this.p_Bra(t_arg0);
																						}else{
																							if(t_1=="sin" || t_1=="cos" || t_1=="tan"){
																								return "Math."+t_id+this.p_Bra(this.p_Bra(t_arg0)+"*D2R");
																							}else{
																								if(t_1=="asin" || t_1=="acos" || t_1=="atan"){
																									return this.p_Bra("Math."+t_id+this.p_Bra(t_arg0)+"*R2D");
																								}else{
																									if(t_1=="atan2"){
																										return this.p_Bra("Math."+t_id+this.p_Bra(t_arg0+","+t_arg1)+"*R2D");
																									}else{
																										if(t_1=="sinr" || t_1=="cosr" || t_1=="tanr"){
																											return "Math."+t_id.slice(0,-1)+this.p_Bra(t_arg0);
																										}else{
																											if(t_1=="asinr" || t_1=="acosr" || t_1=="atanr"){
																												return "Math."+t_id.slice(0,-1)+this.p_Bra(t_arg0);
																											}else{
																												if(t_1=="atan2r"){
																													return "Math."+t_id.slice(0,-1)+this.p_Bra(t_arg0+","+t_arg1);
																												}else{
																													if(t_1=="sqrt" || t_1=="floor" || t_1=="ceil" || t_1=="log" || t_1=="exp"){
																														return "Math."+t_id+this.p_Bra(t_arg0);
																													}else{
																														if(t_1=="pow"){
																															return "Math."+t_id+this.p_Bra(t_arg0+","+t_arg1);
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	bb_config_InternalErr("Internal error");
	return "";
}
function bb_webcc_MatchPathAlt(t_text,t_alt){
	if(!(t_alt.indexOf("*")!=-1)){
		return t_alt==t_text;
	}
	var t_Bits=t_alt.split("*");
	if(!string_startswith(t_text,t_Bits[0])){
		return false;
	}
	var t_n=t_Bits.length-1;
	var t_i=t_Bits[0].length;
	for(var t_j=1;t_j<t_n;t_j=t_j+1){
		var t_bit=t_Bits[t_j];
		t_i=t_text.indexOf(t_bit,t_i);
		if(t_i==-1){
			return false;
		}
		t_i+=t_bit.length;
	}
	return string_endswith(t_text.slice(t_i),t_Bits[t_n]);
}
function bb_webcc_MatchPath(t_text,t_pattern){
	t_text="/"+t_text;
	var t_alts=t_pattern.split("|");
	var t_match=false;
	var t_=t_alts;
	var t_2=0;
	while(t_2<t_.length){
		var t_alt=t_[t_2];
		t_2=t_2+1;
		if(!((t_alt).length!=0)){
			continue;
		}
		if(string_startswith(t_alt,"!")){
			if(bb_webcc_MatchPathAlt(t_text,t_alt.slice(1))){
				return false;
			}
		}else{
			if(bb_webcc_MatchPathAlt(t_text,t_alt)){
				t_match=true;
			}
		}
	}
	return t_match;
}
function c_NodeEnumerator3(){
	Object.call(this);
	this.m_node=null;
}
c_NodeEnumerator3.m_new=function(t_node){
	this.m_node=t_node;
	return this;
}
c_NodeEnumerator3.m_new2=function(){
	return this;
}
c_NodeEnumerator3.prototype.p_HasNext=function(){
	return this.m_node!=null;
}
c_NodeEnumerator3.prototype.p_NextObject=function(){
	var t_t=this.m_node;
	this.m_node=this.m_node.p_NextNode();
	return t_t;
}
var bb_jshtml5_Info_Width=0;
var bb_jshtml5_Info_Height=0;
function bb_jshtml5_OpenInputStream(t_path){
	var t_rawData=__os_LoadArray(RealPath(t_path));
	var t_buffer=c_DataBuffer.m_new.call(new c_DataBuffer,t_rawData.length,false);
	t_buffer.p_PokeBytes(0,t_rawData,0,t_rawData.length);
	var t_S=c_DataStream.m_new.call(new c_DataStream,t_buffer,0);
	return (t_S);
}
function bb_jshtml5_GetInfo_PNG(t_path){
	var t_f=bb_jshtml5_OpenInputStream(t_path);
	if((t_f)!=null){
		var t_data=c_DataBuffer.m_new.call(new c_DataBuffer,32,false);
		var t_n=t_f.p_Read(t_data,0,24);
		t_f.p_Close();
		if(t_n==24 && t_data.PeekByte(1)==80 && t_data.PeekByte(2)==78 && t_data.PeekByte(3)==71){
			bb_jshtml5_Info_Width=(t_data.PeekByte(16)&255)<<24|(t_data.PeekByte(17)&255)<<16|(t_data.PeekByte(18)&255)<<8|t_data.PeekByte(19)&255;
			bb_jshtml5_Info_Height=(t_data.PeekByte(20)&255)<<24|(t_data.PeekByte(21)&255)<<16|(t_data.PeekByte(22)&255)<<8|t_data.PeekByte(23)&255;
			return 0;
		}
	}
	return -1;
}
function bb_jshtml5_GetInfo_JPG(t_path){
	var t_f=bb_jshtml5_OpenInputStream(t_path);
	if((t_f)!=null){
		var t_buf=c_DataBuffer.m_new.call(new c_DataBuffer,32,false);
		if(t_f.p_Read(t_buf,0,2)==2 && (t_buf.PeekByte(0)&255)==255 && (t_buf.PeekByte(1)&255)==216){
			do{
				while(t_f.p_Read(t_buf,0,1)==1 && (t_buf.PeekByte(0)&255)!=255){
				}
				if((t_f.p_Eof())!=0){
					break;
				}
				while(t_f.p_Read(t_buf,0,1)==1 && (t_buf.PeekByte(0)&255)==255){
				}
				if((t_f.p_Eof())!=0){
					break;
				}
				var t_marker=t_buf.PeekByte(0)&255;
				var t_1=t_marker;
				if(t_1==208 || t_1==209 || t_1==210 || t_1==211 || t_1==212 || t_1==213 || t_1==214 || t_1==215 || t_1==216 || t_1==217 || t_1==0 || t_1==255){
					continue;
				}
				if(t_f.p_Read(t_buf,0,2)!=2){
					break;
				}
				var t_datalen=((t_buf.PeekByte(0)&255)<<8|t_buf.PeekByte(1)&255)-2;
				var t_2=t_marker;
				if(t_2==192 || t_2==193 || t_2==194 || t_2==195){
					if(((t_datalen)!=0) && t_f.p_Read(t_buf,0,5)==5){
						var t_bpp=t_buf.PeekByte(0)&255;
						bb_jshtml5_Info_Width=(t_buf.PeekByte(3)&255)<<8|t_buf.PeekByte(4)&255;
						bb_jshtml5_Info_Height=(t_buf.PeekByte(1)&255)<<8|t_buf.PeekByte(2)&255;
						t_f.p_Close();
						return 0;
					}
				}
				var t_pos=t_f.p_Position()+t_datalen;
				if(t_f.p_Seek(t_pos)!=t_pos){
					break;
				}
			}while(!(false));
		}
		t_f.p_Close();
	}
	return -1;
}
function bb_jshtml5_GetInfo_GIF(t_path){
	var t_f=bb_jshtml5_OpenInputStream(t_path);
	if((t_f)!=null){
		var t_data=c_DataBuffer.m_new.call(new c_DataBuffer,32,false);
		var t_n=t_f.p_Read(t_data,0,10);
		t_f.p_Close();
		if(t_n==10 && t_data.PeekByte(0)==71 && t_data.PeekByte(1)==73 && t_data.PeekByte(2)==70){
			bb_jshtml5_Info_Width=(t_data.PeekByte(7)&255)<<8|t_data.PeekByte(6)&255;
			bb_jshtml5_Info_Height=(t_data.PeekByte(9)&255)<<8|t_data.PeekByte(8)&255;
			return 0;
		}
	}
	return -1;
}
function bb_webcc_ReplaceBlock(t_text,t_tag,t_repText,t_mark){
	var t_beginTag=t_mark+"${"+t_tag+"_BEGIN}";
	var t_i=t_text.indexOf(t_beginTag,0);
	if(t_i==-1){
		bb_webcc_Die("Error updating target project - can't find block begin tag '"+t_tag+"'. You may need to delete target .build directory.",-1);
	}
	t_i+=t_beginTag.length;
	while(t_i<t_text.length && t_text.charCodeAt(t_i-1)!=10){
		t_i+=1;
	}
	var t_endTag=t_mark+"${"+t_tag+"_END}";
	var t_i2=t_text.indexOf(t_endTag,t_i-1);
	if(t_i2==-1){
		bb_webcc_Die("Error updating target project - can't find block end tag '"+t_tag+"'.",-1);
	}
	if(!((t_repText).length!=0) || t_repText.charCodeAt(t_repText.length-1)==10){
		t_i2+=1;
	}
	return t_text.slice(0,t_i)+t_repText+t_text.slice(t_i2);
}
function bb_config_Enquote(t_str,t_lang){
	var t_1=t_lang;
	if(t_1=="cpp" || t_1=="java" || t_1=="as" || t_1=="js" || t_1=="cs"){
		t_str=string_replace(t_str,"\\","\\\\");
		t_str=string_replace(t_str,"\"","\\\"");
		t_str=string_replace(t_str,"\n","\\n");
		t_str=string_replace(t_str,"\r","\\r");
		t_str=string_replace(t_str,"\t","\\t");
		for(var t_i=0;t_i<t_str.length;t_i=t_i+1){
			if(t_str.charCodeAt(t_i)>=32 && t_str.charCodeAt(t_i)<128){
				continue;
			}
			var t_t="";
			var t_n=t_str.charCodeAt(t_i);
			while((t_n)!=0){
				var t_c=(t_n&15)+48;
				if(t_c>=58){
					t_c+=39;
				}
				t_t=String.fromCharCode(t_c)+t_t;
				t_n=t_n>>4&268435455;
			}
			if(!((t_t).length!=0)){
				t_t="0";
			}
			var t_2=t_lang;
			if(t_2=="cpp"){
				t_t="\" L\"\\x"+t_t+"\" L\"";
			}else{
				t_t="\\u"+("0000"+t_t).slice(-4);
			}
			t_str=t_str.slice(0,t_i)+t_t+t_str.slice(t_i+1);
			t_i+=t_t.length-1;
		}
		var t_3=t_lang;
		if(t_3=="cpp"){
			t_str="L\""+t_str+"\"";
		}else{
			t_str="\""+t_str+"\"";
		}
		return t_str;
	}
	bb_config_InternalErr("Internal error");
	return "";
}
function c_List9(){
	Object.call(this);
	this.m__head=(c_HeadNode9.m_new.call(new c_HeadNode9));
}
c_List9.m_new=function(){
	return this;
}
c_List9.prototype.p_AddLast9=function(t_data){
	return c_Node16.m_new.call(new c_Node16,this.m__head,this.m__head.m__pred,t_data);
}
c_List9.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast9(t_t);
	}
	return this;
}
c_List9.prototype.p_IsEmpty=function(){
	return this.m__head.m__succ==this.m__head;
}
c_List9.prototype.p_RemoveLast=function(){
	var t_data=this.m__head.m__pred.m__data;
	this.m__head.m__pred.p_Remove();
	return t_data;
}
c_List9.prototype.p_Equals4=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_List9.prototype.p_FindLast7=function(t_value,t_start){
	while(t_start!=this.m__head){
		if(this.p_Equals4(t_value,t_start.m__data)){
			return t_start;
		}
		t_start=t_start.m__pred;
	}
	return null;
}
c_List9.prototype.p_FindLast8=function(t_value){
	return this.p_FindLast7(t_value,this.m__head.m__pred);
}
c_List9.prototype.p_RemoveLast5=function(t_value){
	var t_node=this.p_FindLast8(t_value);
	if((t_node)!=null){
		t_node.p_Remove();
	}
}
function c_Node16(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node16.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node16.m_new2=function(){
	return this;
}
c_Node16.prototype.p_Remove=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode9(){
	c_Node16.call(this);
}
c_HeadNode9.prototype=extend_class(c_Node16);
c_HeadNode9.m_new=function(){
	c_Node16.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Enumerator7(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator7.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator7.m_new2=function(){
	return this;
}
c_Enumerator7.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator7.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_InvokeExpr(){
	c_Expr.call(this);
	this.m_decl=null;
	this.m_args=[];
}
c_InvokeExpr.prototype=extend_class(c_Expr);
c_InvokeExpr.m_new=function(t_decl,t_args){
	c_Expr.m_new.call(this);
	this.m_decl=t_decl;
	this.m_args=t_args;
	return this;
}
c_InvokeExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_InvokeExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_exprType=this.m_decl.m_retType;
	this.m_args=this.p_CastArgs(this.m_args,this.m_decl);
	return (this);
}
c_InvokeExpr.prototype.p_ToString=function(){
	var t_t="InvokeExpr("+this.m_decl.p_ToString();
	var t_=this.m_args;
	var t_2=0;
	while(t_2<t_.length){
		var t_arg=t_[t_2];
		t_2=t_2+1;
		t_t=t_t+(","+t_arg.p_ToString());
	}
	return t_t+")";
}
c_InvokeExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransInvokeExpr(this);
}
c_InvokeExpr.prototype.p_TransStmt=function(){
	return bb_translator__trans.p_TransInvokeExpr(this);
}
function c_StmtExpr(){
	c_Expr.call(this);
	this.m_stmt=null;
	this.m_expr=null;
}
c_StmtExpr.prototype=extend_class(c_Expr);
c_StmtExpr.m_new=function(t_stmt,t_expr){
	c_Expr.m_new.call(this);
	this.m_stmt=t_stmt;
	this.m_expr=t_expr;
	return this;
}
c_StmtExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_StmtExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	this.m_stmt.p_Semant();
	this.m_expr=this.m_expr.p_Semant();
	this.m_exprType=this.m_expr.m_exprType;
	return (this);
}
c_StmtExpr.prototype.p_Copy=function(){
	return (c_StmtExpr.m_new.call(new c_StmtExpr,this.m_stmt,this.p_CopyExpr(this.m_expr)));
}
c_StmtExpr.prototype.p_ToString=function(){
	return "StmtExpr(,"+this.m_expr.p_ToString()+")";
}
c_StmtExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransStmtExpr(this);
}
function c_MemberVarExpr(){
	c_Expr.call(this);
	this.m_expr=null;
	this.m_decl=null;
}
c_MemberVarExpr.prototype=extend_class(c_Expr);
c_MemberVarExpr.m_new=function(t_expr,t_decl){
	c_Expr.m_new.call(this);
	this.m_expr=t_expr;
	this.m_decl=t_decl;
	return this;
}
c_MemberVarExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_MemberVarExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	if(!((this.m_decl.p_IsSemanted())!=0)){
		bb_config_InternalErr("Internal error");
	}
	this.m_exprType=this.m_decl.m_type;
	return (this);
}
c_MemberVarExpr.prototype.p_ToString=function(){
	return "MemberVarExpr("+this.m_expr.p_ToString()+","+this.m_decl.p_ToString()+")";
}
c_MemberVarExpr.prototype.p_SideEffects=function(){
	return this.m_expr.p_SideEffects();
}
c_MemberVarExpr.prototype.p_SemantSet=function(t_op,t_rhs){
	return this.p_Semant();
}
c_MemberVarExpr.prototype.p_Trans=function(){
	return bb_translator__trans.p_TransMemberVarExpr(this);
}
c_MemberVarExpr.prototype.p_TransVar=function(){
	return bb_translator__trans.p_TransMemberVarExpr(this);
}
function c_VarExpr(){
	c_Expr.call(this);
	this.m_decl=null;
}
c_VarExpr.prototype=extend_class(c_Expr);
c_VarExpr.m_new=function(t_decl){
	c_Expr.m_new.call(this);
	this.m_decl=t_decl;
	return this;
}
c_VarExpr.m_new2=function(){
	c_Expr.m_new.call(this);
	return this;
}
c_VarExpr.prototype.p_Semant=function(){
	if((this.m_exprType)!=null){
		return (this);
	}
	if(!((this.m_decl.p_IsSemanted())!=0)){
		bb_config_InternalErr("Internal error");
	}
	this.m_exprType=this.m_decl.m_type;
	return (this);
}
c_VarExpr.prototype.p_ToString=function(){
	return "VarExpr("+this.m_decl.p_ToString()+")";
}
c_VarExpr.prototype.p_SideEffects=function(){
	return false;
}
c_VarExpr.prototype.p_SemantSet=function(t_op,t_rhs){
	return this.p_Semant();
}
c_VarExpr.prototype.p_Trans=function(){
	this.p_Semant();
	return bb_translator__trans.p_TransVarExpr(this);
}
c_VarExpr.prototype.p_TransVar=function(){
	this.p_Semant();
	return bb_translator__trans.p_TransVarExpr(this);
}
var bb_decl__loopnest=0;
function c_Map8(){
	Object.call(this);
	this.m_root=null;
}
c_Map8.m_new=function(){
	return this;
}
c_Map8.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map8.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map8.prototype.p_Get2=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
c_Map8.prototype.p_RotateLeft8=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map8.prototype.p_RotateRight8=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map8.prototype.p_InsertFixup8=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft8(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight8(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight8(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft8(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map8.prototype.p_Set8=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node17.m_new.call(new c_Node17,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup8(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
function c_StringMap8(){
	c_Map8.call(this);
}
c_StringMap8.prototype=extend_class(c_Map8);
c_StringMap8.m_new=function(){
	c_Map8.m_new.call(this);
	return this;
}
c_StringMap8.prototype.p_Compare=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_Node17(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node17.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node17.m_new2=function(){
	return this;
}
function c_Map9(){
	Object.call(this);
	this.m_root=null;
}
c_Map9.m_new=function(){
	return this;
}
c_Map9.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map9.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map9.prototype.p_Contains=function(t_key){
	return this.p_FindNode(t_key)!=null;
}
c_Map9.prototype.p_RotateLeft9=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map9.prototype.p_RotateRight9=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map9.prototype.p_InsertFixup9=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft9(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight9(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight9(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft9(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map9.prototype.p_Set9=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node18.m_new.call(new c_Node18,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup9(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
function c_StringMap9(){
	c_Map9.call(this);
}
c_StringMap9.prototype=extend_class(c_Map9);
c_StringMap9.m_new=function(){
	c_Map9.m_new.call(this);
	return this;
}
c_StringMap9.prototype.p_Compare=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_Node18(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node18.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node18.m_new2=function(){
	return this;
}
function c_Map10(){
	Object.call(this);
	this.m_root=null;
}
c_Map10.m_new=function(){
	return this;
}
c_Map10.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map10.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map10.prototype.p_Get2=function(t_key){
	var t_node=this.p_FindNode(t_key);
	if((t_node)!=null){
		return t_node.m_value;
	}
	return null;
}
c_Map10.prototype.p_RotateLeft10=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map10.prototype.p_RotateRight10=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map10.prototype.p_InsertFixup10=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft10(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight10(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight10(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft10(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map10.prototype.p_Set10=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node19.m_new.call(new c_Node19,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup10(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
function c_StringMap10(){
	c_Map10.call(this);
}
c_StringMap10.prototype=extend_class(c_Map10);
c_StringMap10.m_new=function(){
	c_Map10.m_new.call(this);
	return this;
}
c_StringMap10.prototype.p_Compare=function(t_lhs,t_rhs){
	return string_compare(t_lhs,t_rhs);
}
function c_Node19(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node19.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node19.m_new2=function(){
	return this;
}
function c_Enumerator8(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator8.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator8.m_new2=function(){
	return this;
}
c_Enumerator8.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator8.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function bbInit(){
	c_Stack2.m_NIL=null;
	c_Stack.m_NIL="";
	c_Stream.m__tmp=c_DataBuffer.m_new.call(new c_DataBuffer,4096,false);
	bb_virtualos___OS_Env=c_StringMap.m_new.call(new c_StringMap);
	c_Type.m_stringType=c_StringType.m_new.call(new c_StringType);
	bb_config__errInfo="";
	bb_config__cfgScope=c_ConfigScope.m_new.call(new c_ConfigScope);
	c_Deque.m_NIL="";
	bb_config__cfgScopeStack=c_Stack4.m_new.call(new c_Stack4);
	bb_decl__env=null;
	bb_decl__envStack=c_List.m_new.call(new c_List);
	c_Toker.m__keywords=null;
	c_Toker.m__symbols=null;
	bb_parser_FILE_EXT="monkey";
	bb_config_ENV_MODPATH="";
	bb_config_ENV_SAFEMODE=0;
	c_Type.m_intType=c_IntType.m_new.call(new c_IntType);
	c_Type.m_floatType=c_FloatType.m_new.call(new c_FloatType);
	c_Type.m_boolType=c_BoolType.m_new.call(new c_BoolType);
	c_Type.m_voidType=c_VoidType.m_new.call(new c_VoidType);
	c_Type.m_objectType=c_IdentType.m_new.call(new c_IdentType,"monkey.object",[]);
	c_Type.m_throwableType=c_IdentType.m_new.call(new c_IdentType,"monkey.throwable",[]);
	c_Type.m_emptyArrayType=c_ArrayType.m_new.call(new c_ArrayType,(c_Type.m_voidType));
	c_Type.m_nullObjectType=c_IdentType.m_new.call(new c_IdentType,"",[]);
	c_Stack9.m_NIL=null;
	bb_config__errStack=c_StringList.m_new2.call(new c_StringList);
	c_Stack4.m_NIL=null;
	bb_config_ENV_HOST="";
	bb_config_ENV_CONFIG="";
	bb_config_ENV_TARGET="";
	bb_config_ENV_LANG="";
	c_Stack10.m_NIL=null;
	bb_translator__trans=null;
	bb_jshtml5_Info_Width=0;
	bb_jshtml5_Info_Height=0;
	c_ClassDecl.m_nullObjectClass=c_ClassDecl.m_new.call(new c_ClassDecl,"{NULL}",1280,[],null,[]);
	bb_decl__loopnest=0;
}
//${TRANSCODE_END}
