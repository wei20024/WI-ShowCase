package com.huawei.showcase.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.crypto.AesEncrypter;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.interact.wi.WiClientProxyService;
import com.huawei.showcase.interact.wi.WiClientService;
import com.huawei.showcase.model.request.LoginReq;
import com.huawei.showcase.model.response.LoginRsp;
import com.huawei.showcase.services.CustomService;

@Service
public class CustomServiceImpl
  implements CustomService
{

  @Autowired
  private WiClientService wiClientService;

  @Autowired
  //private WiClientProxyService wiService;

  public LoginRsp authentication(LoginReq req)
  {
    LoginRsp rsp = new LoginRsp();
    String passwordbase64 = null;
    try
    {
      passwordbase64 = AesEncrypter.getBASE64(req.getPassword().getBytes("utf-8"));
    }
    catch (Exception e)
    {
      LogUtils.VDESKTOP_LOG.error(e);
    }
    if (CommonUtils.checkAllStringNull(new String[] { passwordbase64 }))
    {
      passwordbase64 = req.getPassword();
    }

    req.setPassword(passwordbase64);

    rsp = this.wiClientService.login(req);
   
    return rsp;
  }
}