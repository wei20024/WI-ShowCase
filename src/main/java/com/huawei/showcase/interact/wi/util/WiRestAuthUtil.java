package com.huawei.showcase.interact.wi.util;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import com.huawei.showcase.common.enumcode.ResultCode;
import com.huawei.showcase.model.Token;
import com.huawei.showcase.model.request.LoginSystemReq;
import com.huawei.showcase.model.request.UpdateTokenReq;
import com.huawei.showcase.model.response.LoginSystemRsp;
import com.huawei.showcase.model.response.UpdateTokenRsp;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.crypto.AesEncrypter;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.interact.wi.WiClientService;

public final class WiRestAuthUtil
{
  private static int tokenTimeOutTime = Configuration.getControllerPropInstance().getInt("WI.rest.login.tokenValidTime", 
    10);

  private static String unsToWiAuthType = Configuration.getControllerPropInstance().getString("Uns.to.WI.AuthType");

  private static String wiRestUserName = Configuration.getControllerPropInstance().getString("Uns.to.WI.userName");
  private static String wiRestUserPwd = Configuration.getControllerPropInstance().getString("Uns.to.WI.password");
  private static Map<String, Token> wiTokenMap = new HashMap<String, Token>();

  private static boolean systemAuth = false;

  static
  {
    if ((!CommonUtils.checkAllStringNull(new String[] { unsToWiAuthType })) && 
      (unsToWiAuthType.equalsIgnoreCase("system")))
    {
      systemAuth = true;
    }
  }
  
  public static boolean checkSystemAuth(WiClientService wiclient, String ipInfo)
  {
    if (!isSystemAuth())
    {
      return true;
    }

    Token token = (Token)wiTokenMap.get(ipInfo);
    if (token != null)
    {
      long duringTime = System.currentTimeMillis() - token.getStartTime();
      if (tokenTimeOutTime - TimeUnit.MILLISECONDS.toMinutes(duringTime) > 2L)
      {
        return true;
      }
      LogUtils.VDESKTOP_LOG.debug("need update token ");

      if (updateAuthToken(wiclient, ipInfo, token))
      {
        return true;
      }
    }

    LogUtils.VDESKTOP_LOG.debug("need reLoing WI");

    return loginWiSystem(wiclient, ipInfo);
  }

  private static boolean updateAuthToken(WiClientService wiclient, String ipInfo, Token token)
  {
    try
    {
      UpdateTokenReq req = new UpdateTokenReq();
      req.setOldTokenId(token.getTokenId());
      UpdateTokenRsp rsp = wiclient.updateToken(req);

      if (ResultCode.SUCCESS.getCode() == rsp.getResultCode())
      {
        token.setTokenId(rsp.getNewTokenId());
        token.setStartTime(System.currentTimeMillis());
        wiTokenMap.put(ipInfo, token);
        return true;
      }

      LogUtils.VDESKTOP_LOG.error("update token error. rsp = " + rsp);
      wiTokenMap.remove(ipInfo);

      LogUtils.VDESKTOP_LOG.debug("rsp" + rsp);
    }
    catch (Exception e)
    {
      LogUtils.VDESKTOP_LOG.error(e);
    }
    return false;
  }
  
  private static boolean loginWiSystem(WiClientService wiclient, String ipInfo)
  {
    try
    {
      LoginSystemReq req = new LoginSystemReq();

      req.setUserName(wiRestUserName);

      if (CommonUtils.checkAllStringNull(new String[] { wiRestUserPwd }))
      {
        LogUtils.VDESKTOP_LOG.error("wiRestUserPwd is null.");
        return false;
      }

      String password = AesEncrypter.decrypt(wiRestUserPwd);
      req.setPassword(password);
      LoginSystemRsp rsp = wiclient.loginSystem(req);

      LogUtils.VDESKTOP_LOG.debug("rsp" + rsp);
      if ((rsp != null) && (ResultCode.SUCCESS.getCode() == rsp.getResultCode()))
      {
        Token token = new Token();
        token.setTokenId(rsp.getTokenId());
        token.setStartTime(System.currentTimeMillis());
        wiTokenMap.put(ipInfo, token);
        LogUtils.VDESKTOP_LOG.info("login WI system " + ipInfo + " success.");
        return true;
      }

      LogUtils.VDESKTOP_LOG.error("loginWiSystem  error. rsp = " + rsp + " ipInfo = " + ipInfo);
    }
    catch (Exception e)
    {
      LogUtils.VDESKTOP_LOG.error(e);
      LogUtils.VDESKTOP_LOG.error("loginWiSystem  error. ipInfo = " + ipInfo);
    }
    return false;
  }

  public static boolean isSystemAuth()
  {
    return systemAuth;
  }

  public static void removeToken(String ipInfo)
  {
    wiTokenMap.remove(ipInfo);
  }

  public static Map<String, Token> getWiTokenMap()
  {
    return wiTokenMap;
  }

  public static void setWiTokenMap(Map<String, Token> wiTokenMap)
  {
    WiRestAuthUtil.wiTokenMap = wiTokenMap;
  }
}