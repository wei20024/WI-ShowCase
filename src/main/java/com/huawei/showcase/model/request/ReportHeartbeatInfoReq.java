package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@XmlRootElement(name="ReportHeartbeatInfoReq")
public class ReportHeartbeatInfoReq extends Request
{
  private long cpuUse;
  private int memUse;
  private String heartbeatTime;
  private String resourceID;
  private String resourceIP;
  private int applicationMemUse;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.DEFAULT_STYLE);
  }

  public long getCpuUse()
  {
    return this.cpuUse;
  }

  public int getMemUse()
  {
    return this.memUse;
  }

  public String getHeartbeatTime()
  {
    return this.heartbeatTime;
  }

  public String getResourceID()
  {
    return this.resourceID;
  }

  public String getResourceIP()
  {
    return this.resourceIP;
  }

  public void setCpuUse(long cpuUse)
  {
    this.cpuUse = cpuUse;
  }

  public void setMemUse(int memUse)
  {
    this.memUse = memUse;
  }

  public void setHeartbeatTime(String heartbeatTime)
  {
    this.heartbeatTime = heartbeatTime;
  }

  public void setResourceID(String resourceID)
  {
    this.resourceID = resourceID;
  }

  public void setResourceIP(String resourceIP)
  {
    this.resourceIP = resourceIP;
  }

  public int getApplicationMemUse()
  {
    return this.applicationMemUse;
  }

  public void setApplicationMemUse(int applicationMemUse)
  {
    this.applicationMemUse = applicationMemUse;
  }
}