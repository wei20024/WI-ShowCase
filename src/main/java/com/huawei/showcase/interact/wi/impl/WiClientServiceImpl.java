package com.huawei.showcase.interact.wi.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huawei.showcase.model.response.ChangePwdRsp;
import com.huawei.showcase.model.response.CommonRsp;
import com.huawei.showcase.model.response.LoginRsp;
import com.huawei.showcase.common.enumcode.ResultCode;
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
import com.huawei.showcase.model.request.SessionLogoffReq;
import com.huawei.showcase.model.request.UnsCommonReq;
import com.huawei.showcase.model.request.UpdateTokenReq;
import com.huawei.showcase.model.request.VncLoginReq;
import com.huawei.showcase.model.response.DescribeVMUserCustomPolicyRsp;
import com.huawei.showcase.model.response.FavoriteAppRsp;
import com.huawei.showcase.model.response.GetAppLoginInfoRsp;
import com.huawei.showcase.model.response.GetIconRsp;
import com.huawei.showcase.model.response.GetLoginInfoRsp;
import com.huawei.showcase.model.response.GetSessionByUserNameRsp;
import com.huawei.showcase.model.response.GetUserInfoRsp;
import com.huawei.showcase.model.response.GetVmListRsp;
import com.huawei.showcase.model.response.LoginSystemRsp;
import com.huawei.showcase.model.response.ModifyUserVMPolicyRsp;
import com.huawei.showcase.model.response.MonitorRsp;
import com.huawei.showcase.model.response.QueryVmStatusRsp;
import com.huawei.showcase.model.response.RebootUserVMRsp;
import com.huawei.showcase.model.response.SessionLogoffRsp;
import com.huawei.showcase.model.response.UpdateTokenRsp;
import com.huawei.showcase.model.response.VncLoginUnsRsp;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.interact.wi.WiClientProxyService;
import com.huawei.showcase.interact.wi.WiClientService;

@Service
public class WiClientServiceImpl  implements WiClientService
{
  private static final long serialVersionUID = 234567890L;

  @Autowired
  private WiClientProxyService wiService;

  public GetVmListRsp getVmList(GetVmListReq req)
  {
    GetVmListRsp vmRsp = (GetVmListRsp)this.wiService.handleRequest("getVmList", req);
    GetVmListRsp rsp = new GetVmListRsp();
    if (vmRsp == null)
    {
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
      return rsp;
    }
    if (ResultCode.SUCCESS.getCode() != vmRsp.getResultCode())
    {
      LogUtils.LOG.error("errorCode= " + vmRsp.getResultCode() + ", errorMessage= " + vmRsp.getResultDesc());
      rsp.setResultCode(vmRsp.getResultCode());
      rsp.setResultDesc(vmRsp.getResultCode() + vmRsp.getResultDesc());
      return rsp;
    }
    return vmRsp;
  }

  public GetLoginInfoRsp getLoginInfo(GetLoginInfoReq req)
  {
    GetLoginInfoRsp rsp = (GetLoginInfoRsp)this.wiService.handleRequest("getLoginInfo", req);
    if (rsp == null)
    {
      rsp = new GetLoginInfoRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public VncLoginUnsRsp vncLoginAction(VncLoginReq req)
  {
    VncLoginUnsRsp rsp = (VncLoginUnsRsp)this.wiService.handleRequest("vncLoginAction", req);
    if (rsp == null)
    {
      rsp = new VncLoginUnsRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public RebootUserVMRsp restartDesktop(RebootUserVMReq req)
  {
    RebootUserVMRsp rsp = (RebootUserVMRsp)this.wiService.handleRequest("restartDesktop", req);
    if (rsp == null)
    {
      rsp = new RebootUserVMRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public DescribeVMUserCustomPolicyRsp describeVMUserCustomPolicy(DescribeVMUserCustomPolicyReq req)
  {
    DescribeVMUserCustomPolicyRsp rsp = (DescribeVMUserCustomPolicyRsp)this.wiService.handleRequest(
      "describeVMUserCustomPolicy", req);
    if (rsp == null)
    {
      rsp = new DescribeVMUserCustomPolicyRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public ModifyUserVMPolicyRsp modifyVMUserCustomPolicy(ModifyVMUserCustomPolicyReq req)
  {
    ModifyUserVMPolicyRsp rsp = (ModifyUserVMPolicyRsp)this.wiService.handleRequest("modifyVMUserCustomPolicy", req);
    if (rsp == null)
    {
      rsp = new ModifyUserVMPolicyRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public LoginRsp login(LoginReq req)
  {
    LoginRsp rsp = (LoginRsp)this.wiService.handleRequest("login", req);
    if (rsp == null)
    {
      rsp = new LoginRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
    }
    return rsp;
  }

  public ChangePwdRsp changePWD(ChangePwdReq req)
  {
    ChangePwdRsp rsp = (ChangePwdRsp)this.wiService.handleRequest("changePWD", req);
    if (rsp == null)
    {
      rsp = new ChangePwdRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public QueryVmStatusRsp queryVmStatus(QueryVmStatusReq req)
  {
    QueryVmStatusRsp rsp = (QueryVmStatusRsp)this.wiService.handleRequest("queryVmStatus", req);
    if (rsp == null)
    {
      rsp = new QueryVmStatusRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public GetUserInfoRsp getUserInfo(GetUserInfoReq req)
  {
    GetUserInfoRsp rsp = (GetUserInfoRsp)this.wiService.handleRequest("getUserInfo", req);
    if (rsp == null)
    {
      rsp = new GetUserInfoRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public MonitorRsp monitorStatus()
  {
    return null;
  }

  public GetAppLoginInfoRsp getApploginInfo(GetAppLoginInfoReq req)
  {
    GetAppLoginInfoRsp rsp = (GetAppLoginInfoRsp)this.wiService.handleRequest("getApploginInfo", req);
    if (rsp == null)
    {
      rsp = new GetAppLoginInfoRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public FavoriteAppRsp dealFavoriteApp(FavoriteAppReq req)
  {
    FavoriteAppRsp rsp = (FavoriteAppRsp)this.wiService.handleRequest("dealFavoriteApp", req);
    if (rsp == null)
    {
      rsp = new FavoriteAppRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public GetIconRsp getAppIcon(GetIconReq req)
  {
    GetIconRsp rsp = (GetIconRsp)this.wiService.handleRequest("getAppIcon", req);
    if (rsp == null)
    {
      rsp = new GetIconRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public GetSessionByUserNameRsp getSessionByUserName(GetSessionByUserNameReq req)
  {
    GetSessionByUserNameRsp vmRsp = (GetSessionByUserNameRsp)this.wiService.handleRequest("getSessionByUserName", req);
    GetSessionByUserNameRsp rsp = new GetSessionByUserNameRsp();

    if (vmRsp == null)
    {
      LogUtils.LOG.error("vmRsp is null.");
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      return rsp;
    }
    if (ResultCode.SUCCESS.getCode() != vmRsp.getResultCode())
    {
      LogUtils.LOG.error("errorCode= " + vmRsp.getResultCode() + ", errorMessage= " + vmRsp.getResultDesc());
      rsp.setResultCode(vmRsp.getResultCode());
      rsp.setResultDesc(vmRsp.getResultCode() + vmRsp.getResultDesc());
      return rsp;
    }

    return vmRsp;
  }

  public LoginSystemRsp loginSystem(LoginSystemReq req)
  {
    LoginSystemRsp rsp = (LoginSystemRsp)this.wiService.handleRequest("loginSystem", req);
    if (rsp == null)
    {
      rsp = new LoginSystemRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }

  public UpdateTokenRsp updateToken(UpdateTokenReq req)
  {
    UpdateTokenRsp rsp = (UpdateTokenRsp)this.wiService.handleRequest("updateToken", req);

    if (rsp == null)
    {
      rsp = new UpdateTokenRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.LOG.error(rsp);
    }
    return rsp;
  }
}