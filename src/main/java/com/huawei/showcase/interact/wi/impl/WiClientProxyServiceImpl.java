package com.huawei.showcase.interact.wi.impl;

import java.lang.reflect.Method;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import javax.annotation.PreDestroy;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.http.HttpSession;

import org.apache.cxf.configuration.jsse.TLSClientParameters;
import org.apache.cxf.jaxrs.client.JAXRSClientFactoryBean;
import org.apache.cxf.jaxrs.client.WebClient;
import org.apache.cxf.transport.http.HTTPConduit;
import org.springframework.stereotype.Service;

import com.huawei.showcase.common.enumcode.ResultCode;
import com.huawei.showcase.common.framwork.WIApplicationContext;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.crypto.AesEncrypter;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.common.util.log.TransactionIdUtil;
import com.huawei.showcase.interact.wi.WiClientProxyService;
import com.huawei.showcase.interact.wi.WiClientService;
import com.huawei.showcase.interact.wi.util.WiRestAuthUtil;
import com.huawei.showcase.model.SessionInfo;
import com.huawei.showcase.model.WiInterfaceModel;
import com.huawei.showcase.model.request.LoginReq;
import com.huawei.showcase.model.request.UnsCommonReq;
import com.huawei.showcase.model.response.CommonRsp;
import com.huawei.showcase.model.response.LoginRsp;

@Service
public class WiClientProxyServiceImpl implements WiClientProxyService
{
  private String paramValueSplit = "=";

  private String paramSplit = ";";

  private Configuration configuration = Configuration.getControllerPropInstance();
  private static final String WI_RESTURL_FORMAT = "https://%s/services";
  /***
   * 由Wimonitor在启动时获取配置文件中的Wi信息生成
   * @author wzf
   */
  private ConcurrentHashMap<String, List<WiInterfaceModel>> wiMap = 
		  new ConcurrentHashMap<String, List<WiInterfaceModel>>();

  private final ReadWriteLock lock = new ReentrantReadWriteLock();

  public <T> T handleRequest(String methodName, UnsCommonReq req)
  {
    LogUtils.LOG.enterMethod();

    String wiId = req.getGroupId();

    WiClientService realClientProxy = null;

    if (this.wiMap.isEmpty())
    {
      LogUtils.LOG.error("Wi list is null.");
      return null;
    }

    if (CommonUtils.checkAllStringNull( wiId ))
    {
      LogUtils.LOG.error("wiId is null.");
      return null;
    }

    if (this.wiMap.containsKey(wiId))
    {
      List<WiInterfaceModel> wilist = (List<WiInterfaceModel>)this.wiMap.get(wiId);

      if (CommonUtils.checkAllObjectNull( wilist ))
      {
        LogUtils.LOG.error("WiIfModel list is null.");
        return null;
      }

      int listsize = wilist.size();
      T mothodInvokeResult = null;
      if (listsize == 0)
      {
        LogUtils.LOG.error("wilist size is 0.");
        return null;
      }
      LogUtils.LOG.debug("wilist size =" + listsize);
      String currentIp = null;
      for (int i = 0; i < listsize; i++)
      {
        WiInterfaceModel wiinterfacemodle = null;
        currentIp = req.getCurrentIp();
        
        if (currentIp != null)
        {
          wiinterfacemodle = getWiServiceProxy(wiId, this.wiMap, currentIp);
        }
          if ((wiinterfacemodle == null) && (req.getCurrentSessionMap() != null))
          {
            SessionInfo sessionInfo = (SessionInfo)req.getCurrentSessionMap().get(wiId);
            if (sessionInfo != null)
            {
              currentIp= sessionInfo.getCurrentIp();
              wiinterfacemodle = getWiServiceProxy(wiId, this.wiMap, currentIp);
            }
          }
        if (wiinterfacemodle == null)
        {
          wiinterfacemodle = getWiServiceProxy(wiId, this.wiMap);
          if (wiinterfacemodle == null)
          {
            LogUtils.LOG.error("wiInterfaceModel of the farm is null.");
            return null;
          }
        }
       
        realClientProxy = wiinterfacemodle.getWiInterface();
        currentIp = wiinterfacemodle.getWiIp();
        LogUtils.LOG.debug("current ip =" + currentIp);

        if (realClientProxy == null)
        {
          LogUtils.LOG.error("Wi proxy is null.");
          return null;
        }
        if (CommonUtils.checkAllStringNull( methodName ))
        {
          LogUtils.LOG.error(String.format("The parameter methodName is invalid, methodName is %s.",methodName ));
          return null;
        }
        
        LogUtils.LOG.debug(String.format("the name of method of rest request:%s,times:%s, params is %s",
        		methodName, Integer.valueOf(i), convert(new Object[] { req })));
        Method method = getMethodObj(realClientProxy, methodName);

        if (method == null)
        {
          LogUtils.LOG.error("Failed to get method object.");
          return null;
        }

        try
        {
          req.setTransactionId(TransactionIdUtil.getCurrentTransactionId());
          req.setCurrentIp(currentIp);
          if (WiRestAuthUtil.isSystemAuth())
          {
            req.setTokenId(wiinterfacemodle.getTokenId());
          }
          else 
          {
            req.setCurrentIp(currentIp);
            setTokenId(currentIp, req);
          }

          if(req instanceof LoginReq)
          {
              LoginReq loginReq = (LoginReq)req;
              loginReq.setPassword(decodePassword(loginReq.getPassword()));
          }
          mothodInvokeResult = (T) method.invoke(realClientProxy, new Object[] { req });

          if (WiRestAuthUtil.isSystemAuth())
          {
            CommonRsp rsp = (CommonRsp)mothodInvokeResult;
            if ((ResultCode.TOKEN_NOT_EXIST.getCode() == rsp.getResultCode()) )
            {
              WiRestAuthUtil.removeToken(currentIp);
            }
          }
          else
          {
            mothodInvokeResult = dealTokenInvalid(mothodInvokeResult, req, methodName, currentIp);
          }

        }
        catch (Exception e)
        {
          LogUtils.LOG.error(
            String.format("Failed to invoke method : %s. and select other useful Wi.", methodName) , e);
          removewi(wiId, currentIp, methodName);
        }
        if (mothodInvokeResult != null)
        {
          break;
        }

      }
      //如果是登陆流程，则需要保存当前的tokenId信息
      if ((mothodInvokeResult != null) && ((mothodInvokeResult instanceof LoginRsp)))
      {
        LoginRsp loginRsp = (LoginRsp)mothodInvokeResult;
        loginRsp.setWIId(req.getGroupId());
        loginRsp.setUserId(req.getUserId());
        loginRsp.setCurrentIp(currentIp);

        if ((loginRsp.getResultCode() == ResultCode.REST_USER_LOGIN_EMERGENCY_C10.getCode()) || 
          (loginRsp.getResultCode() == ResultCode.LOGIN_IN_EMERGENCY_C10.getCode()))
        {
          loginRsp.setResultCode(ResultCode.LOGIN_IN_EMERGENCY.getCode());
        }
        	dealAuthRespone(loginRsp, req.getCurrentSession());
      }

      LogUtils.LOG.debug(mothodInvokeResult);
      return mothodInvokeResult;
    }
    LogUtils.LOG.error("WI list is null.");
    return null;
  }

  /***
   * tokenId失效时，重新使用login方式登陆，并继续调用原先的操作
   * @param result
   * @param oldReq
   * @param methodName
   * @param currentIp
   * @return
   */
  private <T> T dealTokenInvalid(T result, UnsCommonReq oldReq, String methodName, String currentIp)
  {
    try
    {
      if (result == null)
      {
        return null;
      }
      CommonRsp rsp = (CommonRsp)result;
      if (((ResultCode.TOKEN_NOT_EXIST.getCode() == rsp.getResultCode())) && 
        (!(oldReq instanceof LoginReq)) && (!oldReq.getRetry()))
      {
        LoginReq req = new LoginReq();
        req.setCurrentIp(currentIp);
        req.setGroupId(oldReq.getGroupId());
        req.setTransactionId(oldReq.getTransactionId());
        req.setCurrentSession(oldReq.getCurrentSession());

        if (oldReq.getCurrentSessionMap() != null)
        {
          for (Map.Entry<String,SessionInfo> map : oldReq.getCurrentSessionMap().entrySet())
          {
            if (map.getValue() != null)
            {
             
              if (!CommonUtils.checkAllStringNull(
            		  new String[] { ((SessionInfo)map.getValue()).getUserId(),((SessionInfo)map.getValue()).getPassword()}))
                {
                  req.setUserName(((SessionInfo)map.getValue()).getUserId());
                  req.setPassword(((SessionInfo)map.getValue()).getPassword());
                  break;
                }
            }
          }
        }
        else {
          LogUtils.LOG.error(" getCurrentSessionMap is null. ");
        }
        LogUtils.LOG.info(" token is invalid ,need reLogin WI, currentIp =" + currentIp);
        LoginRsp loginRsp = (LoginRsp)handleRequest("login", req);

       if (loginRsp == null)
        {
          LogUtils.LOG.error("loginRsp is null.");
          return result;
        }

        if ((ResultCode.SUCCESS.getCode() != loginRsp.getResultCode()) && 
          (ResultCode.LOGIN_IN_EMERGENCY.getCode() != loginRsp.getResultCode()))
        {
          LogUtils.LOG.error("loginRsp is not success." + loginRsp);
          rsp.setResultCode(loginRsp.getResultCode());
          rsp.setResultDesc(loginRsp.getResultDesc());
          return result;
        }
        if (ResultCode.LOGIN_IN_EMERGENCY.getCode() == loginRsp.getResultCode())
        {
          oldReq.getCurrentSession().setAttribute("EMERGENCYLOGON", "ok");
        }

        oldReq.setRetry(true);
        result = handleRequest(methodName, oldReq);
      }

    }
    catch (Exception e)
    {
      LogUtils.LOG.error(e);
    }
    return result;
  }

  /***
   * 将session中WI对应的tokenId设置到请求中
   * @param currentIp
   * @param req
   */
  private void setTokenId(String currentIp, UnsCommonReq req)
  {
    try
    {
      if (req.getCurrentSessionMap() == null)
      {
        return;
      }
      SessionInfo info = (SessionInfo)req.getCurrentSessionMap().get(req.getGroupId());
      if (info == null)
      {
        return;
      }
      String tokenId = (String)info.getIpTokenMap().get(currentIp);
      if (!CommonUtils.checkAllStringNull(tokenId ))
      {
        req.setTokenId(tokenId);
      }
    }
    catch (Exception e)
    {
      LogUtils.LOG.error(e);
    }
  }


  private void removewi(String WiId, String currentip, String methodName)
  {    
    List<WiInterfaceModel> lstwi = (List<WiInterfaceModel>)this.wiMap.get(WiId);

    if (lstwi == null)
    {
      LogUtils.LOG.debug("list of Wi is already null.");
      return;
    }
    LogUtils.LOG.debug("prepare for remove wilist size =" + lstwi.size());
    try
    {
      this.lock.writeLock().lock();
      for (Iterator<WiInterfaceModel> lstIterator = lstwi.iterator(); lstIterator.hasNext(); )
      {
        WiInterfaceModel interfaecModel = (WiInterfaceModel)lstIterator.next();

        LogUtils.LOG.debug("prepare for ip:" + interfaecModel.getWiIp());
        if (currentip.equals(interfaecModel.getWiIp()))
        {
          LogUtils.LOG.debug("deleted ip:" + interfaecModel.getWiIp());
          lstIterator.remove();
          break;
        }
      }
    }
    finally
    {
      this.lock.writeLock().unlock();
    }
  }

  private WiInterfaceModel getWiServiceProxy(String WiId, Map<String, List<WiInterfaceModel>> wiMaps)
  {
    LogUtils.LOG.enterMethod();

    List<WiInterfaceModel> lstwi = (List<WiInterfaceModel>)wiMaps.get(WiId);

    if (CommonUtils.checkAllObjectNull(new Object[] { lstwi }))
    {
      LogUtils.LOG.error("WiIfModel is null.");
      return null;
    }

    Random ra = new Random();

    WiInterfaceModel wiInterfaceModel = null;

    if(lstwi.size()>1)
    {
      wiInterfaceModel = (WiInterfaceModel)lstwi.get(ra.nextInt(lstwi.size()));
    }
    else
    {
      wiInterfaceModel = (WiInterfaceModel)lstwi.get(0);
    }

    WiClientService proxy = wiInterfaceModel.getWiInterface();

    if (proxy == null)
    {
      LogUtils.LOG.error("Wi proxy is null.");
      return null;
    }

    LogUtils.LOG.debug("get proxy of the wiIp = " + wiInterfaceModel.getWiIp());
    LogUtils.LOG.exitMethod();

    return wiInterfaceModel;
  }

  private WiInterfaceModel getWiServiceProxy(String WiId, Map<String, List<WiInterfaceModel>> wiMaps, String ip)
  {
    LogUtils.LOG.enterMethod();

    List<WiInterfaceModel> lstwi = (List<WiInterfaceModel>)wiMaps.get(WiId);

    if (CommonUtils.checkAllObjectNull(new Object[] { lstwi }))
    {
      LogUtils.LOG.error("WiIfModel is null.");
      return null;
    }

 
    for (WiInterfaceModel info : lstwi)
    {
      if (info.getWiIp().equals(ip))
      {
        return info;
      }
    }
   
      LogUtils.LOG.error("Wi proxy is null.");
   

    return null;
  }

  /***
   * 获得rest接口调用的CXF客户端
   * @param wiIp
   * @return WiclientService
   */
  public WiClientService getClientProxy(String wiIp)
  {
    WiClientService wiClientProxy = null;
    try
    {
     
      String WIsUrl = String.format(WI_RESTURL_FORMAT, wiIp );
      JAXRSClientFactoryBean clientFactoryBean = (JAXRSClientFactoryBean)WIApplicationContext.getBean("clientFactoryBean");

      clientFactoryBean.setAddress(WIsUrl);

      wiClientProxy = (WiClientService)clientFactoryBean.create();

      WebClient.client(wiClientProxy).accept(new String[] { getCommAcceptHeader() });
      WebClient.client(wiClientProxy).type(getCommContentTypeHeader());

      HTTPConduit conduit = WebClient.getConfig(wiClientProxy).getHttpConduit();
      if (conduit != null)
      {
        conduit.getClient().setConnectionTimeout(
          Integer.parseInt(this.configuration.getString("WI.ConnectionTimeout")));
        conduit.getClient().setReceiveTimeout(Integer.parseInt(this.configuration.getString("WI.ReceiveTimeout")));
      }
      
      String protocolType = Configuration.getControllerPropInstance().getString("protocolType");
      if ("https".equals(protocolType))
      {
        TLSClientParameters tlsParams = new TLSClientParameters();
        tlsParams.setSecureSocketProtocol("TLSv1");
        tlsParams.setDisableCNCheck(true);
        TrustManager[] trustAllCerts = { 
        	new X509TrustManager() {
	          public X509Certificate[] getAcceptedIssuers()
	          {
	            return new X509Certificate[0];
	          }
	
	          public void checkClientTrusted(X509Certificate[] certs, String authType)
	          {
	          }
	
	          public void checkServerTrusted(X509Certificate[] certs, String authType)
	          {
	          }
	        }
         };
        tlsParams.setTrustManagers(trustAllCerts);

        if (conduit != null)
        {
          conduit.setTlsClientParameters(tlsParams);
        }

      }

    }
    catch (Exception exception)
    {
      LogUtils.LOG.error(String.format("Failed to get the client proxy. "));
      LogUtils.LOG.error(exception);
      return null;
    }

    return wiClientProxy;
  }

  private String getCommAcceptHeader()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("application/json").append(this.paramSplit).append("version").append(this.paramValueSplit)
      .append("1.1").append(this.paramSplit).append("charset").append(this.paramValueSplit)
      .append("UTF-8");

    return builder.toString();
  }

  private String getCommContentTypeHeader()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("application/json").append(this.paramSplit).append("charset").append(this.paramValueSplit)
      .append("UTF-8");

    return builder.toString();
  }

  private static final List<Object> convert(Object[] args)
  {
    ArrayList<Object> ret = new ArrayList<Object>(args.length);
    Object[] arrayOfObject = args; 
    int j = args.length;
    for (int i = 0; i < j; i++) {
    	Object arg = arrayOfObject[i];

      ret.add(arg);
    }
    return ret;
  }

  private Method getMethodObj(WiClientService realClientProxy, String methodName)
  {
    LogUtils.LOG.enterMethod();
    Method[] methods;
    try
    {
      methods = realClientProxy.getClass().getMethods();
    }
    catch (SecurityException se)
    {

      LogUtils.LOG.error(String.format("Failed to get method object of %s method.", methodName ), se);
      return null;
    }

    Method method = null;

    int methodCount = 0;

    for (Method methodObj : methods)
    {
      if (methodName.equals(methodObj.getName()))
      {
        method = methodObj;
        methodCount++;
      }

    }

    if (methodCount == 0)
    {
      LogUtils.LOG.error(String.format("The method : %s, not found in %s.",methodName, WiClientService.class ));
      return null;
    }

    if (methodCount != 1)
    {
      LogUtils.LOG.error(String.format("There are more than one method : %s have found in %s.", methodName, 
        WiClientService.class ));
      return null;
    }

    LogUtils.LOG.exitMethod();
    return method;
  }

  @PreDestroy
  public void close()
  {
  }

 /***
 * 登陆操作后，将返回的tokenId等信息设置到session中
 * @param rsp
 * @param currentSession
 */
  private  void dealAuthRespone(LoginRsp rsp, HttpSession currentSession)
  {
    if ((rsp == null) || (currentSession == null))
    {
      rsp = new LoginRsp();
      rsp.setResultCode(ResultCode.WI_INVALID.getCode());
      rsp.setResultDesc(ResultCode.WI_INVALID.getMessage());
      return;
    }

    if ((ResultCode.SUCCESS.getCode() != rsp.getResultCode()) && 
      (ResultCode.LOGIN_IN_EMERGENCY.getCode() != rsp.getResultCode()))
    {
      LogUtils.LOG.error("rsp is not success." + rsp);
      return;
    }

    String userId = (String)currentSession.getAttribute("userId");
    String pass = (String)currentSession.getAttribute("pass");
    String WIid = rsp.getWIId();
    String WiIP = rsp.getCurrentIp();
    String tokenId = rsp.getTokenId();
    Map<String,SessionInfo> currentMap = (Map<String,SessionInfo>)currentSession.getAttribute("currentSessionInfosMap");
    if (currentMap == null)
    {
      currentMap = new HashMap<String,SessionInfo>();
    }
    SessionInfo sessionInfo = (SessionInfo)currentMap.get(WIid);
    if (sessionInfo == null)
    {
  
    	if (!CommonUtils.checkAllStringNull(new String[] { userId,pass }))
        {
          sessionInfo = new SessionInfo();
          sessionInfo.setFarmId(WIid);
          sessionInfo.setUserId(userId);
          sessionInfo.setPassword(pass);
          sessionInfo.setCurrentIp(WiIP);
          currentMap.put(WIid, sessionInfo);
         
        }
    	else LogUtils.LOG.error("user and pass is null.");
    }

    if (sessionInfo != null)
    {
      sessionInfo.getIpTokenMap().put(WiIP, tokenId);
    }

    currentSession.setAttribute("currentSessionInfosMap", currentMap);
  }
  
  public Map<String, List<WiInterfaceModel>> getWIMap()
  {
    return this.wiMap;
  }

  public void setWIMap(ConcurrentHashMap<String, List<WiInterfaceModel>> wiMap)
  {
    this.wiMap = wiMap;
  }

  
  private String decodePassword(String pass)
  {
    try
    {
      String password = AesEncrypter.decodeBASE64(pass);
      if (CommonUtils.checkAllStringNull( password ))
      {
        return pass;
      }
      return password;
    }
    catch (Exception e)
    {
      LogUtils.LOG.error(e);
    }
    return pass;
  }
}