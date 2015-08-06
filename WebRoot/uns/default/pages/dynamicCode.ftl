
    <link rel="stylesheet" type="text/css" href="/uns/default/css/dynamicCode.css">
    <script type="text/javascript" src="/uns/common/js/language/loginLanguage.js"></script>  
    <script type="text/javascript" src="/uns/default/js/src/dynamicCode.js"></script>
   <div id="multiDomainCss"></div>
   
    <div id="userloginpanel">
<<<<<<< HEAD
    	<img id="loginframe" src="/uns/default/img/loginframe.png">
		            <div id="headImgDiv" >
                    	<img id="headImageBg" src="/uns/default/img/headimagebg.png">
=======
    	<img id="loginframe" src="/webui/default/img/loginframe.png">
		            <div id="headImgDiv" >
                    	<img id="headImageBg" src="/webui/default/img/headimagebg.png">
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
						<img id="headImage" />
                    </div>                        
  
                	<div id="uNameInput" >
<<<<<<< HEAD
						<img id="uNameImg" src="/uns/default/img/inputnofocus.png" >				
=======
						<img id="uNameImg" src="/webui/default/img/inputnofocus.png" >				
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
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
<<<<<<< HEAD
						<img id="passImg" src="/uns/default/img/inputnofocus.png">
=======
						<img id="passImg" src="/webui/default/img/inputnofocus.png">
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
                    	<span id="userPassSpan"><input  autocomplete="off"  type="text" id="userPass" name="userPass" onpaste="return false;" oncopy="return false;" onblur="setEmptyValue('userPass','userPassTip',1);" onfocus="setEmptyValue('dymanicPassword','dynamicTip',1);changeType('userPass');" onKeyPress="loginKey(event);" hidefocus="true" tabindex="101"/></span>
                    	
                    </div>
                    <div id="dymanicPassInput">
<<<<<<< HEAD
						<img id="dymanicPassImg" src="/uns/default/img/inputnofocus.png">
=======
						<img id="dymanicPassImg" src="/webui/default/img/inputnofocus.png">
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
                    	<span id="dymaniCodeSpan"><input  autocomplete="off"  type="text" id="dymanicPassword" name="dymanicPassword" onpaste="return false;" oncopy="return false;" onfocus="setEmptyValue('dymanicPassword','dynamicTip',0);changPassType('dymanicPassword');"  onblur="setEmptyValue('dymanicPassword','dynamicTip',1);" onKeyPress="loginKey(event);" tabindex="102"/></span>
                    	<a id="getDymanicCode"  href="javascript:void(0);" onmouseup="this.blur()" tabindex="103"></a>
                    </div>
                    
                    <div id="domainSelect" class="domainSelect"  style="display:none;">
<<<<<<< HEAD
                    	<img id="uNameImgDomain" src="/uns/default/img/inputnofocus.png" />
=======
                    	<img id="uNameImgDomain" src="/webui/default/img/inputnofocus.png" />
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
						<select id="seslectItem" class="seslectItem">
						</select>
					</div>
                    
                	<div id="loginBtnDiv">
						<a id="loginBtn"  href="javascript:void(0);" onmouseup="this.blur()"  hidefocus="true" tabindex="104"></a>
					</div>
<<<<<<< HEAD
=======
                    
                	<div id="resetPwdBtnDiv">
						<a id="resetPwd"  href="javascript:void(0);" onmouseup="this.blur()" tabindex="105">忘记登录密码？</a>
					</div>
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
                    <div id="errorDiv">
                    	<label id="errorLb"></label>
                    </div>
    </div>
