package com.huawei.showcase.web.service;

import com.huawei.showcase.model.response.ChangePwdRsp;
import com.huawei.showcase.model.response.LoginRsp;
import com.huawei.showcase.model.request.ChangePwdReq;
import com.huawei.showcase.model.request.LoginReq;
import com.huawei.showcase.model.response.UsernameRsp;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@Path("login")
public abstract interface LoginAction
{
  @POST
  @Path("/loginWI")
  @Produces({"application/json"})
  public abstract LoginRsp login(LoginReq paramLoginReq);

  @POST
  @Path("/loginUsername")
  @Produces({"application/json"})
  public abstract UsernameRsp getUsername();

  @POST
  @Path("/changepwd")
  @Produces({"application/json"})
  public abstract ChangePwdRsp changePWD(ChangePwdReq paramChangePwdReq);
}