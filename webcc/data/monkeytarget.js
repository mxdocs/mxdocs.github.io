
// This is called initially by the default template html-file.
// Don't bother if you intend to pass arguments with JavaScript or Monkey code.
function __monkey_jstool_exec()
{
	if (typeof CFG_JSTOOL_AUTORUN !== 'undefined')
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
var __monkey_jstool_has_run_once = true;

// Functions:
function executeMonkey(appArgs)
{
	if ((typeof CFG_VIRTUALOS_IMPLEMENTED !== 'undefined') && __os_appargs != null)
	{
		__os_appargs = appArgs;
	}
	
	try
	{
		bbInit();
		
		bbMain();
		
		__monkey_jstool_has_run_once = true;
	}
	catch( ex )
	{
		if (typeof CFG_CONFIG !== 'undefined' && CFG_CONFIG === "debug")
		{
			alert("EXCEPTION CAUGHT: " + ex);
			throw ex;
		}
		
		return;
	}
	
	// Nothing else so far.
	
	return;
}
