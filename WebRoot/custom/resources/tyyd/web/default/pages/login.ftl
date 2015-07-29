
	<!-- 模板,公共js、logo、css样式 -->
	<#include "template.ftl">
	
    <link rel="stylesheet" type="text/css" href="/custom/resources/tyyd/web/default/css/login.css"/>
    <script type="text/javascript" src="/custom/resources/tyyd/web/default/js/src/loadcss.js"></script>
	<script type="text/javascript" src="/custom/resources/tyyd/web/default/js/src/login.js"></script> 

    <div id="loadingpanel">
        <div id="waiting">Loading,please waiting...</div>
    	<img alt="loading" src="/custom/resources/tyyd/web/default/img/loading.gif">
    </div>
	<div id="errorPanel">
		<img id="errorImg" src="/custom/resources/tyyd/web/default/img/error.png">
		<label id="errorMessage"></label>
	</div>