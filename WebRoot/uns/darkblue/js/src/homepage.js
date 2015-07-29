
function initPanleLangValue(){
	$("#sureButtonPane").text(LA("SureButton"));
	$("#cancelButtonPane").text(LA("CancelButton"));
	$("#okButtonPaneGentle").text(LA("Reboot"));
	$("#okButtonPaneForce").text(LA("Force reboot"));
}

function closeMoreMune(){
	$("#vmBox").find(".moreClass").hide();
}

function clearResourceFeedback(){
	$("#mainTopPane").hide();
}

function showMsgConfirm(title, msg){
	setLightboxTitle(title);
	setLightboxMessage(msg);
	$("#lightbox").show();
}

function redirectToSearchResults() {
	var searchTextbox = document.getElementById('searchEntry');
	var searchText;

	if (searchTextbox.className == "searchInactive") {
		return;
	} else if (searchTextbox.hasFocus) {
		searchText = searchTextbox.value;
	} else {
		searchText = currentSearchQuery;
	}
	window.location.href = "searchResults.aspx?CTX_SearchString="
			+ encodeURIComponent(searchText);
}

var currentSearchQuery = "";

function isSearchPageSelected() {
	return false;
}

function setupSearchBox() {
	var searchTextbox = document.getElementById('searchEntry');
	if (searchTextbox) {
		if (isSearchPageSelected()) {
			searchTextbox.focus();
			searchTextbox.value = currentSearchQuery;
			searchTextbox.select();
		}
	}
}

function searchTextFocus(searchTextbox) {
	searchTextbox.hasFocus = true;
	searchTextbox.value = currentSearchQuery;
	searchTextbox.select();
	updateSearchStyle(true);
}

function updateSearchStyle(isActive) {
	var searchField = document.getElementById("searchEntry");
	if (searchField) {
		if (isActive) {
			searchField.className = "";
		} else {
			// Only restore the default string "Search" when the input field is empty
			var currentValue = searchField.value;

			if (currentValue == "") {
				searchField.value = "搜索";
				searchField.className = "searchInactive";
			}
		}
	}
}

function onLoadLayout() {
	maintainAccessibility("SearchButton", true);
	setupTreeView();
	setupSearchBox();
	setFocusIfViewChanged();
	
	loadPowerDiv();
}

function loadPowerDiv(){
	$("#powerControlDiv").css("top", 365);
	$("#powerControlDiv").css("left", 590);
}

function setFocusIfViewChanged() {
	if (window.location.href.indexOf("CTX_CurrentViewStyle=") != -1) {
		var el = document.getElementById("viewButton");
		if (el != null) {
			el.focus();
		}
	}
}

var treeViewCurrentFolder = "";

function changeView(viewName) {
	var newpage = "default.aspx?CTX_CurrentViewStyle=" + viewName;
	if (isTreeView()) {
		newpage += "&CTX_CurrentFolder="
				+ encodeURIComponent(getTreeViewCurrentFolder());

		setItemInCookie("treeViewCurrentFolder", null);
	}
	location.href = newpage;
}

function setupTreeView() {
	if (isTreeView()) {

		retrieveImage(document.getElementById('treeView'));
		expandTreeViewInitialFolder();
	}
}

function toggleTreeNode(node) {
	var nodeClass = node.className;
	if (nodeClass == "folderClose") {
		openFolder(node);
		setTreeViewCurrentFolder(node, false);
	} else {
		closeFolder(node);
		setTreeViewCurrentFolder(node, true);
	}
	updateLayout();
}

function openFolder(node) {
	node.className = "folderOpen";
	node.nextSibling.style.display = 'block';
	retrieveImage(node.nextSibling);
	changeSrcOfChildImgNodes(node, "/uns/darkblue/img/FolderOpenArrowDown.gif");
}

function closeFolder(node) {
	node.className = "folderClose";
	node.nextSibling.style.display = 'none';
	changeSrcOfChildImgNodes(node, "/uns/darkblue/img/FolderClosedArrow.gif");
}

function updateMouseoverTreeNodePicture(node) {
	var nodeClass = node.className;
	if (nodeClass == "folderClose") {
		changeSrcOfChildImgNodes(node, "/uns/darkblue/img/FolderClosedArrowHover.gif");
	} else {
		changeSrcOfChildImgNodes(node, "/uns/darkblue/img/FolderOpenArrowDownHover.gif");
	}
}

function updateMouseoutTreeNodePicture(node) {
	var nodeClass = node.className;
	if (nodeClass == "folderClose") {
		changeSrcOfChildImgNodes(node, "/uns/darkblue/img/FolderClosedArrow.gif");
	} else {
		changeSrcOfChildImgNodes(node, "/uns/darkblue/img/FolderOpenArrowDown.gif");
	}
}

function changeSrcOfChildImgNodes(node, url) {
	for ( var j = 0; j < node.childNodes.length; j++) {
		var child = node.childNodes[j];
		// if it is an image tag, put the closed image in
		if (child.nodeName == "IMG") {
			child.src = url;
			break;
		}
	}
}

function retrieveImage(selectedFolder) {
	for ( var i = 0; i < selectedFolder.childNodes.length; i++) {
		var item = selectedFolder.childNodes[i];
		// Iterate through all leaf (i.e., non-folder) <li> nodes and patch up the src attribute in all descendant images.
		if (item.nodeName == "LI" && item.className != "folder") { //found a list item here
			var images = item.getElementsByTagName("IMG");
			for ( var j = 0; j < images.length; j++) {
				if (images[j].name != null
						&& images[j].className != "spinner") {
					images[j].src = images[j].name;
					break;
				}
			}
		}
	}
}

function expandTreeViewInitialFolder() {
	var currentFolderValue = getTreeViewCurrentFolder();
	var rootNode = document.getElementById("treeView");
	if ((currentFolderValue != null) && (currentFolderValue != "")) {
		expandTreeView(rootNode, currentFolderValue);
	}
}

function expandTreeView(ulElement, path) {
	if (path.indexOf("\\") == 0) { // remove the leading "\" from the path
		path = path.substring(1);
	}

	var value;
	if (path.indexOf("\\") > 0) { // gets the folder name
		value = path.substring(0, path.indexOf("\\"));
	} else {
		value = path;
	}

	if (value == "") { // just return if there are no folder components left
		return;
	}

	for ( var i = 0; i < ulElement.childNodes.length; i++) {
		var item = ulElement.childNodes[i];
		if (item.nodeName == "LI") { // found a list item here
			for ( var j = 0; j < item.childNodes.length; j++) {
				var liChildNode = item.childNodes[j];
				// If the list item is followed by an <a> tag and a <ul> tag
				// then we know that the first child of the list item is the folder name.
				if (liChildNode.nodeName == "A"
						&& (liChildNode.nextSibling != null && liChildNode.nextSibling.nodeName == "UL")) {
					// Check if the folder name matches
					if (findFolderName(liChildNode) == value) {
						openFolder(liChildNode);
						path = path.substring(path.indexOf("\\"));
						expandTreeView(liChildNode.nextSibling, path);
					}
				}
			}
		}
	}
}

function setTreeViewCurrentFolder(node, isCollapsed) {
	var currentFolder = findFolderName(node);
	var currentNode = node.parentNode.parentNode.parentNode;
	while (currentNode.nodeName == "LI") {
		for ( var j = 0; j < currentNode.childNodes.length; j++) {
			var liChildNode = currentNode.childNodes[j];
			// If the list item is followed by an <a> tag and a <ul> tag
			// then we know that the first child of the list item is the folder name.
			if (liChildNode.nodeName == "A"
					&& (liChildNode.nextSibling != null && liChildNode.nextSibling.nodeName == "UL")) {
				currentFolder = findFolderName(liChildNode) + "\\"
						+ currentFolder;
			}
		}
		currentNode = currentNode.parentNode.parentNode;
	}

	if (currentFolder != "" && isCollapsed) {

		var index = currentFolder.lastIndexOf("\\");
		if (index == -1) {
			currentFolder = "\\";
		} else {
			currentFolder = currentFolder.substring(0, index);
		}
	}
	setItemInCookie("treeViewCurrentFolder", currentFolder);
}

function findFolderName(node) {
	var currentFolder = null;
	for ( var j = 0; j < node.childNodes.length; j++) {
		var child = node.childNodes[j];
		// if it a text node (i.e. not the image node)
		// it should be the name of the folder
		if (child.nodeType == 3) {
			currentFolder = child.nodeValue;
			break;
		}
	}
	return currentFolder;
}

function isTreeView() {
	return document.getElementById('treeView') != null;
}

function getTreeViewCurrentFolder() {

	var currentFolderValue = getItemFromCookie("treeViewCurrentFolder");
	if (currentFolderValue == null || currentFolderValue == "") {
		currentFolderValue = "";
	}
	return currentFolderValue;
}

function setItemInCookie(name, value) {
	if (value == null) {
		value = "";
	}
	if ((name == null) || (name == "")) {
		return;
	}

	var newCookie = "";
	var oldCookie = getCookie("WIClientInfo");
	if (oldCookie != "") {
		var cookieItems = oldCookie.split("~");
		for (i = 0; i < cookieItems.length; i++) {
			// The name of the item will be escaped so we need to make sure
			// that we search for the escaped version.
			if (cookieItems[i].indexOf(escape(name) + "#") != 0) {
				newCookie += cookieItems[i] + "~";
			}
		}
	}

	newCookie += escape(name) + "#" + escape(value);
	storeCookie("WIClientInfo", newCookie);
}

function getItemFromCookie(name) {
	return unescape(getValueFromString(escape(name),
			getCookie("WIClientInfo"), "#", "~"));
}

function storeCookie(name, value) {
	if (value) { // non-null, non-empty
		value = "\"" + value + "\"";
	} else {
		value = "";
	}

	if (window.location.protocol.toLowerCase() == "https:") {
		value += "; secure";
	}

	var cookie = name + "=" + value;

	if ("/VDesktop/site/".indexOf('site')) {
		if ("/VDesktop/site/".indexOf('site') > 0) {
			cookie = cookie + "; path=/";
		} else {
			cookie = cookie + "; path=/VDesktop/site/";

		}
	}

	var date = new Date;
	date.setTime(date.getTime() + 7 * 24 * 3600 * 1000);

	document.cookie = cookie + ";expires=" + date.toGMTString();
}

function getCookie(name) {
	var cookie = getValueFromString(name, document.cookie, "=", ";");
	if ((cookie.charAt(0) == "\"")
			&& (cookie.charAt(cookie.length - 1) == "\"")) {
		cookie = cookie.substring(1, cookie.length - 1);
	}
	return cookie;
}

function getValueFromString(name, str, sep1, sep2) {
	var result = "";

	if (str != null) {
		var itemStart = str.indexOf(name + sep1);
		if (itemStart != -1) {
			var valueStart = itemStart + name.length + 1;
			var valueEnd = str.indexOf(sep2, valueStart);
			if (valueEnd == -1) {
				valueEnd = str.length;
			}
			result = str.substring(valueStart, valueEnd);
		}
	}

	return result;
}

try {
	document.execCommand('BackgroundImageCache', false, true);
} catch (e) {
}