package com.huawei.showcase.services;

import com.huawei.showcase.model.request.LoginReq;
import com.huawei.showcase.model.response.LoginRsp;

public abstract interface CustomService
{
  public abstract LoginRsp authentication(LoginReq paramLoginReq);

}