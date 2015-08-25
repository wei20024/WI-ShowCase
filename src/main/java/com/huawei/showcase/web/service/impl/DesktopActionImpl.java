package com.huawei.showcase.web.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huawei.showcase.common.enumcode.LoginType;
import com.huawei.showcase.common.enumcode.ResultCode;
import com.huawei.showcase.common.enumcode.StaticNumber;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.SessionInfoUtil;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.common.util.log.TransactionIdUtil;
import com.huawei.showcase.model.UserGroupInfo;
import com.huawei.showcase.model.VmModel;
import com.huawei.showcase.model.request.DescribeVMUserCustomPolicyReq;
import com.huawei.showcase.model.request.GetConfigInfoReq;
import com.huawei.showcase.model.request.GetLoginInfoReq;
import com.huawei.showcase.model.request.GetUserInfoReq;
import com.huawei.showcase.model.request.GetVmListReq;
import com.huawei.showcase.model.request.ModifyVMUserCustomPolicyReq;
import com.huawei.showcase.model.request.QueryVmStatusReq;
import com.huawei.showcase.model.request.RebootUserVMReq;
import com.huawei.showcase.model.request.VncLoginReq;
import com.huawei.showcase.model.response.DescribeVMUserCustomPolicyRsp;
import com.huawei.showcase.model.response.GetConfigInfoRsp;
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
  
  /***
   * 登录之后获得虚拟机列表
   * @param listReq
   * @return GetVmListRsp
   */
  public GetVmListRsp getVmList(GetVmListReq listReq)
  {
    LogUtils.VDESKTOP_LOG.enterMethod();
    
    GetVmListRsp rsp = new GetVmListRsp();
    HttpSession session = this.req.getSession(false);
    
    //根据登录验证方式获得用户名
    String userName = getUserName();
    if (userName == null || listReq==null)
    {
      LogUtils.VDESKTOP_LOG.error("session is error.");
      rsp.setResultCode(ResultCode.SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SESSION_INVALID.getMessage());
      return rsp;
    }
    Configuration LoginPropConfig = Configuration.getControllerPropInstance();
    
    //判断查询虚拟机时是否要查询用户组
    String getUserGroup = LoginPropConfig.getString("getUserGroup");

    String isEmergencyLogin = "no";
    if (SessionInfoUtil.isEmergencyLogin(session))
    {
      isEmergencyLogin = "ok";
    }
    UserGroupInfo userInfo = null;
    
    if ("true".equalsIgnoreCase(getUserGroup) && CommonUtils.checkAllObjectNull(new Object[]{session.getAttribute("userGroup") }))
      {
        LogUtils.VDESKTOP_LOG.error("session userGroup is null.");

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
      else{
    	  userInfo = (UserGroupInfo)session.getAttribute("userGroup");
     }

    if (CommonUtils.checkAllObjectNull(new Object[] { userInfo }))
    {
      userInfo = new UserGroupInfo();
      LogUtils.VDESKTOP_LOG.error("userinfo is null. username = " + userName);
    }

    	userInfo.setUserName(userName);

    LogUtils.VDESKTOP_LOG.debug("username = " + userName + ", usergroup = " + userInfo.getUserGroupList());

    //1.构造GetVmListReq
    GetVmListReq getVmListReq = new GetVmListReq();
    getVmListReq.setUserInfo(userInfo);
    getVmListReq.setIsEmergencyLogin(isEmergencyLogin);
    getVmListReq.setQueryType(listReq.getQueryType());


    CommonUtils.setCommonReq(getVmListReq);
    //2.查询VM列表
    rsp = this.appCloudService.getVmList(getVmListReq);
    //3.设置结果  
    setSidIntoSession(rsp);

    LogUtils.VDESKTOP_LOG.exitMethod();
    return rsp;
  }

  public QueryVmStatusRsp queryVmStatus(QueryVmStatusReq getVmStatusReq)
  {
    LogUtils.VDESKTOP_LOG.enterMethod();
    QueryVmStatusRsp rsp = new QueryVmStatusRsp();
    String userName = getUserName();
    
    if ((userName == null) || (getVmStatusReq == null))
    {
      LogUtils.VDESKTOP_LOG.error("session is error.");
      rsp.setResultCode(ResultCode.SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SESSION_INVALID.getMessage());
      return rsp;
    }

    HttpSession session = this.req.getSession(false);

    if (!checkSidInSession(session, getVmStatusReq.getId()))
    {
      LogUtils.VDESKTOP_LOG.error("This vm is not belong to this user, sid is " + getVmStatusReq.getId());
      rsp.setResultCode(ResultCode.SID_IN_SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SID_IN_SESSION_INVALID.getMessage());
      return rsp;
    }

    String isEmergencyLogin = "no";
    
    if (SessionInfoUtil.isEmergencyLogin(session))
    {
      isEmergencyLogin = "ok";
    }

    CommonUtils.setCommonReq(getVmStatusReq);
    getVmStatusReq.setGroupId(getGroupIdById(getVmStatusReq.getId()));
    getVmStatusReq.setUserId(userName);
    getVmStatusReq.setUserInfo((UserGroupInfo)session.getAttribute("userGroup"));
    getVmStatusReq.setIsEmergencyLogin(isEmergencyLogin);
    getVmStatusReq.setId(getVmStatusReq.getId());

    rsp = this.appCloudService.queryVmStatus(getVmStatusReq);
    LogUtils.VDESKTOP_LOG.exitMethod();
    return rsp;
  }
  
  public GetLoginInfoRsp getLoginInfo(GetLoginInfoReq getLoginInfoReq)
  {
    LogUtils.VDESKTOP_LOG.enterMethod();

    GetLoginInfoRsp rsp = new GetLoginInfoRsp();
    HttpSession session = this.req.getSession(false);

    getLoginInfoReq.setVmList(getVmIds(session));
    //1.1 会话中必须存在虚拟机IP
    if (!checkSidInSession(session, getLoginInfoReq.getId()))
    {
      LogUtils.VDESKTOP_LOG.error("This vm is not belong to this user, sid is " + getLoginInfoReq.getId());
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
      LogUtils.VDESKTOP_LOG.error("session is error.");
      rsp.setResultCode(ResultCode.SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SESSION_INVALID.getMessage());
      return rsp;
    }

    userGrpInfo.setPassword((String)session.getAttribute("password"));
    //2. 构造Request

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
      LogUtils.VDESKTOP_LOG.error("check randomId is error.");
      rsp.setResultCode(ResultCode.DESKTOP_PREPARING.getCode());
      return rsp;
    }

    if (ResultCode.SUCCESS.getCode() != rsp.getResultCode())
    {
      
      LogUtils.VDESKTOP_LOG.error("login fail. rsp = " + rsp);
    }

    rsp.setTransactionId(TransactionIdUtil.getCurrentTransactionId());
    LogUtils.VDESKTOP_LOG.exitMethod();
    return rsp;
  }

  /***
   * 用户退出登录
   * @return LogOutRsp
   */
  public LogOutRsp loginOut()
  {
    LogUtils.VDESKTOP_LOG.enterMethod();

    HttpSession session = this.req.getSession();
    //释放会话信息
    session.removeAttribute("username");
    session.invalidate();
    Configuration LoginPropConfig = Configuration.getControllerPropInstance();
    String authType = LoginPropConfig.getString("logintype").trim();
    if (CommonUtils.checkAllObjectNull(new Object[] { authType }))
    {
      authType = LoginType.EXPLICIT.getName();
    }
    LogOutRsp rsp = new LogOutRsp();
    rsp.setResultCode(StaticNumber.ZERO.getCode());
    rsp.setResultDesc("OK");
    rsp.setAuthType(authType);

    LogUtils.VDESKTOP_LOG.exitMethod();
    return rsp;
  }
  
  /***
   * 自助维护方式登录
   * @param vncLoginReq
   * @return
   */
  public VNCLoginActionRsp vncLoginAction(VncLoginReq vncLoginReq)
  {
    LogUtils.VDESKTOP_LOG.enterMethod();

    VNCLoginActionRsp rsp = new VNCLoginActionRsp();
    HttpSession session = this.req.getSession(false);

    if (SessionInfoUtil.isEmergencyLogin(session))
    {
      LogUtils.VDESKTOP_LOG.warn("in emergency mode,the user has  no operating authority ");
      rsp.setResultCode(ResultCode.EMERGENCY_LOGON.getCode());
      rsp.setResultDesc(ResultCode.EMERGENCY_LOGON.getMessage());
      return rsp;
    }

    if (!checkSidInSession(session, vncLoginReq.getSid()))
    {
      LogUtils.VDESKTOP_LOG.error("This vm is not belong to this user, sid is " + vncLoginReq.getSid());
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
      LogUtils.VDESKTOP_LOG.error("session is error.");
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
    LogUtils.VDESKTOP_LOG.exitMethod();
    return rsp;
  }
  
  /***
   * 重新启动虚拟机
   * @param rebootVMReq
   * @return
   */
  public RebootUserVMRsp restartDesktop(RebootUserVMReq rebootVMReq)
  {
    LogUtils.VDESKTOP_LOG.enterMethod();

    RebootUserVMRsp rsp = new RebootUserVMRsp();
    HttpSession session = this.req.getSession(false);

    if (!checkSidInSession(session, rebootVMReq.getSid()))
    {
      LogUtils.VDESKTOP_LOG.error("This vm is not belong to this user, sid is " + rebootVMReq.getSid());
      rsp.setResultCode(ResultCode.SID_IN_SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SID_IN_SESSION_INVALID.getMessage());
      return rsp;
    }

    if (SessionInfoUtil.isEmergencyLogin(session))
    {
      LogUtils.VDESKTOP_LOG.warn("in emergency mode,the user has  no operating authority ");
      rsp.setResultCode(ResultCode.EMERGENCY_LOGON.getCode());
      rsp.setResultDesc(ResultCode.EMERGENCY_LOGON.getMessage());
      return rsp;
    }

    rebootVMReq.setGroupId(getGroupIdById(rebootVMReq.getSid()));
    rebootVMReq.setSid(rebootVMReq.getSid());

    CommonUtils.setCommonReq(rebootVMReq);
    rsp = this.appCloudService.restartDesktop(rebootVMReq);
    LogUtils.VDESKTOP_LOG.exitMethod();
    return rsp;
  }

  /***
   * 设置虚拟机电源管理策略
   * @param describeUserVMPolicyReq
   * @return	
   */
  public DescribeVMUserCustomPolicyRsp describeVMUserCustomPolicy(DescribeVMUserCustomPolicyReq describeUserVMPolicyReq)
  {
    describeUserVMPolicyReq.setGroupId(getGroupIdById(describeUserVMPolicyReq.getSid()));
    describeUserVMPolicyReq.setSid(describeUserVMPolicyReq.getSid());

    
    CommonUtils.setCommonReq(describeUserVMPolicyReq);
    DescribeVMUserCustomPolicyRsp rsp = this.appCloudService.describeVMUserCustomPolicy(describeUserVMPolicyReq);
    return rsp;
  }

  /***
   * 修改虚拟机电源管理策略
   * @param modifyUserVMPolicyReq
   * @return
   */
  public ModifyUserVMPolicyRsp modifyVMUserCustomPolicy(ModifyVMUserCustomPolicyReq modifyUserVMPolicyReq)
  {
    LogUtils.VDESKTOP_LOG.enterMethod();
    ModifyUserVMPolicyRsp rsp = new ModifyUserVMPolicyRsp();

    HttpSession session = this.req.getSession(false);

    if (!checkSidInSession(session, modifyUserVMPolicyReq.getSid()))
    {
      LogUtils.VDESKTOP_LOG.error("This vm is not belong to this user, sid is " + modifyUserVMPolicyReq.getSid());
      rsp.setResultCode(ResultCode.SID_IN_SESSION_INVALID.getCode());
      rsp.setResultDesc(ResultCode.SID_IN_SESSION_INVALID.getMessage());
      return rsp;
    }

    if (SessionInfoUtil.isEmergencyLogin(session))
    {
      LogUtils.VDESKTOP_LOG.warn("in emergency mode,the user has  no operating authority ");
      rsp.setResultCode(ResultCode.EMERGENCY_LOGON.getCode());
      rsp.setResultDesc(ResultCode.EMERGENCY_LOGON.getMessage());
      return rsp;
    }
    
    //GroupId为虚拟机Id或虚拟机桌面组Id
    modifyUserVMPolicyReq.setGroupId(getGroupIdById(modifyUserVMPolicyReq.getSid()));
    modifyUserVMPolicyReq.setSid(modifyUserVMPolicyReq.getSid());
    CommonUtils.setCommonReq(modifyUserVMPolicyReq);
    rsp = this.appCloudService.modifyVMUserCustomPolicy(modifyUserVMPolicyReq);
    
    LogUtils.VDESKTOP_LOG.exitMethod();
    return rsp;
  }
/***
 * @since 2015/8/19 11:59
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
    LogUtils.VDESKTOP_LOG.enterMethod();

    if (rsp == null)
    {
      LogUtils.VDESKTOP_LOG.error("setSidIntoSession faild rsp is null.");
      return;
    }

    HttpSession session = this.req.getSession(false);
    List<String> sidList = new ArrayList<String>();
    Map<String,VmModel> vmInfoMaps = new HashMap<String,VmModel>();

    List<VmModel> vmList = rsp.getVmList();

    if ((vmList == null) || (vmList.isEmpty()))
    {
      LogUtils.VDESKTOP_LOG.debug("The vmList is null.");
      return;
    }

    for (VmModel vmModel : vmList)
    {
      sidList.add(vmModel.getSid());
      vmInfoMaps.put(vmModel.getSid(), vmModel);
      LogUtils.VDESKTOP_LOG.debug("Add sid into session " + vmModel.getSid());
    
    }

    session.setAttribute("vmSidList", sidList);
    session.setAttribute("vmInfoMaps", vmInfoMaps);
    LogUtils.VDESKTOP_LOG.exitMethod();
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
      LogUtils.VDESKTOP_LOG.debug("The session is null.");
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
    LogUtils.VDESKTOP_LOG.enterMethod();

    if (session == null)
    {
      LogUtils.VDESKTOP_LOG.debug("The session is null.");
      return false;
    }

    if (session.getAttribute("vmSidList") == null)
    {
      LogUtils.VDESKTOP_LOG.debug("The session.getAttribute is null.");
      return false;
    }

    List<String> vmSidList = (List<String>)session.getAttribute("vmSidList");

    if (vmSidList == null)
    {
      LogUtils.VDESKTOP_LOG.debug("The vmSidList in session is null.");
      return false;
    }

    if (!vmSidList.contains(sid))
    {
      LogUtils.VDESKTOP_LOG.debug("The session do not have this sid.");
      return false;
    }

    LogUtils.VDESKTOP_LOG.exitMethod();
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
     LogUtils.VDESKTOP_LOG.error("session is null.");
    }
    return userName;
  }
}