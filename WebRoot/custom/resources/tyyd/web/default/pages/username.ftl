<script type="text/javascript" src="/custom/resources/tyyd/web/common/js/language/loginLanguage.js"></script>  
<link rel="stylesheet" type="text/css" href="/custom/resources/tyyd/web/default/css/explicit.css">
<script type="text/javascript" src="/custom/resources/tyyd/web/default/js/src/loadcss.js"></script>
<script type="text/javascript" src="/custom/resources/tyyd/web/default/js/src/explicit.js"></script>

<div id="globalTipAnchor" class="centerEle">
			<div id="globalTipArea">
				<table id="globalTipTable">
					<tr id="downloadClient" class="globalTipContainer">
						<td>
							<span class="globaltip">
								<span id="downloadClientTip1"></span>
							</span><br/>
							<span class="globaltip">
								<a id="downloadClientButtion2" href="/plugin/ClientSetup.exe"></a>
								<span id="downloadClientTip2"></span>
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
								<span id="warningText"></span>
							</span>
						</td>
					</tr>
					<tr id="getVmListError" class="globalTipContainer">
						<td>
							<span class="globaltip">
								<span id="getVmListErrorText"></span>
							</span>
						</td>
					</tr>
				</table>
			</div>
		</div>
<div id="userloginpanel">
    	<img id="loginframe" src="/custom/resources/tyyd/web/default/img/loginframe.png">
		            <div id="headImgDiv" >
                    	<img id="headImageBg" src="/custom/resources/tyyd/web/default/img/headimagebg.png">
						<img id="headImage" src="/custom/resources/tyyd/web/default/img/headimage5.png"/>
                    </div>                        
                	<div id="uNameInput" ><!--for test-->
						<img id="uNameImg" src="/custom/resources/tyyd/web/default/img/inputnofocus.png" >
						<input type="text" id="userName" name="userName" hidefocus="true" onfocus="setEmptyValue('userName','userNameTip',0);setEmptyValue('userPass','userPassTip',1);"  onblur="setEmptyValue('userName','userNameTip',1);" onKeyPress="loginKey(event);" tabindex="100"/>
					</div>	
					<div id="uNameLabel" >							
						<label id="userNameLb"></label>
						<a id="btnEditName" href="javascript:void(0);" onmouseup="this.blur()"  hidefocus="true" tabindex="103"></a>
					</div>	
					<div id="passInput">
						<img id="passImg" src="/custom/resources/tyyd/web/default/img/inputnofocus.png">
                    	<input  autocomplete="off"  type="password" id="userPass" name="userPass" onpaste="return false;" oncopy="return false;" onblur="setEmptyValue('userPass','userPassTip',1)" onKeyPress="loginKey(event);" hidefocus="true" tabindex="101"/>
                    </div>
                   <div id="remberMe" style="display:none;">
                    	<span id="checkboxText">Remember me</span>
                    	<input type="checkbox" id="remberBox" name="remberBox" class="remberBox"/>
                    </div>
                	<div id="loginBtnDiv">
						<a id="loginBtn"  href="javascript:void(0);" onmouseup="this.blur()"  hidefocus="true" tabindex="102"></a>
					</div>
                    <div id="errorDiv">
                    	<label id="errorLb">${loginErrorMsg}</label>
                    </div>
    </div>
    
    <div id="mobilehint" style="display:none" >setAgent;autodologin;rememberLoginStatus;</div>