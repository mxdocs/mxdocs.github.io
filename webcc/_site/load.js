// Functions:
function boot(build_dir, filename)
{
	var __transcc_execFile = "MonkeyGame.html";
	var location = build_dir + filename;
	var data = LoadString(location);

	var content = document.getElementById("compiled");

	if (!document.getElementById("__monkey_releaseFrames").checked)
	{
		//__os_safelyDeleteFileEntries(RealPath(build_dir), true);

		content.innerHTML = "";
	}

	var frame = document.createElement("iframe");

	/*
		frame.setAttribute("width", "80%");
		frame.setAttribute("height", "80%");
	*/

	frame.style.resize = "both";

	content.appendChild(frame);

	frame.contentWindow.document.write(LoadString(build_dir + __transcc_execFile)); // RealPath(..);
	
	var script = frame.contentWindow.document.createElement("script");

	script.type = "text/javascript";

	// Set the script's content to our file-data. (With a debug "header")
	script.text = "//@ sourceURL=user.monkey.js\n" + data;

	frame.contentWindow.document.body.appendChild(script);

	// Prepare the frame for execution:
	if (typeof frame.contentWindow.__os_inheritParent == 'function') // CFG_VIRTUALOS_IMPLEMENTED
	{
		frame.contentWindow.__os_inheritParent();

		/*
			var globalPos = build_dir.indexOf(__os_globalDir());
			var localDir;

			if (globalPos == 0)
			{
				localDir = build_dir.substring(globalPos+1);
				var firstSlash = localDir.indexOf("/")+1;

				localDir = localDir.substring(firstSlash);
			}
			else
			{
				localDir = build_dir;
			}

			frame.contentWindow.ChangeDir(frame.contentWindow.CurrentDir() + "/" + localDir);
		*/
	}
	
	// Start the program.
	frame.contentWindow.beginFrame();
}

function __exec(cmd)
{
	if (cmd.indexOf("mserver") > -1)
	{
		var __transcc_compiledFile = "main.js";

		var first = cmd.indexOf("\"", 1);
		var second = cmd.indexOf("\"", first+1);
		
		var slash = cmd.lastIndexOf("/");
		
		if (second > -1)
		{
			//alert("CMD: " + cmd);
			
			var build_dir = cmd.substring(second+1, slash+1);
			
			boot(build_dir, __transcc_compiledFile);

			/*
			var script = document.createElement("script");
			
			print("LOCATION: " + location);
			script.src = __os_storage["data/test.buildv85e/html5/main.js"];
			
			script.type = "text/javascript";
			document.getElementsByTagName("head")[0].appendChild(script);
			*/
		}
	}
}