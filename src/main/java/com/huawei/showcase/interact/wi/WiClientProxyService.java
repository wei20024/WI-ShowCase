
package com.huawei.showcase.interact.wi;

import com.huawei.showcase.model.WiInterfaceModel;
import com.huawei.showcase.model.request.UnsCommonReq;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public abstract interface WiClientProxyService
{
  public abstract <T> T handleRequest(String paramString, UnsCommonReq paramUnsCommonReq);

  public abstract WiClientService getClientProxy(String paramString1);

  public abstract Map<String, List<WiInterfaceModel>> getWIMap();

  public abstract void setWIMap(ConcurrentHashMap<String, List<WiInterfaceModel>> paramConcurrentHashMap);
}