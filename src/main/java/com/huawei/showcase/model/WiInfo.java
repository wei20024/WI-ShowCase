package com.huawei.showcase.model;

import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@XmlRootElement(name="WiInfoInGwi")
public class WiInfo
{
  private String uuid;
  private String wiName;
  private String isGlobalWi;
  private String componentIp;
  private String componentPort;
  private String vlbIp;
  private String vlbPort;
 

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.DEFAULT_STYLE);
  }

  public String getWiName()
  {
    return this.wiName;
  }

  public void setWiName(String wiName)
  {
    this.wiName = wiName;
  }

  public String getIsGlobalWi()
  {
    return this.isGlobalWi;
  }

  public void setIsGlobalWi(String isGlobalWi)
  {
    this.isGlobalWi = isGlobalWi;
  }

  public String getComponentIp()
  {
    return this.componentIp;
  }

  public void setComponentIp(String componentIp)
  {
    this.componentIp = componentIp;
  }

  public String getComponentPort()
  {
    return this.componentPort;
  }

  public void setComponentPort(String componentPort)
  {
    this.componentPort = componentPort;
  }

  public String getUuid()
  {
    return this.uuid;
  }

  public void setUuid(String uuid)
  {
    this.uuid = uuid;
  }

  public String getVlbIp()
  {
    return this.vlbIp;
  }

  public void setVlbIp(String vlbIp)
  {
    this.vlbIp = vlbIp;
  }

  public String getVlbPort()
  {
    return this.vlbPort;
  }

  public void setVlbPort(String vlbPort)
  {
    this.vlbPort = vlbPort;
  }

}