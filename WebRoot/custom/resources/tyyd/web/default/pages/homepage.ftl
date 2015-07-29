<!DOCTYPE html>
<html>
  <head>
    <title>Desktop@FusionAccess</title>
    <link type="image/vnd.microsoft.icon" href=${logoIco} rel="SHORTCUT ICON">
    <meta name="viewport" content="width=device-width, height=device-height,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="this is my page">
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">

    <link rel="stylesheet" type="text/css" href="/custom/resources/tyyd/web/default/css/dashbord.css"/>
    <script src="/jslib/json2.js"></script>
   <script type="text/javascript" src="/jslib/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/jslib/jquery.cookie.js"></script>
    <script type="text/javascript" src="/custom/resources/tyyd/web/default/js/src/loadcss.js"></script>
    <script type="text/javascript" src="/jslib/log4javascript.js"></script>
    <script type="text/javascript" src="/custom/resources/tyyd/web/common/js/src/globalvar.js"></script>
    <script type="text/javascript" src="/custom/resources/tyyd/web/common/js/src/constantvar.js"></script>
    <script type="text/javascript" src="/custom/resources/tyyd/web/common/js/utils/service.js"></script>
    
     <script>
          if (typeof (wiJsVersion) == "undefined" || wiJsVersion != "R5C20") 
          {
                    $.getScript("/custom/resources/tyyd/web/common/js/src/globalvar.js?"+ Math.random(), null);
                    $.getScript("/custom/resources/tyyd/web/common/js/src/constantvar.js?"+ Math.random(), null);
                    $.getScript("/custom/resources/tyyd/web/common/js/utils/resultCode.js?"+ Math.random(), null);
                    $.getScript("/custom/resources/tyyd/web/common/js/language/languageService.js?"+ Math.random(), null);
                    $.getScript("/custom/resources/tyyd/web/default/js/src/dashbord.js?"+ Math.random(), null);
                    $.getScript("/custom/resources/tyyd/web/common/js/language/dashbordLanguage.js?"+ Math.random(), null);
                    $.getScript("/custom/resources/tyyd/web/default/js/src/silentDetection.js?"+ Math.random(), null);
                    $.getScript("/custom/resources/tyyd/web/common/js/utils/commonUtil.js?"+ Math.random(), null);
                    document.location.reload();
        }
    </script>
    
    <script type="text/javascript" src="/custom/resources/tyyd/web/common/js/utils/resultCode.js"></script>
    <script type="text/javascript" src="/custom/resources/tyyd/web/common/js/language/languageService.js"></script>
    <script type="text/javascript" src="/custom/resources/tyyd/web/default/js/src/dashbord.js"></script>
    <script type="text/javascript" src="/custom/resources/tyyd/web/common/js/language/dashbordLanguage.js"></script>
    <script type="text/javascript" src="/custom/resources/tyyd/web/default/js/src/silentDetection.js"></script>
    <script type="text/javascript" src="/custom/resources/tyyd/web/common/js/utils/commonUtil.js"></script>
    <script type="text/javascript" src="/custom/resources/tyyd/web/common/js/utils/jcarousellite_1.0.1.pack.js"></script>   
    <script type="text/javascript" src="/custom/resources/tyyd/web/default/js/src/appcommon.js"></script>
    <link rel="stylesheet" type="text/css" href="/custom/resources/tyyd/web/default/css/onlinehelp.css"/>
     
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
                    <tr id="chromeDownloadTip" class="chromeDownloadTip">
                        <td>
                            <div class="pluginArea">
                                <div id="pluginTipArea" style="display: none" class="clientTip">
                                    <div class="textTip"><img src="/custom/resources/tyyd/web/default/img/app/warming.png"></img></div>
                                    <div class="textTip">
                                        <a id="downloadRef" href="javascript:void(0)"></a> 
                                        <a id="downloadRefR21" href="javascript:void(0)"></a> 
                                        <span id="downloadClientTip"></span>
                                    </div>
                                </div>
                                <div style="display: none" id="nosupportTip" class="clientTip">
                                    <div class="textTip"><img src="/custom/resources/tyyd/web/default/img/app/warming.png"></img></div>
                                    <div class="textTip">
                                        <span id="nosupportTipText"></span>
                                    </div>
                                </div>
                                <div style="display: none" id="linuxTip" class="clientTip">
                                    <div class="textTip"><img src="/custom/resources/tyyd/web/default/img/app/warming.png"></img></div>
                                    <div class="textTip">
                                        <span id="linuxTipText"></span>
                                    </div>
                                </div>
                            </div>
                            <div id="tabBtnArea" class="tabBtnStyle">
                                <a class="tabBtnLeft tabBtnColor2" id="vmTabBtn"></a>
                                <a class="tabBtnCenter tabBtnColor1" id="myAppTabBtn"></a>
                                <a class="tabBtnRight tabBtnColor1" id="allAppTabBtn"></a>
                            </div>
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
            <a id="chpsw" href="javascript:void(0);" style="cursor: auto" title="此功能暂不可用"/>
            <a id="logout" href="javascript:void(0);" title="Logout"></a>
        </div>
        
        <div id="slideBtnArea">
            <div class="leftBtn" id="leftBtn">
                <a href="javascript:void(0)"><img src="/custom/resources/tyyd/web/default/img/app/left.png"></a>
            </div>
            <div class="rightBtn" id="rightBtn">
                <a href="javascript:void(0)"><img src="/custom/resources/tyyd/web/default/img/app/right.png"></a>
            </div>
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
          
          <!-- 我的应用列表区域 -->
          <div class="appDivEle">
              <div id="appArea" style="display:none;">
                  <#include "applist.ftl">
              </div>
          </div>
          
          <div class="slideBottomArea">
              <div id="slideBottomArea" class="slideArea"></div>
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
                                  <td class="globalDialogDownload globalDialogButton" align="center">
                                      <div class="globalDialogLinkWarp">
                                          <a class="globalDialogDownloadLink globalDialogLink" href="javascript:void(0);"></a>
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
                        <option class="defBg" value="/custom/resources/tyyd/web/default/img/null.jpg">Default</option>  
                        <option class="lightBg" value="/custom/resources/tyyd/web/default/img/light.jpg">Light</option>  
                        <option class="grassBg" value="/custom/resources/tyyd/web/default/img/bggrass.jpg">Grass</option>  
                        <option class="seaBg" value="/custom/resources/tyyd/web/default/img/bgsea.jpg">Sea</option>  
                    </select>
                    <img class="bgPreview">    </img>
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
          <iframe id="clientIframe" src="/custom/resources/tyyd/web/default/pages/dump.html" style="width:0;height:0"></iframe>
        <div class="HiddenDiv" id="launchDiv">
              <iframe id="icaIframe" src="/custom/resources/tyyd/web/default/pages/dump.html" style="width:10;height:10;display: block"></iframe>
          </div>
          
          <!-- 登陆应用错误提示 -->
          <div id= "appErrorTip" class="globalMask" style="display:none">
              <div class="globalMaskBack"></div>
              <div class="globalDialogAnchor centerEle">
                  <div class="globalDialog smallGlobalDialog">
                      <div class="globalDialogTitle">Title</div>
                      <a class="globalDialogClose" href="javascript:void(0);"></a>
                      <div class="tipContent"></div>
                      <div class="globalDialogButtonsWarp" >
                          <table class="globalDialogButtons">
                              <tr>
                                  <td class="globalDialogOk globalDialogButton" align="center">
                                      <div class="globalDialogLinkWarp">
                                          <a class="globalDialogOkLink globalDialogLink" href="javascript:void(0);"></a>
                                      </div>
                                  </td>
                              </tr>
                          </table>
                      </div>
                  </div>
              </div>
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
                        <div class="vipFlag" style="display:none"></div>
                        <a class="vmOption" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true"></a>
                        <div class="vmOptionPannel">
                            <a class="powerSet" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true"></a>
                            <a class="loginVnc" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true"></a>
                            <a class="reboot" href="javascript:void(0);" onmouseup="this.blur()"  hidefocus="true"></a>
                            <a class="forceReboot" href="javascript:void(0);" onmouseup="this.blur()" hidefocus="true"></a>
                        </div>
                        <div class="vmTip">
                           <img id="vmg" class="vmTipImg" src="/custom/resources/tyyd/web/default/img/dashbord/vmTip.png"/> 
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
        
        <!-- Li模板 -->
        <ul style="display: none" id="appLiTemplate">
            <li id="__liItem__"></li>
        </ul>
        
        <!-- 应用模板 -->
        <div style="display: none" id="appItemTemplate">
            <div id="__appId__" class="appItemDiv">
                <!-- 应用图标区域 -->
                <div class="bgImgItem">
                    <img src="/custom/resources/tyyd/web/default/img/app/windows.png" onerror="this.src='/custom/resources/tyyd/web/default/img/app/windows.png'"/>    
                </div>
                <!-- 右上角三角操作区域 -->
                <div class="angleDiv __angleStyle__"><a></a></div>
                <!-- 浮动边框-->
                <div class="floatDiv"></div>
                <!-- 填补图标点击忙点 并加上click事件-->
                <div class="fillAngleBank"></div>
                <!-- 应用名称显示 -->
                <div class="appNameItem"><a title="__appName__">__appName__</a></div>
                <!-- 加载遮盖层 -->
                <div class="appCover"></div>
                <div class="loaderImg"><img src="/custom/resources/tyyd/web/default/img/app/loader.gif"/></div>
                <!-- 提示区域 -->
                <div class="tip_box"> 
                    <div class="tip_content"><div class="tip">tip</div></div>
                    <div class="tip_angle">
                        <div class="angle_x">&#9670</div><div class="angle_y">&#9670</div> 
                    </div> 
                </div> 
            </div>
        </div>
        
        <div class="ForAnalysis" id="clientVersion"></div>
        <div id="compatibility"></div>

        <!-- 联机帮助图片 -->
        <#include "onlinehelp.ftl">
    </div>
  </body>
</html>
