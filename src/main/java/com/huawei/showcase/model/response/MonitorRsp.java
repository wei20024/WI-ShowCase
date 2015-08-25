package com.huawei.showcase.model.response;


import com.huawei.showcase.model.ComponentInfo;
import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@XmlRootElement(name="MonitorRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class MonitorRsp extends CommonRsp
{
  private static final long serialVersionUID = 777476630517176525L;

  @XmlElement(name="WIState")
  private String wiState;

  @XmlElement(name="clientIP")
  private String clientIP;

  @XmlElement(name="unsAlarmInfos")
  private List<ComponentInfo> componentInfos = new ArrayList<ComponentInfo>();

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.DEFAULT_STYLE);
  }

  public String getWiState()
  {
    return this.wiState;
  }

  public void setWiState(String wiState)
  {
    this.wiState = wiState;
  }

  public String getClientIP()
  {
    return this.clientIP;
  }

  public void setClientIP(String clientIP)
  {
    this.clientIP = clientIP;
  }

  public List<ComponentInfo> getComponentInfos()
  {
    return this.componentInfos;
  }

  public void setComponentInfos(List<ComponentInfo> componentInfos)
  {
    this.componentInfos = componentInfos;
  }
}