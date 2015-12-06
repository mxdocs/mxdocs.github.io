// Functions:
function boot(build_dir, filename)
{
	var __transcc_execFile = "MonkeyGame.html";
	var location = build_dir + filename;
	var data = __os_storage[location];

	var content = document.getElementById("compiled");

	if (!document.getElementById("__monkey_releaseFrames").checked)
	{
		content.innerHTML = "";
	}

	var frame = document.createElement("iframe");

	//frame.setAttribute("align", "middle");

	content.appendChild(frame);

	frame.contentWindow.document.write(__os_storageLookup(build_dir + __transcc_execFile)); // RealPath(..);

	var script = frame.contentWindow.document.createElement("script");

	script.type = "text/javascript";
	script.text = data;

	frame.contentWindow.document.body.appendChild(script);

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