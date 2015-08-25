package com.huawei.showcase.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="Configuration")
@XmlAccessorType(XmlAccessType.FIELD)
public class ConfigInfo
{

  @XmlElement(name="paramName")
  private String paramName;

  @XmlElement(name="paramValue")
  private String paramValue;

  public String getParamName()
  {
    return this.paramName;
  }

  public void setParamName(String paramName)
  {
    this.paramName = paramName;
  }

  public String getParamValue()
  {
    return this.paramValue;
  }

  public void setParamValue(String paramValue)
  {
    this.paramValue = paramValue;
  }
}