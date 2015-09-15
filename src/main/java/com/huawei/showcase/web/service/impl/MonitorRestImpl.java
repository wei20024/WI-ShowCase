package com.huawei.showcase.web.service.impl;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;

import org.springframework.stereotype.Service;

import com.huawei.showcase.common.enumcode.ResultCode;
import com.huawei.showcase.model.response.MonitorRsp;
import com.huawei.showcase.web.service.MonitorRest;


@Service
public class MonitorRestImpl
  implements MonitorRest
{

  private static ResultCode resultCode = ResultCode.SUCCESS;

  @Context
  private HttpServletRequest req;

  /**
   * 对外提供监视该系统运行状态
   * @author wzf
   *
   */
  public MonitorRsp monitorStatus()
  {
    MonitorRsp rsp = new MonitorRsp();
    rsp.setResultCode(resultCode.getCode());
    rsp.setWiState("ok");
  
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