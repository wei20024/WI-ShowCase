
    <link rel="stylesheet" type="text/css" href="/custom/resources/tyyd/web/default/css/tyydLogin.css">
    <script type="text/javascript" src="/custom/resources/tyyd/web/common/js/language/loginLanguage.js"></script>  
    <script type="text/javascript" src="/custom/resources/tyyd/web/common/js/src/hdpclient.js"></script>
    <script type="text/javascript" src="/custom/resources/tyyd/web/default/js/src/tyydLogin.js"></script>
   <div id="multiDomainCss"></div>
   
    <div id="userloginpanel">
    	<img id="loginframe" src="/custom/resources/tyyd/web/default/img/loginframe.png">
		            <div id="headImgDiv" >
                    	<img id="headImageBg" src="/custom/resources/tyyd/web/default/img/headimagebg.png">
						<img id="headImage" />
                    </div>                        
  
                	<div id="uNameInput" >
						<img id="uNameImg" src="/custom/resources/tyyd/web/default/img/inputnofocus.png" >				
						<input type="text" id="userName" name="userName" hidefocus="true" onfocus="setEmptyValue('userName','userNameTip',0);setEmptyValue('userPass','userPassTip',1);setEmptyValue('dymanicPassword','dynamicTip',1);"  onblur="setEmptyValue('userName','userNameTip',1);" onKeyPress="loginKey(event);" tabindex="100"/>
					</div>	
					<div id="uNameLabel" >							
						<label id="userNameLb"></label>
						<a id="btnEditName" href="javascript:void(0);" onmouseup="this.blur()"  hidefocus="true" tabindex="105"></a>
					</div>	
					<div id="passImgTip">
                    		<div id="lefttip"></div>
                    		<div id="leftmid"></div>
                    		<div id="midbottom"></div>
                    		<div id="rightmid"></div>
                    		<div id="righttip"></div>
                    		<div id="tiptext" ></div>
                    		<div id="resetPwdtiptext" ></div>
                    </div>
					<div id="passInput">
						<img id="passImg" src="/custom/resources/tyyd/web/default/img/inputnofocus.png">
                    	<span id="userPassSpan"><input  autocomplete="off"  type="text" id="userPass" name="userPass" onpaste="return false;" oncopy="return false;" onblur="setEmptyValue('userPass','userPassTip',1);" onfocus="setEmptyValue('dymanicPassword','dynamicTip',1);changeType('userPass');" onKeyPress="loginKey(event);" hidefocus="true" tabindex="101"/></span>
                    	
                    </div>
                    <div id="dymanicPassInput">
						<img id="dymanicPassImg" src="/custom/resources/tyyd/web/default/img/inputnofocus.png">
                    	<span id="dymaniCodeSpan"><input  autocomplete="off"  type="text" id="dymanicPassword" name="dymanicPassword" onpaste="return false;" oncopy="return false;" onfocus="setEmptyValue('dymanicPassword','dynamicTip',0);changPassType('dymanicPassword');"  onblur="setEmptyValue('dymanicPassword','dynamicTip',1);" onKeyPress="loginKey(event);" tabindex="102"/></span>
                    	<a id="getDymanicCode"  href="javascript:void(0);" onmouseup="this.blur()" tabindex="103"></a>
                    </div>
                    
                    <div id="domainSelect" class="domainSelect"  style="display:none;">
                    	<img id="uNameImgDomain" src="/custom/resources/tyyd/web/default/img/inputnofocus.png" />
						<select id="seslectItem" class="seslectItem">
						</select>
					</div>
                    
                	<div id="loginBtnDiv">
						<a id="loginBtn"  href="javascript:void(0);" onmouseup="this.blur()"  hidefocus="true" tabindex="104"></a>
					</div>
                	<div id="resetPwdDiv">
						<a id="resetPwdBtn"  href="javascript:void(0);" onmouseup="this.blur()"  hidefocus="true" tabindex="105">忘记登录密码？</a>
					</div>
                    <div id="errorDiv">
                    	<label id="errorLb"></label>
                    </div>
    </div>
    
    <div id= "resetPwdLog" style="display:none" class="langMask">
	<div class="resetPwdBack"></div>
	<div class="langDialogAnchor centerEle">
  		<div class="langDialog smallLangDialog">
  			<div class="langDialogTitle">重置密码</div>
  			<a class="langDialogClose" href="javascript:void(0);"></a>
  			<div class="dinamicinputclass1">动态密码：</div><input class="dinamicinputclass" name="dinamicinput" id="dinamicinput" />
  			<div class="langDialogButtonsWarp" >
	  			<table class="langDialogButtons">
	  				<tr>
	  					<td class="langDialogButton" align="center">
	  						<div class="langDialogLinkWarp">
	  							<a id="resetPwdBtn1" class="langDialogOkLink langDialogLink" style="background-image: url('/custom/resources/tyyd/web/default/img/dashbord/globalConfirmOkLinkzh.png')" href="javascript:void(0);"></a>
	  						</div>
	  					</td>
	  					<td class="langDialogButton" align="center">
	  						<div class="langDialogLinkWarp">
		  						<a class="langDialogCanncelLink langDialogLink"  style="background-image: url('/custom/resources/tyyd/web/default/img/dashbord/globalConfirmCanncelLinkzh.png');" href="javascript:void(0);"></a>
		  					</div>
	  					</td>
	  				</tr>
	  			</table>
	  		</div>
  		</div>
	</div>
</div>
