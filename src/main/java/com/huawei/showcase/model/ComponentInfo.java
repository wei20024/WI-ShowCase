package com.huawei.showcase.model;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@XmlRootElement(name="ComponentInfo")
@XmlAccessorType(XmlAccessType.FIELD)
public class ComponentInfo
  implements Serializable
{
  private static final long serialVersionUID = 156890L;

  @XmlElement(name="componentIp")
  private String componentIp;

  @XmlElement(name="componentType")
  private String componentType;

  @XmlElement(name="componentStatus")
  private String componentStatus;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.DEFAULT_STYLE);
  }

  public String getComponentStatus()
  {
    return this.componentStatus;
  }

  public void setComponentStatus(String componentStatus)
  {
    this.componentStatus = componentStatus;
  }

  public String getComponentIp()
  {
    return this.componentIp;
  }

  public void setComponentIp(String componentIp)
  {
    this.componentIp = componentIp;
  }

  public String getComponentType()
  {
    return this.componentType;
  }

  public void setComponentType(String componentType)
  {
    this.componentType = componentType;
  }
}