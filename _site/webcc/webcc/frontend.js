// Frontend related code for WebCC:

// Global variable(s):

// Meta:
var __monkey_data_files_loaded = 1;

// File-system related:
var __monkey_format_suffix = ".monkey";
var __monkey_dir_suffix = ".data";

var __monkey_user_content_dir = "data/dev";
var __monkey_user_file_name = "user"; // "user.monkey", "user.data", etc.

var __monkey_user_main_file = __monkey_user_file_name + __monkey_format_suffix;		// "user.monkey"
var __monkey_user_main_dir = __monkey_user_file_name + __monkey_dir_suffix;			// "user.data"

// Functions:

// Meta:
function simulateEvent(element, var_args)
{
	if (element == null)
	{
		return;
	}
	
	var e = document.createEvent("Events"); // "MouseEvents"
	
	e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
	element.dispatchEvent(e);
}

function stripQuotes(path)
{
	var firstQuote = path.indexOf('"');

	if (firstQuote == -1)
	{
		return path;
	}

	var finalQuote = path.lastIndexOf('"');
	
	if (firstQuote == finalQuote)
	{
		return path.substring(firstQuote+1); // ..
	}

	return path.substring(firstQuote+1, finalQuote);
}

// I/O:

// This requests a file from the host using the current directory.
function requestRemoteFile(url, type, callback)
{
	var xhr = new XMLHttpRequest();
	
	xhr.open("GET", url);
	xhr.responseType = type;

	xhr.onreadystatechange = function ()
	{
		callback(xhr.response, xhr);
	}

	xhr.send();
}

function requestFileFromHost(path, type, callback)
{
	var here = window.location.pathname;
	var currentPath = here.substring(0, here.lastIndexOf("/"));

	requestRemoteFile(currentPath + "/" + path, type, callback);
}

// This requests Monkey's license from the host, and supplies it to 'callback' as a string.
function requestLicense(callback)
{
	requestFileFromHost("MONKEY_LICENSE.TXT", "text", callback);
}

// File-system related:
function getUserFileDirectory(name)
{
	var monkeyEndSymbol = ".monkey";

	var lCaseFileName = name.toLowerCase();

	if (lCaseFileName.lastIndexOf(monkeyEndSymbol) == name.length-monkeyEndSymbol.length) // - 1
	{
		return __monkey_user_content_dir;
	}
	
	return __monkey_user_content_dir + "/" + __monkey_user_main_dir;
}

function invalidUserFileName(name)
{
	return (name == (__monkey_user_main_file));
}

function displayUserFile(table, rep, size)
{
	if (table != null)
	{
		var ext = name.substring(name.lastIndexOf(".")+1).toUpperCase(); // ..

		if (ext == null)
		{
			ext = "???";
		}
		
		__monkey_data_files_loaded += 1;

		var row = table.insertRow();
		var elementID = ("__monkey_resource_" + __monkey_data_files_loaded);

		//.setAttribute("class", "removalElement");
		row.setAttribute("id", elementID);

		row.insertCell().innerHTML = "<img class='removalElement mouseClick' onclick='removeUserFileById(\""+elementID+"\");' src='style/images/remove_file.png' alt='{R}'>";
		row.insertCell().innerHTML = rep;
		row.insertCell().innerHTML = ext;
		row.insertCell().innerHTML = "<center>"+size+"</center>";
	}
}

// This removes a displayed element from its parent table.
function removeUserFile(row)
{
	if (row != null)
	{
		// Delete the file-system entry, then remove the row:
		DeleteFile(__monkey_user_content_dir + "/" + __monkey_user_main_dir + "/" + row.cells[1].innerHTML);

		row.parentElement.removeChild(row);
	}
}

function removeUserFileById(id)
{
	removeUserFile(document.getElementById(id));
}

// This initializes a hook to 'requesterId', in order to add
// elements to the internal file-system, as well as 'tableId'.
function initUserFileHook(requesterId, tableId, fail_on_no_table) // fail_on_no_table=false
{
	var fileReq = document.getElementById(requesterId);

	if (fileReq == null)
	{
		return false;
	}

	// Get a reference to the shared file-table.
	var table = document.getElementById(tableId);

	if (fail_on_no_table && table == null)
	{
		return false;
	}

	fileReq.onchange = function ()
	{
		var files = this.files;
		var filesAvailable = files.length;

		for (var i = 0; i < filesAvailable; i++)
		{
			var f = files[i];
			var name = f.name;

			if (invalidUserFileName(name))
			{
				continue;
			}

			var parentDir = getUserFileDirectory(name);

			// Asynchronously read the file into the file-system:

			// A slash is added here instead of ahead of time for easy modification if needed.
			var outPath = RealPath(parentDir + "/" + name);

			// Check if this file already exists.
			if (FileType(outPath) != FILETYPE_NONE)
			{
				continue;
			}

			var reader = new FileReader();

			reader.onloadend = function ()
			{
				var result = reader.result;

				if (result == null) // !result
				{
					return;
				}

				__os_createFileEntry(outPath, __os_ArrayBuffer_To_Native(result), false);

				// Add the file to the loaded-files list.
				displayUserFile(table, name, result.byteLength);
			}

			reader.readAsArrayBuffer(f);
		}

		// Reset our value, just in case.
		this.value = null;
	}

	// Return the default response.
	return true;
}