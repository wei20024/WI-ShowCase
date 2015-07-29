
var remoteClientToDetect = "Ica-Local";
var useJavaFallback = false;
var detectStreamingClient = "";
var serverRemoteClientVersion = "";
var serverStreamingClientVersion = "";
var defaultVer = "21.0";

var ClientInfo = {
    isIE: function() {
    	return (navigator.userAgent.indexOf("MSIE") > 0)?true:false;
    },
    isFirefox: function() {
    	return (navigator.userAgent.indexOf("Firefox") > 0)?true:false;
    },
    isNetscape: function() {
    	return (navigator.userAgent.indexOf("Netscape") > 0)?true:false;
    },
    isSafari: function() {
    	return (navigator.userAgent.indexOf("Safari") > 0)?true:false;
    },
    isWindows: function() {
    	return (navigator.userAgent.indexOf("Windows",0) != -1)?true:false;
    },
    isWinCE: function() {
    	return false;
    },
    isMacOSX: function() {
    	return (navigator.userAgent.indexOf("MacOSX",0) != -1)?true:false;
    },
    isSymbian: function() {
    	return false;
    }
};

var DetectionUtils = {
    _popupsEnabled: null,
    popupsEnabled: function() {
        if (DetectionUtils._popupsEnabled != null) {
            return DetectionUtils._popupsEnabled;
        }
        try {
            var popup = window.open("","testwindow","height=1,width=1,scrollbars=no,status=no,resizable=no,toolbar=no");
            if (popup != null) {
                popup.close();
                DetectionUtils._popupsEnabled = true;
                return true;
            }
        } catch(e) {}
        DetectionUtils._popupsEnabled = false;
        return false;
    }
};

var _CitrixClient = {
    init: function(mimeType) {
        if (ClientInfo.isNetscape() || ClientInfo.isFirefox() || (ClientInfo.isMacOSX() && ClientInfo.isSafari())) {
            if (_CitrixClient.isInstalled(null, mimeType)) {
                var hiddenDiv = document.getElementById("hiddenDiv");
                hiddenDiv.innerHTML = "<embed type='" + mimeType + "' hidden='true' name='IcaObj' id='IcaObj'></embed>";
            }
        }
    },
    isInstalled: function(activeX, mimeType) {
        if (ClientInfo.isWinCE() || ClientInfo.isSymbian()) {
            return true; // We can't tell or install it if we could
        }
        if (ClientInfo.isIE() && ClientInfo.isWindows()) {
            try {
                var obj = new ActiveXObject(activeX);
                if (obj) {
                    return true;
                }
            } catch (e) {}
            return false;
        }
        if (ClientInfo.isNetscape() || ClientInfo.isFirefox() || (ClientInfo.isMacOSX() && ClientInfo.isSafari())) {
            var found = false;
            navigator.plugins.refresh(false);
            for (var idx = 0; (!found) && (idx < navigator.plugins.length); idx++) {
                var plugIn = navigator.plugins[idx];
                var mimeCount = plugIn.length;
                for (mimeIdx = 0; (!found) && (mimeIdx < mimeCount); mimeIdx++) {
                    if (plugIn[mimeIdx].type == mimeType) {
                        found = true;
                    }
                }
            }
            return found;
        }
        return false;
    },
    isCorrectZone: function(activeX) {
        if (ClientInfo.isIE() && ClientInfo.isWindows()) {
            try {
                var obj = new ActiveXObject(activeX);
                if (obj != null) {
                    obj.Launch = true;
                    var propertyChanged = obj.Launch;
                    if (propertyChanged) {
                        return true;
                    }
                 }
            } catch (e) {
            }
            return false;
        }
        return true; // Zone doesn't matter on non-IE browsers
    },
    getVersion: function(activeX) {
        // Only call if native is detected
        if (ClientInfo.isIE() && ClientInfo.isWindows()) {
            try {
                var obj = new ActiveXObject(activeX);
                if (obj != null) {
                    var version = obj.ClientVersion;
                    if (version != null && version != "") {
                        return version;
                    }
                }
            } catch (e) {
            }
            return null;
        }
        if (ClientInfo.isNetscape() || ClientInfo.isFirefox() || (ClientInfo.isMacOSX() && ClientInfo.isSafari())) {
            try {
                var version = document.IcaObj.GetPropValue("ClientVersion");
                if (version != null && version != "") {
                    return version;
                }
            } catch (e) {}
            return null;
        }
        return null; // No version found
    },
    isPassThrough: function(activeX) {
        if (ClientInfo.isWindows()) {
            // Pass-through mode is only relevant for Windows OSes
            if (ClientInfo.isIE()) {
                // Use ActiveX for IE
                try {
                    var obj = new ActiveXObject(activeX);
                    return obj.IsPassThrough();
                } catch (e) {}
                return null;
            } else if (ClientInfo.isNetscape() || ClientInfo.isFirefox()) {
                // Use the browser plug-in
                try {
                    return document.IcaObj.IsPassThrough();
                } catch (e) {}
                return null;
            } else {
                // For other Windows browsers, assume pass-through to disable workspace control
                return true;
            }
        } else {
            // Non-Windows OS - this will never be pass-through
            return false;
        }
    }
};

var ICA = {
    _mimeType: "application/x-ica",
    _activeX: "Citrix.ICAClient",
    init: function() {
        _CitrixClient.init(ICA._mimeType);
    },
    isInstalled: function() {
        return _CitrixClient.isInstalled(ICA._activeX, ICA._mimeType);
    },
    isCorrectZone: function() {
        return _CitrixClient.isCorrectZone(ICA._activeX);
    },
    getVersion: function() {
        return _CitrixClient.getVersion(ICA._activeX);
    },
    isPassThrough: function() {
        return _CitrixClient.isPassThrough(ICA._activeX);
    },
    getDetails: function() {
        var result = {
            available: null,
            detected: null,
            version: null,
            correctZone: null,
            passthrough: null
        };
        ICA.init();
        result.detected = ICA.isInstalled();
        result.available = result.detected;
        if (result.available) {
            result.correctZone = ICA.isCorrectZone();
            result.version = ICA.getVersion();
            result.passthrough = ICA.isPassThrough();
        }
        return result;
    }
};

var Streaming = {
    _mimeType: "application/x-ctxrade",
    _activeX: "Rco.RadeClient",
    init: function() {
        _CitrixClient.init(Streaming._mimeType);
    },
    isInstalled: function() {
        return _CitrixClient.isInstalled(Streaming._activeX, Streaming._mimeType);
    },
    isCorrectZone: function() {
        return _CitrixClient.isCorrectZone(Streaming._activeX);
    },
    getVersion: function() {
        var version = _CitrixClient.getVersion(Streaming._activeX);
        if (version != null && version.indexOf("4.5.") == 0) {
            version = "1.0.0.0";
        }
        return version;
    },
    getDetails: function() {
        var result = {
            available: null,
            detected: null,
            correctZone: null,
            version: null
        };
        Streaming.init();
        result.detected = Streaming.isInstalled();
        result.correctZone = Streaming.isCorrectZone();
        result.available = result.detected && result.correctZone;
        if (result.available) {
            result.version = Streaming.getVersion();
        }
        return result;
    }
};

var Java = {
    init: function() {
        if (ClientInfo.isIE()) {
            document.body.id = 'oClientCaps';
            document.body.style.behavior = 'url(#default#clientCaps)';
        }
    },
    isInstalled: function() {
        if (ClientInfo.isIE()) {
            try {
                if (oClientCaps) {
                    var installed = oClientCaps.isComponentInstalled("{08B0E5C0-4FCB-11CF-AAA5-00401C608500}", "ComponentID");
                    return installed && oClientCaps.javaEnabled;
                }
            } catch (e) {}
            return false;
        }
        if (ClientInfo.isNetscape() || ClientInfo.isFirefox()) {
            if (navigator.plugins) {
               navigator.plugins.refresh(false);
               // Check to find a java plugin
               for (var i=0; i < navigator.plugins.length; i++) {
                    var plugin = navigator.plugins[i];
                    if (plugin && plugin.name.toLowerCase().indexOf('java') != -1) {
                        // Check if this java plugin has a mime type for applets
                        for (var j=0; j < plugin.length; j++) {
                            var mimetype = plugin[j];
                            if (mimetype && mimetype.type && mimetype.type.toLowerCase().indexOf('java-applet') != -1) {
                                return true; // We have java applet support
                            }
                        }
                    }
                }
            }
        }
        try {
            if (navigator && navigator.javaEnabled) {
                return navigator.javaEnabled();
            }
        } catch(e) {}
        return false;
    },
    getDetails: function() {
        var result = {
            available: null,
            javaInstalled: null,
            popupsEnabled: null
        };
        Java.init();
        result.javaInstalled = Java.isInstalled();
        result.popupsEnabled = DetectionUtils.popupsEnabled();
        result.available = result.javaInstalled && result.popupsEnabled;
        return result;
    }
};

var RDP = {
    _classID: "4EB89FF4-7F78-4A0F-8B8D-2BF02E94E4B2", // RDP 6.0
    getClassID: function() {
        try {
            rdpClient = new ActiveXObject("MsRdp.MsRdp.5");
            if (rdpClient != null) {
                return RDP._classID;
            }
        } catch (e) {}
        return null;
    },
    isCorrectZone: function() {
        var hiddenDiv = document.getElementById("hiddenDiv");
        hiddenDiv.innerHTML = "<object classid=clsid:" + RDP._classID + " id='rdpobj' height='0' width='0' border='0'></object>";
        if (document.rdpobj != null) {
            if (document.rdpobj.SecuredSettingsEnabled) {
                return true;
            }
        }
        return false;
    },
    getDetails: function() {
        var result = {
            available: null,
            classID: null,
            correctZone: null
        };
        result.classID = RDP.getClassID();
        result.correctZone = RDP.isCorrectZone();
        result.available = result.classID && result.correctZone;
        return result;
    }
};

var SilentDetection = {
    run: function () {
        var client;
        var correctZone = true;
        var canUpgradeRemote = false;
        var result = {
            remoteClient: "",
            streamingClient: "",
            icoStatus: "IcoNotDetected",
            rdpClassId: null
        };

        // Always use ICO to determine whether this is a pass-through session
        client = ICA.getDetails();
        if (client.available && (client.passthrough != null)) {
            result.icoStatus = client.passthrough ? "IsPassthrough" : "IsNotPassthrough";
        }

        switch (remoteClientToDetect) {
            case "Ica-Local":
                if (client.available) {
                    result.remoteClient = "Ica-Local";
                    correctZone = client.correctZone;
                    if (client.version) {
                        canUpgradeRemote = !isUpToDateVersion(client.version, serverRemoteClientVersion);
                    }
                } else if (useJavaFallback) {
                    client = Java.getDetails();
                    if (client.available) {
                        result.remoteClient = "Ica-Java";
                    }
                }
                break;
            case "Ica-Java":
                client = Java.getDetails();
                if (client.available) {
                    result.remoteClient = "Ica-Java";
                }
                break;
            case "Rdp-Embedded":
                client = RDP.getDetails();
                if (client.available) {
                    result.remoteClient = "Rdp-Embedded";
                    correctZone = client.correctZone;
                    result.rdpClassId = client.classID;
                }
                break;
        }

        if (result.remoteClient) {
            // There is no opportunity for the user to "force" a client during silent detection
            result.remoteClient += "=Auto";

            if (canUpgradeRemote) {
                result.remoteClient += ",CanUpgrade";
            }
            if (!correctZone) {
                result.remoteClient += ",IncorrectZone";
            }
        }

        if (detectStreamingClient) {
            client = Streaming.getDetails();
            if (client.available) {
                result.streamingClient = "Rade-Local=Auto";
                if (client.version && !isUpToDateVersion(client.version, serverStreamingClientVersion)) {
                    result.streamingClient += ",CanUpgrade";
                }
            }
        }

        return result;
    }
};
//Compare two comma- or dot-separated version numbers.
//Return true if haveVersion >= wantVersion
function isUpToDateVersion(haveVersion, wantVersion) {
	var haveComponents = getVersionComponents(haveVersion);
	var wantComponents = getVersionComponents(wantVersion);

	for(var ix=0; ix<wantComponents.length; ix++) {

	    var have = ( ix<haveComponents.length ) ? parseInt(haveComponents[ix]) : 0;
	    var want = parseInt(wantComponents[ix]);
	
	    if( have > want ) {
	        return true;
	    }
	    if( have < want ) {
	        return false;
	    }
	}
	return true;
}

//Split a version number into its components.
//This function can accept a comma or dot as a separator.
function getVersionComponents(version) {
	if(version.indexOf(".") == -1) {
		return version.split(",");
	} else {
		return version.split(".");
	}
}

function compareFirefoxVision(){
	var _agent = navigator.userAgent.toLowerCase();
	var _firefox = _agent.match(/firefox\/[\d.]+/gi);
	if (_firefox) {
		var _currentVer = (_firefox+"").replace(/[^0-9.]/ig, "");
		if (_currentVer > defaultVer) {
			return false;
		}else{
			return true;
		}
	}else{
		return false;
	}
}
