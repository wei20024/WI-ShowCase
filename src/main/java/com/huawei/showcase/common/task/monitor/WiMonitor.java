package com.huawei.showcase.common.task.monitor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huawei.showcase.common.enumcode.ResultCode;
import com.huawei.showcase.model.WiInterfaceModel;
import com.huawei.showcase.model.Token;
import com.huawei.showcase.model.WiInfo;
import com.huawei.showcase.model.response.MonitorRsp;
import com.huawei.showcase.common.task.BaseTask;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.interact.util.LocalConfigWI;
import com.huawei.showcase.interact.wi.WiClientProxyService;
import com.huawei.showcase.interact.wi.WiClientService;
import com.huawei.showcase.interact.wi.util.WiRestAuthUtil;

@Service
public final class WiMonitor extends BaseTask
{
  private Map<String, WiInfo> wiInfoMap =new HashMap<String, WiInfo>();

  @Autowired
  private WiClientProxyService wiService;

  public void doTask()
  {
    LogUtils.LOG.enterMethod();
    try
    {
      if (!initWIList())
      {
        LogUtils.LOG.error("no wi info configured.");
        return;
      }

      ConcurrentHashMap<String,List<WiInterfaceModel>> healthWiInfoMap = 
    		  new ConcurrentHashMap<String,List<WiInterfaceModel>>();

      Set<String> keySet = this.wiInfoMap.keySet();

      for (String key : keySet)
      {
        List<WiInterfaceModel> lstWi = new ArrayList<WiInterfaceModel>();

        WiInfo info = (WiInfo)this.wiInfoMap.get(key);

        LogUtils.LOG.debug("wiInfoMap:" + key + "; wi ip is:" + info.getVlbIp());

       if (!CommonUtils.checkAllStringNull(new String[] { info.getVlbIp(),info.getVlbPort() })) {
          {
            String ipInfo = getIpInfo(info.getVlbIp(), info.getVlbPort());
            checkWiService(ipInfo, lstWi);
          }
        }
        if (!CommonUtils.checkAllStringNull(new String[] { info.getComponentIp(),info.getComponentPort() })) {        
          {
            String ipInfo = getIpInfo(info.getComponentIp(), info.getComponentPort());
            checkWiService(ipInfo, lstWi);
          }
        }
        
        if (!lstWi.isEmpty())
        {
          healthWiInfoMap.put(key, lstWi);
        }
      }
      if (healthWiInfoMap.isEmpty())
      {
        LogUtils.LOG.error("all of the wi list is empty.");
      }

      this.wiService.setWIMap(healthWiInfoMap);
    }
    catch (Exception e)
    {
      LogUtils.LOG.error("run method exception:");
      LogUtils.LOG.error(e);
    }
    finally
    {
      LogUtils.LOG.exitMethod();
    }
  }

  private String getIpInfo(String ip, String port)
  {
    String ipInfo = ip;
    if ((!CommonUtils.checkAllStringNull( port )) && (!port.equals("80")) && (!port.equals("443")))
    {
      ipInfo = ipInfo + ":" + port;
    }
    return ipInfo;
  }

  
  private boolean checkWiService(String ipInfo, List<WiInterfaceModel> lstWi)
  {
    WiClientService wiclient = this.wiService.getClientProxy(ipInfo);
   
    if (checkStatus(wiclient))
    {
      if (!WiRestAuthUtil.checkSystemAuth(wiclient, ipInfo))
      {
        LogUtils.LOG.error("login WI error,auth fail");
        return false;
      }
      WiInterfaceModel wiInterfaceModel = new WiInterfaceModel();
      wiInterfaceModel.setWiInterface(wiclient);
      wiInterfaceModel.setWiIp(ipInfo);

      if (WiRestAuthUtil.isSystemAuth())
      {
        Token token = WiRestAuthUtil.getWiTokenMap().get(ipInfo);
        if ((token == null) || (token.getTokenId() == null))
        {
          LogUtils.LOG.error("WI token is null, ipInfo = " + ipInfo);
          return false;
        }
        String sysAuthTokenId = token.getTokenId();
        wiInterfaceModel.setTokenId(sysAuthTokenId);
      }
      lstWi.add(wiInterfaceModel);
    }
    else
    {
      LogUtils.LOG.error("the wi is error.wiip = " + ipInfo);
      return false;
    }
    return true;
  }
  
 
  private boolean checkStatus(WiClientService realClientProxy)
  {
	 
    LogUtils.LOG.enterMethod();
   
    if (realClientProxy == null)
    {
      LogUtils.LOG.error("wi proxy is null.");
      return false;
    }

    MonitorRsp rsp = null;
    try
    {
   
      rsp = realClientProxy.monitorStatus();
    }
    catch (Exception e)
    {
      LogUtils.LOG.error(e);
    }

    if (rsp == null)
    {
      LogUtils.LOG.error("getwistatus is null.");
      return false;
    }

    LogUtils.LOG.debug("rsp" + rsp);

    if (ResultCode.SUCCESS.getCode() == rsp.getResultCode())
    {
      return true;
    }

    LogUtils.LOG.exitMethod();
    return false;
  }

  private boolean initWIList()
  {
    LogUtils.LOG.enterMethod();

    this.wiInfoMap.clear();  
    List<WiInfo> wiInfos = LocalConfigWI.getWiInfos();
    if(wiInfos.size()==0)return false;
    for (WiInfo info : wiInfos)
    {
      this.wiInfoMap.put(info.getWiName(), info);
    }

    LogUtils.LOG.exitMethod();
    return true;
  }


  public Map<String, WiInfo> getWiInfoMap()
  {
    return this.wiInfoMap;
  }

  public void setWiInfoMap(Map<String, WiInfo> wiInfoMap)
  {
    this.wiInfoMap = wiInfoMap;
  }
}