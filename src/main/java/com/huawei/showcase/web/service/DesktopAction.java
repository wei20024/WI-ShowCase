package com.huawei.showcase.web.service;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import com.huawei.showcase.model.request.DescribeVMUserCustomPolicyReq;
import com.huawei.showcase.model.request.FavoriteAppReq;
import com.huawei.showcase.model.request.GetAppLoginInfoReq;
import com.huawei.showcase.model.request.GetConfigInfoReq;
import com.huawei.showcase.model.request.GetIconReq;
import com.huawei.showcase.model.request.GetLoginInfoReq;
import com.huawei.showcase.model.request.GetVmListReq;
import com.huawei.showcase.model.request.ModifyVMUserCustomPolicyReq;
import com.huawei.showcase.model.request.QueryVmStatusReq;
import com.huawei.showcase.model.request.RebootUserVMReq;
import com.huawei.showcase.model.request.VncLoginReq;
import com.huawei.showcase.model.response.DescribeVMUserCustomPolicyRsp;
import com.huawei.showcase.model.response.FavoriteAppRsp;
import com.huawei.showcase.model.response.GetAppLoginInfoRsp;
import com.huawei.showcase.model.response.GetConfigInfoRsp;
import com.huawei.showcase.model.response.GetIconRsp;
import com.huawei.showcase.model.response.GetLoginInfoRsp;
import com.huawei.showcase.model.response.GetVmListRsp;
import com.huawei.showcase.model.response.LogOutRsp;
import com.huawei.showcase.model.response.ModifyUserVMPolicyRsp;
import com.huawei.showcase.model.response.QueryVmStatusRsp;
import com.huawei.showcase.model.response.RebootUserVMRsp;
import com.huawei.showcase.model.response.VNCLoginActionRsp;

@Path("desktop")
public abstract interface DesktopAction
{
  @POST
  @Path("/getvmlist")
  @Produces({"application/json"})
  public abstract GetVmListRsp getVmList(GetVmListReq paramGetVmListReq);

  @POST
  @Path("/queryVmStatus")
  @Produces({"application/json"})
  public abstract QueryVmStatusRsp queryVmStatus(QueryVmStatusReq paramQueryVmStatusReq);

  @POST
  @Path("/getlogininfo")
  @Produces({"application/json"})
  public abstract GetLoginInfoRsp getLoginInfo(GetLoginInfoReq paramGetLoginInfoReq);

  @POST
  @Path("/logout")
  @Produces({"application/json"})
  public abstract LogOutRsp loginOut();

  @POST
  @Path("/getvnclogininfo")
  @Produces({"application/json"})
  public abstract VNCLoginActionRsp vncLoginAction(VncLoginReq paramVncLoginReq);

  @POST
  @Path("/reboot")
  @Produces({"application/json"})
  public abstract RebootUserVMRsp restartDesktop(RebootUserVMReq paramRebootUserVMReq);

  @POST
  @Path("/getvmspowerset")
  @Produces({"application/json"})
  public abstract DescribeVMUserCustomPolicyRsp describeVMUserCustomPolicy(DescribeVMUserCustomPolicyReq paramDescribeVMUserCustomPolicyReq);

  @POST
  @Path("/setvmspowerset")
  @Produces({"application/json"})
  public abstract ModifyUserVMPolicyRsp modifyVMUserCustomPolicy(ModifyVMUserCustomPolicyReq paramModifyVMUserCustomPolicyReq);

  @POST
  @Path("/getconfiginfo")
  @Produces({"application/json"})
  public abstract GetConfigInfoRsp getConfigInfo(GetConfigInfoReq paramGetConfigInfoReq);

  @POST
  @Path("/getApploginInfo")
  @Produces({"application/json"})
  public abstract GetAppLoginInfoRsp getApploginInfo(GetAppLoginInfoReq paramGetAppLoginInfoReq);

  @POST
  @Path("/getAppIcon")
  @Produces({"application/json"})
  public abstract GetIconRsp getAppIcon(GetIconReq paramGetIconReq);

  @POST
  @Path("/dealFavoriteApp")
  @Produces({"application/json"})
  public abstract FavoriteAppRsp dealFavoriteApp(FavoriteAppReq paramFavoriteAppReq);

}