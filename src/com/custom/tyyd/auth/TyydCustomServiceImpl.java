package com.custom.tyyd.auth;

import com.huawei.common.custom.inf.CustomService;
import com.huawei.common.custom.meta.request.ExtendFunctionReq;
import com.huawei.common.custom.meta.request.LoginReq;
import com.huawei.common.custom.meta.response.ExtendFunctionRsp;
import com.huawei.common.custom.meta.response.LoginRsp;

public class TyydCustomServiceImpl
  implements CustomService
{
  public LoginRsp authentication(LoginReq req)
  {
    return TyydCustomUtil.authenticationWith4A(req);
  }

  public ExtendFunctionRsp extendFunction(ExtendFunctionReq arg0)
  {
    return TyydCustomUtil.resetPwd(arg0);
  }

  public LoginRsp preAuthentication(LoginReq req)
  {
    LoginRsp rsp = new LoginRsp();
    rsp.setResultCode(0);
    return rsp;
  }
}