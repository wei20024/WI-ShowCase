<#include "template.ftl">
<!-- 模板,公共js、logo、css样式 -->

	    <script type="text/javascript" src="/uns/common/js/language/loginLanguage.js"></script>  
	    <script type="text/javascript" src="/uns/default/js/src/changepassword.js"></script>	

		<div id="passExpired" style="display:none;">
			<img id="alertBg" src="/uns/default/img/smallframe.png">	
			<label id="alertTitle"></label>		
			<img id="alertIcon" src="/uns/default/img/error.png">
			<label id="alertText"></label>			
			<a id="confirmMod" class="btnA" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true" tabindex="1"></a>
	  		<a id="cancelMod" class="btnA" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true" tabindex="2"></a>			
		</div>
			
		<div id="modifyPasswordDiv" style="display:none;">
			<img id="modBg" src="/uns/default/img/largeframe.png">
			<label id="modTitle">修改密码</label>
			<div id="modifyInputDiv" class="modifyClass">				
				<div id="errorModifyDiv">
					<img id="errorDivImg" src="/uns/default/img/bubbleerror.png">
					<label id="errorDivLB">用户名错误</label>
				</div>	
				<div id="usernameDIV" class="divClass">
					<label id="usernameLb" class="labelClass">用户名：</label>
					<input type="text" id="usernameInput" class="inputClass" tabindex="3"  readonly="readonly"/>
				</div>	
				<div id="oldPassDIV" class="divClass">
					<label id="oldPassLb" class="labelClass">旧密码：</label>
					<input  autocomplete="off"  type="password" id="oldPassInput" class="inputClass" tabindex="4" onpaste="return false;" oncopy="return false;" />
				</div>
				<div id="newPassDIV" class="divClass">
					<label id="newPassLb" class="labelClass">新密码：</label>
					<input  autocomplete="off"  type="password" id="newPassInput" class="inputClass" tabindex="5" onpaste="return false;" oncopy="return false;" />			
				</div>
				<div id="renewPassDIV" class="divClass">
					<label id="renewPassLb" class="labelClass">
					确认密码：
					</label>
					<input  autocomplete="off"  type="password" id="renewPassInput" class="inputClass" tabindex="6" onpaste="return false;" oncopy="return false;" />
				</div>
				<div id="btnDiv">
					<a id="confirmBtn" class="btnA" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true" tabindex="7"></a>
					<a id="cancelBtn" class="btnA" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true" tabindex="8"></a>
				</div>
			</div>
			<div id="modifySuccessDiv" class="modifyClass">
				<img id="successImg" src="/uns/default/img/successicon.png">
				<label id="successLB1">恭喜您！新密码设置成功！</label>
				<label id="successLB2">今后将使用新密码登录系统，请牢记！</label>
				<a id="successA" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true" tabindex="9">点击跳转到主页面</a>
			</div>
			<div id="loadingpanel">
    			<img src="/uns/default/img/Loader.gif">
   			 </div>
		</div>
