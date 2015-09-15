package com.huawei.showcase.web.service.impl;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huawei.showcase.common.enumcode.ResultCode;
import com.huawei.showcase.common.enumcode.StaticNumber;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.SessionInfoUtil;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.crypto.AesEncrypter;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.common.util.log.TransactionIdUtil;
import com.huawei.showcase.model.AppModel;
import com.huawei.showcase.model.IconInfoModel;
import com.huawei.showcase.model.UserGroupInfo;
import com.huawei.showcase.model.VmModel;
import com.huawei.showcase.model.request.DescribeVMUserCustomPolicyReq;
import com.huawei.showcase.model.request.FavoriteAppReq;
import com.huawei.showcase.model.request.GetAppLoginInfoReq;
import com.huawei.showcase.model.request.GetConfigInfoReq;
import com.huawei.showcase.model.request.GetIconReq;
import com.huawei.showcase.model.request.GetLoginInfoReq;
import com.huawei.showcase.model.request.GetUserInfoReq;
import com.huawei.showcase.model.request.GetVmListReq;
import com.huawei.showcase.model.request.ModifyVMUserCustomPolicyReq;
import com.huawei.showcase.model.request.QueryVmStatusReq;
import com.huawei.showcase.model.request.RebootUserVMReq;
import com.huawei.showcase.model.request.VncLoginReq;
import com.huawei.showcase.model.response.DescribeVMUserCustomPolicyRsp;
import com.huawei.showcase.model.response.FavoriteAppRsp;
import com.huawei.showcase.model.response.GetAppLoginInfoRsp;
import com.huawei.showcase.model.response.GetConfigInfoRsp;
import com.huawei.showcase.model.response.GetIconRsp;
import com.huawei.showcase.model.response.GetLoginInfoRsp;
import com.huawei.showcase.model.response.GetUserInfoRsp;
import com.huawei.showcase.model.response.GetVmListRsp;
import com.huawei.showcase.model.response.LogOutRsp;
import com.huawei.showcase.model.response.ModifyUserVMPolicyRsp;
import com.huawei.showcase.model.response.QueryVmStatusRsp;
import com.huawei.showcase.model.response.RebootUserVMRsp;
import com.huawei.showcase.model.response.VNCLoginActionRsp;
import com.huawei.showcase.services.AppCloudService;
import com.huawei.showcase.web.service.DesktopAction;

@Service
public class DesktopActionImpl implements DesktopAction
{
	
  @Context
  private HttpServletRequest req;

  @Autowired
  private AppCloudService appCloudService;

  String appIconPath = CommonUtils.getProjAbsolutePath() + "/uns/default/img/app/appicon/";
  private static final String appIconSuffix=".png";
  
  /***
   * 登录之后获得虚拟机列表
   * @param listReq
   * @return GetVmListRsp
   */
  public GetVmListRsp getVmList(GetVmListReq listReq)
  {
    LogUtils.LOG.enterMethod();
    GetVmListRsp rsp = new GetVmListRsp();
    HttpSession session = this.req.getSession(false);
    
    //根据登录验证方式获得用户名
    String userName = getUserName();
    if (userName == null || listReq==null)
    {
      LogUtils.LOG.error("session is error.");
      rsp.setResultCode(ResultCode.SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SESSION_INVALID.getMessage());
      return rsp;
    }
    
    //读取配置文件判断查询虚拟机时是否要查询用户组
    Configuration LoginPropConfig = Configuration.getControllerPropInstance();
    
    String getUserGroup = LoginPropConfig.getString("getUserGroup");
    String isEmergencyLogin = "no";
    UserGroupInfo userInfo = null;
    
    if (SessionInfoUtil.isEmergencyLogin(session))
    {
      isEmergencyLogin = "ok";
    }
    
    if ("true".equalsIgnoreCase(getUserGroup) && CommonUtils.checkAllObjectNull(new Object[]{session.getAttribute("userGroup") }))
      {
        LogUtils.LOG.error("session userGroup is null.");
        
        GetUserInfoReq getUserInfoReq = new GetUserInfoReq();
        getUserInfoReq.setUsername(userName);
        getUserInfoReq.setEmergencyLogonFlag(isEmergencyLogin);
        CommonUtils.setCommonReq(getUserInfoReq);
        
        //通过WIclient获得UserGroup信息
        GetUserInfoRsp getUserInfoRsp = this.appCloudService.getUserInfo(getUserInfoReq);    
        if (getUserInfoRsp != null && getUserInfoRsp.getUserInfo() !=null)
        {
          userInfo = getUserInfoRsp.getUserInfo();
          session.setAttribute("userGroup", userInfo);
        }
      }
      else
      {
    	  userInfo = (UserGroupInfo)session.getAttribute("userGroup");
      }

    if (CommonUtils.checkAllObjectNull(new Object[] { userInfo }))
    {
      userInfo = new UserGroupInfo();
      LogUtils.LOG.error("userinfo is null. username = " + userName);
    }

    userInfo.setUserName(userName);
    LogUtils.LOG.debug("username = " + userName + ", usergroup = " + userInfo.getUserGroupList());

    //1.构造GetVmListReq
    GetVmListReq getVmListReq = new GetVmListReq();
    getVmListReq.setUserInfo(userInfo);
    getVmListReq.setIsEmergencyLogin(isEmergencyLogin);
    getVmListReq.setQueryType(listReq.getQueryType());
    CommonUtils.setCommonReq(getVmListReq);
    //2.查询VM列表
    rsp = this.appCloudService.getVmList(getVmListReq);
    //3.设置结果  
    if ((listReq.getQueryType() == null) || (StaticNumber.ZERO.getCode() == listReq.getQueryType().intValue()))
    {
      setSidIntoSession(rsp);
    }
    else if (StaticNumber.ONE.getCode() == listReq.getQueryType().intValue())
    {
      setAppIntoSession(rsp);
    }
    else
    {
      setSidIntoSession(rsp);
      setAppIntoSession(rsp);
    }
    LogUtils.LOG.exitMethod();
    return rsp;
  }

  public QueryVmStatusRsp queryVmStatus(QueryVmStatusReq getVmStatusReq)
  {
    LogUtils.LOG.enterMethod();
    QueryVmStatusRsp rsp = new QueryVmStatusRsp();
    String userName = getUserName();
    
    if ((userName == null) || (getVmStatusReq == null))
    {
      LogUtils.LOG.error("session is error.");
      rsp.setResultCode(ResultCode.SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SESSION_INVALID.getMessage());
      return rsp;
    }

    HttpSession session = this.req.getSession(false);

    if (!checkSidInSession(session, getVmStatusReq.getId()))
    {
      LogUtils.LOG.error("This vm is not belong to this user, sid is " + getVmStatusReq.getId());
      rsp.setResultCode(ResultCode.SID_IN_SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SID_IN_SESSION_INVALID.getMessage());
      return rsp;
    }

    String isEmergencyLogin = "no";
    
    if (SessionInfoUtil.isEmergencyLogin(session))
    {
      isEmergencyLogin = "ok";
    }

    //构造Req
    CommonUtils.setCommonReq(getVmStatusReq);
    getVmStatusReq.setGroupId(getGroupIdById(getVmStatusReq.getId()));
    getVmStatusReq.setUserId(userName);
    getVmStatusReq.setUserInfo((UserGroupInfo)session.getAttribute("userGroup"));
    getVmStatusReq.setIsEmergencyLogin(isEmergencyLogin);
    getVmStatusReq.setId(getVmStatusReq.getId());

    rsp = this.appCloudService.queryVmStatus(getVmStatusReq);
    LogUtils.LOG.exitMethod();
    return rsp;
  }
  
  /***
   * 调用hdpclient时获取虚拟机登录信息
   */
  public GetLoginInfoRsp getLoginInfo(GetLoginInfoReq getLoginInfoReq)
  {
    LogUtils.LOG.enterMethod();
    GetLoginInfoRsp rsp = new GetLoginInfoRsp();
    HttpSession session = this.req.getSession(false);
    getLoginInfoReq.setVmList(getVmIds(session));
    //1.1 会话中必须存在虚拟机Id
    if (!checkSidInSession(session, getLoginInfoReq.getId()))
    {
      LogUtils.LOG.error("This vm is not belong to this user, sid is " + getLoginInfoReq.getId());
      rsp.setResultCode(ResultCode.SID_IN_SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SID_IN_SESSION_INVALID.getMessage());
      return rsp;
    }
    //1.2 会话中有用户名
    String userName=null;
    UserGroupInfo userGrpInfo = (UserGroupInfo)session.getAttribute("userGroup");
    
    if (!CommonUtils.checkAllObjectNull(new Object[] { userGrpInfo }) &&
    	!CommonUtils.checkAllObjectNull(new Object[] { userGrpInfo.getUserName() }))
    {
        userName = userGrpInfo.getUserName();      
    }   
    
    if (userName == null)
    {
      LogUtils.LOG.error("session is error.");
      rsp.setResultCode(ResultCode.SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SESSION_INVALID.getMessage());
      return rsp;
    }

    userGrpInfo.setPassword((String)session.getAttribute("password"));
    //2. 构造Request
    getLoginInfoReq.setIsEmergencyLogin((String)session.getAttribute("EMERGENCYLOGON"));
    getLoginInfoReq.setUserInfo(userGrpInfo);
    getLoginInfoReq.setGroupId(getGroupIdById(getLoginInfoReq.getId()));
    getLoginInfoReq.setId(getLoginInfoReq.getId());
    CommonUtils.setCommonReq(getLoginInfoReq);
    //3. 远程调用，实际执行
    rsp = this.appCloudService.getLoginInfo(getLoginInfoReq);

    if (rsp.getResultCode() == ResultCode.DESK_PREPARING_C10.getCode())
    {
      rsp.setResultCode(ResultCode.DESK_PREPARING.getCode());
    }
    
    if ((ResultCode.SUCCESS.getCode() == rsp.getResultCode()) && 
      (!CommonUtils.checkRandomId(getLoginInfoReq.getRandomId(), rsp.getRandomId())))
    {
      LogUtils.LOG.error("check randomId is error.");
      rsp.setResultCode(ResultCode.DESKTOP_PREPARING.getCode());
      return rsp;
    }

    if (ResultCode.SUCCESS.getCode() != rsp.getResultCode())
    {
      
      LogUtils.LOG.error("login fail. rsp = " + rsp);
    }

    rsp.setTransactionId(TransactionIdUtil.getCurrentTransactionId());
    LogUtils.LOG.exitMethod();
    return rsp;
  }

  /***
   * 用户退出登录
   * @return LogOutRsp
   */
  public LogOutRsp loginOut()
  {
    LogUtils.LOG.enterMethod();
    HttpSession session = this.req.getSession();
    //释放会话信息
    session.removeAttribute("username");
    session.invalidate();
    
      
    LogOutRsp rsp = new LogOutRsp();
    rsp.setResultCode(StaticNumber.ZERO.getCode());
    rsp.setResultDesc("OK");

    LogUtils.LOG.exitMethod();
    return rsp;
  }
  
  /***
   * 自助维护方式登录
   * @param vncLoginReq
   * @return
   */
  public VNCLoginActionRsp vncLoginAction(VncLoginReq vncLoginReq)
  {
    LogUtils.LOG.enterMethod();

    VNCLoginActionRsp rsp = new VNCLoginActionRsp();
    HttpSession session = this.req.getSession(false);

    if (SessionInfoUtil.isEmergencyLogin(session))
    {
      LogUtils.LOG.warn("in emergency mode,the user has  no operating authority ");
      rsp.setResultCode(ResultCode.EMERGENCY_LOGON.getCode());
      rsp.setResultDesc(ResultCode.EMERGENCY_LOGON.getMessage());
      return rsp;
    }

    if (!checkSidInSession(session, vncLoginReq.getSid()))
    {
      LogUtils.LOG.error("This vm is not belong to this user, sid is " + vncLoginReq.getSid());
      rsp.setResultCode(ResultCode.SID_IN_SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SID_IN_SESSION_INVALID.getMessage());
      return rsp;
    }  
    String userName=null;
    UserGroupInfo userGrpInfo = (UserGroupInfo)session.getAttribute("userGroup");
    if (!CommonUtils.checkAllObjectNull(new Object[] { userGrpInfo }) &&
    	!CommonUtils.checkAllObjectNull(new Object[] { userGrpInfo.getUserName() }))
    {
        userName = userGrpInfo.getUserName();
    }
    if (userName == null)
    {
      LogUtils.LOG.error("session is error.");
      rsp.setResultCode(ResultCode.SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SESSION_INVALID.getMessage());
      return rsp;
    }

    vncLoginReq.setUserName(userName);
    vncLoginReq.setGroupId(getGroupIdById(vncLoginReq.getSid()));
    vncLoginReq.setSid(vncLoginReq.getSid());
    vncLoginReq.setClientIp(vncLoginReq.getClientIp());
    vncLoginReq.setUserInfo(userGrpInfo);
    CommonUtils.setCommonReq(vncLoginReq);
    
    rsp = this.appCloudService.vncLoginAction(vncLoginReq);

    rsp.setTransactionId(TransactionIdUtil.getCurrentTransactionId());
    LogUtils.LOG.exitMethod();
    return rsp;
  }
  
  /***
   * 重新启动虚拟机
   * @param rebootVMReq
   * @return
   */
  public RebootUserVMRsp restartDesktop(RebootUserVMReq rebootVMReq)
  {
    LogUtils.LOG.enterMethod();

    RebootUserVMRsp rsp = new RebootUserVMRsp();
    HttpSession session = this.req.getSession(false);

    if (!checkSidInSession(session, rebootVMReq.getSid()))
    {
      LogUtils.LOG.error("This vm is not belong to this user, sid is " + rebootVMReq.getSid());
      rsp.setResultCode(ResultCode.SID_IN_SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SID_IN_SESSION_INVALID.getMessage());
      return rsp;
    }
    if (SessionInfoUtil.isEmergencyLogin(session))
    {
      LogUtils.LOG.warn("in emergency mode,the user has  no operating authority ");
      rsp.setResultCode(ResultCode.EMERGENCY_LOGON.getCode());
      rsp.setResultDesc(ResultCode.EMERGENCY_LOGON.getMessage());
      return rsp;
    }
    rebootVMReq.setGroupId(getGroupIdById(rebootVMReq.getSid()));
    rebootVMReq.setSid(rebootVMReq.getSid());
    CommonUtils.setCommonReq(rebootVMReq);
    rsp = this.appCloudService.restartDesktop(rebootVMReq);
    LogUtils.LOG.exitMethod();
    return rsp;
  }

  /***
   * 查询虚拟机电源管理策略
   * @param describeUserVMPolicyReq
   * @return	
   */
  public DescribeVMUserCustomPolicyRsp describeVMUserCustomPolicy(DescribeVMUserCustomPolicyReq describeUserVMPolicyReq)
  {
	LogUtils.LOG.enterMethod();
    describeUserVMPolicyReq.setGroupId(getGroupIdById(describeUserVMPolicyReq.getSid()));
    describeUserVMPolicyReq.setSid(describeUserVMPolicyReq.getSid());
    CommonUtils.setCommonReq(describeUserVMPolicyReq);
    
    DescribeVMUserCustomPolicyRsp rsp = this.appCloudService.describeVMUserCustomPolicy(describeUserVMPolicyReq);
    LogUtils.LOG.exitMethod();
    return rsp;
  }

  /***
   * 修改虚拟机电源管理策略
   * @param modifyUserVMPolicyReq
   * @return
   */
  public ModifyUserVMPolicyRsp modifyVMUserCustomPolicy(ModifyVMUserCustomPolicyReq modifyUserVMPolicyReq)
  {
    LogUtils.LOG.enterMethod();
    ModifyUserVMPolicyRsp rsp = new ModifyUserVMPolicyRsp();
    HttpSession session = this.req.getSession(false);

    if (!checkSidInSession(session, modifyUserVMPolicyReq.getSid()))
    {
      LogUtils.LOG.error("This vm is not belong to this user, sid is " + modifyUserVMPolicyReq.getSid());
      rsp.setResultCode(ResultCode.SID_IN_SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SID_IN_SESSION_INVALID.getMessage());
      return rsp;
    }

    if (SessionInfoUtil.isEmergencyLogin(session))
    {
      LogUtils.LOG.warn("in emergency mode,the user has  no operating authority ");
      rsp.setResultCode(ResultCode.EMERGENCY_LOGON.getCode());
      rsp.setResultDesc(ResultCode.EMERGENCY_LOGON.getMessage());
      return rsp;
    }
    
    modifyUserVMPolicyReq.setGroupId(getGroupIdById(modifyUserVMPolicyReq.getSid()));
    modifyUserVMPolicyReq.setSid(modifyUserVMPolicyReq.getSid());
    CommonUtils.setCommonReq(modifyUserVMPolicyReq);
    rsp = this.appCloudService.modifyVMUserCustomPolicy(modifyUserVMPolicyReq);
    
    LogUtils.LOG.exitMethod();
    return rsp;
  }
  
  /***
 * 首次登陆时获取login.properties配置项值
 * @param reqs 传入了待获取的配置的key值
 */
  public GetConfigInfoRsp getConfigInfo(GetConfigInfoReq reqs)
  {
    return this.appCloudService.getConfigInfo(reqs);
  }
  
  /***
   * 将虚拟机列表的id设置到Session中
   * @param rsp
   */
  private void setSidIntoSession(GetVmListRsp rsp)
  {
    LogUtils.LOG.enterMethod();

    if (rsp == null)
    {
      LogUtils.LOG.error("setSidIntoSession faild rsp is null.");
      return;
    }

    HttpSession session = this.req.getSession(false);
    List<String> sidList = new ArrayList<String>();
    Map<String,VmModel> vmInfoMaps = new HashMap<String,VmModel>();

    List<VmModel> vmList = rsp.getVmList();

    if ((vmList == null) || (vmList.isEmpty()))
    {
      LogUtils.LOG.debug("The vmList is null.");
      return;
    }

    for (VmModel vmModel : vmList)
    {
      sidList.add(vmModel.getSid());
      vmInfoMaps.put(vmModel.getSid(), vmModel);
      LogUtils.LOG.debug("Add sid into session " + vmModel.getSid());
    }

    session.setAttribute("vmSidList", sidList);
    session.setAttribute("vmInfoMaps", vmInfoMaps);
    LogUtils.LOG.exitMethod();
  }

  private void setAppIntoSession(GetVmListRsp rsp)
  {
    LogUtils.LOG.enterMethod();

    if (rsp == null)
    {
      LogUtils.LOG.error("setAppIntoSession faild rsp is null.");
      return;
    }

    HttpSession session = this.req.getSession(false);
    List<String> appIdList = new ArrayList<String>();
    Map<String,AppModel> appInfoMaps = new HashMap<String,AppModel>();
    List<AppModel> appList = rsp.getAppInfos();

    if ((appList == null) || (appList.isEmpty()))
    {
      LogUtils.LOG.debug("The appList is null.");
      return;
    }

    for (AppModel appModel : appList)
    {
      if(!appIdList.contains(appModel.getAppId()))
    		  appIdList.add(appModel.getAppId());
      appInfoMaps.put(appModel.getAppId(), appModel);
      LogUtils.LOG.debug("Add appId into session " + appModel.getAppId());
    }

    session.setAttribute("appIdList", appIdList);
    session.setAttribute("appInfoMaps", appInfoMaps);
    LogUtils.LOG.exitMethod();
  }
  
  /***
   * 获得该虚拟机Sid的桌面组groupId
   * @param sid
   * @return 桌面组groupId或空
   */
  private String getGroupIdById(String sid)
  {
    HttpSession session = this.req.getSession(false);
    Map<String,VmModel> vmInfoMaps = (Map<String,VmModel>)session.getAttribute("vmInfoMaps");
    if ((vmInfoMaps == null) || (vmInfoMaps.get(sid) == null))
    {
      return null;
    }
    return ((VmModel)vmInfoMaps.get(sid)).getGroupId();
  }
  /***
   * 获取Session中的虚拟机Sid列表
   * @param session
   * @return List<String>
   */
  public List<String> getVmIds(HttpSession session)
  {
    if (session == null)
    {
      LogUtils.LOG.debug("The session is null.");
      return null;
    }
    return (List<String>)session.getAttribute("vmSidList");
  }

  /***
   * 判断该虚拟机是否在虚拟机组中存在
   * @param session
   * @param sid
   * @return 存在返回true
   */
  public boolean checkSidInSession(HttpSession session, String sid)
  {
    LogUtils.LOG.enterMethod();

    if (session == null)
    {
      LogUtils.LOG.debug("The session is null.");
      return false;
    }

    if (session.getAttribute("vmSidList") == null)
    {
      LogUtils.LOG.debug("The session.getAttribute is null.");
      return false;
    }

    List<String> vmSidList = (List<String>)session.getAttribute("vmSidList");

    if (vmSidList == null)
    {
      LogUtils.LOG.debug("The vmSidList in session is null.");
      return false;
    }

    if (!vmSidList.contains(sid))
    {
      LogUtils.LOG.debug("The session do not have this sid.");
      return false;
    }

    LogUtils.LOG.exitMethod();
    return true;
  }

  private String getUserName()
  {
    HttpSession session = this.req.getSession(false);
    String userName = null;
    if (session != null)
    {
     userName = (String)session.getAttribute("username");
    }
    else
    {
     LogUtils.LOG.error("session is null.");
    }
    return userName;
  }

  /***
   * 调用hdpclient时获取应用登录信息
   */
 public GetAppLoginInfoRsp getApploginInfo(GetAppLoginInfoReq appReq)
  {
    LogUtils.LOG.enterMethod();

    GetAppLoginInfoRsp rsp = new GetAppLoginInfoRsp();
    HttpSession session = this.req.getSession(false);

    if (session == null)
    {
      LogUtils.LOG.error("session is error.");
      rsp.setResultCode(ResultCode.SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SESSION_INVALID.getMessage());
      return rsp;
    }

    if (!checkAppIdInSession(session, appReq.getAppId(), appReq.getAppType()))
    {
      LogUtils.LOG.error("This app is not belong to this user, appId is " + appReq.getAppId());
      rsp.setResultCode(ResultCode.SID_IN_SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SID_IN_SESSION_INVALID.getMessage());
      return rsp;
    }

    String userName = getUserName();

    UserGroupInfo nameInfo = (UserGroupInfo)session.getAttribute("userGroup");
    if (!CommonUtils.checkAllObjectNull(new Object[] { nameInfo }) && !CommonUtils.checkAllObjectNull(new Object[] { nameInfo.getUserName() }))
      {
        userName = nameInfo.getUserName();
       
      }
     if (userName == null)
    {
      LogUtils.LOG.error("session is error.");
      rsp.setResultCode(ResultCode.SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SESSION_INVALID.getMessage());
      return rsp;
    }
    nameInfo = new UserGroupInfo();
    nameInfo.setUserName(userName);
    nameInfo.setPassword(AesEncrypter.decrypt((String)session.getAttribute("password")));
    appReq.setIsEmergencyLogin((String)session.getAttribute("EMERGENCYLOGON"));
    appReq.setUserInfo(nameInfo);
    appReq.setGroupId(getAppGroupIdById(appReq.getAppId()));
    CommonUtils.setCommonReq(appReq);

    rsp = this.appCloudService.getApploginInfo(appReq);

    if ((ResultCode.SUCCESS.getCode() == rsp.getResultCode()) && 
      (!CommonUtils.checkRandomId(appReq.getRandomId(), rsp.getRandomId())))
    {
      LogUtils.LOG.error("check randomId is error.");
     
      rsp.setResultCode(ResultCode.DESKTOP_PREPARING.getCode());
      return rsp;
    }

    rsp.setTransactionId(TransactionIdUtil.getCurrentTransactionId());

    LogUtils.LOG.exitMethod();
    return rsp;
  }

  private String getAppGroupIdById(String appId)
  {
    HttpSession session = this.req.getSession(false);
    Map<String,AppModel> appInfoMaps = (Map<String,AppModel>)session.getAttribute("appInfoMaps");
    if ((appInfoMaps == null) || (appInfoMaps.get(appId) == null))
    {
      return null;
    }
    return ((AppModel)appInfoMaps.get(appId)).getGroupId();
  }

  public GetIconRsp getAppIcon(GetIconReq getIconReq)
  {
    LogUtils.LOG.enterMethod();

    GetIconRsp rsp = new GetIconRsp();
    HttpSession session = this.req.getSession(false);

    if (session == null)
    {
      LogUtils.LOG.error("session is error.");
      rsp.setResultCode(ResultCode.SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SESSION_INVALID.getMessage());
      return rsp;
    }

    if (getIconReq == null)
    {
      LogUtils.LOG.error("getIconReq is null.");
      rsp.setResultCode(ResultCode.REQUEST_INVALID.getCode());
      rsp.setResultDesc(ResultCode.REQUEST_INVALID.getMessage());
      return rsp;
    }

    if (!getIconReq.isValid())
    {
      LogUtils.LOG.error("getIconReq is invalid.");
      rsp.setResultCode(ResultCode.REQUEST_INVALID.getCode());
      rsp.setResultDesc(ResultCode.REQUEST_INVALID.getMessage());
      return rsp;
    }

    List<String> files = CommonUtils.getFiles(appIconPath);

    if ((files == null) || (files.isEmpty()))
    {
      LogUtils.LOG.info("Have not icon imgs.");
      files = new ArrayList<String>();
    }

    List<IconInfoModel> iconInfos = new ArrayList<IconInfoModel>();
    List<AppModel> newApp = new ArrayList<AppModel>();
    //查找本地缺少的应用图标
    for (AppModel app : getIconReq.getAppList())
    {
      if (!files.contains(app.getAppId()+appIconSuffix))
      {
        newApp.add(app);
      }
    }

    getIconReq.setAppList(newApp);    

    CommonUtils.setCommonReq(getIconReq);

    rsp = this.appCloudService.getAppIcon(getIconReq);

    if (rsp.getResultCode() == ResultCode.SUCCESS.getCode())
    {
      iconInfos = rsp.getIconInfos();
    }
    else
    {
      LogUtils.LOG.error("errorCode= " + rsp.getResultCode() + ", errorMessage= " + rsp.getResultDesc());
      return rsp;
    }

    List<String> appIdList = saveIcon(iconInfos, appIconPath);

    rsp.setAppIdList(appIdList);

    LogUtils.LOG.exitMethod();
    return rsp;
  }
  /***
   * 将从服务器获得的应用图标保存到本地
   * @param iconInfos
   * @param path
   * @return 获得图标的应用Id
   */
  private List<String> saveIcon(List<IconInfoModel> iconInfos, String path)
  {
    List<String> appIdList = new ArrayList<String>();

    if (iconInfos == null)
    {
      LogUtils.LOG.info("The iconInfos is null.");
      return appIdList;
    }

    for (IconInfoModel model : iconInfos)
    {
      FileOutputStream fos = null;
      try
      {
        fos = new FileOutputStream(path + model.getAppId() + appIconSuffix);
        byte[] icon = model.getIcon();

        fos.write(icon);

        appIdList.add(model.getAppId());
      }
      catch (Exception e)
      {
        LogUtils.LOG.error("create img catch exception appId = " + model.getAppId(), e);

        if (fos != null)
        {
          try
          {
            fos.close();
          }
          catch (IOException e1)
          {
            LogUtils.LOG.error("create img catch exception ", e1);
          }
        }
      }
      finally
      {
        if (fos != null)
        {
          try
          {
            fos.close();
          }
          catch (IOException e)
          {
            LogUtils.LOG.error("create img catch exception ", e);
          }
        }
      }
    }

    return appIdList;
  }

  public FavoriteAppRsp dealFavoriteApp(FavoriteAppReq favoriteAppReq)
  {
    LogUtils.LOG.enterMethod();

    FavoriteAppRsp rsp = new FavoriteAppRsp();
    HttpSession session = this.req.getSession(false);

    if (session == null)
    {
      LogUtils.LOG.error("session is error.");
      rsp.setResultCode(ResultCode.SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SESSION_INVALID.getMessage());
      return rsp;
    }

    if (favoriteAppReq == null)
    {
      LogUtils.LOG.error("favoriteAppReq is null.");
      rsp.setResultCode(ResultCode.REQUEST_INVALID.getCode());
      rsp.setResultDesc(ResultCode.REQUEST_INVALID.getMessage());
      return rsp;
    }

    if (!favoriteAppReq.isValid())
    {
      LogUtils.LOG.error("favoriteAppReq is inValid.");
      rsp.setResultCode(ResultCode.REQUEST_INVALID.getCode());
      rsp.setResultDesc(ResultCode.REQUEST_INVALID.getMessage());
      return rsp;
    }

    if (!checkAppIdInSession(session, favoriteAppReq.getAppId(), null))
    {
      LogUtils.LOG.error("This app is not belong to this user, appId is " + favoriteAppReq.getAppId());
      rsp.setResultCode(ResultCode.SID_IN_SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SID_IN_SESSION_INVALID.getMessage());
      return rsp;
    }

    favoriteAppReq.setGroupId(getAppGroupIdById(favoriteAppReq.getAppId()));

    CommonUtils.setCommonReq(favoriteAppReq);
    rsp = this.appCloudService.dealFavoriteApp(favoriteAppReq);

    LogUtils.LOG.debug("errorCode= " + rsp.getResultCode() + ", errorMessage= " + rsp.getResultDesc());
    LogUtils.LOG.exitMethod();
    return rsp;
  }

  private boolean checkAppIdInSession(HttpSession session, String appId, Integer appType)
  {
    LogUtils.LOG.enterMethod();

    if (session == null)
    {
      LogUtils.LOG.error("The session is null.");
      return false;
    }

    if (session.getAttribute("appInfoMaps") == null)
    {
      LogUtils.LOG.error("The session.getAttribute is null.");
      return false;
    }

    Map<String,AppModel> appMap = (Map<String,AppModel>)session.getAttribute("appInfoMaps");

    if (appMap == null)
    {
      LogUtils.LOG.error("The vmList in session is null.");
      return false;
    }

    Iterator<Entry<String, AppModel>> iter = appMap.entrySet().iterator();

    while (iter.hasNext())
    {
      Map.Entry<String,AppModel> entry = (Map.Entry<String,AppModel>)iter.next();
      AppModel val = (AppModel)entry.getValue();

      if (val.getAppId().equals(appId))
      {
        if ((appType != null) && (val.getAppType() != null))
        {
          if (val.getAppType().equals(appType))
          {
            return true;
          }

          LogUtils.LOG.error("The appId is valid but appType is inValid. appTyep = " + appType);
          return false;
        }

        return true;
      }
    }

    LogUtils.LOG.exitMethod();
    return false;
  }
  
}