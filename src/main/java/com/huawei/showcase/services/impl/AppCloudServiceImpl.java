package com.huawei.showcase.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huawei.showcase.common.enumcode.GetConfigForbidKey;
import com.huawei.showcase.common.enumcode.ResultCode;
import com.huawei.showcase.common.enumcode.StaticNumber;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.crypto.AesEncrypter;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.common.util.log.TransactionIdUtil;
import com.huawei.showcase.interact.util.LocalConfigWI;
import com.huawei.showcase.interact.wi.WiClientProxyService;
import com.huawei.showcase.interact.wi.WiClientService;
import com.huawei.showcase.model.SessionModel;
import com.huawei.showcase.model.UserGroupInfo;
import com.huawei.showcase.model.VmModel;
import com.huawei.showcase.model.WiInfo;
import com.huawei.showcase.model.WiInterfaceModel;
import com.huawei.showcase.model.request.DescribeVMUserCustomPolicyReq;
import com.huawei.showcase.model.request.GetConfigInfoReq;
import com.huawei.showcase.model.request.GetLoginInfoReq;
import com.huawei.showcase.model.request.GetSessionByUserNameReq;
import com.huawei.showcase.model.request.GetUserInfoReq;
import com.huawei.showcase.model.request.GetVmListReq;
import com.huawei.showcase.model.request.ModifyVMUserCustomPolicyReq;
import com.huawei.showcase.model.request.QueryVmStatusReq;
import com.huawei.showcase.model.request.RebootUserVMReq;
import com.huawei.showcase.model.request.VncLoginReq;
import com.huawei.showcase.model.response.DescribeVMUserCustomPolicyRsp;
import com.huawei.showcase.model.response.GetConfigInfoMapRsp;
import com.huawei.showcase.model.response.GetConfigInfoRsp;
import com.huawei.showcase.model.response.GetLoginInfoRsp;
import com.huawei.showcase.model.response.GetSessionByUserNameRsp;
import com.huawei.showcase.model.response.GetUserInfoRsp;
import com.huawei.showcase.model.response.GetVmListRsp;
import com.huawei.showcase.model.response.ModifyUserVMPolicyRsp;
import com.huawei.showcase.model.response.MonitorRsp;
import com.huawei.showcase.model.response.QueryVmStatusRsp;
import com.huawei.showcase.model.response.RebootUserVMRsp;
import com.huawei.showcase.model.response.VNCLoginActionRsp;
import com.huawei.showcase.model.response.VncLoginUnsRsp;
import com.huawei.showcase.services.AppCloudService;

@Service
public class AppCloudServiceImpl implements AppCloudService
{
  private static final int POOL_SIZE = 300;

  @Autowired
  private WiClientService wiClientService;

  @Autowired
  private WiClientProxyService wiService;
  private ExecutorService executor;
  private Configuration loginPropConf = Configuration.getControllerPropInstance();
  

  @PostConstruct
  public void init()
  {
    this.executor = Executors.newFixedThreadPool(POOL_SIZE);
  }

  public GetVmListRsp getVmList(GetVmListReq req)
  {
    LogUtils.VDESKTOP_LOG.debug(req);

    GetVmListRsp rsp = new GetVmListRsp();

    List<VmModel> vmList = new ArrayList<VmModel>();
//    List<AppModel> appList = new ArrayList<AppModel>();
//    List<AppModel> myAppList = new ArrayList<AppModel>();

    Map<String, List<WiInterfaceModel>>  hdcMap = this.wiService.getWIMap();

    if ((hdcMap == null) || (hdcMap.isEmpty()))
    {
      LogUtils.VDESKTOP_LOG.error("hdc list is null.");
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc("hdc list is null.");
      return rsp;
    }

    List<String> wiInfos = LocalConfigWI.getWiIds();
    LogUtils.VDESKTOP_LOG.debug("farmIds = " + wiInfos);
    if (wiInfos.size() == 1)
    {
      req.setGroupId((String)wiInfos.get(0));
      return getVmListBySingleFarm(req);
    }
    
    List<Future<GetVmListRsp>> lst = new ArrayList<Future<GetVmListRsp>>();
    for (final String wiId : wiInfos)
    {
      final GetVmListReq getVmListReq = new GetVmListReq();
      getVmListReq.setCurrentSessionMap(req.getCurrentSessionMap());
      //getVmListReq.setGroupId(req.getGroupId());
      getVmListReq.setIsEmergencyLogin(req.getIsEmergencyLogin());
      getVmListReq.setRetry(req.getRetry());
      getVmListReq.setTokenId(req.getTokenId());
      getVmListReq.setTransactionId(req.getTransactionId());
      getVmListReq.setUserId(req.getUserId());
      getVmListReq.setUserInfo(req.getUserInfo());
      getVmListReq.getUserInfo().setDomain(null);
      getVmListReq.setCurrentSession(req.getCurrentSession());
      getVmListReq.setTransactionId(req.getTransactionId());
      getVmListReq.setGroupId(wiId);
      getVmListReq.setQueryType(req.getQueryType());

      Future<GetVmListRsp> future = this.executor.submit(new Callable<GetVmListRsp>()
      {
        public GetVmListRsp call()
        {
          try
          {
            TransactionIdUtil.setCurrentTransactionId(getVmListReq.getTransactionId());
            GetVmListRsp getListRsp = AppCloudServiceImpl.this.wiClientService.getVmList(getVmListReq);
            getListRsp.setFarmId(wiId);
            return getListRsp;
          }
          catch (Exception e)
          {
            LogUtils.VDESKTOP_LOG.error(e);
          }
          return null;
        }
      });
      lst.add(future);
    }

    boolean healFlag = false;
    String message = null;
    int retCode = StaticNumber.ZERO.getCode();
    GetVmListRsp getRsp = null;

    for (Future<GetVmListRsp> future : lst)
    {
      try
      {
        getRsp = (GetVmListRsp)future.get(StaticNumber.SIXTY.getCode(), TimeUnit.SECONDS);
      }
      catch (Exception e)
      {
        LogUtils.VDESKTOP_LOG.error(e);
      }

      if (getRsp == null)
      {
        LogUtils.VDESKTOP_LOG.error("vmRsp is null.");
        retCode = ResultCode.HDC_INVALID.getCode();
      }
      else if (ResultCode.SUCCESS.getCode() != getRsp.getResultCode())
      {
        LogUtils.VDESKTOP_LOG
          .error("errorCode= " + getRsp.getResultCode() + ", errorMessage= " + getRsp.getResultDesc());
        retCode = getRsp.getResultCode();
        message = getRsp.getResultDesc();
      }
      else
      {
        healFlag = true;

        vmList.addAll(dealVmList(req, getRsp));

      }

    }

    if (!healFlag)
    {
      LogUtils.VDESKTOP_LOG.info("query desktoplist of all the hdc is empty.");
      rsp.setResultCode(retCode);
      rsp.setResultDesc(message);
      return rsp;
    }

    rsp.setResultCode(ResultCode.SUCCESS.getCode());

    rsp.setVmList(vmList);
//    rsp.setAppInfos(appList);
//    rsp.setMyAppInfos(myAppList);

    LogUtils.VDESKTOP_LOG.debug(rsp);
    return rsp;
  }

  private GetVmListRsp getVmListBySingleFarm(GetVmListReq req)
  {
    LogUtils.VDESKTOP_LOG.debug(req);

    GetVmListRsp rsp = new GetVmListRsp();
    GetVmListRsp getRsp = this.wiClientService.getVmList(req);
    getRsp.setFarmId(req.getGroupId());

    String message = null;
    int retCode = StaticNumber.ZERO.getCode();

    if ((getRsp == null) || (ResultCode.SUCCESS.getCode() != getRsp.getResultCode()))
    {
      retCode = ResultCode.HDC_INVALID.getCode();
      rsp.setResultCode(retCode);
      rsp.setResultDesc(message);
      return rsp;
    }

      rsp.setVmList(dealVmList(req, getRsp));


     rsp.setResultCode(ResultCode.SUCCESS.getCode());

    LogUtils.VDESKTOP_LOG.debug(rsp);
    return rsp;
  }

 

  private List<VmModel> dealVmList(GetVmListReq req, GetVmListRsp getRsp)
  {
    List<VmModel> vmList = new ArrayList<VmModel>();
    List<String> vmIds = new ArrayList<String>();

    if ((getRsp != null) && (getRsp.getVmList() != null))
    {
      WiInfo wiInfo = (WiInfo)LocalConfigWI.getWiInfoMap().get(getRsp.getFarmId());

   
      if (wiInfo != null)
      {
    
        for (VmModel vm : getRsp.getVmList())
        {
          vm.setGroupId(getRsp.getFarmId());
          
          if (CommonUtils.checkAllStringNull(new String[] { vm.getSid() }))
          {
            vm.setSid(AesEncrypter.encodeBASE64(vm.getId()));
          }
          
          vm.setId(null);
     
          if (!vmIds.contains(vm.getSid()))
          {
            if ((!"api".equals(req.getRequestType())) && 
              ("ok".equalsIgnoreCase((String)req.getCurrentSession().getAttribute("EMERGENCYLOGON"))))
            {
              vm.setInMaintenanceMode("1");
            }
            vmIds.add(vm.getSid());
            vmList.add(vm);
          }
        }
      }
    }
    return vmList;
  }

  public QueryVmStatusRsp queryVmStatus(QueryVmStatusReq req)
  {
   

    QueryVmStatusRsp rsp = new QueryVmStatusRsp();

      GetVmListReq getVmListReq = new GetVmListReq();
      getVmListReq.setCurrentSessionMap(req.getCurrentSessionMap());
      getVmListReq.setGroupId(req.getGroupId());
      getVmListReq.setIsEmergencyLogin(req.getIsEmergencyLogin());
      getVmListReq.setRetry(req.getRetry());
      getVmListReq.setTokenId(req.getTokenId());
      getVmListReq.setTransactionId(req.getTransactionId());
      getVmListReq.setUserId(req.getUserId());
      getVmListReq.setUserInfo(req.getUserInfo());
      getVmListReq.getUserInfo().setDomain(null);
      getVmListReq.setCurrentSession(req.getCurrentSession());
      getVmListReq.setTransactionId(req.getTransactionId());
      getVmListReq.setGroupId(req.getGroupId());
      GetVmListRsp getListRsp = this.wiClientService.getVmList(getVmListReq);
      
      if (getListRsp != null && getListRsp.getResultCode() == ResultCode.SUCCESS.getCode())
      {
        List<VmModel> vmList = getListRsp.getVmList();
        for (VmModel vm : vmList)
        {
          if (vm.getSid().equals(req.getId()))
          {
            rsp.setVmStatus(vm.getState());
            rsp.setResultCode(ResultCode.SUCCESS.getCode());
            rsp.setResultDesc(ResultCode.SUCCESS.getMessage());
            break;
          }
        }
      }
      else
      {
        rsp.setResultCode(getListRsp.getResultCode());
        rsp.setResultDesc(getListRsp.getResultDesc());
      }
  
    return rsp;
  }

  public GetLoginInfoRsp getLoginInfo(GetLoginInfoReq req)
  {
    return this.wiClientService.getLoginInfo(req);
  }

  public VNCLoginActionRsp vncLoginAction(VncLoginReq req)
  {
    VncLoginUnsRsp vncRsp = this.wiClientService.vncLoginAction(req);
    VNCLoginActionRsp rsp = new VNCLoginActionRsp();
    if (vncRsp == null)
    {
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      LogUtils.VDESKTOP_LOG.error(rsp);
    }
    else
    {
      rsp.setResultCode(vncRsp.getResultCode());
      rsp.setResultDesc(vncRsp.getResultDesc());
      rsp.setAddressTicket(vncRsp.getAddressTicket());
      rsp.setLinkType(vncRsp.getLinkType());
      rsp.setPassword(vncRsp.getPassword());
      rsp.setTransactionId(vncRsp.getTransactionId());
      rsp.setVncGateIp(vncRsp.getVncGateIp());
    }
    return rsp;
  }

  public RebootUserVMRsp restartDesktop(RebootUserVMReq req)
  {
    return this.wiClientService.restartDesktop(req);
  }

  public DescribeVMUserCustomPolicyRsp describeVMUserCustomPolicy(DescribeVMUserCustomPolicyReq req)
  {
    return this.wiClientService.describeVMUserCustomPolicy(req);
  }

  public ModifyUserVMPolicyRsp modifyVMUserCustomPolicy(ModifyVMUserCustomPolicyReq req)
  {
    return this.wiClientService.modifyVMUserCustomPolicy(req);
  }

  /***
   * @since 2015/8/20
   */
  public GetConfigInfoRsp getConfigInfo(GetConfigInfoReq req)
  {
    LogUtils.VDESKTOP_LOG.enterMethod();

    GetConfigInfoRsp rsp = new GetConfigInfoRsp();

    if (req == null)
    {
      LogUtils.VDESKTOP_LOG.error("The params is null.");
      rsp.setResultCode(ResultCode.REQUEST_INVALID.getCode());
      rsp.setResultDesc(ResultCode.REQUEST_INVALID.getMessage());
      return rsp;
    }

    List<String> keyList = req.getConfigInfoList();
    List<GetConfigInfoMapRsp> configInfoKeyList = new ArrayList<GetConfigInfoMapRsp>();

    for (String key : keyList)
    {
      GetConfigInfoMapRsp configInfoValue = new GetConfigInfoMapRsp();

      if (key==null || (key.isEmpty()))continue;
      
      String propValue = this.loginPropConf.getString(key);
      if (propValue == null || propValue.isEmpty())continue;
        
      if (GetConfigForbidKey.containKey(key))
      {
        LogUtils.VDESKTOP_LOG.error("The key cannot be req key = " + key);
      }
      else
      {
        if ("multidomainconfig".equalsIgnoreCase(key))
        {
          String mutilDomainConfig = "";
          configInfoValue.setKey(key);
          configInfoValue.setValue(mutilDomainConfig);
        }
        else
        {
          configInfoValue.setKey(key);
          configInfoValue.setValue(propValue);
        }

        configInfoKeyList.add(configInfoValue);
      }
    }
    GetConfigInfoMapRsp configFlag = new GetConfigInfoMapRsp();
    configFlag.setKey("configFlag");

    configInfoKeyList.add(configFlag);

    rsp.setConfigKey(configInfoKeyList);
    rsp.setResultCode(ResultCode.SUCCESS.getCode());
    LogUtils.VDESKTOP_LOG.exitMethod();
    return rsp;
  }

 

  public GetUserInfoRsp getUserInfo(GetUserInfoReq getUserInfoReq)
  {
    if ("ok".equalsIgnoreCase(getUserInfoReq.getEmergencyLogonFlag()))
    {
      LogUtils.VDESKTOP_LOG.info("EMERGENCYLOGON Mode,AD is bad,return...");
      return null;
    }

    UserGroupInfo info = new UserGroupInfo();
    info.setUserName(getUserInfoReq.getUsername());
    getUserInfoReq.setGroupId(LocalConfigWI.getRandomWiId());

    return this.wiClientService.getUserInfo(getUserInfoReq);
  }

  public MonitorRsp monitorStatus()
  {
    return this.wiClientService.monitorStatus();
  }

 

  public GetSessionByUserNameRsp getSessionByUserName(GetSessionByUserNameReq req)
  {
    LogUtils.VDESKTOP_LOG.debug(req);

    GetSessionByUserNameRsp rsp = new GetSessionByUserNameRsp();
    List<SessionModel> sessionList = new ArrayList<SessionModel>();

    Map<String, List<WiInterfaceModel>>  hdcMap = this.wiService.getWIMap();

    if ((hdcMap == null) || (hdcMap.isEmpty()))
    {
      LogUtils.VDESKTOP_LOG.error("hdc list is null.");
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc("hdc list is null.");
      return rsp;
    }

    List<String> wiInfos = LocalConfigWI.getWiIds();

    for (String i : LocalConfigWI.getGloableWiInfos())
    {
      if (!wiInfos.contains(i))
      {
        wiInfos.add(i);
      }
    }

    List<Future<GetSessionByUserNameRsp>> lst = new ArrayList<Future<GetSessionByUserNameRsp>>();

    LogUtils.VDESKTOP_LOG.debug("groupIds = " + wiInfos);

    if (wiInfos.size() == 1)
    {
      req.setGroupId((String)wiInfos.get(0));
      return getSessionsBySingleFarm(req);
    }

    for (final String farmId : wiInfos)
    {
      final GetSessionByUserNameReq sessionReq = new GetSessionByUserNameReq();

      sessionReq.setCurrentSessionMap(req.getCurrentSessionMap());
      sessionReq.setGroupId(req.getGroupId());
      sessionReq.setRetry(req.getRetry());
      sessionReq.setTokenId(req.getTokenId());
      sessionReq.setTransactionId(req.getTransactionId());
      sessionReq.setUserId(req.getUserId());
      sessionReq.setDomain(null);
      sessionReq.setCurrentSession(req.getCurrentSession());
      sessionReq.setGroupId(farmId);

      Future<GetSessionByUserNameRsp> future = this.executor.submit(new Callable<GetSessionByUserNameRsp>()
      {
        public GetSessionByUserNameRsp call()
        {
          try
          {
            TransactionIdUtil.setCurrentTransactionId(sessionReq.getTransactionId());
            GetSessionByUserNameRsp getListRsp = AppCloudServiceImpl.this.wiClientService.getSessionByUserName(sessionReq);
            getListRsp.setGroupId(farmId);
            return getListRsp;
          }
          catch (Exception e)
          {
            LogUtils.VDESKTOP_LOG.error(e);
          }
          return null;
        }
      });
      lst.add(future);
    }

    boolean healFlag = false;

    String message = null;
    int retCode = StaticNumber.ZERO.getCode();;

    for (Future<GetSessionByUserNameRsp> future : lst)
    {
      GetSessionByUserNameRsp getRsp = null;
      try
      {
        getRsp = (GetSessionByUserNameRsp)future.get(StaticNumber.SIXTY.getCode(), TimeUnit.SECONDS);
      }
      catch (Exception e)
      {
        LogUtils.VDESKTOP_LOG.error(e);
      }

      if (getRsp == null)
      {
        LogUtils.VDESKTOP_LOG.error("sessionRsp is null.");
        retCode = ResultCode.HDC_INVALID.getCode();
      }
      else if (ResultCode.SUCCESS.getCode() != getRsp.getResultCode())
      {
        LogUtils.VDESKTOP_LOG
          .error("errorCode= " + getRsp.getResultCode() + ", errorMessage= " + getRsp.getResultDesc());
        retCode = getRsp.getResultCode();
        message = getRsp.getResultDesc();
      }
      else
      {
        healFlag = true;

        sessionList.addAll(dealSessionsList(req, getRsp));
      }

    }

    if (!healFlag)
    {
      LogUtils.VDESKTOP_LOG.error("query sessionlist of all the WI is empty.");
      rsp.setResultCode(retCode);
      rsp.setResultDesc(message);
      return rsp;
    }

    rsp.setResultCode(ResultCode.SUCCESS.getCode());
    rsp.setSessionInfoList(sessionList);

    LogUtils.VDESKTOP_LOG.debug(rsp);
    return rsp;
  }

  private GetSessionByUserNameRsp getSessionsBySingleFarm(GetSessionByUserNameReq req)
  {
    LogUtils.VDESKTOP_LOG.debug(req);

    GetSessionByUserNameRsp rsp = new GetSessionByUserNameRsp();
    GetSessionByUserNameRsp getRsp = this.wiClientService.getSessionByUserName(req);
    getRsp.setGroupId(req.getGroupId());

    String message = null;
    int retCode = StaticNumber.ZERO.getCode();

    if ((getRsp == null) || (ResultCode.SUCCESS.getCode() != getRsp.getResultCode()))
    {
      retCode = ResultCode.HDC_INVALID.getCode();
      rsp.setResultCode(retCode);
      rsp.setResultDesc(message);
      return rsp;
    }

    rsp.setSessionInfoList(dealSessionsList(req, getRsp));

    rsp.setResultCode(ResultCode.SUCCESS.getCode());

    LogUtils.VDESKTOP_LOG.debug(rsp);
    return rsp;
  }

 private List<SessionModel> dealSessionsList(GetSessionByUserNameReq req, GetSessionByUserNameRsp getRsp)
  {
    List<SessionModel> sessionList = new ArrayList<SessionModel>();

    if ((getRsp != null) && (getRsp.getSessionInfoList() != null))
    {
      WiInfo wiInfo = (WiInfo)LocalConfigWI.getWiInfoMap().get(getRsp.getGroupId());

     
      if (wiInfo != null)
      {
        for (SessionModel session : getRsp.getSessionInfoList())
        {
          session.setGroupId(getRsp.getGroupId());
          sessionList.add(session);
        }
      }
    }

    return sessionList;
  }

 
}