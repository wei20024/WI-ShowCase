package com.huawei.showcase.interact.wi;

import java.io.Serializable;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import com.huawei.showcase.model.request.ChangePwdReq;
import com.huawei.showcase.model.request.DescribeVMUserCustomPolicyReq;
import com.huawei.showcase.model.request.FavoriteAppReq;
import com.huawei.showcase.model.request.GetAppLoginInfoReq;
import com.huawei.showcase.model.request.GetIconReq;
import com.huawei.showcase.model.request.GetLoginInfoReq;
import com.huawei.showcase.model.request.GetSessionByUserNameReq;
import com.huawei.showcase.model.request.GetUserInfoReq;
import com.huawei.showcase.model.request.GetVmListReq;
import com.huawei.showcase.model.request.LoginReq;
import com.huawei.showcase.model.request.LoginSystemReq;
import com.huawei.showcase.model.request.ModifyVMUserCustomPolicyReq;
import com.huawei.showcase.model.request.QueryVmStatusReq;
import com.huawei.showcase.model.request.RebootUserVMReq;
import com.huawei.showcase.model.request.UpdateTokenReq;
import com.huawei.showcase.model.request.VncLoginReq;
import com.huawei.showcase.model.response.ChangePwdRsp;
import com.huawei.showcase.model.response.DescribeVMUserCustomPolicyRsp;
import com.huawei.showcase.model.response.FavoriteAppRsp;
import com.huawei.showcase.model.response.GetAppLoginInfoRsp;
import com.huawei.showcase.model.response.GetIconRsp;
import com.huawei.showcase.model.response.GetLoginInfoRsp;
import com.huawei.showcase.model.response.GetSessionByUserNameRsp;
import com.huawei.showcase.model.response.GetUserInfoRsp;
import com.huawei.showcase.model.response.GetVmListRsp;
import com.huawei.showcase.model.response.LoginRsp;
import com.huawei.showcase.model.response.LoginSystemRsp;
import com.huawei.showcase.model.response.ModifyUserVMPolicyRsp;
import com.huawei.showcase.model.response.MonitorRsp;
import com.huawei.showcase.model.response.QueryVmStatusRsp;
import com.huawei.showcase.model.response.RebootUserVMRsp;
import com.huawei.showcase.model.response.UpdateTokenRsp;
import com.huawei.showcase.model.response.VncLoginUnsRsp;

@Produces({"application/json"})
@Consumes({"application/json"})
@Path("/api")
public abstract interface WiClientService extends Serializable
{
  public static final long serialVersionUID = 64626574880L;

  @GET
  @Path("/monitor/monitorStatus")
  @Produces({"application/json"})
  public abstract MonitorRsp monitorStatus();

  @POST
  @Path("/auth/login")
  @Produces({"application/json"})
  public abstract LoginRsp login(LoginReq paramLoginReq);



  @POST
  @Path("/auth/changePwd")
  @Produces({"application/json"})
  public abstract ChangePwdRsp changePWD(ChangePwdReq paramChangePwdReq);

  @POST
  @Path("/auth/getUserInfo")
  @Produces({"application/json"})
  public abstract GetUserInfoRsp getUserInfo(GetUserInfoReq paramGetUserInfoReq);

  @POST
  @Path("/desktop/getVmList")
  @Produces({"application/json"})
  public abstract GetVmListRsp getVmList(GetVmListReq paramGetVmListReq);

  @POST
  @Path("/desktop/queryVmStatus")
  @Produces({"application/json"})
  public abstract QueryVmStatusRsp queryVmStatus(QueryVmStatusReq paramQueryVmStatusReq);

  @POST
  @Path("/desktop/getLoginInfo")
 // @Path("/desktop/loginVm")
  @Produces({"application/json"})
  public abstract GetLoginInfoRsp getLoginInfo(GetLoginInfoReq paramGetLoginInfoReq);

  @POST
  @Path("/desktop/getVncLoginInfo")
  @Produces({"application/json"})
  public abstract VncLoginUnsRsp vncLoginAction(VncLoginReq paramVncLoginReq);

  @POST
  @Path("/desktop/rebootVm")
  @Produces({"application/json"})
  public abstract RebootUserVMRsp restartDesktop(RebootUserVMReq paramRebootUserVMReq);

  @POST
  @Path("/desktop/getVmsPowerSet")
  @Produces({"application/json"})
  public abstract DescribeVMUserCustomPolicyRsp describeVMUserCustomPolicy(DescribeVMUserCustomPolicyReq paramDescribeVMUserCustomPolicyReq);

  @POST
  @Path("/desktop/setVmsPowerSet")
  @Produces({"application/json"})
  public abstract ModifyUserVMPolicyRsp modifyVMUserCustomPolicy(ModifyVMUserCustomPolicyReq paramModifyVMUserCustomPolicyReq);

  @POST
  @Path("/desktop/getApploginInfo")
  @Produces({"application/json"})
  public abstract GetAppLoginInfoRsp getApploginInfo(GetAppLoginInfoReq paramGetAppLoginInfoReq);

  @POST
  @Path("/desktop/dealFavoriteApp")
  @Produces({"application/json"})
  public abstract FavoriteAppRsp dealFavoriteApp(FavoriteAppReq paramFavoriteAppReq);

  @POST
  @Path("/desktop/getAppIcon")
  @Produces({"application/json"})
  public abstract GetIconRsp getAppIcon(GetIconReq paramGetIconReq);

  @POST
  @Path("/desktop/getSessionByUserName")
  @Produces({"application/json"})
  public abstract GetSessionByUserNameRsp getSessionByUserName(GetSessionByUserNameReq paramGetSessionByUserNameReq);


  @POST
  @Path("/auth/loginSystem")
  @Produces({"application/json"})
  public abstract LoginSystemRsp loginSystem(LoginSystemReq paramLoginSystemReq);

  @POST
  @Path("/auth/updateToken")
  @Produces({"application/json"})
  public abstract UpdateTokenRsp updateToken(UpdateTokenReq paramUpdateTokenReq);
}