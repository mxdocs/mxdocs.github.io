// Code found here is dedicated to the WebCC frontend/webpage, and may need to be adapted.

// This file supports the frontend, but acts as a way to route
// native code-execution to a sandboxed environment.

// Global variable(s):

// This will be the primary source-file for the user.
var __monkey_compiled_file = "main.js";
var __monkey_compiled_exec_file = "MonkeyGame.html";

// Functions:

// This initializes and executes a Monkey program at 'build_dir' named 'filename'.
// This also handles boot semantics and sandboxed-resource closure.
// Execution is sandboxed, and will be performed separately from the main context.

// The 'build_dir' argument must end with a slash,
// and 'filename' may not begin or end with a slash.
function boot(build_dir, filename)
{
	// This is used to identify and load our program. (Full path)
	var location = build_dir + filename;

	var content = document.getElementById("compiled");
	var programs = content.getElementsByTagName("iframe");

	if (!document.getElementById("__monkey_releaseFrames").checked)
	{
		// Just to be safe, release any resources attatched to 'programs':
		for (var i = 0; i < programs.length; i++)
		{
			var p = programs[i];

			if (typeof p.contentWindow.__os_destroyResources == 'function') // CFG_VIRTUALOS_IMPLEMENTED
			{
				p.contentWindow.__os_destroyResources();
			}
		}
		
		content.innerHTML = "";
	}

	// Allocate an iframe for sandboxing the user's application.
	var frame = document.createElement("iframe");
	
	// At this frame to this document before doing anything else.
	content.appendChild(frame);

	// Load the user's HTML data into our frame.
	frame.contentWindow.document.write(LoadString(build_dir + __monkey_compiled_exec_file)); // RealPath(..);

	// Load the user's main script as a string.
	var data = LoadString(location);

	// Attach the loaded script to our frame.
	attachUserScript(frame, data, __monkey_user_main_file + "_" + programs.length + ".js");

	// Prepare the frame for execution:

	// Check if our frame needs 'os', and if so, have it inherit its parent's behavior:
	if (typeof frame.contentWindow.__os_inheritParent == 'function') // CFG_VIRTUALOS_IMPLEMENTED
	{
		frame.contentWindow.__os_inheritParent();
	}
	
	// Start the program.
	frame.contentWindow.beginFrame();

	// Return the default response. (Asynchronous execution)
	return 0;
}

// This creates a script element (JavaScript) in 'frame' using 'data'.
function attachUserScript(frame, data, debugName)
{
	// Allocate a script element using 'frame'.
	var script = frame.contentWindow.document.createElement("script");

	// Set the script's type to JavaScript.
	script.type = "text/javascript";

	// Set the script's content to our file-data, with a Chromium debug-header.
	script.text = "//@ sourceURL=" + debugName + "\n" + data;

	// Attach the script to our 'frame' object.
	frame.contentWindow.document.body.appendChild(script);
	
	// Return the script for debugging purposes.
	return script;
}

// This is a bit of a hack, but we basically parse the input for the right symbols:
function __exec(cmd)
{
	// Act as "mserver" to the caller:
	if (cmd.indexOf("mserver") > -1)
	{
		var first = cmd.indexOf("\"", 1);
		var second = cmd.indexOf("\"", first+1);
		
		var slash = cmd.lastIndexOf("/");
		
		if (second > -1)
		{
			return boot(cmd.substring(second+1, slash+1), __monkey_compiled_file);
		}
	}

	return 1; // -1;
}