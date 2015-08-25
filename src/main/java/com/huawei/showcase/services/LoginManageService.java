package com.huawei.showcase.services;

import com.huawei.showcase.model.UserGroupInfo;
import com.huawei.showcase.model.request.ChangePwdReq;
import com.huawei.showcase.model.request.LoginReq;
import com.huawei.showcase.model.response.ChangePwdRsp;
import com.huawei.showcase.model.response.LoginRsp;

public abstract interface LoginManageService
{
  public abstract LoginRsp login(LoginReq paramLoginReq);
  public UserGroupInfo getUserGroup(LoginReq req);
  public abstract ChangePwdRsp changePWD(ChangePwdReq paramChangePwdReq);

}