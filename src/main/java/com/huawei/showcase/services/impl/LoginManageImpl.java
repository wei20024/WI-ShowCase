package com.huawei.showcase.services.impl;

import java.io.UnsupportedEncodingException;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huawei.showcase.common.enumcode.ResultCode;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.ContextUtil;
import com.huawei.showcase.common.util.SessionInfoUtil;
import com.huawei.showcase.common.util.crypto.AesEncrypter;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.common.util.log.TransactionIdUtil;
import com.huawei.showcase.interact.util.LocalConfigWI;
import com.huawei.showcase.interact.wi.WiClientService;
import com.huawei.showcase.model.CurrentInfo;
import com.huawei.showcase.model.SessionInfo;
import com.huawei.showcase.model.UserGroupInfo;
import com.huawei.showcase.model.request.ChangePwdReq;
import com.huawei.showcase.model.request.GetUserInfoReq;
import com.huawei.showcase.model.request.LoginReq;
import com.huawei.showcase.model.response.ChangePwdRsp;
import com.huawei.showcase.model.response.GetUserInfoRsp;
import com.huawei.showcase.model.response.LoginRsp;
import com.huawei.showcase.services.AppCloudService;
import com.huawei.showcase.services.LoginManageService;

@Service
public class LoginManageImpl  implements LoginManageService
{

  @Autowired
  private AppCloudService appCloudService;

 
  
  @Autowired
  private WiClientService wiClientService;
   
   /***
   * @date 2015/8/19 17:18
   * 用户登录和记录用户信息
   * @param loginReq
   * @return
   */
  public LoginRsp login(LoginReq loginReq)
  {
    TransactionIdUtil.setCurrentTransactionId(CommonUtils.createTransactoinId(loginReq.getUserName()));

    LoginRsp loginrsp = new LoginRsp();
    String username = loginReq.getUserName();
    String password = loginReq.getPassword();
    HttpSession currentSession = ContextUtil.getSession();
    
    if (CommonUtils.checkAllStringNull( username ))
    {
      LogUtils.LOG.error("The parameter username is null.");
      loginrsp.setResultCode(ResultCode.PARAMETER_INVALID.getCode());
      loginrsp.setResultDesc(ResultCode.PARAMETER_INVALID.getMessage());      
      loginrsp.setLoginState(1);
      return loginrsp;
    }

    if (CommonUtils.checkAllStringNullNotTrim(password ))
    {
      LogUtils.LOG.error("The parameter password is null");
      loginrsp.setResultCode(ResultCode.PARAMETER_INVALID.getCode());
      loginrsp.setResultDesc(ResultCode.PARAMETER_INVALID.getMessage());
      loginrsp.setLoginState(1);
      return loginrsp;
    }

    loginReq.setLogin(true);
    String passwordbase64 = password;
    try
    {
	  passwordbase64 = AesEncrypter.getBASE64(password.getBytes("utf-8"));
	} 
    catch (UnsupportedEncodingException e) 
    {
	  LogUtils.LOG.error(e);
	}
    
    currentSession.setAttribute("userId", username);
    currentSession.setAttribute("pass", passwordbase64);
    loginReq.setUserId(username);
    loginReq.setCurrentSession(currentSession);
    
    loginReq.setCurrentSessionMap(
    		(Map<String, SessionInfo>) currentSession.getAttribute("currentSessionInfosMap"));

    //1.认证 所有WI处于同一AD域， 随机获取WIip进行用户认证
    String wiId = LocalConfigWI.getRandomWiId();
    loginReq.setGroupId(wiId);
    LoginRsp rsp = authentication(loginReq);
     
    //认证失败，跳转4.1
    if ((ResultCode.SUCCESS.getCode() != rsp.getResultCode()) && 
      (ResultCode.LOGIN_IN_EMERGENCY.getCode() != rsp.getResultCode()))
    {
    	currentSession.removeAttribute("userId");
    	currentSession.removeAttribute("pass");
    	
    }
    if ((ResultCode.SUCCESS.getCode() == rsp.getResultCode()) || 
    		(ResultCode.LOGIN_IN_EMERGENCY.getCode() == rsp.getResultCode()))
    {
      //2.设置会话
      setSessionInfo(rsp, loginReq);
      currentSession = ContextUtil.getSession();
      currentSession.setAttribute("userCurrentWiIp", rsp.getCurrentIp());

      if (ResultCode.LOGIN_IN_EMERGENCY.getCode() == rsp.getResultCode())
      {
    	  currentSession.setAttribute("EMERGENCYLOGON", "ok");
      }

      loginReq.setGroupId(rsp.getWIId());
      loginReq.setCurrentSession(currentSession);
      //3.获得用户组信息
      UserGroupInfo userGrpInfo = getUserGroup(loginReq);
      currentSession.setAttribute("userGroup", userGrpInfo);
  
      //4.认证成功
      loginrsp.setResultCode(ResultCode.SUCCESS.getCode());
      loginrsp.setResultDesc(ResultCode.SUCCESS.getMessage());
      loginrsp.setLoginState(0);
      return loginrsp;
    }
    //4.1 认证登陆失败
    return convertLoginFailResult(loginrsp, rsp, loginReq);
  }

  private LoginRsp authentication(LoginReq req)
  {
    LoginRsp rsp = new LoginRsp();
    String passwordbase64 = null;
    try
    {
      passwordbase64 = AesEncrypter.getBASE64(req.getPassword().getBytes("utf-8"));
    }
    catch (Exception e)
    {
      LogUtils.LOG.error(e);
    }
    if (CommonUtils.checkAllStringNull( passwordbase64 ))
    {
      passwordbase64 = req.getPassword();
    }

    req.setPassword(passwordbase64);

    rsp = this.wiClientService.login(req);
   
    return rsp;
  }
  
  /****
   * 用户修改密码
   */
  public ChangePwdRsp changePWD(ChangePwdReq changepwdreq)
  {
    LogUtils.LOG.enterMethod();
    ChangePwdRsp changersp = new ChangePwdRsp();
    String username = changepwdreq.getUsername();
    String oldpwd = changepwdreq.getOldpwd();
    String newpwd = changepwdreq.getNewpwd();

    HttpSession session = ContextUtil.getSession();

    if (SessionInfoUtil.isEmergencyLogin(session))
    {
      LogUtils.LOG.warn("in emergency mode,the user has  no operating authority ");
      changersp.setResultCode(ResultCode.EMERGENCY_LOGON.getCode());
      changersp.setResultDesc(ResultCode.EMERGENCY_LOGON.getMessage());
      return changersp;
    }

    if (CommonUtils.checkAllStringNull(new String[] { username, oldpwd, newpwd }))
    {
      LogUtils.LOG.error(String.format("parameters of change pwd have null, username is %s.", username));
      changersp.setChangeState(-1);
      changersp.setResultCode(ResultCode.COMMON_PWD_INVOKEINTERFACE_NULL.getCode());
      changersp.setResultDesc(ResultCode.COMMON_PWD_INVOKEINTERFACE_NULL.getMessage());
      return changersp;
    }

    try
    {
      oldpwd = AesEncrypter.getBASE64(oldpwd.getBytes("utf-8"));
      newpwd = AesEncrypter.getBASE64(newpwd.getBytes("utf-8"));
      changepwdreq.setNewpwd(newpwd);
      changepwdreq.setOldpwd(oldpwd);
    }
    catch (UnsupportedEncodingException e)
    {
      LogUtils.LOG.error(e);
    }

    String WiId = LocalConfigWI.getRandomWiId();
    if (CommonUtils.checkAllStringNull( WiId ))
    {
      LogUtils.LOG.error("WiId  is null.");
      ChangePwdRsp rsp = new ChangePwdRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc("WiId  is null.");
      return rsp;
    }

    changepwdreq.setGroupId(WiId);
    CommonUtils.setCommonReq(changepwdreq);

    ChangePwdRsp resp =this.wiClientService.changePWD(changepwdreq);
    LogUtils.LOG.info("invoke WI interface is success,username = " + username);
    
    //修改密码操作成功
    if (resp.getResultCode() == ResultCode.SUCCESS.getCode())
    {
      changersp.setChangeState(0);
      changersp.setResultCode(ResultCode.OPERATE_SUCCESS.getCode());
      changersp.setResultDesc(ResultCode.OPERATE_SUCCESS.getMessage());
      LogUtils.LOG.exitMethod();
      return changersp;
    }
    
    //账号被锁定，修改密码失败
    if (resp.getResultCode() == ResultCode.COMMON_ACCOUNT_LOCKED_OUT.getCode())
    {
      LogUtils.LOG.error("change password error resultCode = " + ResultCode.USER_LOCK.getCode() + 
        ", errorMessage = " + ResultCode.USER_LOCK.getMessage() + ", username = " + username);
      changersp.setChangeState(-1);
      changersp.setResultCode(ResultCode.USER_LOCK.getCode());
      changersp.setResultDesc(ResultCode.USER_LOCK.getMessage());
      return changersp;
    }
    
    //新密码不符合字符域的长度、复杂性或历史要求,操作失败
    LogUtils.LOG.error("change password error resultCode = " + resp.getResultCode() + ", errorMessage = " + 
      resp.getResultDesc() + ", username = " + username);
    changersp.setChangeState(-1);
    changersp.setResultCode(resp.getResultCode());
    return changersp;
  }
  
  /**
   * 将从WI认证返回的结果设置到Session中 
   * @param rsp
   * @param req
   */
  private static void setSessionInfo(LoginRsp rsp, LoginReq req)
  {
    HttpSession session = ContextUtil.getSession();
    if (session == null)
    {
      LogUtils.LOG.error(" session is null.");
      return;
    }

    String userName = req.getUserName();
    String password = req.getPassword();
    CurrentInfo info = rsp.getCurrentInfo();
    if (info != null)
    {
      if (!CommonUtils.checkAllStringNull(info.getUserName() ))
      {
        userName = info.getUserName();
      }
      if (!CommonUtils.checkAllStringNull(info.getPassword() ))
      {
        password = info.getPassword();
      }
    }
   
    try
    {
      session.setAttribute("username", userName);
      String passwordbase64 = AesEncrypter.getBASE64(password.getBytes("utf-8"));
      String passwordAes = AesEncrypter.encrypt(passwordbase64);
      //加密密码
      session.setAttribute("password", passwordAes);

    }
    catch (UnsupportedEncodingException e)
    {
      LogUtils.LOG.error(e);
    }
  }

  /****
   * 获取用户组的信息
   * @param req
   * @return
   */
  public UserGroupInfo getUserGroup(LoginReq req)
  {
 
    GetUserInfoReq getUserInfoReq = new GetUserInfoReq();
    getUserInfoReq.setUsername(req.getUserName());
    CommonUtils.setCommonReq(getUserInfoReq);
    getUserInfoReq.setEmergencyLogonFlag((String)
    		getUserInfoReq.getCurrentSession().getAttribute("EMERGENCYLOGON"));
    
    GetUserInfoRsp getUserInfoRsp = this.appCloudService.getUserInfo(getUserInfoReq);
    UserGroupInfo userInfo = null;
    if (getUserInfoRsp != null && getUserInfoRsp.getResultCode()!=ResultCode.SUCCESS.getCode())
    {
      userInfo = getUserInfoRsp.getUserInfo();
    }
    return userInfo;
  }

 
  /****
   * 认证登录失败信息反馈
   * @param loginrsp
   * @param rsp
   * @param loginreq
   * @return
   */
  private LoginRsp convertLoginFailResult(LoginRsp loginrsp, LoginRsp rsp, LoginReq loginreq)
  {
    String username = loginreq.getUserName();
    loginrsp.setLoginState(1);
    if (ResultCode.ACCOUNT_REVOKED.getCode() == rsp.getResultCode())
    {
      LogUtils.LOG.error("user login authenticate failed,userName= " + username + ",password=**** " + 
    		  ",domainName= " + loginreq.getDomain());
      loginrsp.setResultCode(ResultCode.USER_LOCK.getCode());
      loginrsp.setResultDesc(ResultCode.USER_LOCK.getMessage());
      return loginrsp;
    }
    if ((ResultCode.UESR_PASSWORD_EXPIRED.getCode() == rsp.getResultCode()) || 
    		(ResultCode.WI_PASS_EXPIRED.getCode() == rsp.getResultCode()) || 
    		(ResultCode.UESR_PASSWORD_EXPIRED_C10.getCode() == rsp.getResultCode()))
    {
      LogUtils.LOG.error("user's pwd has expired,userName= " + username + ",password=**** " + ",domainName= " + 
    		  loginreq.getDomain());

      HttpSession httpsession = ContextUtil.getSession();
      httpsession.setAttribute("userPasswordExpired", "true");

      loginrsp.setResultCode(ResultCode.PASSWORD_INVALIDATIONED.getCode());
      loginrsp.setResultDesc(ResultCode.PASSWORD_INVALIDATIONED.getMessage());
      return loginrsp;
    }
    if (ResultCode.UESR_ACCOUNT_EXPIRED.getCode() == rsp.getResultCode())
    {
      LogUtils.LOG.error("user's account has expired,userName= " + username + ",password=**** " + ",domainName= " + 
        loginreq.getDomain());
      loginrsp.setResultCode(ResultCode.ACCOUNT_INVALIDATIONED.getCode());
      loginrsp.setResultDesc(ResultCode.ACCOUNT_INVALIDATIONED.getMessage());
      return loginrsp;
    }
    if (ResultCode.AD_NOT_INIT.getCode() == rsp.getResultCode())
    {
      LogUtils.LOG.error("AD module no initialization,userName= " + username + ",password=**** " + 
        ",domainName= " + loginreq.getDomain());
      loginrsp.setResultCode(ResultCode.AD_UNREADY.getCode());
      loginrsp.setResultDesc(ResultCode.AD_UNREADY.getMessage());
      return loginrsp;
    }
    if (ResultCode.USER_NOT_EXISTS.getCode() == rsp.getResultCode())
    {
      LogUtils.LOG.error("AD module no exist, userName not exist, userName= " + username + ",password=**** " + 
        ",domainName= " + loginreq.getDomain());
      loginrsp.setResultCode(ResultCode.USER_PASSWORD_INVALID.getCode());
      loginrsp.setResultDesc(ResultCode.USER_PASSWORD_INVALID.getMessage());
      return loginrsp;
    }
    
    //输入的密码错误
    if (ResultCode.WRONG_PASSWORD.getCode() == rsp.getResultCode())
    {
      LogUtils.LOG.error("username or password has some errors,userName= " + username + ",password=**** " + 
        ",domainName= " + loginreq.getDomain());
      loginrsp.setResultCode(ResultCode.USER_PASSWORD_INVALID.getCode());
      loginrsp.setResultDesc(ResultCode.USER_PASSWORD_INVALID.getMessage());

      return loginrsp;
    }
    if ((ResultCode.USER_NOT_BINDING_TO_TC.getCode() == rsp.getResultCode()) || 
      (ResultCode.USER_NOT_BINDING_TO_THE_TC.getCode() == rsp.getResultCode()))
    {
      LogUtils.LOG.error("username or password has some errors:" + rsp);
      loginrsp.setResultCode(rsp.getResultCode());
      loginrsp.setResultDesc(rsp.getResultDesc());
      return loginrsp;
    }
    if (String.valueOf(rsp.getResultCode()).startsWith("1000"))
    {
      LogUtils.LOG.error("login fail rsp  " + rsp);
      loginrsp.setResultCode(rsp.getResultCode());
      loginrsp.setResultDesc(rsp.getResultDesc());
      return loginrsp;
    }
    if (ResultCode.RADIUS_SERVICE_EXCEPTION.getCode() == rsp.getResultCode())
    {
      LogUtils.LOG.error("login fail rsp  " + rsp);
      loginrsp.setResultCode(rsp.getResultCode());
      loginrsp.setResultDesc(rsp.getResultDesc());
      return loginrsp;
    }
    if (ResultCode.GET_DYNAMIC_CODE_FAIL.getCode() == rsp.getResultCode())
    {
      LogUtils.LOG.error("login fail rsp  " + rsp);
      loginrsp.setResultCode(rsp.getResultCode());
      loginrsp.setResultDesc(rsp.getResultDesc());
      return loginrsp;
    }
    if (ResultCode.CHECK_DYNAMIC_CODE_FAIL.getCode() == rsp.getResultCode())
    {
      LogUtils.LOG.error("login fail rsp  " + rsp);
      loginrsp.setResultCode(rsp.getResultCode());
      loginrsp.setResultDesc(rsp.getResultDesc());
      return loginrsp;
    }
    if (ResultCode.INIT_DYNAMIC_CODE_FAIL.getCode() == rsp.getResultCode())
    {
      LogUtils.LOG.error("login fail rsp  " + rsp);
      loginrsp.setResultCode(rsp.getResultCode());
      loginrsp.setResultDesc(rsp.getResultDesc());
      return loginrsp;
    }
    if (ResultCode.DYNAMIC_CODE_NULL.getCode() == rsp.getResultCode())
    {
      LogUtils.LOG.error("login fail rsp  " + rsp);
      loginrsp.setResultCode(rsp.getResultCode());
      loginrsp.setResultDesc(rsp.getResultDesc());
      return loginrsp;
    }
    if (ResultCode.API_LOGIN_TYPE_ERROR.getCode() == rsp.getResultCode())
    {
      LogUtils.LOG.error("login fail rsp  " + rsp);
      loginrsp.setResultCode(rsp.getResultCode());
      loginrsp.setResultDesc(rsp.getResultDesc());
      return loginrsp;
    }
    if (ResultCode.GET_DYNAMIC_CODE_SUCCESS.getCode() == rsp.getResultCode())
    {
      loginrsp.setResultCode(rsp.getResultCode());
      loginrsp.setResultDesc(rsp.getResultDesc());
      return loginrsp;
    }
    
    LogUtils.LOG.error("unknow reason,userName= " + username + ",password=**** " + ",domainName= " + 
      loginreq.getDomain());
    loginrsp.setResultCode(ResultCode.UNKNOW_REASON.getCode());
    loginrsp.setResultDesc(ResultCode.UNKNOW_REASON.getMessage());
    return loginrsp;
  }
}