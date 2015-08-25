package com.huawei.showcase.rest.impl;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

import org.springframework.stereotype.Service;

import com.huawei.showcase.common.enumcode.ResultCode;
import com.huawei.showcase.model.response.MonitorRsp;
import com.huawei.showcase.rest.MonitorRest;

@Service
public class MonitorRestImpl
  implements MonitorRest
{
  //private static final String VERSION_NAME = "versionName";
  //private static final String VERSION_CODE = "versionCode";
  //private static final String CLIENT_DOWNLOAD_PATH = "clientDownloadPath";
  //private static final String ANDROID_CLIENT_VERSION = "androidClientVersion";
  //private static final String IOS_CLIENT_VERSION = "iosClientVersion";
  //private static final String SMSOTPAUTH = "dynamicPassword.SMSOTPAuth";
  //private static final String ANONYMOUS = "anonymousFlag";
  //private static final String NOTICEZH = "noticeZH";
  //private static final String NOTICEEN = "noticeEN";
  private static ResultCode resultCode = ResultCode.SUCCESS;

  @Context
  private HttpServletRequest req;

  public MonitorRsp monitorStatus()
  {
    MonitorRsp rsp = new MonitorRsp();
    rsp.setResultCode(resultCode.getCode());
    rsp.setWiState("ok");
    rsp.setClientIP(this.req.getRemoteAddr());
    //rsp.setComponentInfos(ComponentMonitorUtil.getFaultComponentList());
    rsp.setComponentInfos(null);
    if ((resultCode.getCode() == ResultCode.SUCCESS.getCode()) && (!rsp.getComponentInfos().isEmpty()))
    {
      rsp.setResultCode(ResultCode.COMPONENT_ERROR.getCode());
      rsp.setResultDesc(ResultCode.COMPONENT_ERROR.getMessage());
    }
    return rsp;
  }


  public static ResultCode getResultCode()
  {
    return resultCode;
  }

  public static void setResultCode(ResultCode resultCode)
  {
    MonitorRestImpl.resultCode = resultCode;
  }
}