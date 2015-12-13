// Frontend related code for WebCC:

// Global variable(s):

// Meta:
var __monkey_data_files_loaded = 1;
var __monkey_fileSystemInitialized = false;

var __monkey_releaseDataDir_symbol = "||__monkey_releaseDataDir||"

// Constant variable(s):

// File-system related:
var __monkey_format_suffix = ".monkey";
var __monkey_dir_suffix = ".data";

var __monkey_user_file_name = "user"; // "user.monkey", "user.data", etc.

var __monkey_user_main_file = __monkey_user_file_name + __monkey_format_suffix;		// "user.monkey"
var __monkey_user_main_dir = __monkey_user_file_name + __monkey_dir_suffix;			// "user.data"

var __monkey_user_content_dir = "data/dev";
var __monkey_user_data_dir = __monkey_user_content_dir + "/" + __monkey_user_main_dir; // "data/dev/user.data";

// Meta:
var __monkey_resource_table_reserved_entries = 1;

// Functions:

// Meta:
function __monkey_shouldReleaseDataDir()
{
	return Number(localStorage[__monkey_releaseDataDir_symbol]);
}

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
function initializeFileSystem()
{
	if (__monkey_fileSystemInitialized)
	{
		return;
	}
	
	// Initialize the file-system:
	if (!__os_hasFileSystemEncoding())
	{
		__os_setFileSystemEncoding(FILESYSTEM_ENCODING_STRING);
	}
	
	// Formally load the file-system's time-data.
	__os_load_filesystem_time_map();
	
	// Create the initial file-structure:
	var primary = __monkey_user_content_dir; // "data/dev";
	var secondary = __monkey_user_data_dir; // "data/dev/user.data";
	
	var resourceTableId = "__monkey_resource_table";
	
	if (FileType(primary) == FILETYPE_NONE)
	{
		CreateDir(primary);
		
		if (FileType(secondary) == FILETYPE_NONE)
		{
			CreateDir(secondary);
		}
		else
		{
			displayUserDir(secondary, resourceTableId);
		}
	}
	else
	{
		displayUserDir(primary, resourceTableId);
		displayUserDir(secondary, resourceTableId);
	}
	
	var useLocalStorage_element = document.getElementById("__monkey_localFiles_toggle");
	
	if (useLocalStorage_element)
	{
		if (localStorage.hasOwnProperty(__monkey_releaseDataDir_symbol))
		{
			useLocalStorage_element.checked = !__monkey_shouldReleaseDataDir();
		}
	}
	
	__monkey_fileSystemInitialized = true;
}

function deinitializeFileSystem()
{
	if (!__monkey_fileSystemInitialized)
	{
		return;
	}
	
	// Deinitialize the file-system:
	
	// Formally save the file-system's time-data.
	__os_save_filesystem_time_map();
	
	// Delete the temporary file-structure:
	var primary = __monkey_user_content_dir;
	var secondary = __monkey_user_data_dir;
	
	if (__monkey_shouldReleaseDataDir())
	{
		DeleteDir(primary, false);
		DeleteDir(secondary, true);
	}
	else
	{
		DeleteDir(primary, false);
	}
	
	__monkey_fileSystemInitialized = false;
}

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
	return ((name.length == 0) || (name == __monkey_user_main_file) || (name.indexOf(".") == -1));
}

function displayUserFile(table, rep, size)
{
	if (table != null)
	{
		var ext = name.substring(name.lastIndexOf(".")+1).toUpperCase(); // ..
		
		// If nothing else, give an "unknown type" symbol.
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

// This will display the files in 'path'. (Non-recursive)
function displayUserDir(path, tableId)
{
	var table = document.getElementById(tableId);
	var files = LoadDir(path);
	
	for (var i = 0; i < files.length; i++)
	{
		var f = files[i];
		var fullPath = path + "/" + f;
		
		// For the sake of safety, check what comes in:
		if (invalidUserFileName(f) || FileType(fullPath) != FILETYPE_FILE)
		{
			continue;
		}
		
		displayUserFile(table, f, FileSize(fullPath));
	}
}

// This removes a displayed element from its parent table.
function removeUserFile(row)
{
	if (row != null)
	{
		// Delete the file-system entry, then remove the row:
		DeleteFile(getUserFileDirectory("." + row.cells[2].innerHTML) + "/" + row.cells[1].innerHTML);

		row.parentElement.removeChild(row);
	}
}

function releaseUserFileDisplay(table)
{
	if (table != null)
	{
		var rows = table.rows;
		var rowCount = table.rows.length;
		
		for (var i = rowCount; i > __monkey_resource_table_reserved_entries; i--)
		{
			removeUserFile(rows[i]);
		}
	}
}

function releaseUserFileDisplayById(tableId)
{
	var table = document.getElementById(tableId);
	
	releaseUserFileDisplay(table);
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