package com.huawei.showcase.web.service.impl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huawei.showcase.common.enumcode.ResultCode;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.common.util.log.TransactionIdUtil;
import com.huawei.showcase.model.request.ChangePwdReq;
import com.huawei.showcase.model.request.LoginReq;
import com.huawei.showcase.model.response.ChangePwdRsp;
import com.huawei.showcase.model.response.LoginRsp;
import com.huawei.showcase.model.response.UsernameRsp;
import com.huawei.showcase.services.LoginManageService;
import com.huawei.showcase.web.service.LoginAction;

@Service
public class LoginActionImpl implements LoginAction
{

  @Context
  private HttpServletRequest httpReq;

  @Context
  private HttpServletResponse httpRsp;
  
  @Autowired
  private LoginManageService loginManage;

  public LoginRsp login(LoginReq loginreq)
  {
    TransactionIdUtil.setCurrentTransactionId(CommonUtils.createTransactoinId(loginreq.getUserName()));
    return this.loginManage.login(loginreq);
  }
/***
 * @since 2015/8/19 11:57
 * 获取session中的用户名
 */
  public UsernameRsp getUsername()
  {
    LogUtils.USERLOGIN_LOG.enterMethod();
    UsernameRsp usernamersp = new UsernameRsp();

    HttpSession session = this.httpReq.getSession(false);
    String username = "";
    if (session != null)
    {
      username = (String)session.getAttribute("username");
    }
    else
    {
      LogUtils.USERLOGIN_LOG.error("getusername is null.session is null.");
    }

    if ((username == null) || (username.equals("")))
    {
      username = "unknow";
      usernamersp.setResultCode(ResultCode.USERNAME_UNNORMAL.getCode());
      usernamersp.setResultDesc(ResultCode.USERNAME_UNNORMAL.getMessage());
      usernamersp.setLoginusername(username);
    }
    else
    {
      usernamersp.setResultCode(ResultCode.OPERATE_SUCCESS.getCode());
      usernamersp.setResultDesc(ResultCode.OPERATE_SUCCESS.getMessage());
      usernamersp.setLoginusername(username);
    }
    LogUtils.USERLOGIN_LOG.exitMethod();
    return usernamersp;
  }

  public ChangePwdRsp changePWD(ChangePwdReq changepwdreq)
  {
    return this.loginManage.changePWD(changepwdreq);
  }

  public void setLoginManage(LoginManageService loginManage)
  {
    this.loginManage = loginManage;
  }
}