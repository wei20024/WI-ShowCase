package com.huawei.showcase.model;

import com.huawei.showcase.interact.wi.WiClientService;
import java.io.Serializable;

public class WiInterfaceModel
  implements Serializable
{
  private static final long serialVersionUID = -816923280667L;
  private String wiIp;
  private WiClientService wiInterface;
  private String tokenId;

  public String getWiIp()
  {
    return this.wiIp;
  }

  public void setWiIp(String wiIp)
  {
    this.wiIp = wiIp;
  }

  public WiClientService getWiInterface()
  {
    return this.wiInterface;
  }

  public void setWiInterface(WiClientService wiInterface)
  {
    this.wiInterface = wiInterface;
  }

  public String getTokenId()
  {
    return this.tokenId;
  }

  public void setTokenId(String tokenId)
  {
    this.tokenId = tokenId;
  }
}