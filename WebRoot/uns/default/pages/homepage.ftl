<!DOCTYPE html>
<html>
  <head>
    <title>Desktop@FusionAccess</title>
    <link type="image/vnd.microsoft.icon" href=${logoIco} rel="SHORTCUT ICON">
	<meta name="viewport" content="width=device-width, height=device-height,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="this is my page">
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

    <link rel="stylesheet" type="text/css" href="/uns/default/css/dashbord.css"/>
    <script src="/jslib/json2.js"></script>
   <script type="text/javascript" src="/jslib/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/jslib/jquery.cookie.js"></script>
    <script type="text/javascript" src="/uns/default/js/src/loadcss.js"></script>
    <script type="text/javascript" src="/jslib/log4javascript.js"></script>
    <script type="text/javascript" src="/uns/common/js/src/globalvar.js"></script>
    <script type="text/javascript" src="/uns/common/js/src/constantvar.js"></script>
    
     <script>
      	if (typeof (wiJsVersion) == "undefined" || wiJsVersion != "R5C20") 
      	{
					$.getScript("/uns/common/js/src/globalvar.js?"+ Math.random(), null);
					$.getScript("/uns/common/js/src/constantvar.js?"+ Math.random(), null);
					$.getScript("/uns/common/js/utils/resultCode.js?"+ Math.random(), null);
					$.getScript("/uns/common/js/language/languageService.js?"+ Math.random(), null);
					$.getScript("/uns/default/js/src/dashbord.js?"+ Math.random(), null);
					$.getScript("/uns/common/js/language/dashbordLanguage.js?"+ Math.random(), null);
					$.getScript("/uns/default/js/src/silentDetection.js?"+ Math.random(), null);
					$.getScript("/uns/common/js/utils/commonUtil.js?"+ Math.random(), null);
					document.location.reload();
		}
    </script>
    
    <script type="text/javascript" src="/uns/common/js/utils/resultCode.js"></script>
    <script type="text/javascript" src="/uns/common/js/language/languageService.js"></script>
    <script type="text/javascript" src="/uns/default/js/src/dashbord.js"></script>
    <script type="text/javascript" src="/uns/common/js/language/dashbordLanguage.js"></script>
    <script type="text/javascript" src="/uns/default/js/src/silentDetection.js"></script>
    <script type="text/javascript" src="/uns/common/js/utils/commonUtil.js"></script>
    <link rel="stylesheet" type="text/css" href="/uns/default/css/onlinehelp.css"/>
 	
    <!--[if IE 6]>
     <script type="text/javascript" src="/jslib/DD_belatedPNG.js"></script>
   <![endif]-->
   
  </head>
  
  <body style="background-image:url(${nullJpg});">
  	<div id="page">
		<div id="logo" style="background-image:url(${logoPng});"></div>
		
		<#include "hdpclientplugin.ftl"> 
		<div id="hiddenDiv"></div>
		<div style="display: block;width: 0px;height: 0px;" id="icaobjdiv"></div>
		<div id="globalTipAnchor" class="centerEle">
			<div id="globalTipArea">
				<table id="globalTipTable">
					<tr id="fireTipTr" class="globalTipContainer">
						<td>
							<span class="globaltip">
								<span id="fireTip"></span>
							</span>
						</td>
					</tr>
					<tr id="downloadClient" class="globalTipContainer">
						<td>
							<div class="yellowicon"></div>
							<span class="globaltip">
								<span id="downloadClientTip1"></span>
							</span><br/>
							<span class="globaltip">
								<span id="downloadClientTip2">Download Client</span>
								<a id="downloadClientButtion2_R21" href="../plugin/huaweiDesktop.exe">Download</a>
								<a id="downloadClientButtion2" href="../plugin/ClientSetup.exe">Download</a>
								<a id="downloadClientButtion2_Net" href="../plugin/connectTools.exe">Download</a>
							</span><br/>
							<span class="globaltip">
								<span id="downloadClientTip3"></span>
							</span>
						</td>
					</tr>
					<tr id="nosupportTip" class="globalTipContainer">
						<td>
							<span class="globaltip">
								<span id="nosupportTipText"></span>
							</span>
						</td>
					</tr>
					<tr id="warning" class="globalTipContainer">
						<td>
							<span class="globaltip">
								<span id="warningText">__Text__</span>
							</span>
						</td>
					</tr>
					<tr id="getVmListError" class="globalTipContainer">
						<td>
							<span class="globaltip">
								<span id="getVmListErrorText">__Text__</span>
							</span>
						</td>
					</tr>
					<tr id="chromeDownloadTip" class="chromeDownloadTip" style="display:none;">
						<td>
							<div class="yellowicon"></div>
							<span class="globaltip">
								<span id="chromeDownloadText"></span>
							</span>
								<a id="chromedownloadClient_R21" href="../plugin/Clients/huaweiDesktop.exe">Download</a>
								<a id="chromedownloadClient" href="../plugin/Clients/ClientSetup.exe">Download</a>
								<a id="chromedownloadClient_Net" href="../plugin/Clients/connectTools.exe">Download</a>
							<span class="globaltip">
								<span id="chromeDownloadRefTip"></span>
							</span>
						</td>
					</tr>
				</table>
			</div>
		</div>
		
	    <!-- 功能区 -->
	    <!-- 右上角齿轮 -->
	    <div id="username"></div>
	    <a id="gear" href="javascript:void(0);"></a>
	    <div id="optionArea">
	    	<a id="lang" href="javascript:void(0);" title="Language"></a>
	    	<a id="chbg" href="javascript:void(0);" title="Change Background"></a>
	    	<a id="chpsw" href="javascript:void(0);" title="Change Password"></a>
	    	<a id="logout" href="javascript:void(0);" title="Logout"></a>
	    </div>
	
		<div class="centerEle" id="vmAreaAnchor">
			<div id="vmArea">    
			    <!-- 初始桌面列表loading元素 -->
			    <div class="centerEle" id="loadingListAnchor">
			    	<div class="loading5" id="loadingList"></div>
			    </div>
	
			    <!-- 虚拟机列表 -->
			    <table id="vmListContainer">
			    	<tr id="vmList">
				    	<!-- 桌面组模板 -->
				    </tr>
			    </table>
		  	</div>
	  	</div>
	  	
	  	<div id= "messageBox" class="globalMask">
	  		<div class="globalMaskBack"></div>
	  		<div class="globalDialogAnchor centerEle">
		  		<div class="globalDialog  smallGlobalDialog" id="globalDialog">
		  			<div class="globalDialogTitle">Title</div>
		  			<a class="globalDialogClose" href="javascript:void(0);"></a>
		  			<div id="globalConfirmTipContainer">
		  				<div id="globalConfirmTipText">Text Content</div>
		  			</div>
		  			<div id="vnccheckbox" class="vncCheckbox">
		  				<input type="checkbox" id="vncTip" /><span id="vnclabel"></span>
		  			</div>
		  			<div class="globalDialogButtonsWarp" id="globalDialogButtonsWarp">
			  			<table class="globalDialogButtons">
			  				<tr>
			  					<td class="globalDialogOk globalDialogButton" align="center">
			  						<div class="globalDialogLinkWarp">
			  							<a class="globalDialogOkLink globalDialogLink" href="javascript:void(0);"></a>
			  						</div>
			  					</td>
			  					<td class="globalDialogCanncel globalDialogButton" align="center">
			  						<div class="globalDialogLinkWarp">
				  						<a class="globalDialogCanncelLink globalDialogLink" href="javascript:void(0);"></a>
				  					</div>
			  					</td>
			  					<td class="globalDialogIgnore globalDialogButton" align="center">
			  						<div class="globalDialogLinkWarp">
				  						<a class="globalDialogIgnoreLink globalDialogLink" href="javascript:void(0);"></a>
				  					</div>
			  					</td>
			  				</tr>
			  			</table>
		  			</div>
		  		</div>
	  		</div>
	  	</div>
	  	
	  	<!-- 修改语言 -->
	  	<div id= "choiceLang" class="globalMask">
	  		<div class="globalMaskBack"></div>
	  		<div class="globalDialogAnchor centerEle">
		  		<div class="globalDialog smallGlobalDialog">
		  			<div class="globalDialogTitle">Title</div>
		  			<a class="globalDialogClose" href="javascript:void(0);"></a>
					<select class="langSelector">    
						<option class="langZh" value="zh">Simplified Chinese</option>  
						<option class="langEn" value="en">English</option>				
					</select>
		  			<div class="globalDialogButtonsWarp" >
			  			<table class="globalDialogButtons">
			  				<tr>
			  					<td class="globalDialogOk globalDialogButton" align="center">
			  						<div class="globalDialogLinkWarp">
			  							<a class="globalDialogOkLink globalDialogLink" href="javascript:void(0);"></a>
			  						</div>
			  					</td>
			  					<td class="globalDialogCanncel globalDialogButton" align="center">
			  						<div class="globalDialogLinkWarp">
				  						<a class="globalDialogCanncelLink globalDialogLink" href="javascript:void(0);"></a>
				  					</div>
			  					</td>
			  				</tr>
			  			</table>
			  		</div>
		  		</div>
	  		</div>
	  	</div>
	
	  	<!-- 修改背景 -->
	  	<div id= "changeBg" class="globalMask">
	  		<div class="globalMaskBack"></div>
	  		<div class="globalDialogAnchor centerEle">
		  		<div class="globalDialog bigGlobalDialog">
		  			<div class="globalDialogTitle">Title</div>
		  			<a class="globalDialogClose" href="javascript:void(0);"></a>
					<select class="bgSelector">  
						<option class="defBg" value="/uns/default/img/null.jpg">Default</option>  
						<option class="lightBg" value="/uns/default/img/light.jpg">Light</option>  
						<option class="grassBg" value="/uns/default/img/bggrass.jpg">Grass</option>  
						<option class="seaBg" value="/uns/default/img/bgsea.jpg">Sea</option>  
					</select>
					<img class="bgPreview">	</img>
		  			<div class="globalDialogButtonsWarp" >
			  			<table class="globalDialogButtons">
			  				<tr>
			  					<td class="globalDialogOk globalDialogButton" align="center">
			  						<div class="globalDialogLinkWarp">
			  							<a class="globalDialogOkLink globalDialogLink" href="javascript:void(0);"></a>
			  						</div>
			  					</td>
			  					<td class="globalDialogCanncel globalDialogButton" align="center">
			  						<div class="globalDialogLinkWarp">
				  						<a class="globalDialogCanncelLink globalDialogLink" href="javascript:void(0);"></a>
				  					</div>
			  					</td>
			  				</tr>
			  			</table>
			  		</div>
		  		</div>
	  		</div>
	  	</div>
	
	  	<div id= "neterror" class="globalMask">
	  		<div class="globalMaskBack"></div>
	  		<div class="globalDialogAnchor centerEle">
				<div id="netErrorTipText">Text Content</div>
	  		</div>
	  	</div>
	
	  	<!-- 修改电源管理策略 -->
	  	<div id= "powerMgr" class="globalMask">
	  		<div class="globalMaskBack"></div>
	  		<div class="globalDialogAnchor centerEle">
		  		<div class="globalDialog">
		  			<div class="globalDialogTitle">Title</div>
		  			<a class="globalDialogClose" href="javascript:void(0);"></a>
					<div class="powerItemImg"></div>
					<select class="powerSelector">  
						<option class="powerNone" value="none">Forbbid automatic SHUTDOWN/RESET/SLEEP</option>  
						<option class="powerAll" value="all">Allow automatic SHUTDOWN/RESET/SLEEP</option>  
						<option class="powerSleep" value="sleep">Allow automatic SLEEP</option>  
						<option class="powerSR" value="sr">Allow automatic SHUTDOWN/RESET</option>  
					</select>
					<div class="loadingPower"></div>
	
					
		  			<div class="globalDialogButtonsWarp" >
			  			<table class="globalDialogButtons">
			  				<tr>
			  					<td class="globalDialogOk globalDialogButton" align="center">
			  						<div class="globalDialogLinkWarp">
			  							<a class="globalDialogOkLink globalDialogLink" href="javascript:void(0);"></a>
			  						</div>
			  					</td>
			  					<td class="globalDialogCanncel globalDialogButton" align="center">
			  						<div class="globalDialogLinkWarp">
				  						<a class="globalDialogCanncelLink globalDialogLink" href="javascript:void(0);"></a>
				  					</div>
			  					</td>
			  				</tr>
			  			</table>
			  		</div>
		  		</div>
	  		</div>
	  	</div>
	
	  	<!-- 用于启动客户端的iframe -->
	  	<div style="display:none"><input type="hidden" id="icaFileId"/></div>
	  	<iframe id="clientIframe" src="/uns/default/pages/dump.html" style="width:0;height:0"></iframe>
		<div class="HiddenDiv" id="launchDiv">
	  		<iframe id="icaIframe" src="/uns/default/pages/dump.html" style="width:10;height:10;display: block"></iframe>
	  	</div>
		<!-- 虚拟机模板 -->
		<table style="display:none">
		  	<tr class = "template" id="vmTemplate" style="display:none">
		  		<td align="center">
			    	<div class="vmRole" id="__vmTemplate__">
			    		<div class="connectingVm" hidefocus="true"></div>
			    		<a class="loginVm" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true"></a>
			    		<div class="vmLoading" hidefocus="true"></div>
			    		<a class="hdaVersion ForAnalysis" href="javascript:void(0);" onmousedown="this.blur()" hidefocus="true"></a>
			    		<a class="vmOption" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true"></a>
			    		<div class="vmOptionPannel">
			    			<a class="powerSet" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true"></a>
				    		<a class="loginVnc" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true"></a>
				    		<a class="reboot" href="javascript:void(0);" onmouseup="this.blur()"  hidefocus="true"></a>
				    		<a class="forceReboot" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true"></a>
			    		</div>
			    		<div class="vmTip">
			    		   <img id="vmg" class="vmTipImg" src="/uns/default/img/dashbord/vmTip.png"/> 
			    		    <div id="textTips">
			    			   <table class="vmTipTable">
			    				    <tr><td class="vmTipText" align="center">__TipText__</td></tr>
			    			   </table>
			    		     </div>
			    			<a class="vmTipOk" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true"></a>		    		
			    		</div>
			    		  
			    		<a class="vmNameLink" href="javascript:void(0);">__vmName__</a>
			    		<a class="vmName">__vmName__</a>
			    	</div>
		    	</td>
		  	</tr>
		</table>
		
		<div class="ForAnalysis" id="clientVersion"></div>
		<div id="compatibility"></div>

		<!-- 联机帮助图片 -->
    	<#include "onlinehelp.ftl">
	</div>
  </body>
</html>
