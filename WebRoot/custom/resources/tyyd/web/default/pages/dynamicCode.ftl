
    <link rel="stylesheet" type="text/css" href="/custom/resources/tyyd/web/default/css/dynamicCode.css">
    <script type="text/javascript" src="/custom/resources/tyyd/web/common/js/language/loginLanguage.js"></script>  
    <script type="text/javascript" src="/custom/resources/tyyd/web/default/js/src/dynamicCode.js"></script>
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
                    <div id="errorDiv">
                    	<label id="errorLb"></label>
                    </div>
    </div>