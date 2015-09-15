package com.huawei.showcase.services;

import com.huawei.showcase.model.request.DescribeVMUserCustomPolicyReq;
import com.huawei.showcase.model.request.FavoriteAppReq;
import com.huawei.showcase.model.request.GetAppLoginInfoReq;
import com.huawei.showcase.model.request.GetConfigInfoReq;
import com.huawei.showcase.model.request.GetIconReq;
import com.huawei.showcase.model.request.GetLoginInfoReq;
import com.huawei.showcase.model.request.GetSessionByUserNameReq;
import com.huawei.showcase.model.request.GetUserInfoReq;
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
import com.huawei.showcase.model.response.GetSessionByUserNameRsp;
import com.huawei.showcase.model.response.GetUserInfoRsp;
import com.huawei.showcase.model.response.GetVmListRsp;
import com.huawei.showcase.model.response.ModifyUserVMPolicyRsp;
import com.huawei.showcase.model.response.MonitorRsp;
import com.huawei.showcase.model.response.QueryVmStatusRsp;
import com.huawei.showcase.model.response.RebootUserVMRsp;
import com.huawei.showcase.model.response.VNCLoginActionRsp;

public abstract interface AppCloudService
{
  public abstract MonitorRsp monitorStatus();

  public abstract GetUserInfoRsp getUserInfo(GetUserInfoReq paramGetUserInfoReq);

  public abstract GetVmListRsp getVmList(GetVmListReq paramGetVmListReq);

  public abstract QueryVmStatusRsp queryVmStatus(QueryVmStatusReq paramQueryVmStatusReq);

  public abstract GetLoginInfoRsp getLoginInfo(GetLoginInfoReq paramGetLoginInfoReq);

  public abstract VNCLoginActionRsp vncLoginAction(VncLoginReq paramVncLoginReq);

  public abstract RebootUserVMRsp restartDesktop(RebootUserVMReq paramRebootUserVMReq);

  public abstract DescribeVMUserCustomPolicyRsp describeVMUserCustomPolicy(DescribeVMUserCustomPolicyReq paramDescribeVMUserCustomPolicyReq);

  public abstract ModifyUserVMPolicyRsp modifyVMUserCustomPolicy(ModifyVMUserCustomPolicyReq paramModifyVMUserCustomPolicyReq);

  public abstract GetConfigInfoRsp getConfigInfo(GetConfigInfoReq paramGetConfigInfoReq);

  public abstract GetAppLoginInfoRsp getApploginInfo(GetAppLoginInfoReq paramGetAppLoginInfoReq);

  public abstract FavoriteAppRsp dealFavoriteApp(FavoriteAppReq paramFavoriteAppReq);

  public abstract GetIconRsp getAppIcon(GetIconReq paramGetIconReq);

  public abstract GetSessionByUserNameRsp getSessionByUserName(GetSessionByUserNameReq paramGetSessionByUserNameReq);

}